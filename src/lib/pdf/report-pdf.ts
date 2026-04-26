import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import type { Evidence, Message, Report } from "@/generated/prisma/browser";

export type ReportForPdf = Report & {
  evidences: Evidence[];
  messages: Message[];
};

function chunkLines(text: string, maxLen: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const trial = cur ? `${cur} ${w}` : w;
    if (trial.length <= maxLen) cur = trial;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

export async function buildReportPdf(report: ReportForPdf) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 48;
  const lineHeight = 12;
  const maxChars = 95;

  let page = pdf.addPage([612, 792]);
  let y = 792 - margin;

  const sections: { title: string; body: string; boldTitle?: boolean }[] = [
    { title: "Cobra Kill - Dossier", body: "", boldTitle: true },
    { title: "Identifiant", body: report.publicId },
    { title: "Statut / priorité", body: `${report.status} - ${report.priority}` },
    { title: "Type", body: report.harassmentType },
    { title: "Résumé IA (si disponible)", body: report.aiSummary ?? "(non généré)" },
    { title: "Description", body: report.description },
    {
      title: "Preuves",
      body:
        report.evidences.length === 0
          ? "(Aucune)"
          : report.evidences.map((e) => `- ${e.kind}: ${e.url ?? e.text ?? ""}`).join("\n"),
    },
    {
      title: "Messages",
      body:
        report.messages.length === 0
          ? "(Aucun)"
          : report.messages
              .map((m) => `- ${m.createdAt.toISOString()} [${m.senderRole}]: ${m.body}`)
              .join("\n"),
    },
    {
      title: "Mention",
      body:
        "Document généré automatiquement. Les éléments IA sont indicatifs et ne remplacent pas une analyse humaine.",
    },
  ];

  for (const section of sections) {
    if (section.title) {
      if (y < margin + lineHeight * 3) {
        page = pdf.addPage([612, 792]);
        y = 792 - margin;
      }
      page.drawText(section.title, {
        x: margin,
        y,
        size: section.boldTitle ? 14 : 11,
        font: section.boldTitle ? fontBold : fontBold,
        color: rgb(0.08, 0.09, 0.12),
      });
      y -= lineHeight + 2;
    }

    for (const line of chunkLines(section.body, maxChars)) {
      if (y < margin) {
        page = pdf.addPage([612, 792]);
        y = 792 - margin;
      }
      page.drawText(line, {
        x: margin,
        y,
        size: 10,
        font,
        color: rgb(0.12, 0.13, 0.16),
      });
      y -= lineHeight;
    }

    y -= 6;
  }

  return pdf.save();
}
