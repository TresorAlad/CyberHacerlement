"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/signaler", label: "Signaler" },
  { href: "/guide", label: "Guide" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm sm:size-10 sm:text-base">
            CK
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold tracking-tight sm:text-base">Cobra Kill</div>
            <div className="hidden text-xs text-muted-foreground sm:block">Anti cyberharcèlement</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Navigation principale">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                pathname === item.href && "bg-secondary text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {session ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden text-muted-foreground hover:text-foreground sm:inline-flex"
              )}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden text-muted-foreground hover:text-foreground sm:inline-flex"
              )}
            >
              Connexion
            </Link>
          )}

          <Link href="/signaler" className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
            Signaler
          </Link>
          <Link href="/signaler" className={cn(buttonVariants({ size: "sm" }), "shrink-0 sm:hidden")}>
            Signaler
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="shrink-0 sm:hidden"
              aria-label="Ouvrir le menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <SheetContent side="right" className="w-[min(100vw-1rem,20rem)] gap-0 p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border/60 p-4 text-left">
                <SheetTitle className="text-base">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-2" aria-label="Navigation mobile">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-border/60 pt-2">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Dashboard
                      </Link>
                      <div className="px-4 py-3">
                        <SignOutButton variant="secondary" size="sm" className="w-full justify-center" showIcon />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Créer un compte
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
