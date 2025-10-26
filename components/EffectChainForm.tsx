import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowDownCircle, Cpu, ArrowUpCircle } from "lucide-react";

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
}) => {
  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <Label htmlFor="effect-chain-input" className="text-sm font-medium flex items-center gap-2">
          <ArrowDownCircle className="h-4 w-4 text-foreground" />
          Input
        </Label>
        <Textarea
          id="effect-chain-input"
          value={value.input}
          onChange={(e) => onChange({ ...value, input: e.target.value })}
          placeholder="e.g., Driver Brake Request, Pedal Position Sensor"
          rows={3}
          className="resize-none text-sm"
        />
      </div>

      {/* Core Logic */}
      <div className="space-y-2">
        <Label htmlFor="effect-chain-core-logic" className="text-sm font-medium flex items-center gap-2">
          <Cpu className="h-4 w-4 text-foreground" />
          Core Logic / Processing
        </Label>
        <Textarea
          id="effect-chain-core-logic"
          value={value.coreLogic}
          onChange={(e) => onChange({ ...value, coreLogic: e.target.value })}
          placeholder="e.g., Calculate braking force, Apply ABS algorithm"
          rows={3}
          className="resize-none text-sm"
        />
      </div>

      {/* Output */}
      <div className="space-y-2">
        <Label htmlFor="effect-chain-output" className="text-sm font-medium flex items-center gap-2">
          <ArrowUpCircle className="h-4 w-4 text-foreground" />
          Output
        </Label>
        <Textarea
          id="effect-chain-output"
          value={value.output}
          onChange={(e) => onChange({ ...value, output: e.target.value })}
          placeholder="e.g., Vehicle Deceleration, Brake Actuator Commands"
          rows={3}
          className="resize-none text-sm"
        />
      </div>
    </div>
  );
};
