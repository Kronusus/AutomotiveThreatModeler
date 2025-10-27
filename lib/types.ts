/**
 * Core types for the Automotive Threat Modeler
 */

export interface System {
  name: string;
  inputs: string;
  outputs: string;
  description: string;
}

export interface EffectChain {
  input: string;
  coreLogic: string;
  output: string;
}

export interface ThreatModelResult {
  asset: string;
  property: string;
  stride: string;
  reasoning: string;
  damage: string;
}

export interface ThreatModelData {
  useCase: string;
  effectChain: EffectChain;
  systems: System[];
  diagram: string;
  results: ThreatModelResult[];
}

export type ExportType = "pdf" | "csv" | "json";
