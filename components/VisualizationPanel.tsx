import React, { useState } from "react";
import Mermaid from "mermaid-react";
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
  const [diagramCopied, setDiagramCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(diagram);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyDiagram = async () => {
    try {
      // Get the rendered SVG element
      const svgElement = document.querySelector('#diagram svg');
      if (!svgElement) {
        throw new Error('SVG element not found');
      }

      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement;
      
      // Get the SVG as string
      const svgString = new XMLSerializer().serializeToString(svgClone);
      
      // Create a blob with the SVG content
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      
      // Try to copy as image first (modern browsers)
      try {
        const item = new ClipboardItem({
          'image/svg+xml': blob,
          'text/plain': new Blob([svgString], { type: 'text/plain' })
        });
        await navigator.clipboard.write([item]);
      } catch (clipboardErr) {
        // Fallback: copy as text
        await navigator.clipboard.writeText(svgString);
      }
      
      setDiagramCopied(true);
      setTimeout(() => setDiagramCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy diagram:", err);
      // Final fallback: copy the mermaid code
      try {
        await navigator.clipboard.writeText(diagram);
        setDiagramCopied(true);
        setTimeout(() => setDiagramCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Failed to copy fallback:", fallbackErr);
      }
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 rounded-lg border-2 border-dashed border-border bg-muted/20">
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
          <AlertTitle className="text-sm font-semibold">Visualization Error</AlertTitle>
          <AlertDescription className="text-sm mt-1">{error}</AlertDescription>
        </Alert>
      ) : diagram ? (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">System Architecture Diagram</Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyDiagram}
                className="h-8"
              >
                {diagramCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="rounded-lg border-2 border-border bg-card p-6 overflow-auto flex items-center justify-center min-h-[280px]">
              <Mermaid id="diagram" mmd={diagram} />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="diagram-editor" className="text-sm font-medium">
                  Diagram Source Code
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
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
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 rounded-lg border-2 border-dashed border-border bg-muted/20">
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
