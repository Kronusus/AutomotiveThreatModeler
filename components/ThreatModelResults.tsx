import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, AlertCircle, Shield, FileDown, FileSpreadsheet, Search, X, FileJson, Filter } from "lucide-react";

export interface ThreatModelResult {
  asset: string;
  property: string;
  stride: string;
  reasoning: string;
  damage: string;
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const [strideFilter, setStrideFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");

  // Get unique STRIDE categories and properties
  const uniqueStrides = useMemo(() => {
    return Array.from(new Set(results.map(r => r.stride))).sort();
  }, [results]);

  const uniqueProperties = useMemo(() => {
    return Array.from(new Set(results.map(r => r.property))).sort();
  }, [results]);

  const filteredResults = useMemo(() => {
    let filtered = results;
    
    // Apply STRIDE filter
    if (strideFilter !== "all") {
      filtered = filtered.filter(r => r.stride === strideFilter);
    }
    
    // Apply Property filter
    if (propertyFilter !== "all") {
      filtered = filtered.filter(r => r.property === propertyFilter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.asset.toLowerCase().includes(query) ||
          r.property.toLowerCase().includes(query) ||
          r.stride.toLowerCase().includes(query) ||
          r.reasoning.toLowerCase().includes(query) ||
          r.damage.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [results, searchQuery, strideFilter, propertyFilter]);

  const hasActiveFilters = strideFilter !== "all" || propertyFilter !== "all" || searchQuery.trim() !== "";

  const clearAllFilters = () => {
    setSearchQuery("");
    setStrideFilter("all");
    setPropertyFilter("all");
  };

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
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredResults.length} of {results.length} threat{results.length !== 1 ? 's' : ''} shown
        </p>
        
        <div className="flex gap-2 shrink-0">
          <Button 
            onClick={onExportPDF} 
            variant="default" 
            size="sm"
            className="h-10"
          >
            <FileDown className="h-3.5 w-3.5 mr-1.5" />
            PDF
          </Button>
          <Button 
            onClick={onExportJSON} 
            variant="outline" 
            size="sm"
            className="h-10"
          >
            <FileJson className="h-3.5 w-3.5 mr-1.5" />
            JSON
          </Button>
          <Button 
            onClick={onExportCSV} 
            variant="outline" 
            size="sm"
            className="h-10"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
            CSV
          </Button>
        </div>
      </div>

      {/* Results Table with Filters in Column Headers */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {/* Asset Column - with Search */}
              <TableHead className="font-semibold w-[15%] p-2">
                <div className="space-y-2">
                  <div className="text-xs">Asset</div>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-7 pr-7 h-7 text-xs w-full"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableHead>
              
              {/* Property Column - with Filter */}
              <TableHead className="font-semibold w-[12%] p-2">
                <div className="space-y-2">
                  <div className="text-xs">Property</div>
                  <div className="relative">
                    <Filter className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none z-10" />
                    <select
                      value={propertyFilter}
                      onChange={(e) => setPropertyFilter(e.target.value)}
                      className="w-full h-7 pl-7 pr-2 text-xs border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                    >
                      <option value="all">All</option>
                      {uniqueProperties.map(property => (
                        <option key={property} value={property}>{property}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </TableHead>
              
              {/* STRIDE Column - with Filter */}
              <TableHead className="font-semibold w-[10%] p-2">
                <div className="space-y-2">
                  <div className="text-xs">STRIDE</div>
                  <div className="relative">
                    <Filter className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none z-10" />
                    <select
                      value={strideFilter}
                      onChange={(e) => setStrideFilter(e.target.value)}
                      className="w-full h-7 pl-7 pr-2 text-xs border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                    >
                      <option value="all">All</option>
                      {uniqueStrides.map(stride => (
                        <option key={stride} value={stride}>{stride}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </TableHead>
              
              {/* Reasoning Column */}
              <TableHead className="font-semibold w-[30%] p-2">
                <div className="space-y-2">
                  <div className="text-xs">Reasoning</div>
                  <div className="h-7 flex items-center">
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-7 px-2 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </TableHead>
              
              {/* Damage Scenario Column */}
              <TableHead className="font-semibold w-[33%] p-2">
                <div className="text-xs">Damage Scenario</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No threats match your filter criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredResults.map((r, i) => (
                <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium align-top py-3 text-sm">{r.asset}</TableCell>
                  <TableCell className="align-top py-3 text-sm">{r.property}</TableCell>
                  <TableCell className="align-top py-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      {r.stride}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top py-3">
                    <p className="text-sm leading-relaxed">{r.reasoning}</p>
                  </TableCell>
                  <TableCell className="align-top py-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.damage}</p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
