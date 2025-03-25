import { NextResponse } from "next/server";
import config from "@/app/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ meals: [] });
  }

  try {
    const response = await fetch(`${config.env.apiEndpoint}/search.php?s=${query}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ meals: [] });
  }
}
