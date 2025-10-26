import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UseCaseFormProps {
  value: string;
  onChange: (val: string) => void;
}

export const UseCaseForm: React.FC<UseCaseFormProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="use-case-input" className="text-sm font-semibold">
      Narrative
    </Label>
    <Input
      id="use-case-input"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g., As a Driver, I want to safely brake the vehicle using the foot pedal"
      className="h-11 text-sm"
    />
  </div>
);

