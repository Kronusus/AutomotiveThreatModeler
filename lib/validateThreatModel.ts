import { ThreatModelResult } from "../components/ThreatModelResults";

export function validateThreatModel(results: any): results is ThreatModelResult[] {
  return Array.isArray(results) && results.every(r =>
    typeof r.asset === "string" &&
    typeof r.property === "string" &&
    typeof r.stride === "string" &&
    typeof r.reasoning === "string" &&
    typeof r.damage === "string"
  );
}
