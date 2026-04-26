"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/auth-client";

export function ResetPasswordRequestForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const redirectTo = `${window.location.origin}/reset-password/confirm`;

    const res = await requestPasswordReset({
      email,
      redirectTo,
    });

    if (res.error) {
      setError(res.error.message ?? "Impossible d’envoyer la demande.");
      return;
    }

    setMessage(
      "Si cet email existe dans notre système, tu recevras un lien (voir aussi les logs serveur en développement)."
    );
  }

  return (
    <Card className="w-full max-w-md p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Réinitialiser le mot de passe</h1>
          <p className="pt-2 text-sm text-muted-foreground">
            Nous enverrons un lien à ton email si un compte existe.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <Button type="submit" className="w-full">
            Envoyer le lien
          </Button>
        </form>

        <div className="text-sm text-muted-foreground">
          <Link href="/sign-in" className="text-foreground underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </Card>
  );
}
