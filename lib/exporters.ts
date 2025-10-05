
import { PDFDocument, StandardFonts } from "pdf-lib";
import { ThreatModelResult } from "../components/ThreatModelResults";

export async function exportPDF({ useCase, effectChain, systems, diagram, results }: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 40;
  const fontSize = 14;
  const lineHeight = 20;

  function drawText(text: string) {
    page.drawText(text, { x: 40, y, size: fontSize, font });
    y -= lineHeight;
  }

  drawText(`Use Case: ${useCase}`);
  drawText(`Effect Chain: ${effectChain}`);
  drawText(`Systems: ${JSON.stringify(systems)}`);
  drawText(`Diagram: ${diagram}`);
  drawText(`Results:`);
  for (const r of results as ThreatModelResult[]) {
    drawText(`- Asset: ${r.asset}, Property: ${r.property}, STRIDE: ${r.stride}, Reasoning: ${r.reasoning}, Damage: ${r.damage}`);
  }

  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}

export async function exportCSV({ useCase, effectChain, systems, diagram, results }: any): Promise<Uint8Array> {
  let csv = "Asset,Property,STRIDE,Reasoning,Damage\n";
  for (const r of results as ThreatModelResult[]) {
    csv += `${r.asset},${r.property},${r.stride},${r.reasoning},${r.damage}\n`;
  }
  return new TextEncoder().encode(csv);
}
