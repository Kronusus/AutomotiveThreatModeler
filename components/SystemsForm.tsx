import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { System } from "@/lib/types";

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
    <div className="space-y-5">
      {systems.map((sys, idx) => (
        <Card
          key={idx}
          className="hover:shadow-md transition-all duration-200"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <Label htmlFor={`system-name-${idx}`} className="text-sm font-semibold text-foreground">
                  System Name
                </Label>
                <Input
                  id={`system-name-${idx}`}
                  value={sys.name || ""}
                  onChange={(e) =>
                    handleSystemChange(idx, "name", e.target.value)
                  }
                  placeholder={`System ${idx + 1}`}
                  className="h-10 border-input bg-background"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSystem(idx)}
                className="shrink-0 self-end"
                title="Remove system"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`system-inputs-${idx}`} className="text-sm font-semibold text-foreground">
                  Inputs
                </Label>
                <Input
                  id={`system-inputs-${idx}`}
                  placeholder="e.g., BrakePedalPosition"
                  value={sys.inputs}
                  onChange={(e) =>
                    handleSystemChange(idx, "inputs", e.target.value)
                  }
                  className="h-10 border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`system-outputs-${idx}`} className="text-sm font-semibold text-foreground">
                  Outputs
                </Label>
                <Input
                  id={`system-outputs-${idx}`}
                  placeholder="e.g., ActuatorTargetPressure"
                  value={sys.outputs}
                  onChange={(e) =>
                    handleSystemChange(idx, "outputs", e.target.value)
                  }
                  className="h-10 border-input bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`system-description-${idx}`} className="text-sm font-semibold text-foreground">
                Description
              </Label>
              <Textarea
                id={`system-description-${idx}`}
                placeholder="Describe the system's function and responsibilities..."
                value={sys.description}
                onChange={(e) =>
                  handleSystemChange(idx, "description", e.target.value)
                }
                rows={3}
                className="resize-none border-input bg-background leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={addSystem}
        type="button"
        id="add-system-btn"
        variant="outline"
        className="w-full h-11"
      >
        <PlusCircle className="h-4 w-4" />
        Add system
      </Button>
    </div>
  );
};
