"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { summarizeReportAction } from "@/app/actions/ai";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AiSummaryButton({ publicId }: { publicId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-1">
      {/* Barre de chargement indéterminée pendant la génération IA */}
      <div className={cn("h-0.5 w-full rounded-full bg-muted overflow-hidden", pending ? "visible" : "invisible")}>
        <div className="h-full w-1/3 rounded-full bg-accent origin-left animate-[indeterminate_1.4s_ease-in-out_infinite]" />
      </div>
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await summarizeReportAction({ publicId });
            if (!res.ok) toast.error(res.error);
            else {
              toast.success("Résumé IA généré.");
              router.refresh();
            }
          })
        }
      >
        {pending ? "Génération IA…" : "Générer un résumé IA"}
      </Button>
    </div>
  );
}
