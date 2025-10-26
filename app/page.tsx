

"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { UseCaseForm } from "../components/UseCaseForm";
import { EffectChainForm } from "../components/EffectChainForm";
import { SystemsForm } from "../components/SystemsForm";
import { VisualizationPanel } from "../components/VisualizationPanel";
import { ThreatModelResults } from "../components/ThreatModelResults";
import { FormSection } from "@/components/FormSection";
import { StepCard } from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText, Sparkles, Shield, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVisualization, useThreatModeling, exportThreatModel } from "@/lib/hooks";
import { EffectChain, System } from "@/lib/types";
import { EXAMPLE_USE_CASE, EXAMPLE_EFFECT_CHAIN, EXAMPLE_SYSTEMS, STEPS } from "@/lib/constants";

export default function HomePage() {
  const [useCase, setUseCase] = useState("");
  const [effectChain, setEffectChain] = useState<EffectChain>({
    input: "",
    coreLogic: "",
    output: "",
  });
  const [systems, setSystems] = useState<System[]>([]);

  // Use custom hooks for business logic
  const {
    diagram,
    loading: diagramLoading,
    error: diagramError,
    generateDiagram,
    setDiagram,
  } = useVisualization();

  const {
    results,
    loading: resultsLoading,
    error: resultsError,
    analyzeTreats,
  } = useThreatModeling();

  const handleExampleData = () => {
    setUseCase(EXAMPLE_USE_CASE);
    setEffectChain(EXAMPLE_EFFECT_CHAIN);
    setSystems(EXAMPLE_SYSTEMS);
  };
    
  const handleGenerateVisualization = async () => {
    const isFirstGeneration = !diagram;
    await generateDiagram(useCase, effectChain, systems);
    // Focus on "Next step" button only on first generation
    if (isFirstGeneration) {
      setTimeout(() => nextStep2BtnRef.current?.focus(), 300);
    }
  };

  const handlePerformThreatModeling = async () => {
    await analyzeTreats(useCase, effectChain, systems, diagram);
  };

  const handleExport = async (type: "pdf" | "csv" | "json") => {
    try {
      await exportThreatModel(type, { useCase, effectChain, systems, diagram, results });
    } catch (e) {
      alert((e as Error).message);
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
  const nextStep2BtnRef = useRef<HTMLButtonElement | null>(null);
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
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Automotive Threat Modeler
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  STRIDE Methodology for Vehicle Security
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Step 1: Define System */}
            <section id="step-1" className="scroll-mt-20">
              <StepCard
                stepNumber={1}
                title={STEPS[0].title}
                description={STEPS[0].description}
                isComplete={step2Unlocked}
                isActive={!step2Unlocked}
                collapsed={collapsed1}
                onToggleCollapse={() => setCollapsed1((s) => !s)}
              >
                <div className="space-y-6">
                  <FormSection
                    title="Use Case"
                    description="Describe the primary scenario or goal that drives this analysis."
                    headerAction={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExampleData}
                        title="Load example data"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Load example
                      </Button>
                    }
                  >
                    <UseCaseForm value={useCase} onChange={setUseCase} />
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

                  {/* Primary action at bottom */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Complete the use case and add at least one system to proceed.
                    </p>
                    <Button
                      onClick={() => {
                        if (canGenerateVisualization) {
                          setCollapsed1(true);
                          document.getElementById("step-2")?.scrollIntoView({ behavior: "smooth" });
                          setCollapsed2(false);
                          setTimeout(() => nextStep2BtnRef.current?.focus(), 500);
                        } else {
                          if (useCase.trim() === "") {
                            document.getElementById("use-case-input")?.focus();
                          } else if (systems.length === 0) {
                            document.getElementById("add-system-btn")?.focus();
                          }
                        }
                      }}
                      size="lg"
                      disabled={!canGenerateVisualization}
                    >
                      Continue
                      <ChevronDown className="ml-2 h-4 w-4 -rotate-90" />
                    </Button>
                  </div>
                </div>
              </StepCard>
            </section>

            {/* Step 2: Generate Visualization */}
            <section id="step-2" className="scroll-mt-20">
              <StepCard
                stepNumber={2}
                title={STEPS[1].title}
                description={STEPS[1].description}
                isComplete={hasDiagram}
                isActive={step2Unlocked && !hasDiagram}
                isLocked={!step2Unlocked}
                collapsed={collapsed2}
                onToggleCollapse={() => setCollapsed2((s) => !s)}
              >
                <div className="space-y-6">
                  {!step2Unlocked && (
                    <Alert>
                      <AlertDescription>
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

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      {diagram ? "Edit the diagram or proceed to threat analysis." : "Generate the visualization to continue."}
                    </p>
                    <div className="flex items-center gap-3">
                      {diagram && (
                        <Button
                          onClick={handleGenerateVisualization}
                          disabled={diagramLoading}
                          size="lg"
                          variant="outline"
                        >
                          {diagramLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Regenerate
                            </>
                          )}
                        </Button>
                      )}

                      {!diagram ? (
                        <Button
                          onClick={handleGenerateVisualization}
                          disabled={!canGenerateVisualization || diagramLoading}
                          size="lg"
                          variant="default"
                          ref={generateBtnRef}
                        >
                          {diagramLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generate
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setCollapsed2(true);
                            document.getElementById("step-3")?.scrollIntoView({ behavior: "smooth" });
                            setCollapsed3(false);
                            setTimeout(() => analyzeBtnRef.current?.focus(), 500);
                          }}
                          size="lg"
                          variant="default"
                          ref={nextStep2BtnRef}
                        >
                          Continue
                          <ChevronDown className="ml-2 h-4 w-4 -rotate-90" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </StepCard>
            </section>

            {/* Step 3: Analyze Threats */}
            <section id="step-3" className="scroll-mt-20">
              <StepCard
                stepNumber={3}
                title={STEPS[2].title}
                description={STEPS[2].description}
                isComplete={hasResults}
                isActive={step3Unlocked && !hasResults}
                isLocked={!step3Unlocked}
                collapsed={collapsed3}
                onToggleCollapse={() => setCollapsed3((s) => !s)}
              >
                <div className="space-y-6">
                  {!step3Unlocked && (
                    <Alert>
                      <AlertDescription>
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

                  {/* Action */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      {hasResults ? "Review the threat analysis results and export if needed." : "Run the STRIDE analysis to identify security threats."}
                    </p>
                    <Button
                      onClick={handlePerformThreatModeling}
                      disabled={!canPerformThreatModeling || resultsLoading}
                      size="lg"
                      ref={analyzeBtnRef}
                    >
                      {resultsLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Analyze Threats
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </StepCard>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
