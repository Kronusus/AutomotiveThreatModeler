/**
 * Custom hooks for threat modeling operations
 */

import { useState, useCallback } from "react";
import { EffectChain, System, ThreatModelResult, ExportType } from "./types";

interface UseVisualizationResult {
  diagram: string;
  loading: boolean;
  error: string | undefined;
  generateDiagram: (
    useCase: string,
    effectChain: EffectChain,
    systems: System[]
  ) => Promise<void>;
  setDiagram: (diagram: string) => void;
}

export function useVisualization(): UseVisualizationResult {
  const [diagram, setDiagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const generateDiagram = useCallback(
    async (useCase: string, effectChain: EffectChain, systems: System[]) => {
      setLoading(true);
      setError(undefined);
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
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { diagram, loading, error, generateDiagram, setDiagram };
}

interface UseThreatModelingResult {
  results: ThreatModelResult[];
  loading: boolean;
  error: string | undefined;
  analyzeTreats: (
    useCase: string,
    effectChain: EffectChain,
    systems: System[],
    diagram: string
  ) => Promise<void>;
}

export function useThreatModeling(): UseThreatModelingResult {
  const [results, setResults] = useState<ThreatModelResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const analyzeTreats = useCallback(
    async (
      useCase: string,
      effectChain: EffectChain,
      systems: System[],
      diagram: string
    ) => {
      setLoading(true);
      setError(undefined);
      try {
        const res = await fetch("/api/threatmodel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ useCase, effectChain, systems, diagram }),
        });
        const data = await res.json();
        if (!data.success)
          throw new Error(data.error || "Error during threat modeling analysis");
        setResults(data.results);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { results, loading, error, analyzeTreats };
}

export async function exportThreatModel(
  type: ExportType,
  data: {
    useCase: string;
    effectChain: EffectChain;
    systems: System[];
    diagram: string;
    results: ThreatModelResult[];
  }
): Promise<void> {
  try {
    const res = await fetch(`/api/export?type=${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `threatmodel.${type}`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Export failed:", e);
    throw new Error("Export failed. Please try again.");
  }
}
