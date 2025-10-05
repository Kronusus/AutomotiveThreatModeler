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

export const ThreatModelResults: React.FC<ThreatModelResultsProps> = ({ results, loading, error, onExportPDF, onExportCSV }) => (
  <div className="card bg-white shadow p-6 mb-4">
    <label className="block text-lg font-semibold mb-2">Threat Modeling Ergebnisse</label>
    {loading ? (
      <div className="text-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : (
      <>
        <div className="mb-4 flex gap-2">
          <button className="btn btn-outline btn-primary" onClick={onExportPDF}>Export als PDF</button>
          <button className="btn btn-outline btn-secondary" onClick={onExportCSV}>Export als CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Eigenschaft (C, I, A, ...)</th>
                <th>STRIDE</th>
                <th>Begründung</th>
                <th>Schadensszenario</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.asset}</td>
                  <td>{r.property}</td>
                  <td>{r.stride}</td>
                  <td>{r.reasoning}</td>
                  <td>{r.damage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}
  </div>
);
