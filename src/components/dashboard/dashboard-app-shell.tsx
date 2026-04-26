"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileWarning, Globe, LayoutDashboard, Shield, Sparkles } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type DashboardShellVariant = "victim" | "admin";

const victimNav = [
  { href: "/dashboard", label: "Mes dossiers", icon: LayoutDashboard },
  { href: "/signaler", label: "Signalement", icon: FileWarning },
  { href: "/guide", label: "Guide", icon: BookOpen },
] as const;

const adminNav = [
  { href: "/admin", label: "Signalements", icon: LayoutDashboard },
  { href: "/", label: "Site public", icon: Globe },
] as const;

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  if (href === "/admin") {
    return pathname === "/admin" || pathname === "/admin/" || pathname.startsWith("/admin/");
  }
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string | null, email: string | null) {
  const base = (name ?? email ?? "?").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0] + parts[1]![0]).toUpperCase();
  return base.slice(0, 2).toUpperCase() || "?";
}

export function DashboardAppShell({
  variant,
  userName,
  userEmail,
  children,
}: {
  variant: DashboardShellVariant;
  userName: string | null;
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const nav = variant === "admin" ? adminNav : victimNav;
  const displayName = userName?.trim() || userEmail?.split("@")[0] || "Utilisateur";
  const subtitle =
    variant === "admin"
      ? "Consultation et traitement des signalements."
      : "Suivi sécurisé de tes dossiers.";

  return (
    <div className="dash-professional dark flex min-h-dvh w-full bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/80 bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border/80 px-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Shield className="size-5" aria-hidden />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">Cobra Kill</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {variant === "admin" ? "Administration" : "Utilisateur"}
            </span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigation principale">
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {variant === "admin" ? "Administration" : "Utilisateur"}
          </p>
          {nav.map(({ href, label, icon: Icon }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-border/80 p-4">
          {variant === "victim" ? (
            <div className="rounded-xl border border-primary/25 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="size-4 shrink-0" aria-hidden />
                <span className="text-xs font-semibold">Rappel</span>
              </div>
              <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
                En danger immédiat ? Contacte les autorités ou une ligne d’écoute.
              </p>
              <Link
                href="/guide"
                className="mt-2 inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                Voir le guide
              </Link>
            </div>
          ) : null}
          <SignOutButton
            variant="ghost"
            showIcon
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-border/80 bg-background/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              {initials(userName, userEmail)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Input
                readOnly
                placeholder="Recherche (bientôt)…"
                className="h-9 rounded-full border-border/60 bg-muted/40 pr-3 pl-4 text-sm"
                aria-label="Recherche"
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            <SignOutButton size="sm" variant="outline" />
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-6 lg:px-8 lg:py-8">{children}</main>

        <nav
          className="sticky bottom-0 flex border-t border-border/80 bg-background/95 px-2 py-2 backdrop-blur-md lg:hidden"
          aria-label="Navigation mobile"
        >
          {nav.map(({ href, label, icon: Icon }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" aria-hidden />
                <span className="truncate px-0.5">{label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
