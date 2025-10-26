
import { PDFDocument, StandardFonts, rgb, PDFPage } from "pdf-lib";
import { ThreatModelResult } from "../components/ThreatModelResults";

interface ExportData {
  useCase: string;
  effectChain: any;
  systems: any[];
  diagram: string;
  results: ThreatModelResult[];
}

export async function exportPDF(data: ExportData): Promise<Uint8Array> {
  const { useCase, effectChain, systems, diagram, results } = data;
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;
  
  const primaryColor = rgb(0.13, 0.51, 0.96); // Blue
  const textColor = rgb(0.2, 0.2, 0.2);
  const tableHeaderBg = rgb(0.95, 0.95, 0.95);
  const tableBorder = rgb(0.8, 0.8, 0.8);
  
  function addNewPageIfNeeded(requiredSpace: number) {
    if (y < margin + requiredSpace) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
  }
  
  function drawTitle(text: string, size: number = 18) {
    addNewPageIfNeeded(30);
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: boldFont,
      color: primaryColor,
    });
    y -= size + 10;
  }
  
  function drawHeading(text: string, size: number = 12) {
    addNewPageIfNeeded(25);
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: boldFont,
      color: textColor,
    });
    y -= size + 8;
  }
  
  function drawText(text: string, size: number = 10, indent: number = 0) {
    const maxWidth = width - 2 * margin - indent;
    const words = text.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, size);
      
      if (textWidth > maxWidth && line) {
        addNewPageIfNeeded(15);
        page.drawText(line, {
          x: margin + indent,
          y,
          size,
          font,
          color: textColor,
        });
        y -= size + 5;
        line = word;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      addNewPageIfNeeded(15);
      page.drawText(line, {
        x: margin + indent,
        y,
        size,
        font,
        color: textColor,
      });
      y -= size + 5;
    }
  }
  
  function drawSeparator() {
    addNewPageIfNeeded(10);
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.9, 0.9, 0.9),
    });
    y -= 15;
  }

  function drawTable(headers: string[], rows: string[][], columnWidths: number[]) {
    const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
    const rowHeight = 25;
    const cellPadding = 5;
    
    // Check if we need a new page for the table header
    addNewPageIfNeeded(rowHeight * (rows.length + 1) + 20);
    
    const startY = y;
    let currentX = margin;
    
    // Draw header background
    page.drawRectangle({
      x: margin,
      y: y - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: tableHeaderBg,
    });
    
    // Draw header borders and text
    currentX = margin;
    for (let i = 0; i < headers.length; i++) {
      // Vertical border
      page.drawLine({
        start: { x: currentX, y: y },
        end: { x: currentX, y: y - rowHeight },
        thickness: 0.5,
        color: tableBorder,
      });
      
      // Header text
      page.drawText(headers[i], {
        x: currentX + cellPadding,
        y: y - rowHeight + 8,
        size: 9,
        font: boldFont,
        color: textColor,
      });
      
      currentX += columnWidths[i];
    }
    
    // Right border of header
    page.drawLine({
      start: { x: currentX, y: y },
      end: { x: currentX, y: y - rowHeight },
      thickness: 0.5,
      color: tableBorder,
    });
    
    // Top horizontal border
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: margin + tableWidth, y: y },
      thickness: 0.5,
      color: tableBorder,
    });
    
    y -= rowHeight;
    
    // Draw rows
    for (const row of rows) {
      // Check if we need a new page
      if (y - rowHeight < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
      
      currentX = margin;
      
      // Horizontal border
      page.drawLine({
        start: { x: margin, y: y },
        end: { x: margin + tableWidth, y: y },
        thickness: 0.5,
        color: tableBorder,
      });
      
      for (let i = 0; i < row.length; i++) {
        // Vertical border
        page.drawLine({
          start: { x: currentX, y: y },
          end: { x: currentX, y: y - rowHeight },
          thickness: 0.5,
          color: tableBorder,
        });
        
        // Cell text (truncate if too long)
        const maxTextWidth = columnWidths[i] - 2 * cellPadding;
        let cellText = row[i] || '';
        const textWidth = font.widthOfTextAtSize(cellText, 8);
        
        if (textWidth > maxTextWidth) {
          while (font.widthOfTextAtSize(cellText + '...', 8) > maxTextWidth && cellText.length > 0) {
            cellText = cellText.slice(0, -1);
          }
          cellText += '...';
        }
        
        page.drawText(cellText, {
          x: currentX + cellPadding,
          y: y - rowHeight + 8,
          size: 8,
          font,
          color: textColor,
        });
        
        currentX += columnWidths[i];
      }
      
      // Right border
      page.drawLine({
        start: { x: currentX, y: y },
        end: { x: currentX, y: y - rowHeight },
        thickness: 0.5,
        color: tableBorder,
      });
      
      y -= rowHeight;
    }
    
    // Bottom horizontal border
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: margin + tableWidth, y: y },
      thickness: 0.5,
      color: tableBorder,
    });
    
    y -= 20;
  }
  
  // Header
  drawTitle("Automotive Threat Model Report", 24);
  y -= 10;
  drawSeparator();
  
  // Use Case Section
  drawHeading("Use Case");
  drawText(useCase || "Not specified");
  y -= 10;
  
  // Effect Chain Section
  drawHeading("Effect Chain");
  if (effectChain.input) {
    drawText("Input:", 10);
    drawText(effectChain.input, 9, 15);
  }
  if (effectChain.coreLogic) {
    drawText("Core Logic:", 10);
    drawText(effectChain.coreLogic, 9, 15);
  }
  if (effectChain.output) {
    drawText("Output:", 10);
    drawText(effectChain.output, 9, 15);
  }
  y -= 10;
  
  // Systems Section with Table
  drawHeading("Systems Overview");
  y -= 5;
  
  if (systems.length > 0) {
    const systemRows = systems.map(sys => [
      sys.name || '',
      sys.inputs || '',
      sys.outputs || '',
      sys.description || ''
    ]);
    
    drawTable(
      ['System Name', 'Inputs', 'Outputs', 'Description'],
      systemRows,
      [100, 120, 120, 155]
    );
  } else {
    drawText("No systems defined", 9);
    y -= 10;
  }
  
  // Diagram Section
  drawSeparator();
  drawHeading("System Architecture Diagram");
  y -= 5;
  
  if (diagram) {
    drawText("Diagram Source (Mermaid):", 10);
    y -= 5;
    
    // Draw diagram code in a box
    const diagramLines = diagram.split('\n');
    const boxHeight = Math.min(diagramLines.length * 12 + 20, 200);
    
    addNewPageIfNeeded(boxHeight + 20);
    
    page.drawRectangle({
      x: margin,
      y: y - boxHeight,
      width: width - 2 * margin,
      height: boxHeight,
      borderColor: tableBorder,
      borderWidth: 1,
      color: rgb(0.98, 0.98, 0.98),
    });
    
    let diagramY = y - 15;
    for (const line of diagramLines.slice(0, 15)) { // Limit to 15 lines
      page.drawText(line, {
        x: margin + 10,
        y: diagramY,
        size: 8,
        font,
        color: textColor,
      });
      diagramY -= 12;
    }
    
    y -= boxHeight + 10;
  } else {
    drawText("No diagram available", 9);
    y -= 10;
  }
  
  drawSeparator();
  
  // Threats Section with Table
  drawTitle("Threat Analysis Results", 18);
  drawText(`Total Threats Identified: ${results.length}`, 11);
  y -= 15;
  
  if (results.length > 0) {
    const threatRows = results.map((threat, idx) => [
      (idx + 1).toString(),
      threat.asset || '',
      threat.stride || '',
      threat.property || '',
      threat.reasoning || '',
      threat.damage || ''
    ]);
    
    drawTable(
      ['#', 'Asset', 'STRIDE', 'Property', 'Reasoning', 'Damage Scenario'],
      threatRows,
      [25, 80, 60, 60, 120, 150]
    );
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}

export async function exportCSV(data: ExportData): Promise<Uint8Array> {
  const { results } = data;
  
  const escapeCSV = (str: string) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  
  let csv = "Asset,Property,STRIDE,Reasoning,Damage Scenario\n";
  for (const r of results) {
    csv += `${escapeCSV(r.asset)},${escapeCSV(r.property)},${escapeCSV(r.stride)},${escapeCSV(r.reasoning)},${escapeCSV(r.damage)}\n`;
  }
  return new TextEncoder().encode(csv);
}

export async function exportJSON(data: ExportData): Promise<Uint8Array> {
  const exportObject = {
    metadata: {
      exportDate: new Date().toISOString(),
      tool: "Automotive Threat Modeler",
      version: "1.0"
    },
    useCase: data.useCase,
    effectChain: data.effectChain,
    systems: data.systems,
    diagram: data.diagram,
    threats: data.results
  };
  
  const jsonString = JSON.stringify(exportObject, null, 2);
  return new TextEncoder().encode(jsonString);
}
