import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Eye, Code2, Copy, Check } from "lucide-react";

interface VisualizationPanelProps {
  diagram: string;
  onEdit: (diagram: string) => void;
  loading: boolean;
  error?: string;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ 
  diagram, 
  onEdit, 
  loading, 
  error 
}) => {
  const [copied, setCopied] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    if (diagram && mermaidRef.current) {
      // Generate a unique ID for each render
      const uniqueId = `diagram-svg-${renderKey}`;
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
      mermaid.render(uniqueId, diagram)
        .then(({ svg }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        })
        .catch(e => console.error(e));
    }
  }, [diagram, renderKey]);

  // Re-render when component becomes visible (detect if ref has dimensions)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && diagram) {
            // Trigger re-render when element becomes visible
            setRenderKey((prev) => prev + 1);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (mermaidRef.current) {
      observer.observe(mermaidRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [diagram]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(diagram);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 rounded-md border-2 border-dashed bg-muted/20">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <div className="text-center space-y-1">
            <p className="text-base font-medium">Generating visualization</p>
            <p className="text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Visualization Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : diagram ? (
        <>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
              <Label className="text-sm font-semibold">System Architecture Diagram</Label>
            </div>
            <div className="rounded-md border bg-card p-6 overflow-auto flex items-center justify-center min-h-[280px]">
              <div ref={mermaidRef} id="diagram"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2.5">
                <Code2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <Label htmlFor="diagram-editor" className="text-sm font-semibold">
                  Diagram Source Code
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="diagram-editor"
              value={diagram}
              onChange={e => onEdit(e.target.value)}
              rows={5}
              placeholder="Mermaid diagram code"
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Edit the Mermaid syntax above to customize the diagram. Changes update in real-time.
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 rounded-md border-2 border-dashed bg-muted/20">
          <div className="rounded-full bg-muted p-3">
            <Eye className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium">No visualization yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
