
"use client";
import React, { useState } from "react";
import { UseCaseForm } from "../components/UseCaseForm";
import { EffectChainForm } from "../components/EffectChainForm";
import { SystemsForm, System } from "../components/SystemsForm";
import { VisualizationPanel } from "../components/VisualizationPanel";
import { ThreatModelResults, ThreatModelResult } from "../components/ThreatModelResults";

export default function HomePage() {
  const [useCase, setUseCase] = useState("");
  const [effectChain, setEffectChain] = useState({
    input: "",
    coreLogic: "",
    output: "",
  });
  const [systems, setSystems] = useState<System[]>([]);
  const [diagram, setDiagram] = useState("");
  const [diagramLoading, setDiagramLoading] = useState(false);
  const [diagramError, setDiagramError] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<ThreatModelResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | undefined>(undefined);

    // Prefill example data handler
    const handleExampleData = () => {
      setUseCase(
        "As a Driver, I want to safely and proportionally reduce the vehicle's speed (or bring it to a stop) by applying force to the foot pedal."
      );
      setEffectChain({
        input: "Driver Brake Request (Pedal Force/Position)",
        coreLogic:
          "Brake System Control (Interprets request, calculates required actuator effort, and manages stability/safety functions like ABS/ESC).",
        output:
          "Vehicle Deceleration/Speed Reduction achieved through friction and kinetic energy conversion.",
      });
      setSystems([
        {
          name: "Brake input Processor",
          inputs: "BrakePedalPosition (Raw sensor signal)",
          outputs: "RequestedBrakeDemand (Normalized percentage 0-100%)",
          description:
            "This system measures the physical input (position and/or force) applied by the driver. It translates the raw signal into a normalized brake demand and performs initial safety and plausibility checks on the sensor data.",
        },
        {
          name: "Brake Provider",
          inputs: "RequestedBrakeDemand",
          outputs: "ActuatorTargetPressure",
          description:
            "This system calculates the required braking force for each wheel, considering the driver's request and integrating safety functions (e.g., ABS/ESC to prevent wheel lock or instability). It maps the high-level percentage request to a specific physical command value (e.g., target pressure or actuator current), based on an internal value table.",
        },
      ]);
    };
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
      if (!data.success) throw new Error(data.error || "Error during visualization");
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
      if (!data.success) throw new Error(data.error || "Error during threat modeling analysis");
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
      alert("Export failed");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          Automotive Threat Modeler
        </h1>
        <p className="text-center text-foreground/60 mb-10">
          A tool to help you model threats in automotive systems.
        </p>

        <div className="space-y-6">
          <UseCaseForm value={useCase} onChange={setUseCase} />
          <EffectChainForm value={effectChain} onChange={setEffectChain} />
          <SystemsForm systems={systems} onChange={setSystems} />
        </div>

        <div className="flex justify-center items-center gap-4 my-8 p-4 bg-card rounded-lg shadow-md">
          <button className="btn btn-accent" onClick={handleExampleData}>
            Load Example
          </button>
          <button
            className="btn btn-primary"
            onClick={handleGenerateVisualization}
            disabled={diagramLoading}
          >
            {diagramLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              "Generate Visualization"
            )}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handlePerformThreatModeling}
            disabled={resultsLoading || !diagram}
          >
            {resultsLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              "Perform Threat Modeling"
            )}
          </button>
        </div>

        <VisualizationPanel
          diagram={diagram}
          onEdit={setDiagram}
          loading={diagramLoading}
          error={diagramError}
        />
        <ThreatModelResults
          results={results}
          loading={resultsLoading}
          error={resultsError}
          onExportPDF={() => handleExport("pdf")}
          onExportCSV={() => handleExport("csv")}
        />
      </div>
    </main>
  );
}
