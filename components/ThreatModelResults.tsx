import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-4 rounded-lg border bg-muted/50">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium">
            {results.length} threat{results.length !== 1 ? 's' : ''} identified
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportPDF}
          >
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportJSON}
          >
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
          >
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[16%] font-semibold text-foreground">Asset</TableHead>
              <TableHead className="w-[12%] font-semibold text-foreground">Property</TableHead>
              <TableHead className="w-[10%] font-semibold text-foreground">STRIDE</TableHead>
              <TableHead className="w-[20%] font-semibold text-foreground">Damage Scenario</TableHead>
              <TableHead className="font-semibold text-foreground">Reasoning</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="align-top font-normal">{r.asset}</TableCell>
                <TableCell className="align-top font-normal">{r.property}</TableCell>
                <TableCell className="align-top">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {r.stride}
                  </span>
                </TableCell>
                <TableCell className="align-top font-normal">{r.damage}</TableCell>
                <TableCell className="align-top font-normal">{r.reasoning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
