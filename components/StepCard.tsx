/**
 * Collapsible step card component for workflow steps
 */

import React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
  isLocked?: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  children: React.ReactNode;
  className?: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  description,
  isComplete,
  isActive,
  isLocked = false,
  collapsed,
  onToggleCollapse,
  children,
  className,
}) => {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isActive && "border-primary/30 shadow-md",
        isComplete && "bg-primary/5",
        isLocked && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-base transition-all duration-300 mt-0.5 border-2",
                isComplete
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-foreground border-muted-foreground/50"
              )}
            >
              {isComplete ? (
                <Check className="h-5 w-5 animate-in zoom-in-50" />
              ) : (
                stepNumber
              )}
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <CardTitle className="text-lg font-semibold leading-none">{title}</CardTitle>
              <CardDescription className="text-sm leading-snug">{description}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand" : "Collapse"}
            className="shrink-0 h-9 w-9"
          >
            {collapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          collapsed ? "max-h-0 opacity-0" : "max-h-[5000px] opacity-100"
        )}
      >
        <CardContent className="pt-0 pb-6">
          {children}
        </CardContent>
      </div>
    </Card>
  );
};
