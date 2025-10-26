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
        "shadow-xl border-2 transition-all duration-300",
        isComplete || isActive
          ? "hover:shadow-2xl"
          : isLocked
          ? "border-dashed bg-muted/30"
          : "hover:shadow-2xl",
        className
      )}
    >
      <CardHeader
        className={cn(
          "space-y-2 pb-6 transition-colors duration-300",
          isLocked && "bg-muted/30"
        )}
      >
        <div className="flex items-start justify-between gap-3 w-full">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-lg shadow-md transition-all duration-300 border-2",
                isComplete
                  ? "bg-primary text-primary-foreground border-primary"
                  : isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {isComplete ? (
                <Check className="h-6 w-6 animate-in zoom-in-50 duration-300" />
              ) : (
                stepNumber
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              aria-expanded={!collapsed}
              title={collapsed ? "Expand" : "Collapse"}
              className="transition-transform hover:scale-110"
            >
              {collapsed ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {!collapsed && (
        <CardContent className="pt-7 pb-9 animate-in fade-in-50 slide-in-from-top-4 duration-300">
          {children}
        </CardContent>
      )}
    </Card>
  );
};
