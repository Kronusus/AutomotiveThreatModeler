import React from "react";

export interface System {
  name: string;
  inputs: string;
  outputs: string;
  description: string;
}

interface SystemsFormProps {
  systems: System[];
  onChange: (systems: System[]) => void;
}

export const SystemsForm: React.FC<SystemsFormProps> = ({
  systems,
  onChange,
}) => {
  const handleSystemChange = (
    idx: number,
    field: keyof System,
    value: string
  ) => {
    const updated = systems.map((sys, i) =>
      i === idx ? { ...sys, [field]: value } : sys
    );
    onChange(updated);
  };

  const addSystem = () => {
    onChange([
      ...systems,
      { name: "", inputs: "", outputs: "", description: "" },
    ]);
  };

  const removeSystem = (idx: number) => {
    onChange(systems.filter((_, i) => i !== idx));
  };

  return (
    <div className="card shadow-md p-6 mb-6">
      <h3 className="block text-lg font-bold mb-4 text-foreground/80">
        Systems
      </h3>
      <div className="space-y-6">
        {systems.map((sys, idx) => (
          <div
            key={idx}
            className="border border-card-border rounded-lg p-4 relative"
          >
            <button
              className="btn btn-error btn-sm absolute top-2 right-2"
              onClick={() => removeSystem(idx)}
            >
              Remove
            </button>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-foreground/70">
                  System Name
                </label>
                <input
                  className="input w-full"
                  placeholder="e.g., Brake Controller"
                  value={sys.name}
                  onChange={(e) =>
                    handleSystemChange(idx, "name", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-foreground/70">
                  Inputs
                </label>
                <input
                  className="input w-full"
                  placeholder="e.g., BrakePedalPosition"
                  value={sys.inputs}
                  onChange={(e) =>
                    handleSystemChange(idx, "inputs", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-foreground/70">
                  Outputs
                </label>
                <input
                  className="input w-full"
                  placeholder="e.g., ActuatorTargetPressure"
                  value={sys.outputs}
                  onChange={(e) =>
                    handleSystemChange(idx, "outputs", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-foreground/70">
                  Description
                </label>
                <textarea
                  className="input w-full"
                  placeholder="Briefly describe the system's function"
                  value={sys.description}
                  onChange={(e) =>
                    handleSystemChange(idx, "description", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn btn-secondary mt-4"
        onClick={addSystem}
        type="button"
      >
        Add System
      </button>
    </div>
  );
};
