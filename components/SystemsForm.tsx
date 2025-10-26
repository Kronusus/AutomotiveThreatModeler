import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

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
    <div className="space-y-3">
      {systems.map((sys, idx) => (
        <Card
          key={idx}
          className="border-2 border-primary/10 bg-card/60 transition-all hover:border-primary/30 hover:shadow-md"
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Input
                  value={sys.name || `System ${idx + 1}`}
                  onChange={(e) =>
                    handleSystemChange(idx, "name", e.target.value)
                  }
                  placeholder="Enter system name..."
                  className="font-semibold text-base h-9 border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSystem(idx)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                title="Remove system"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`system-inputs-${idx}`} className="text-sm font-medium">
                  Inputs
                </Label>
                <Input
                  id={`system-inputs-${idx}`}
                  placeholder="e.g., BrakePedalPosition"
                  value={sys.inputs}
                  onChange={(e) =>
                    handleSystemChange(idx, "inputs", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`system-outputs-${idx}`} className="text-sm font-medium">
                  Outputs
                </Label>
                <Input
                  id={`system-outputs-${idx}`}
                  placeholder="e.g., ActuatorTargetPressure"
                  value={sys.outputs}
                  onChange={(e) =>
                    handleSystemChange(idx, "outputs", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`system-description-${idx}`} className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id={`system-description-${idx}`}
                placeholder="Describe the system's function and responsibilities"
                value={sys.description}
                onChange={(e) =>
                  handleSystemChange(idx, "description", e.target.value)
                }
                rows={2}
                className="resize-none"
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
        className="w-full border-dashed border-2 h-10 hover:bg-primary/5 hover:border-primary transition-all"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add System
      </Button>
    </div>
  );
};
