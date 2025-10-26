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
    <div className={cn("flex items-center gap-2 pt-4 px-2", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const showConnector = !isLast;

        return (
          <React.Fragment key={step.id}>
            {/* Step Indicator */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm transition-all duration-300 border-2",
                  step.isComplete
                    ? "bg-primary text-primary-foreground border-primary"
                    : step.isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border"
                )}
              >
                {step.isComplete ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-bold truncate">{step.label}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {step.subtitle}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {showConnector && (
              <div
                className="flex-1 transition-colors duration-300"
                style={{
                  height: "4px",
                  minWidth: "60px",
                  borderRadius: "2px",
                  backgroundColor: step.isComplete
                    ? "hsl(var(--primary))"
                    : "hsl(var(--connector))",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
