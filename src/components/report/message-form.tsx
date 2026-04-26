"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { sendMessageAction } from "@/app/actions/messages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function MessageForm({ publicId }: { publicId: string }) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const res = await sendMessageAction({ publicId, body });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setBody("");
      toast.success("Message envoyé.");
    });
  }

  return (
    <div className="grid gap-2">
      {/* Barre de chargement indéterminée */}
      <div className={cn("h-0.5 w-full rounded-full bg-muted overflow-hidden", pending ? "visible" : "invisible")}>
        <div className="h-full w-1/3 rounded-full bg-primary origin-left animate-[indeterminate_1.4s_ease-in-out_infinite]" />
      </div>

      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Écris ton message…"
        disabled={pending}
      />
      <div className="flex justify-end">
        <Button type="button" disabled={pending || !body.trim()} onClick={submit}>
          {pending ? "Envoi…" : "Envoyer"}
        </Button>
      </div>
    </div>
  );
}
