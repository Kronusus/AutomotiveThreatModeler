
import { PDFDocument, StandardFonts, rgb, PDFPage } from "pdf-lib";
import { ThreatModelResult } from "@/lib/types";

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
    const cellPadding = 5;
    const fontSize = 8;
    const lineHeight = 10;
    
    // Calculate row heights based on content
    const rowHeights: number[] = [];
    
    // Header height
    rowHeights.push(25);
    
    // Calculate each row height
    for (const row of rows) {
      let maxLines = 1;
      for (let i = 0; i < row.length; i++) {
        const cellText = row[i] || '';
        const maxTextWidth = columnWidths[i] - 2 * cellPadding;
        const lines = wrapText(cellText, maxTextWidth, fontSize);
        maxLines = Math.max(maxLines, lines.length);
      }
      const rowHeight = Math.max(25, maxLines * lineHeight + cellPadding * 2);
      rowHeights.push(rowHeight);
    }
    
    const totalTableHeight = rowHeights.reduce((a, b) => a + b, 0);
    
    // Check if we need a new page for the table
    if (y - totalTableHeight < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
    
    let currentX = margin;
    
    // Draw header background
    page.drawRectangle({
      x: margin,
      y: y - rowHeights[0],
      width: tableWidth,
      height: rowHeights[0],
      color: tableHeaderBg,
    });
    
    // Draw header borders and text
    currentX = margin;
    for (let i = 0; i < headers.length; i++) {
      // Vertical border
      page.drawLine({
        start: { x: currentX, y: y },
        end: { x: currentX, y: y - rowHeights[0] },
        thickness: 0.5,
        color: tableBorder,
      });
      
      // Header text
      page.drawText(headers[i], {
        x: currentX + cellPadding,
        y: y - rowHeights[0] + 8,
        size: 9,
        font: boldFont,
        color: textColor,
      });
      
      currentX += columnWidths[i];
    }
    
    // Right border of header
    page.drawLine({
      start: { x: currentX, y: y },
      end: { x: currentX, y: y - rowHeights[0] },
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
    
    y -= rowHeights[0];
    
    // Draw rows
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const row = rows[rowIdx];
      const rowHeight = rowHeights[rowIdx + 1];
      
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
        
        // Cell text with wrapping
        const maxTextWidth = columnWidths[i] - 2 * cellPadding;
        const cellText = row[i] || '';
        const lines = wrapText(cellText, maxTextWidth, fontSize);
        
        let textY = y - cellPadding - fontSize;
        for (const line of lines) {
          page.drawText(line, {
            x: currentX + cellPadding,
            y: textY,
            size: fontSize,
            font,
            color: textColor,
          });
          textY -= lineHeight;
        }
        
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
  
  function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines.length > 0 ? lines : [''];
  }
  
  // Header
  drawTitle("Automotive Threat Model Report", 24);
  y -= 10;
  drawSeparator();
  
  // Use Case Section as Table
  drawHeading("Use Case");
  y -= 5;
  drawTable(
    ['Description'],
    [[useCase || 'Not specified']],
    [width - 2 * margin]
  );
  
  // Effect Chain Section
  drawHeading("Effect Chain");
  const effectChainRows: string[][] = [];
  if (effectChain.input) {
    effectChainRows.push(['Input', effectChain.input]);
  }
  if (effectChain.coreLogic) {
    effectChainRows.push(['Core Logic', effectChain.coreLogic]);
  }
  if (effectChain.output) {
    effectChainRows.push(['Output', effectChain.output]);
  }
  
  if (effectChainRows.length > 0) {
    y -= 5;
    drawTable(
      ['Component', 'Description'],
      effectChainRows,
      [100, width - 2 * margin - 100]
    );
  } else {
    drawText("Not specified", 9);
    y -= 10;
  }
  
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
  
  // Threats Section - Each threat as its own table
  drawTitle("Threat Analysis Results", 18);
  drawText(`Total Threats Identified: ${results.length}`, 11);
  y -= 15;
  
  if (results.length > 0) {
    for (let i = 0; i < results.length; i++) {
      const threat = results[i];
      
      // Threat number heading
      drawHeading(`Threat #${i + 1}`, 11);
      y -= 5;
      
      // Create a table for this threat with full text
      const threatRows = [
        ['Asset', threat.asset || 'N/A'],
        ['Property', threat.property || 'N/A'],
        ['STRIDE Category', threat.stride || 'N/A'],
        ['Reasoning', threat.reasoning || 'N/A'],
        ['Damage Scenario', threat.damage || 'N/A']
      ];
      
      drawTable(
        ['Field', 'Details'],
        threatRows,
        [120, width - 2 * margin - 120]
      );
      
      // Add some space between threats
      y -= 5;
    }
  } else {
    drawText("No threats identified", 9);
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
