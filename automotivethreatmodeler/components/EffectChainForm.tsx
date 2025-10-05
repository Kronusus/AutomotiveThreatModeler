import React from "react";

interface EffectChainFormProps {
  value: string;
  onChange: (val: string) => void;
}

export const EffectChainForm: React.FC<EffectChainFormProps> = ({ value, onChange }) => (
  <div className="card bg-white shadow p-6 mb-4">
    <label className="block text-lg font-semibold mb-2">Abstract Effect Chain</label>
    <textarea
      className="textarea textarea-bordered w-full"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Beschreibe Input, Verhalten und Output-Schritte"
      rows={3}
    />
  </div>
);
