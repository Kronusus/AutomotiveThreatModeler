import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, ChevronDown, ChevronUp, Cpu, ArrowDownCircle, ArrowUpCircle, FileText } from "lucide-react";
import { System } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SystemsFormProps {
  systems: System[];
  onChange: (systems: System[]) => void;
}

export const SystemsForm: React.FC<SystemsFormProps> = ({
  systems,
  onChange,
}) => {
  const [expandedSystems, setExpandedSystems] = useState<Set<number>>(
    new Set(systems.map((_, idx) => idx))
  );
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

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
    const newIndex = systems.length;
    onChange([
      ...systems,
      { name: "", inputs: "", outputs: "", description: "" },
    ]);
    // Automatically expand the new system
    setExpandedSystems((prev) => new Set(prev).add(newIndex));
    // Set focus index to the new system
    setFocusIndex(newIndex);
  };

  const removeSystem = (idx: number) => {
    onChange(systems.filter((_, i) => i !== idx));
    setExpandedSystems((prev) => {
      const updated = new Set(prev);
      updated.delete(idx);
      return updated;
    });
  };

  const toggleExpand = (idx: number) => {
    setExpandedSystems((prev) => {
      const updated = new Set(prev);
      if (updated.has(idx)) {
        updated.delete(idx);
      } else {
        updated.add(idx);
      }
      return updated;
    });
  };

  // Auto-focus on the name input of newly added system
  useEffect(() => {
    if (focusIndex !== null) {
      const inputElement = document.getElementById(`system-name-${focusIndex}`);
      if (inputElement) {
        setTimeout(() => {
          inputElement.focus();
          setFocusIndex(null);
        }, 100);
      }
    }
  }, [focusIndex]);

  const isSystemComplete = (sys: System) => {
    return sys.name.trim() !== "" && sys.description.trim() !== "";
  };

  const getSystemCompletionPercentage = (sys: System) => {
    let filled = 0;
    if (sys.name.trim() !== "") filled++;
    if (sys.inputs.trim() !== "") filled++;
    if (sys.outputs.trim() !== "") filled++;
    if (sys.description.trim() !== "") filled++;
    return (filled / 4) * 100;
  };

  return (
    <div className="space-y-4">
      {systems.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Cpu className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No systems defined yet</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Add your first system to begin modeling your automotive architecture. Each system represents a component or subsystem in your vehicle.
              </p>
            </div>
          </div>
        </div>
      )}

      {systems.map((sys, idx) => {
        const isExpanded = expandedSystems.has(idx);
        const isComplete = isSystemComplete(sys);
        const completionPercentage = getSystemCompletionPercentage(sys);

        return (
          <Card
            key={idx}
            className={cn(
              "transition-all duration-200",
              isComplete && "border-l-4 border-l-primary"
            )}
          >
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(idx)}
                    className="shrink-0 h-8 w-8"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Cpu className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      {sys.name.trim() ? (
                        <CardTitle className="text-base truncate">{sys.name}</CardTitle>
                      ) : (
                        <CardTitle className="text-base text-muted-foreground">
                          System {idx + 1} (Unnamed)
                        </CardTitle>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isComplete && (
                      <Badge variant="default" className="text-xs">
                        Complete
                      </Badge>
                    )}
                    {sys.inputs.trim() && (
                      <Badge variant="outline" className="text-xs hidden sm:flex items-center gap-1">
                        <ArrowDownCircle className="h-3 w-3" />
                        In
                      </Badge>
                    )}
                    {sys.outputs.trim() && (
                      <Badge variant="outline" className="text-xs hidden sm:flex items-center gap-1">
                        <ArrowUpCircle className="h-3 w-3" />
                        Out
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSystem(idx)}
                    className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove system"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isExpanded && sys.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 ml-11 mt-2">
                  {sys.description}
                </p>
              )}
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-6 pb-6 pt-3">
                <div className="space-y-2">
                  <Label htmlFor={`system-name-${idx}`} className="text-sm font-medium">
                    System Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`system-name-${idx}`}
                    value={sys.name || ""}
                    onChange={(e) =>
                      handleSystemChange(idx, "name", e.target.value)
                    }
                    placeholder="e.g., Electronic Brake Control Module (EBCM)"
                    className="h-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`system-inputs-${idx}`} className="text-sm font-medium flex items-center gap-2">
                      <ArrowDownCircle className="h-4 w-4 text-foreground" />
                      Inputs
                    </Label>
                    <Textarea
                      id={`system-inputs-${idx}`}
                      placeholder="e.g., BrakePedalPosition, VehicleSpeed"
                      value={sys.inputs}
                      onChange={(e) =>
                        handleSystemChange(idx, "inputs", e.target.value)
                      }
                      rows={3}
                      className="resize-none text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`system-outputs-${idx}`} className="text-sm font-medium flex items-center gap-2">
                      <ArrowUpCircle className="h-4 w-4 text-foreground" />
                      Outputs
                    </Label>
                    <Textarea
                      id={`system-outputs-${idx}`}
                      placeholder="e.g., BrakeActuatorCommand, ABSStatus"
                      value={sys.outputs}
                      onChange={(e) =>
                        handleSystemChange(idx, "outputs", e.target.value)
                      }
                      rows={3}
                      className="resize-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`system-description-${idx}`} className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id={`system-description-${idx}`}
                    placeholder="Describe the system's primary function and responsibilities..."
                    value={sys.description}
                    onChange={(e) =>
                      handleSystemChange(idx, "description", e.target.value)
                    }
                    rows={4}
                    className="resize-none text-sm"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      <Button
        variant="outline"
        size="lg"
        onClick={addSystem}
        type="button"
        id="add-system-btn"
        className="w-full"
      >
        <PlusCircle className="h-5 w-5" />
        Add {systems.length > 0 ? "another" : "a"} system
      </Button>
    </div>
  );
};
