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
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 mt-0.5",
                isComplete
                  ? "bg-primary text-primary-foreground shadow-md"
                  : isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground border-2 border-border"
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
      {!collapsed && (
        <CardContent className="pt-0 pb-6">
          {children}
        </CardContent>
      )}
    </Card>
  );
};
