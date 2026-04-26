import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const pillars = [
  {
    icon: FileText,
    title: "Signalement guidé",
    description:
      "Parcours clair, adapté au mobile, avec champs essentiels et contexte rassurant.",
  },
  {
    icon: Lock,
    title: "Preuves sécurisées",
    description:
      "Pièces jointes et liens contrôlés : accès limité aux personnes autorisées.",
  },
  {
    icon: MessageSquare,
    title: "Suivi & échanges",
    description:
      "Tableau de bord personnel et fil de messages lié à chaque dossier.",
  },
] as const;

const steps = [
  { n: "01", title: "Tu déposes", text: "Formulaire ou compte, anonymat possible." },
  { n: "02", title: "Tu documentes", text: "Captures, URLs, texte - le guide t’aide." },
  { n: "03", title: "Tu suis", text: "Statuts et messages depuis ton espace." },
  { n: "04", title: "L’admin traite", text: "L’équipe habilitée consulte et met à jour." },
] as const;

export default function HomePage() {
  return (
    <div className="marketing-hero-bg">
      {/* Hero */}
      <section className="overflow-hidden border-b border-border/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                Togo · lutte contre le cyberharcèlement
              </Badge>
              <span className="hidden items-center gap-1 rounded-full border border-border/80 bg-card/80 px-3 py-1 text-xs text-muted-foreground sm:inline-flex">
                <Zap className="size-3.5 text-primary" aria-hidden />
                Urgences priorisées
              </span>
            </div>
            <h1 className="mt-6 text-balance text-[1.65rem] font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl sm:leading-[1.12] lg:text-5xl xl:text-[3.25rem] xl:leading-[1.08]">
              Signaler avec des preuves.{" "}
              <span className="text-primary">Être entendu·e</span> et suivi·e.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0 lg:max-w-xl">
              Cobra Kill centralise les signalements, sécurise les pièces et permet à
              l’administration de traiter les dossiers de façon structurée - depuis
              n’importe quel appareil.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:mx-auto sm:max-w-md sm:flex-row sm:items-center lg:mx-0 lg:max-w-none">
              <Link
                href="/signaler"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 w-full justify-center gap-2 px-8 text-base sm:w-auto"
                )}
              >
                Faire un signalement
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </Link>
              <Link
                href="/guide"
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "h-12 w-full justify-center border border-border/80 bg-card/90 text-base shadow-sm backdrop-blur-sm sm:w-auto"
                )}
              >
                Guide des preuves
              </Link>
            </div>
            <ul className="mt-8 flex flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2 lg:justify-start">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden />
                Connexion ou parcours guidé
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden />
                Anonymat possible
              </li>
              <li className="flex items-center gap-2 sm:hidden lg:flex">
                <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden />
                Interface responsive
              </li>
            </ul>
          </div>

          <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <Card className="relative overflow-hidden border-border/80 bg-card/95 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-8">
              <div
                className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/10 blur-2xl"
                aria-hidden
              />
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                  <Shield className="size-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-semibold text-foreground">Parcours unifié</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Un même espace pour déposer, suivre et échanger sur ton dossier.
                  </p>
                </div>
              </div>
              <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
                <li className="flex gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>Dossier structuré avec type de situation et priorisation.</span>
                </li>
                <li className="flex gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
                  <LayoutDashboard className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>Tableau de bord pour retrouver l’état en un coup d’œil.</span>
                </li>
              </ul>
              <div className="mt-6 border-t border-border/60 pt-6">
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 w-full justify-center border-border/80 text-base"
                  )}
                >
                  J’ai déjà un compte - me connecter
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Blocs valeur */}
      <section className="border-b border-border/60 bg-muted/25 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Pensé pour la clarté et le terrain
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Grilles fluides, textes lisibles, actions visibles - du téléphone au grand
              écran.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {pillars.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="group border-border/80 bg-card/90 p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Comment ça marche
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Quatre étapes simples, affichées en colonne sur mobile et en grille sur
                tablette et plus.
              </p>
            </div>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
            {steps.map(({ n, title, text }) => (
              <li key={n}>
                <Card className="h-full border-border/80 bg-card/80 p-5 sm:p-6">
                  <span className="font-mono text-xs font-semibold tracking-widest text-primary">
                    {n}
                  </span>
                  <p className="mt-3 font-medium text-foreground">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-border/60 bg-slate-900 py-14 text-white sm:py-16 lg:py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Besoin d’aide maintenant ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            En danger immédiat, contacte les services d’urgence de ton pays. La plateforme
            complète un signalement structuré - elle ne remplace pas les secours.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/signaler"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 border-0 bg-white text-slate-900 hover:bg-white/90"
              )}
            >
              Lancer un signalement
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 border-white/35 bg-transparent text-white hover:bg-white/10"
              )}
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
