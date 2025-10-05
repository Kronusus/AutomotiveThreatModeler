import React from "react";

interface VisualizationPanelProps {
  diagram: string;
  onEdit: (diagram: string) => void;
  loading: boolean;
  error?: string;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ diagram, onEdit, loading, error }) => {
  return (
    <div className="card bg-white shadow p-6 mb-4">
      <label className="block text-lg font-semibold mb-2">Visualisierung</label>
      {loading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {/* Mermaid-Diagramm-Renderer, z.B. mit mermaid-react */}
          <div className="mb-4">
            {/* Hier Diagramm rendern, z.B. <Mermaid chart={diagram} /> */}
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">{diagram}</pre>
          </div>
          <textarea
            className="textarea textarea-bordered w-full"
            value={diagram}
            onChange={e => onEdit(e.target.value)}
            rows={6}
            placeholder="Bearbeite das Diagramm direkt im Framework-Format (z.B. Mermaid)"
          />
        </>
      )}
    </div>
  );
}
