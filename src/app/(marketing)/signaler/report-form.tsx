"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { createReportAction } from "@/app/actions/reports";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CategoryOption = { id: string; label: string; slug: string };

export function ReportForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [urls, setUrls] = useState<string[]>([""]);

  const categoryOptions = useMemo(() => categories, [categories]);

  function addUrlField() {
    setUrls((u) => [...u, ""]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const evidenceUrls = urls.map((u) => u.trim()).filter(Boolean);
    const evidenceNotesRaw = (form.get("evidenceNotes") as string) ?? "";
    const evidenceNotes = evidenceNotesRaw.trim() ? [evidenceNotesRaw.trim()] : [];

    startTransition(async () => {
      const res = await createReportAction({
        website: (form.get("website") as string) || "",
        categoryId: (form.get("categoryId") as string) || undefined,
        harassmentType: form.get("harassmentType") as string,
        description: form.get("description") as string,
        platform: (form.get("platform") as string) || undefined,
        region: (form.get("region") as string) || undefined,
        occurredAt: (form.get("occurredAt") as string) || undefined,
        isAnonymous: form.get("isAnonymous") === "on",
        displayName: (form.get("displayName") as string) || undefined,
        evidenceUrls,
        evidenceNotes,
      });

      if (!res.ok) {
        toast.error(res.error);
        return;
      }

      toast.success("Signalement enregistré.");
      router.push(`/dashboard/${res.data?.publicId}`);
      router.refresh();
    });
  }

  return (
    <Card className="p-6">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <input
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          name="website"
          defaultValue=""
          aria-hidden="true"
        />
        <div className="grid gap-2">
          <Label htmlFor="categoryId">Catégorie (optionnel)</Label>
          <select
            id="categoryId"
            name="categoryId"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            defaultValue=""
          >
            <option value="">-</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="harassmentType">Type de situation</Label>
          <Input id="harassmentType" name="harassmentType" required placeholder="Ex: harcèlement, menaces…" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required rows={8} />
          <p className="text-xs text-muted-foreground">
            Plus tu es précis, plus l’équipe peut agir vite. Minimum 20 caractères.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="platform">Plateforme / lieu</Label>
            <Input id="platform" name="platform" placeholder="WhatsApp, Instagram, etc." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="region">Région</Label>
            <Input id="region" name="region" placeholder="Ex: Lomé" />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="occurredAt">Date / heure (optionnel)</Label>
          <Input id="occurredAt" name="occurredAt" type="datetime-local" />
        </div>

        <div className="grid gap-3 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <input id="isAnonymous" name="isAnonymous" type="checkbox" className="size-4" />
            <Label htmlFor="isAnonymous" className="font-normal">
              Affichage anonyme côté équipe (ton compte reste lié au dossier)
            </Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="displayName">Pseudo affiché (optionnel)</Label>
            <Input id="displayName" name="displayName" placeholder="Ex: A." />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label>Liens de preuves (optionnel)</Label>
            <Button type="button" variant="secondary" size="sm" onClick={addUrlField}>
              Ajouter un lien
            </Button>
          </div>
          {urls.map((val, idx) => (
            <Input
              key={idx}
              value={val}
              onChange={(e) =>
                setUrls((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))
              }
              placeholder="https://…"
              inputMode="url"
            />
          ))}
          <p className="text-xs text-muted-foreground">
            Upload de fichiers volumineux : configure{" "}
            <span className="font-medium">UploadThing</span> (token) - pour l’instant privilégie
            captures hébergées (liens).
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="evidenceNotes">Notes / texte de preuve (optionnel)</Label>
          <Textarea id="evidenceNotes" name="evidenceNotes" rows={4} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            En cas de danger immédiat, contacte aussi les services d’urgence locaux.
          </p>
          <Button type="submit" disabled={pending}>
            {pending ? "Envoi…" : "Envoyer le signalement"}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <Link className="underline" href="/guide">
            Guide de collecte de preuves
          </Link>
        </div>
      </form>
    </Card>
  );
}
