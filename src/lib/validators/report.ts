import { z } from "zod";

export const createReportSchema = z.object({
  website: z
    .string()
    .optional()
    .refine((v) => !v || v.length === 0, { message: "Spam détecté." }),
  categoryId: z.string().optional(),
  harassmentType: z.string().min(1, "Le type est requis."),
  description: z.string().min(20, "Merci de décrire la situation (20 caractères minimum)."),
  platform: z.string().max(120).optional(),
  region: z.string().max(120).optional(),
  occurredAt: z
    .preprocess((v) => (v === "" || v == null ? undefined : v), z.string().datetime().optional()),
  isAnonymous: z.boolean().optional().default(false),
  displayName: z.string().max(80).optional(),
  evidenceUrls: z.array(z.string().url()).max(10).optional().default([]),
  evidenceNotes: z.array(z.string().min(1).max(4000)).max(10).optional().default([]),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
