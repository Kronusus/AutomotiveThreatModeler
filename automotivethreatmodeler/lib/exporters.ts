import { ThreatModelResult } from "../components/ThreatModelResults";

export async function exportPDF({ useCase, effectChain, systems, diagram, results }: any): Promise<Uint8Array> {
  // Dummy: PDF als Textdatei
  const text = `Use Case: ${useCase}\nEffect Chain: ${effectChain}\nSystems: ${JSON.stringify(systems)}\nDiagram: ${diagram}\nResults: ${JSON.stringify(results, null, 2)}`;
  return new TextEncoder().encode(text);
}

export async function exportCSV({ useCase, effectChain, systems, diagram, results }: any): Promise<Uint8Array> {
  let csv = "Asset,Property,STRIDE,Reasoning,Damage\n";
  for (const r of results as ThreatModelResult[]) {
    csv += `${r.asset},${r.property},${r.stride},${r.reasoning},${r.damage}\n`;
  }
  return new TextEncoder().encode(csv);
}
