import * as React from "react";

interface EffectChainValue {
  input: string;
  coreLogic: string;
  output: string;
}

interface EffectChainFormProps {
  value: EffectChainValue;
  onChange: (val: EffectChainValue) => void;
}

interface EffectChainFormProps {
  value: {
    input: string;
    coreLogic: string;
    output: string;
  };
  onChange: (val: { input: string; coreLogic: string; output: string }) => void;
}

export const EffectChainForm: React.FC<EffectChainFormProps> = ({ value, onChange }) => (
  <div className="card bg-white shadow p-6 mb-4">
    <label className="block text-lg font-semibold mb-2">Effect Chain</label>
    <div className="mb-4">
      <label className="block font-medium mb-1">Input</label>
      <textarea
        className="textarea textarea-bordered w-full"
        value={value.input}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ ...value, input: e.target.value })}
        placeholder="List all overall inputs for the respective use case"
        rows={2}
      />
    </div>
    <div className="mb-4">
      <label className="block font-medium mb-1">Core Logic</label>
      <textarea
        className="textarea textarea-bordered w-full"
        value={value.coreLogic}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ ...value, coreLogic: e.target.value })}
        placeholder="Describe the general logic that processes the input to derive the output"
        rows={2}
      />
    </div>
    <div>
      <label className="block font-medium mb-1">Output</label>
      <textarea
        className="textarea textarea-bordered w-full"
        value={value.output}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ ...value, output: e.target.value })}
        placeholder="List all outputs of the respective use case"
        rows={2}
      />
    </div>
  </div>
);
