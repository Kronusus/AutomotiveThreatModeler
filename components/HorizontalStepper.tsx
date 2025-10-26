/**
 * Horizontal stepper component for multi-step workflows
 */

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-start justify-between gap-2">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold border-2 transition-colors",
                    step.isComplete
                      ? "bg-primary text-primary-foreground border-primary"
                      : step.isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-muted-foreground/20"
                  )}
                >
                  {step.isComplete ? <Check className="h-6 w-6" /> : step.id}
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
