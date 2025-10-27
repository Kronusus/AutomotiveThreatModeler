/**
 * Horizontal stepper component for multi-step workflows
 */

import React from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Step {
  id: number;
  label: string;
  subtitle: string;
  isComplete: boolean;
  isActive: boolean;
}

interface HorizontalStepperProps {
  steps: Step[];
  className?: string;
}

export const HorizontalStepper: React.FC<HorizontalStepperProps> = ({
  steps,
  className,
}) => {
  const completedCount = steps.filter((s) => s.isComplete).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <div className={cn("w-full py-4", className)}>
      {/* Progress Header */}
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Threat Model Wizard</h2>
          <Badge variant={completedCount === totalSteps ? "default" : "secondary"}>
            Step {steps.findIndex((s) => s.isActive) + 1} of {totalSteps}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {completedCount} of {totalSteps} completed
          </span>
          <Badge 
            variant={progressPercentage === 100 ? "default" : "outline"}
            className="min-w-[60px] justify-center"
          >
            {Math.round(progressPercentage)}%
          </Badge>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold border-2 transition-all duration-300",
                    step.isComplete
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : step.isActive
                      ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20"
                      : "bg-muted/50 text-foreground border-muted-foreground/40 hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  {step.isComplete ? (
                    <Check className="h-6 w-6 animate-in zoom-in-50 duration-200" />
                  ) : (
                    <span className="text-base font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="text-center space-y-1">
                  <p className={cn(
                    "text-sm font-semibold",
                    step.isComplete || step.isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.subtitle}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex items-center pt-6 flex-shrink-0 px-4" style={{ width: '140px' }}>
                  <div className="w-full h-1 relative rounded-full bg-muted-foreground/30">
                    <div 
                      className={cn(
                        "absolute inset-y-0 left-0 transition-all duration-500 rounded-full bg-primary",
                        step.isComplete ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
