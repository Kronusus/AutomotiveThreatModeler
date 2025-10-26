/**
 * Constants and example data for the Automotive Threat Modeler
 */

import { EffectChain, System } from "./types";

export const EXAMPLE_USE_CASE =
  "As a Driver, I want to safely and proportionally reduce the vehicle's speed (or bring it to a stop) by applying force to the foot pedal.";

export const EXAMPLE_EFFECT_CHAIN: EffectChain = {
  input: "Driver Brake Request (Pedal Force/Position)",
  coreLogic:
    "Brake System Control (Interprets request, calculates required actuator effort, and manages stability/safety functions like ABS/ESC).",
  output:
    "Vehicle Deceleration/Speed Reduction achieved through friction and kinetic energy conversion.",
};

export const EXAMPLE_SYSTEMS: System[] = [
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
];

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  label: string;
  subtitle: string;
}

export const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Define System",
    description: "Configure your automotive system details",
    label: "Define System",
    subtitle: "Specify components",
  },
  {
    id: 2,
    title: "Generate Visualization",
    description: "Transform your inputs into an interactive system diagram",
    label: "Generate Diagram",
    subtitle: "UML visualization",
  },
  {
    id: 3,
    title: "Threat Analysis",
    description: "Evaluate security posture with STRIDE methodology",
    label: "Analyze Threats",
    subtitle: "STRIDE analysis",
  },
];
