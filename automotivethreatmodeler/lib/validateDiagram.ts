export function validateDiagram(diagram: string): boolean {
  // Einfache Mermaid-Validierung: Muss mit 'graph' beginnen
  return typeof diagram === "string" && diagram.trim().startsWith("graph");
}
