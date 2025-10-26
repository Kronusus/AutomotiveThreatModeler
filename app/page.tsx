

"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { UseCaseForm } from "../components/UseCaseForm";
import { EffectChainForm } from "../components/EffectChainForm";
import { SystemsForm, System } from "../components/SystemsForm";
import { VisualizationPanel } from "../components/VisualizationPanel";
import { ThreatModelResults, ThreatModelResult } from "../components/ThreatModelResults";
import { ThemeToggle } from "../components/theme-toggle";
import { FormSection } from "@/components/FormSection";
// Left stepper removed from main layout (moved to inline progress indicators)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, Sparkles, Shield, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [useCase, setUseCase] = useState("");
  const [effectChain, setEffectChain] = useState({
    input: "",
    coreLogic: "",
    output: "",
  });
  const [systems, setSystems] = useState<System[]>([]);
  const [diagram, setDiagram] = useState("");
  const [diagramLoading, setDiagramLoading] = useState(false);
  const [diagramError, setDiagramError] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<ThreatModelResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | undefined>(undefined);

  const handleExampleData = () => {
    setUseCase(
      "As a Driver, I want to safely and proportionally reduce the vehicle's speed (or bring it to a stop) by applying force to the foot pedal."
    );
    setEffectChain({
      input: "Driver Brake Request (Pedal Force/Position)",
      coreLogic:
        "Brake System Control (Interprets request, calculates required actuator effort, and manages stability/safety functions like ABS/ESC).",
      output:
        "Vehicle Deceleration/Speed Reduction achieved through friction and kinetic energy conversion.",
    });
    setSystems([
      {
        name: "Brake input Processor",
        inputs: "BrakePedalPosition (Raw sensor signal)",
        outputs: "RequestedBrakeDemand (Normalized percentage 0-100%)",
        description:
          "This system measures the physical input (position and/or force) applied by the driver. It translates the raw signal into a normalized brake demand and performs initial safety and plausibility checks on the sensor data.",
      },
      {
        name: "Brake Provider",
        inputs: "RequestedBrakeDemand",
        outputs: "ActuatorTargetPressure",
        description:
          "This system calculates the required braking force for each wheel, considering the driver's request and integrating safety functions (e.g., ABS/ESC to prevent wheel lock or instability). It maps the high-level percentage request to a specific physical command value (e.g., target pressure or actuator current), based on an internal value table.",
      },
    ]);
  };
    
  const handleGenerateVisualization = async () => {
    setDiagramLoading(true);
    setDiagramError(undefined);
    try {
      const res = await fetch("/api/visualization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, effectChain, systems }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Error during visualization");
      setDiagram(data.diagram);
    } catch (e: any) {
      setDiagramError(e.message);
    } finally {
      setDiagramLoading(false);
    }
  };

  const handlePerformThreatModeling = async () => {
    setResultsLoading(true);
    setResultsError(undefined);
    try {
      const res = await fetch("/api/threatmodel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, effectChain, systems, diagram }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Error during threat modeling analysis");
      setResults(data.results);
    } catch (e: any) {
      setResultsError(e.message);
    } finally {
      setResultsLoading(false);
    }
  };

  const handleExport = async (type: "pdf" | "csv" | "json") => {
    try {
      const res = await fetch(`/api/export?type=${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, effectChain, systems, diagram, results }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `threatmodel.${type}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
      alert("Export failed. Please try again.");
    }
  };

  const canGenerateVisualization = useCase.trim() !== "" && systems.length > 0;
  const hasDiagram = Boolean(diagram);
  const hasResults = results.length > 0;

  const currentStage = useMemo(() => {
    if (resultsLoading || hasResults) return 3;
    if (diagramLoading || hasDiagram) return 2;
    return 1;
  }, [resultsLoading, hasResults, diagramLoading, hasDiagram]);

  // inline header progress indicators used instead of a left stepper

  // Collapse state for each step card
  const [collapsed1, setCollapsed1] = useState(false);
  const [collapsed2, setCollapsed2] = useState(false);
  const [collapsed3, setCollapsed3] = useState(false);

  // Refs for focusing next-step buttons
  const generateBtnRef = useRef<HTMLButtonElement | null>(null);
  const analyzeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // placeholder for side-effects when stage changes
  }, [currentStage]);

  const canPerformThreatModeling = hasDiagram;
  const step2Unlocked = canGenerateVisualization;
  const step3Unlocked = hasDiagram;

  return (
    <>
      {/* Header - Fixed */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">
                  Automotive Threat Modeler
                </h1>
              </div>
            </div>
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="space-y-6 lg:space-y-8">
            {/* Introduction Card */}
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-background animate-in fade-in-50 duration-500">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A systematic approach to identify security threats in automotive systems using the STRIDE methodology. 
                    Follow the three-step process below to define your system, generate an architecture diagram, and analyze potential vulnerabilities.
                  </p>
                  
                  {/* Horizontal Stepper */}
                  <div className="flex items-center gap-4 pt-3 px-2">
                    {/* Step 1 */}
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium text-[11px] transition-all duration-300 border",
                        step2Unlocked 
                          ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-500" 
                          : "bg-primary/5 text-primary border-primary/30"
                      )}>
                        {step2Unlocked ? <Check className="h-3 w-3" /> : "1"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold truncate">Define System</p>
                        <p className="text-[10px] text-muted-foreground truncate hidden sm:block">Specify components</p>
                      </div>
                    </div>
                    
                    {/* Connector - always visible */}
                    <div className={cn(
                      "h-[2px] flex-1 transition-colors duration-300",
                      step2Unlocked ? "bg-green-400" : "bg-gray-200/60 dark:bg-gray-700/60"
                    )} />
                    
                    {/* Step 2 */}
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium text-[11px] transition-all duration-300 border",
                        hasDiagram 
                          ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-500" 
                          : step2Unlocked
                          ? "bg-primary/5 text-primary border-primary/30 shadow-[0_0_0_3px_rgba(34,197,94,0.08)]"
                          : "bg-muted/30 text-muted-foreground border-muted-foreground/20"
                      )}>
                        {hasDiagram ? <Check className="h-3 w-3" /> : "2"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold truncate">Generate Diagram</p>
                        <p className="text-[10px] text-muted-foreground truncate hidden sm:block">AI visualization</p>
                      </div>
                    </div>
                    
                    {/* Connector - always visible */}
                    <div className={cn(
                      "h-[2px] flex-1 transition-colors duration-300",
                      hasDiagram ? "bg-green-400" : "bg-gray-200/60 dark:bg-gray-700/60"
                    )} />
                    
                    {/* Step 3 */}
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium text-[11px] transition-all duration-300 border",
                        hasResults
                          ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-500"
                          : step3Unlocked
                          ? "bg-primary/5 text-primary border-primary/30 shadow-[0_0_0_3px_rgba(34,197,94,0.08)]"
                          : "bg-muted/30 text-muted-foreground border-muted-foreground/20"
                      )}>
                        {hasResults ? <Check className="h-3 w-3" /> : "3"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold truncate">Analyze Threats</p>
                        <p className="text-[10px] text-muted-foreground truncate hidden sm:block">STRIDE analysis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Define System */}
            <section id="step-1" className="scroll-mt-20">
              <Card className="shadow-lg border-2 border-primary/20 transition-all hover:shadow-xl duration-300 hover:border-primary/30">
                <CardHeader className="space-y-1 bg-gradient-to-r from-primary/10 to-transparent pb-5">
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium text-sm shadow-sm transition-all duration-300 border-2",
                        step2Unlocked 
                          ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-500" 
                          : "bg-primary/5 text-primary border-primary/30"
                      )}>
                        {step2Unlocked ? (
                          <Check className="h-4 w-4 animate-in zoom-in-50 duration-300" />
                        ) : (
                          "1"
                        )}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-xl sm:text-2xl">Define System</CardTitle>
                        <CardDescription className="text-sm">
                          Configure your automotive system details
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed1((s) => !s)}
                        aria-expanded={!collapsed1}
                        title={collapsed1 ? "Expand" : "Collapse"}
                        className="transition-transform hover:scale-110"
                      >
                        {collapsed1 ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {!collapsed1 && (
                <CardContent className="pt-6 space-y-8 pb-8 animate-in fade-in-50 slide-in-from-top-4 duration-300">
                  <FormSection
                    title="Use Case"
                    description="Describe the primary scenario or goal that drives this analysis."
                  >
                    <div className="space-y-4">
                      <UseCaseForm value={useCase} onChange={setUseCase} />
                      <Button
                        variant="outline"
                        onClick={handleExampleData}
                        className="w-full sm:w-auto border-dashed hover:border-solid hover:bg-primary/5 transition-all"
                        title="Load example data"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Load Example Data
                      </Button>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Effect Chain"
                    description="Outline how inputs are processed and transformed into outputs within the system."
                  >
                    <EffectChainForm value={effectChain} onChange={setEffectChain} />
                  </FormSection>

                  <FormSection
                    title="Systems"
                    description={
                      systems.length > 0
                        ? `${systems.length} ${systems.length === 1 ? "system" : "systems"} configured`
                        : "Add the subsystems and interfaces that participate in the scenario."
                    }
                  >
                    <SystemsForm systems={systems} onChange={setSystems} />
                  </FormSection>

                  {/* Primary action at bottom right per UX best practices */}
                  <div className="flex items-center justify-between pt-8 border-t">
                    <p className="text-sm text-muted-foreground">
                      Complete the use case and add at least one system to proceed.
                    </p>
                    <Button
                      onClick={() => {
                        if (canGenerateVisualization) {
                          setCollapsed1(true); // Collapse current step
                          document.getElementById("step-2")?.scrollIntoView({ behavior: "smooth" });
                          setCollapsed2(false);
                          setTimeout(() => generateBtnRef.current?.focus(), 500);
                        } else {
                          if (useCase.trim() === "") {
                            document.getElementById("use-case-input")?.focus();
                          } else if (systems.length === 0) {
                            document.getElementById("add-system-btn")?.focus();
                          }
                        }
                      }}
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold transition-all"
                    >
                      Next step
                      <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg] transition-transform" />
                    </Button>
                  </div>
                </CardContent>
                )}
              </Card>
            </section>

            {/* Step 2: Generate Visualization */}
            <section id="step-2" className="scroll-mt-20">
              <Card
                className={cn(
                  "shadow-lg border-2 transition-all duration-300",
                  hasDiagram || diagramLoading
                    ? "border-primary/20 hover:shadow-xl hover:border-primary/30"
                    : step2Unlocked
                    ? "border-border hover:border-primary/30"
                    : "border-dashed border-border/60 bg-muted/20"
                )}
              >
                <CardHeader
                  className={cn(
                    "space-y-1 pb-5 transition-colors duration-300",
                    hasDiagram || diagramLoading
                      ? "bg-gradient-to-r from-primary/10 to-transparent"
                      : step2Unlocked
                      ? "bg-muted/10"
                      : "bg-muted/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium text-sm shadow-sm transition-all duration-300 border-2",
                          hasDiagram
                            ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-500"
                            : step2Unlocked
                            ? "bg-primary/5 text-primary border-primary/30 shadow-[0_0_0_4px_rgba(34,197,94,0.15)]"
                            : "bg-muted/30 text-muted-foreground border-muted-foreground/20"
                        )}
                      >
                        {hasDiagram ? <Check className="h-4 w-4 animate-in zoom-in-50 duration-300" /> : "2"}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-xl sm:text-2xl">Generate Visualization</CardTitle>
                        <CardDescription className="text-sm">
                          Transform your inputs into an interactive system diagram
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed2((s) => !s)}
                        aria-expanded={!collapsed2}
                        title={collapsed2 ? "Expand" : "Collapse"}
                        className="transition-transform hover:scale-110"
                      >
                        {collapsed2 ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {!collapsed2 && (
                <CardContent className="pt-6 space-y-6 pb-8">
                  {!step2Unlocked && (
                    <Alert>
                      <AlertDescription className="text-sm">
                        Complete the system definition in Step 1 to enable diagram generation.
                      </AlertDescription>
                    </Alert>
                  )}

                  <VisualizationPanel
                    diagram={diagram}
                    onEdit={setDiagram}
                    loading={diagramLoading}
                    error={diagramError}
                  />

                  {/* Primary actions at bottom right per UX best practices */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      {diagram ? "Edit the diagram above or proceed to threat analysis." : "Generate the visualization to continue."}
                    </p>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleGenerateVisualization}
                        disabled={!canGenerateVisualization || diagramLoading}
                        size="lg"
                        variant={diagram ? "outline" : "default"}
                        ref={generateBtnRef}
                        className={cn(
                          "shadow-md transition-all",
                          !diagram && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                      >
                        {diagramLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            {diagram ? "Regenerate" : "Generate"}
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => {
                          if (hasDiagram) {
                            setCollapsed2(true); // Collapse current step
                            document.getElementById("step-3")?.scrollIntoView({ behavior: "smooth" });
                            setCollapsed3(false);
                            setTimeout(() => analyzeBtnRef.current?.focus(), 500);
                          } else {
                            if (!canGenerateVisualization) {
                              document.getElementById("step-1")?.scrollIntoView({ behavior: "smooth" });
                            } else {
                              generateBtnRef.current?.focus();
                            }
                          }
                        }}
                        disabled={!hasDiagram}
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold transition-all"
                      >
                        Next step
                        <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg] transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                )}
              </Card>
            </section>

            {/* Step 3: Analyze Threats */}
            <section id="step-3" className="scroll-mt-20">
              <Card
                className={cn(
                  "shadow-lg border-2 transition-all duration-300",
                  hasResults
                    ? "border-primary/20 hover:shadow-xl hover:border-primary/30"
                    : step3Unlocked
                    ? "border-border hover:border-primary/30"
                    : "border-dashed border-border/60 bg-muted/20"
                )}
              >
                <CardHeader
                  className={cn(
                    "space-y-1 pb-5 transition-colors duration-300",
                    hasResults
                      ? "bg-gradient-to-r from-primary/10 to-transparent"
                      : step3Unlocked
                      ? "bg-muted/10"
                      : "bg-muted/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium text-sm shadow-sm transition-all duration-300 border-2",
                          hasResults
                            ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-500"
                            : step3Unlocked
                            ? "bg-primary/5 text-primary border-primary/30 shadow-[0_0_0_4px_rgba(34,197,94,0.15)]"
                            : "bg-muted/30 text-muted-foreground border-muted-foreground/20"
                        )}
                      >
                        {hasResults ? <Check className="h-4 w-4 animate-in zoom-in-50 duration-300" /> : "3"}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-xl sm:text-2xl">Threat Analysis</CardTitle>
                        <CardDescription className="text-sm">
                          Evaluate security posture with STRIDE methodology
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed3((s) => !s)}
                        aria-expanded={!collapsed3}
                        title={collapsed3 ? "Expand" : "Collapse"}
                        className="transition-transform hover:scale-110"
                      >
                        {collapsed3 ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {!collapsed3 && (
                <CardContent className="pt-6 space-y-8 pb-8 animate-in fade-in-50 slide-in-from-top-4 duration-300">
                  {!step3Unlocked && (
                    <Alert className="animate-in fade-in-50 duration-200">
                      <AlertDescription className="text-sm">
                        Generate and review the system visualization in Step 2 before running the STRIDE analysis.
                      </AlertDescription>
                    </Alert>
                  )}

                  <ThreatModelResults
                    results={results}
                    loading={resultsLoading}
                    error={resultsError}
                    onExportPDF={() => handleExport("pdf")}
                    onExportJSON={() => handleExport("json")}
                    onExportCSV={() => handleExport("csv")}
                  />

                  {/* Primary action at bottom right per UX best practices */}
                  <div className="flex items-center justify-between pt-8 border-t">
                    <p className="text-sm text-muted-foreground">
                      {hasResults ? "Review the threat analysis results above and export if needed." : "Run the STRIDE analysis to identify security threats."}
                    </p>
                    <Button
                      onClick={handlePerformThreatModeling}
                      disabled={!canPerformThreatModeling || resultsLoading}
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold transition-all"
                      ref={analyzeBtnRef}
                    >
                      {resultsLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Analyze Threats
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
                )}
              </Card>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
