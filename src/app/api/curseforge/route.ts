import { NextResponse } from "next/server";
import { getCreationLiveMeta } from "@/lib/curseforge";
import { getCreations } from "@/lib/data";

export async function GET() {
  const creations = getCreations();
  const result = await getCreationLiveMeta(creations);

  return NextResponse.json({
    source: result.source,
    meta: result.meta,
  });
}
