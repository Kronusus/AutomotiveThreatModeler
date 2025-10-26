import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, AlertCircle, Shield, FileDown, FileSpreadsheet, FileJson } from "lucide-react";
import { ThreatModelResult } from "@/lib/types";

interface ThreatModelResultsProps {
  results: ThreatModelResult[];
  loading: boolean;
  error?: string;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export const ThreatModelResults: React.FC<ThreatModelResultsProps> = ({
  results,
  loading,
  error,
  onExportPDF,
  onExportCSV,
  onExportJSON,
}) => {
  if (loading) {
    return (
      <div className="py-16 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <div className="text-center space-y-1">
            <p className="text-base font-medium">Analyzing threats</p>
            <p className="text-sm text-muted-foreground">
              Performing STRIDE threat modeling analysis
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-sm font-semibold">Analysis Failed</AlertTitle>
        <AlertDescription className="text-sm mt-1">{error}</AlertDescription>
      </Alert>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-16 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-muted p-3">
            <Shield className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium">No results yet</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Run the threat modeling analysis to identify security vulnerabilities
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Export Buttons and Count */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground font-medium">
          {results.length} threat{results.length !== 1 ? 's' : ''} identified
        </p>
        
        <div className="flex gap-2 shrink-0">
          <Button 
            onClick={onExportPDF} 
            size="sm"
            className="h-9"
          >
            <FileDown className="h-4 w-4 mr-1.5" />
            PDF
          </Button>
          <Button 
            onClick={onExportJSON} 
            size="sm"
            className="h-9"
          >
            <FileJson className="h-4 w-4 mr-1.5" />
            JSON
          </Button>
          <Button 
            onClick={onExportCSV} 
            size="sm"
            className="h-9"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            CSV
          </Button>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold w-[15%] p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Asset</div>
              </TableHead>
              
              <TableHead className="font-semibold w-[12%] p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Property</div>
              </TableHead>
              
              <TableHead className="font-semibold w-[10%] p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">STRIDE</div>
              </TableHead>
              
              <TableHead className="font-semibold w-[30%] p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reasoning</div>
              </TableHead>
              
              <TableHead className="font-semibold w-[33%] p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Damage Scenario</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((r, i) => (
              <TableRow key={i} className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-medium align-top py-4 text-sm">{r.asset}</TableCell>
                <TableCell className="align-top py-4 text-sm">{r.property}</TableCell>
                <TableCell className="align-top py-4">
                  <Badge variant="outline" className="font-mono text-xs font-semibold">
                    {r.stride}
                  </Badge>
                </TableCell>
                <TableCell className="align-top py-4">
                  <p className="text-sm leading-relaxed text-foreground">{r.reasoning}</p>
                </TableCell>
                <TableCell className="align-top py-4">
                  <p className="text-sm leading-relaxed text-foreground">{r.damage}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
