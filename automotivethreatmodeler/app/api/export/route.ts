import { NextRequest, NextResponse } from "next/server";
import { exportPDF, exportCSV } from "../../../lib/exporters";

export async function POST(req: NextRequest) {
  try {
    const { useCase, effectChain, systems, diagram, results } = await req.json();
    const type = req.nextUrl.searchParams.get("type");
    let fileBuffer: Uint8Array, mime: string, filename: string;
    if (type === "pdf") {
      fileBuffer = await exportPDF({ useCase, effectChain, systems, diagram, results });
      mime = "application/pdf";
      filename = "threatmodel.pdf";
    } else {
      fileBuffer = await exportCSV({ useCase, effectChain, systems, diagram, results });
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
