import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedDownloadUrl } from "@/actions/s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  if (file.driveFileUrl) {
    return NextResponse.redirect(file.driveFileUrl);
  }

  const result = await getPresignedDownloadUrl(file.s3Key);
  if (!result.success || !result.downloadUrl) {
    return NextResponse.json(
      { error: "Could not generate download URL" },
      { status: 500 },
    );
  }

  return NextResponse.redirect(result.downloadUrl);
}
