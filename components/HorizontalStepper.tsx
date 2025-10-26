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
    <div className={cn("flex items-center gap-2 pt-4 pb-4 px-4 bg-muted/30 rounded-md border", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const showConnector = !isLast;

        return (
          <React.Fragment key={step.id}>
            {/* Step Indicator */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-bold text-sm transition-all duration-300 shadow-sm",
                  step.isComplete
                    ? "bg-primary text-primary-foreground shadow"
                    : step.isActive
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.isComplete ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-semibold truncate">{step.label}</p>
                <p className="text-sm text-muted-foreground truncate">
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
