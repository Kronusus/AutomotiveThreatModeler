import React from "react";
import Mermaid from "mermaid-react";

interface VisualizationPanelProps {
  diagram: string;
  onEdit: (diagram: string) => void;
  loading: boolean;
  error?: string;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ diagram, onEdit, loading, error }) => {
  return (
    <div className="card bg-white shadow p-6 mb-4">
      <label className="block text-lg font-semibold mb-2">Visualization</label>
      {loading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="mb-4">
            {/* Render Mermaid diagram if available */}
            {diagram ? (
              <Mermaid id="diagram" mmd={diagram} />
            ) : (
              <div className="text-gray-400">No diagram available</div>
            )}
          </div>
          <textarea
            className="textarea textarea-bordered w-full"
            value={diagram}
            onChange={e => onEdit(e.target.value)}
            rows={6}
            placeholder="Edit the diagram directly in the framework format (e.g., Mermaid)"
          />
        </>
      )}
    </div>
  );
}
