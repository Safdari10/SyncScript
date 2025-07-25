import { NextResponse } from "next/server";
import { DocumentVersionsRouteParams } from "@/types/types";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: DocumentVersionsRouteParams
) {
  const documentId = params.id;
  try {
    const versions = await prisma.documentVersion.findMany({
      where: { documentId },
      select: { version: true, createdAt: true },
      orderBy: { version: "desc" },
    });
    return NextResponse.json(versions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 }
    );
  }
}
