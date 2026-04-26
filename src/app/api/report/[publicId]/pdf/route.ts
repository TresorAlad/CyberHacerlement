import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { buildReportPdf } from "@/lib/pdf/report-pdf";
import { prisma } from "@/lib/prisma";
import { canAccessReport, resolveUserRole } from "@/lib/rbac";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Non authentifié", { status: 401 });

  const role = await resolveUserRole(session.user);
  if (!role) return new NextResponse("Non authentifié", { status: 401 });

  const report = await prisma.report.findUnique({
    where: { publicId },
    include: {
      evidences: { orderBy: { createdAt: "asc" } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!report) return new NextResponse("Introuvable", { status: 404 });

  if (!canAccessReport(session.user.id, role, report)) {
    return new NextResponse("Interdit", { status: 403 });
  }

  const bytes = await buildReportPdf(report);

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cobra-kill-${publicId}.pdf"`,
    },
  });
}
