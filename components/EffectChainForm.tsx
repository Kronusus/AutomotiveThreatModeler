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

export const EffectChainForm: React.FC<EffectChainFormProps> = ({
  value,
  onChange,
}) => (
  <div className="card shadow-md p-6 mb-6">
    <h3 className="block text-lg font-bold mb-4 text-foreground/80">
      Effect Chain
    </h3>
    <div className="space-y-4">
      <div>
        <label
          htmlFor="effect-chain-input"
          className="block text-sm font-bold mb-1 text-foreground/70"
        >
          Input
        </label>
        <textarea
          id="effect-chain-input"
          className="input w-full"
          value={value.input}
          onChange={(e) => onChange({ ...value, input: e.target.value })}
          placeholder="List all overall inputs for the respective use case"
          rows={2}
        />
      </div>
      <div>
        <label
          htmlFor="effect-chain-core-logic"
          className="block text-sm font-bold mb-1 text-foreground/70"
        >
          Core Logic
        </label>
        <textarea
          id="effect-chain-core-logic"
          className="input w-full"
          value={value.coreLogic}
          onChange={(e) =>
            onChange({ ...value, coreLogic: e.target.value })
          }
          placeholder="Describe the general logic that processes the input to derive the output"
          rows={2}
        />
      </div>
      <div>
        <label
          htmlFor="effect-chain-output"
          className="block text-sm font-bold mb-1 text-foreground/70"
        >
          Output
        </label>
        <textarea
          id="effect-chain-output"
          className="input w-full"
          value={value.output}
          onChange={(e) => onChange({ ...value, output: e.target.value })}
          placeholder="List all outputs of the respective use case"
          rows={2}
        />
      </div>
    </div>
  </div>
);
