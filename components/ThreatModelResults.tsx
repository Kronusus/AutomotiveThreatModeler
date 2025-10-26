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
      <div className="py-16 rounded-md border-2 border-dashed bg-muted/20">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">Analyzing threats</p>
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
      <div className="py-16 rounded-md border-2 border-dashed bg-muted/20">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-muted p-3">
            <Shield className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No results yet</p>
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
            variant="default"
          >
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button 
            onClick={onExportJSON} 
            size="sm"
            variant="default"
          >
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
          <Button 
            onClick={onExportCSV} 
            size="sm"
            variant="default"
          >
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-md border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold w-[15%] p-3">
                <div className="text-sm font-semibold">Asset</div>
              </TableHead>
              
              <TableHead className="font-semibold w-[12%] p-3">
                <div className="text-sm font-semibold">Property</div>
              </TableHead>
              
              <TableHead className="font-semibold w-[10%] p-3">
                <div className="text-sm font-semibold">STRIDE</div>
              </TableHead>
              
              <TableHead className="font-semibold w-[30%] p-3">
                <div className="text-sm font-semibold">Reasoning</div>
              </TableHead>
              
              <TableHead className="font-semibold w-[33%] p-3">
                <div className="text-sm font-semibold">Damage Scenario</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((r, i) => (
              <TableRow key={i} className="hover:bg-muted/40 transition-colors">
                <TableCell className="align-top py-4 text-sm">{r.asset}</TableCell>
                <TableCell className="align-top py-4 text-sm">{r.property}</TableCell>
                <TableCell className="align-top py-4 text-sm">{r.stride}</TableCell>
                <TableCell className="align-top py-4 text-sm">{r.reasoning}</TableCell>
                <TableCell className="align-top py-4 text-sm">{r.damage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
