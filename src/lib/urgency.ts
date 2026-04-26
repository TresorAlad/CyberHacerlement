import { Priority } from "@/generated/prisma/browser";

export function scoreReportText(description: string): {
  priority: Priority;
  urgent: boolean;
  score: number;
} {
  const t = description.toLowerCase();
  let score = 0;
  let urgent = false;

  const critical = [
    "suicide",
    "me tuer",
    "meurtre",
    "tuer",
    "menace de mort",
    "danger immédiat",
    "viol",
    "agression sexuelle",
  ];
  for (const k of critical) {
    if (t.includes(k)) {
      score += 40;
      urgent = true;
    }
  }

  const serious = ["menace", "chantage", "dox", "nude", "intime", "harcèlement"];
  for (const k of serious) {
    if (t.includes(k)) score += 12;
  }

  if (score >= 60) return { priority: Priority.URGENT, urgent: true, score };
  if (score >= 30) return { priority: Priority.HIGH, urgent, score };
  if (score >= 12) return { priority: Priority.MEDIUM, urgent, score };
  return { priority: Priority.LOW, urgent, score };
}
