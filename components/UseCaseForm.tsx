import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UseCaseFormProps {
  value: string;
  onChange: (val: string) => void;
}

export const UseCaseForm: React.FC<UseCaseFormProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
          <Label htmlFor="useCase" className="text-base font-semibold">
        Description <span className="text-destructive">*</span>
      </Label>
      
      <Textarea
        id="use-case-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: As a Driver, I want to safely brake the vehicle using the foot pedal to reduce speed and come to a complete stop when needed."
        className="min-h-[100px] resize-none"
        rows={4}
      />
    </div>
  );
};

