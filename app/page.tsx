

"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { UseCaseForm } from "../components/UseCaseForm";
import { EffectChainForm } from "../components/EffectChainForm";
import { SystemsForm } from "../components/SystemsForm";
import { VisualizationPanel } from "../components/VisualizationPanel";
import { ThreatModelResults } from "../components/ThreatModelResults";
import { ThemeToggle } from "../components/theme-toggle";
import { FormSection } from "@/components/FormSection";
import { HorizontalStepper } from "@/components/HorizontalStepper";
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
    await generateDiagram(useCase, effectChain, systems);
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shrink-0">
                <Shield className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-semibold truncate">
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
      <main className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="space-y-8 lg:space-y-10">
            {/* Introduction Card */}
            <Card className="border-2 shadow-lg animate-in fade-in-50 duration-500">
              <CardContent className="pt-7 pb-7">
                <div className="space-y-5">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    A systematic approach to identify security threats in automotive systems using the STRIDE methodology. 
                    Follow the three-step process below to define your system, generate an architecture diagram, and analyze potential vulnerabilities.
                  </p>
                  
                  {/* Horizontal Stepper */}
                  <HorizontalStepper
                    steps={[
                      {
                        id: 1,
                        label: STEPS[0].label,
                        subtitle: STEPS[0].subtitle,
                        isComplete: step2Unlocked,
                        isActive: !step2Unlocked,
                      },
                      {
                        id: 2,
                        label: STEPS[1].label,
                        subtitle: STEPS[1].subtitle,
                        isComplete: hasDiagram,
                        isActive: step2Unlocked && !hasDiagram,
                      },
                      {
                        id: 3,
                        label: STEPS[2].label,
                        subtitle: STEPS[2].subtitle,
                        isComplete: hasResults,
                        isActive: step3Unlocked && !hasResults,
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

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
                <div className="space-y-10">
                  <FormSection
                    title="Use Case"
                    description="Describe the primary scenario or goal that drives this analysis."
                    headerAction={
                      <Button
                        variant="outline"
                        onClick={handleExampleData}
                        className="border-dashed border-2 hover:border-solid hover:bg-primary/[0.06] transition-all"
                        title="Load example data"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Load Example Data
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

                  {/* Primary action at bottom right per UX best practices */}
                  <div className="flex items-center justify-between pt-8 border-t-2 border-border">
                    <p className="text-sm text-muted-foreground max-w-md">
                      Complete the use case and add at least one system to proceed.
                    </p>
                    <Button
                      onClick={() => {
                        if (canGenerateVisualization) {
                          setCollapsed1(true);
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
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold transition-colors"
                    >
                      Next step
                      <ChevronDown className="h-5 w-5 ml-2 rotate-[-90deg] transition-transform" />
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
                <div className="space-y-7">
                  {!step2Unlocked && (
                    <Alert className="border-2">
                      <AlertDescription className="text-base">
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
                  <div className="flex items-center justify-between pt-8 border-t-2 border-border">
                    <p className="text-sm text-muted-foreground max-w-md">
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
                          "shadow-md transition-all font-semibold",
                          !diagram && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                      >
                        {diagramLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Generating
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            {diagram ? "Regenerate" : "Generate"}
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => {
                          if (hasDiagram) {
                            setCollapsed2(true);
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
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold transition-colors"
                      >
                        Next step
                        <ChevronDown className="h-5 w-5 ml-2 rotate-[-90deg] transition-transform" />
                      </Button>
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
                <div className="space-y-10">
                  {!step3Unlocked && (
                    <Alert className="animate-in fade-in-50 duration-200 border-2">
                      <AlertDescription className="text-base">
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
                  <div className="flex items-center justify-between pt-8 border-t-2 border-border">
                    <p className="text-sm text-muted-foreground max-w-md">
                      {hasResults ? "Review the threat analysis results above and export if needed." : "Run the STRIDE analysis to identify security threats."}
                    </p>
                    <Button
                      onClick={handlePerformThreatModeling}
                      disabled={!canPerformThreatModeling || resultsLoading}
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold transition-colors"
                      ref={analyzeBtnRef}
                    >
                      {resultsLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Analyzing
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 mr-2" />
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
