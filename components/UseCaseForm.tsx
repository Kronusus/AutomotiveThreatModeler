import React from "react";

interface UseCaseFormProps {
  value: string;
  onChange: (val: string) => void;
}

export const UseCaseForm: React.FC<UseCaseFormProps> = ({ value, onChange }) => (
  <div className="card shadow-md p-6 mb-6">
    <label
      htmlFor="use-case-input"
      className="block text-lg font-bold mb-2 text-foreground/80"
    >
      Use Case
    </label>
    <input
      id="use-case-input"
      type="text"
      className="input w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. 'Brake the vehicle using foot pedal'"
    />
  </div>
);
