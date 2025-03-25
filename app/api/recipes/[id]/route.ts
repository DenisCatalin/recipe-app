import { NextResponse } from "next/server";
import config from "@/app/config";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const response = await fetch(`${config.env.apiEndpoint}/lookup.php?i=${id}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ meals: [] });
  }
}
