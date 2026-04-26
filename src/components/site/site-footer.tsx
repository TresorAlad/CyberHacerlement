import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const footerLinks = [
  { href: "/signaler", label: "Signaler" },
  { href: "/guide", label: "Guide" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sign-in", label: "Connexion" },
  { href: "/sign-up", label: "Créer un compte" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="text-base font-semibold tracking-tight">Cobra Kill</div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Plateforme de lutte contre le cyberharcèlement au Togo. Signalement structuré,
              preuves sécurisées et suivi de dossier.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              En cas de danger immédiat, contacte les services d’urgence locaux. Cette
              plateforme ne remplace pas les secours.
            </p>
          </div>
          <div className="sm:col-span-1 lg:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Liens rapides
            </div>
            <ul className="mt-4 grid gap-2 text-sm">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Passer à l’action
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Tu peux déposer un signalement sans compte ou te connecter pour suivre tes
              dossiers.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link href="/signaler" className={cn(buttonVariants({ size: "sm" }), "w-full sm:w-auto")}>
                Faire un signalement
              </Link>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full sm:w-auto")}
              >
                Suivre mes dossiers
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Cobra Kill. Tous droits réservés.</span>
          <Link href="/" className="hover:text-foreground">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </footer>
  );
}
