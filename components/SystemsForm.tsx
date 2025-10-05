import React from "react";

export interface System {
  name: string;
  inputs: string;
  outputs: string;
  interfaces: string;
}

interface SystemsFormProps {
  systems: System[];
  onChange: (systems: System[]) => void;
}

export const SystemsForm: React.FC<SystemsFormProps> = ({ systems, onChange }) => {
  const handleSystemChange = (idx: number, field: keyof System, value: string) => {
    const updated = systems.map((sys, i) =>
      i === idx ? { ...sys, [field]: value } : sys
    );
    onChange(updated);
  };

  const addSystem = () => {
    onChange([...systems, { name: "", inputs: "", outputs: "", interfaces: "" }]);
  };

  const removeSystem = (idx: number) => {
    onChange(systems.filter((_, i) => i !== idx));
  };

  return (
    <div className="card bg-white shadow p-6 mb-4">
      <label className="block text-lg font-semibold mb-2">Systems</label>
      {systems.map((sys, idx) => (
        <div key={idx} className="mb-4 border-b pb-4">
          <input
            className="input input-bordered w-full mb-2"
            placeholder="System Name"
            value={sys.name}
            onChange={e => handleSystemChange(idx, "name", e.target.value)}
          />
          <input
            className="input input-bordered w-full mb-2"
            placeholder="Inputs"
            value={sys.inputs}
            onChange={e => handleSystemChange(idx, "inputs", e.target.value)}
          />
          <input
            className="input input-bordered w-full mb-2"
            placeholder="Outputs"
            value={sys.outputs}
            onChange={e => handleSystemChange(idx, "outputs", e.target.value)}
          />
          <input
            className="input input-bordered w-full mb-2"
            placeholder="Interfaces"
            value={sys.interfaces}
            onChange={e => handleSystemChange(idx, "interfaces", e.target.value)}
          />
          <button className="btn btn-error btn-sm" onClick={() => removeSystem(idx)}>
            Entfernen
          </button>
        </div>
      ))}
      <button className="btn btn-primary" onClick={addSystem} type="button">
        System hinzufügen
      </button>
    </div>
  );
};
