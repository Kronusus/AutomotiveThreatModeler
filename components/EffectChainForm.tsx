import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="effect-chain-input" className="text-sm font-semibold">
        Input
      </Label>
      <Textarea
        id="effect-chain-input"
        value={value.input}
        onChange={(e) => onChange({ ...value, input: e.target.value })}
        placeholder="Specify all inputs (e.g., Driver Brake Request)"
        rows={3}
        className="resize-none text-sm"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="effect-chain-core-logic" className="text-sm font-semibold">
        Core Logic
      </Label>
      <Textarea
        id="effect-chain-core-logic"
        value={value.coreLogic}
        onChange={(e) => onChange({ ...value, coreLogic: e.target.value })}
        placeholder="Describe processing logic and control flow"
        rows={3}
        className="resize-none text-sm"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="effect-chain-output" className="text-sm font-semibold">
        Output
      </Label>
      <Textarea
        id="effect-chain-output"
        value={value.output}
        onChange={(e) => onChange({ ...value, output: e.target.value })}
        placeholder="Define expected outputs (e.g., Vehicle Deceleration)"
        rows={3}
        className="resize-none text-sm"
      />
    </div>
  </div>
);
