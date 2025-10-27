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
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px] font-semibold text-foreground align-middle">Asset</TableHead>
                <TableHead className="w-[120px] font-semibold text-foreground align-middle">Property</TableHead>
                <TableHead className="w-[100px] font-semibold text-foreground align-middle">STRIDE</TableHead>
                <TableHead className="w-[200px] font-semibold text-foreground align-middle">Damage Scenario</TableHead>
                <TableHead className="font-semibold text-foreground align-middle">Reasoning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="align-top font-normal py-3 w-[180px]">{r.asset}</TableCell>
                  <TableCell className="align-top font-normal py-3 w-[120px]">{r.property}</TableCell>
                  <TableCell className="align-top font-normal py-3 w-[100px]">{r.stride}</TableCell>
                  <TableCell className="align-top font-normal py-3 w-[200px]">{r.damage}</TableCell>
                  <TableCell className="align-top font-normal py-3">{r.reasoning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
