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
    <section
      className={cn(
        "space-y-5",
        className
      )}
    >
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </header>
      <div className="space-y-4">{children}</div>
      {footer && <div className="mt-6 pt-6 border-t border-border">{footer}</div>}
    </section>
  );
};
