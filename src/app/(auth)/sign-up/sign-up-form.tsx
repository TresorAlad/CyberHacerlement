"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";

import { AuthUnderlineField } from "@/components/auth/auth-underline-field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSession, signUp } from "@/lib/auth-client";
import { getPostLoginPath } from "@/lib/post-login";
import { getUserRole } from "@/lib/role-utils";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await signUp.email({
      name: (formData.get("name") as string) || "Utilisateur",
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (res.error) {
      setError(res.error.message ?? "Inscription impossible.");
      return;
    }

    const sessionRes = await getSession();
    const role = getUserRole(sessionRes.data?.user);
    router.push(getPostLoginPath(role));
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <div className="flex flex-col items-center text-center">
        <div
          className={cn(
            "flex size-[4.25rem] items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent",
            "ring-2 ring-primary/25 ring-offset-2 ring-offset-surface",
            "shadow-[0_14px_36px_-10px_color-mix(in_oklab,var(--primary)_40%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--primary-foreground)_35%,transparent)]",
          )}
        >
          <User className="size-8 text-primary-foreground" strokeWidth={1.65} aria-hidden />
        </div>
        <h1 className="mt-6 text-xl font-bold uppercase tracking-[0.2em] text-foreground">Sign up</h1>
        <p className="mt-2 text-sm text-muted-foreground">Crée ton compte pour suivre tes dossiers.</p>
      </div>

      <form className="mt-10 grid gap-7" onSubmit={handleSubmit}>
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-center text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <div className="grid gap-6">
          <div>
            <label htmlFor="name" className="sr-only">
              Prénom ou pseudo
            </label>
            <AuthUnderlineField
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Prénom ou pseudo"
              icon={User}
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <AuthUnderlineField
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              icon={Mail}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <AuthUnderlineField
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mot de passe (min. 8 caractères)"
              icon={Lock}
              required
              minLength={8}
            />
          </div>
        </div>

        <Button
          type="submit"
          className={cn(
            "h-11 w-full rounded-full border-0 bg-gradient-to-r from-primary via-primary to-accent text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground antialiased sm:ml-auto sm:w-auto sm:px-12",
            "shadow-[0_14px_36px_-12px_color-mix(in_oklab,var(--primary)_42%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--primary-foreground)_28%,transparent)]",
            "transition-[transform,box-shadow,opacity] duration-200 ease-out",
            "hover:-translate-y-0.5 hover:opacity-[0.98] hover:shadow-[0_20px_44px_-12px_color-mix(in_oklab,var(--primary)_48%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--primary-foreground)_34%,transparent)]",
            "active:translate-y-0 active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          )}
        >
          Sign up
        </Button>
      </form>

      <p className="mt-9 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
