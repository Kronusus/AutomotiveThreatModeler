import React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  footer,
  headerAction,
}) => {
  return (
    <div className={cn("space-y-4 py-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold leading-none tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>
      <div>{children}</div>
      {footer && (
        <div className="pt-4 border-t">{footer}</div>
      )}
    </div>
  );
};
