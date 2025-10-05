
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
        <button className="btn btn-primary" onClick={handleGenerateVisualization} disabled={diagramLoading}>
          Generate Visualization
        </button>
        <button className="btn btn-secondary" onClick={handlePerformThreatModeling} disabled={resultsLoading || !diagram}>
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
