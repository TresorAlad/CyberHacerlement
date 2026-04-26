"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth-client";

export function ResetPasswordConfirmForm({
  token,
  error,
}: {
  token?: string;
  error?: string;
}) {
  const router = useRouter();
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);

    if (!token) {
      setLocalError("Lien invalide ou expiré.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;

    const res = await resetPassword({
      newPassword,
      token,
    });

    if (res.error) {
      setLocalError(res.error.message ?? "Impossible de mettre à jour le mot de passe.");
      return;
    }

    router.push("/sign-in");
    router.refresh();
  }

  const combinedError = error ?? localError;

  return (
    <Card className="w-full max-w-md p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nouveau mot de passe</h1>
          <p className="pt-2 text-sm text-muted-foreground">
            Choisis un mot de passe d’au moins 8 caractères.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {combinedError ? <p className="text-sm text-destructive">{combinedError}</p> : null}
          <div className="grid gap-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!token}>
            Mettre à jour
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
