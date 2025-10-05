import React from "react";

interface UseCaseFormProps {
  value: string;
  onChange: (val: string) => void;
}

export const UseCaseForm: React.FC<UseCaseFormProps> = ({ value, onChange }) => (
  <div className="card bg-white shadow p-6 mb-4">
    <label className="block text-lg font-semibold mb-2">Use Case</label>
    <input
      type="text"
      className="input input-bordered w-full"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="e.g. 'Brake the vehicle using foot pedal'"
    />
  </div>
);
