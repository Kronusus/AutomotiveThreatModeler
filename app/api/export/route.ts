import { NextRequest, NextResponse } from "next/server";
import { exportPDF, exportCSV, exportJSON } from "../../../lib/exporters";

export async function POST(req: NextRequest) {
  try {
    const { useCase, effectChain, systems, diagram, results } = await req.json();
    const type = req.nextUrl.searchParams.get("type");
    
    let fileBuffer: Uint8Array;
    let mime: string;
    let filename: string;
    
    const data = { useCase, effectChain, systems, diagram, results };
    
    if (type === "pdf") {
      fileBuffer = await exportPDF(data);
      mime = "application/pdf";
      filename = "threatmodel.pdf";
    } else if (type === "json") {
      fileBuffer = await exportJSON(data);
      mime = "application/json";
      filename = "threatmodel.json";
    } else {
      fileBuffer = await exportCSV(data);
      mime = "text/csv";
      filename = "threatmodel.csv";
    }
    
    const arrayBuffer = fileBuffer instanceof Uint8Array ? fileBuffer.buffer as ArrayBuffer : fileBuffer as ArrayBuffer;
    return new NextResponse(new Blob([arrayBuffer]), {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
