import { NextRequest, NextResponse } from "next/server";
import { generateInsights } from "@/lib/ai/insights";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId } = body;

    if (!customerId || typeof customerId !== "string") {
      return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    }

    const insights = await generateInsights(customerId);
    return NextResponse.json(insights);
  } catch (error) {
    console.error("AI insights error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to generate insights", detail: message }, { status: 500 });
  }
}
