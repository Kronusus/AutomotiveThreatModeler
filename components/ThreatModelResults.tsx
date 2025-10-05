import React from "react";

export interface ThreatModelResult {
  asset: string;
  property: string;
  stride: string;
  reasoning: string;
  damage: string;
}

interface ThreatModelResultsProps {
  results: ThreatModelResult[];
  loading: boolean;
  error?: string;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

export const ThreatModelResults: React.FC<ThreatModelResultsProps> = ({
  results,
  loading,
  error,
  onExportPDF,
  onExportCSV,
}) => {
  if (loading) {
    return (
      <div className="card shadow-md p-6 mt-6 text-center">
        <h3 className="text-lg font-bold mb-2">
          Analyzing for Threats...
        </h3>
        <p>Please wait while we perform the threat modeling analysis.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-md p-6 mt-6 text-center bg-red-100 border-red-400">
        <h3 className="text-lg font-bold mb-2 text-red-800">
          Analysis Failed
        </h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="card shadow-md p-6 mt-6 text-center">
        <h3 className="text-lg font-bold mb-2">
          No Threat Modeling Results
        </h3>
        <p>
          Generate a visualization and then perform threat modeling to see the
          results here.
        </p>
      </div>
    );
  }

  return (
    <div className="card shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Threat Modeling Results</h3>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={onExportPDF}>
            Export as PDF
          </button>
          <button className="btn btn-secondary" onClick={onExportCSV}>
            Export as CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-card-border">
              <th className="p-2 border">Asset</th>
              <th className="p-2 border">Property</th>
              <th className="p-2 border">STRIDE</th>
              <th className="p-2 border">Reasoning</th>
              <th className="p-2 border">Damage Scenario</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="odd:bg-card">
                <td className="p-2 border">{r.asset}</td>
                <td className="p-2 border">{r.property}</td>
                <td className="p-2 border">{r.stride}</td>
                <td className="p-2 border">{r.reasoning}</td>
                <td className="p-2 border">{r.damage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
