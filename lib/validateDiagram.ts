// Returns true if valid, false if not. Also returns sanitized diagram.
export function validateAndSanitizeDiagram(diagram: string): { valid: boolean, sanitized: string, error?: string } {
  if (typeof diagram !== "string") {
    return { valid: false, sanitized: "", error: "Diagram is not a string" };
  }
  let sanitized = diagram.trim();
  // Mermaid diagrams should start with 'graph' or 'flowchart'
  if (!/^\s*(graph|flowchart)/.test(sanitized)) {
    return { valid: false, sanitized, error: "Diagram must start with 'graph' or 'flowchart'" };
  }
  // Remove problematic characters from node labels (parentheses, special chars)
  sanitized = sanitized.replace(/\(([^)]*)\)/g, ""); // Remove parentheses and contents
  sanitized = sanitized.replace(/[^\w\s->{}\[\];:|,.]/g, ""); // Remove unsupported special chars
  // Relaxed arrow syntax check: allow any --, -->, --- etc.
  // Only fail if there are unfinished arrows (e.g., -- at end of line)
  if (/--\s*$/m.test(sanitized)) {
    return { valid: false, sanitized, error: "Unfinished arrow at end of line" };
  }
  // Basic check for at least one edge or node
  if (!/(-->|---|--|\[\w+\])/.test(sanitized)) {
    return { valid: false, sanitized, error: "No edges or nodes detected" };
  }
  return { valid: true, sanitized };
}
