
"use client";
import React, { useState } from "react";
import { UseCaseForm } from "../components/UseCaseForm";
import { EffectChainForm } from "../components/EffectChainForm";
import { SystemsForm, System } from "../components/SystemsForm";
import { VisualizationPanel } from "../components/VisualizationPanel";
import { ThreatModelResults, ThreatModelResult } from "../components/ThreatModelResults";

export default function HomePage() {
  const [useCase, setUseCase] = useState("");
  const [effectChain, setEffectChain] = useState("");
  const [systems, setSystems] = useState<System[]>([]);
  const [diagram, setDiagram] = useState("");
  const [diagramLoading, setDiagramLoading] = useState(false);
  const [diagramError, setDiagramError] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<ThreatModelResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | undefined>(undefined);

  const handleGenerateVisualization = async () => {
    setDiagramLoading(true);
    setDiagramError(undefined);
    try {
      const res = await fetch("/api/visualization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, effectChain, systems }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Fehler bei der Visualisierung");
      setDiagram(data.diagram);
    } catch (e: any) {
      setDiagramError(e.message);
    } finally {
      setDiagramLoading(false);
    }
  };

  const handlePerformThreatModeling = async () => {
    setResultsLoading(true);
    setResultsError(undefined);
    try {
      const res = await fetch("/api/threatmodel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, effectChain, systems, diagram }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Fehler bei der Threat Modeling Analyse");
      setResults(data.results);
    } catch (e: any) {
      setResultsError(e.message);
    } finally {
      setResultsLoading(false);
    }
  };

  const handleExport = async (type: "pdf" | "csv") => {
    try {
      const res = await fetch(`/api/export?type=${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, effectChain, systems, diagram, results }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `threatmodel.${type}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Export fehlgeschlagen");
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Automotive Threat Modeler</h1>
      <UseCaseForm value={useCase} onChange={setUseCase} />
      <EffectChainForm value={effectChain} onChange={setEffectChain} />
      <SystemsForm systems={systems} onChange={setSystems} />
      <div className="flex gap-4 mb-4">
        <button className="btn btn-primary flex items-center gap-2" onClick={handleGenerateVisualization} disabled={diagramLoading}>
          {diagramLoading && (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="text-xs text-gray-500">Loading...</span>
            </>
          )}
          Generate Visualization
        </button>
        <button className="btn btn-secondary flex items-center gap-2" onClick={handlePerformThreatModeling} disabled={resultsLoading || !diagram}>
          {resultsLoading && (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="text-xs text-gray-500">Loading...</span>
            </>
          )}
          Perform Threat Modeling
        </button>
      </div>
      <VisualizationPanel diagram={diagram} onEdit={setDiagram} loading={diagramLoading} error={diagramError} />
      <ThreatModelResults
        results={results}
        loading={resultsLoading}
        error={resultsError}
        onExportPDF={() => handleExport("pdf")}
        onExportCSV={() => handleExport("csv")}
      />
    </main>
  );
}
