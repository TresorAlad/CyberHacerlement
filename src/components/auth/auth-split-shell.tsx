import Link from "next/link";

import { cn } from "@/lib/utils";

const tabActive = cn(
  "relative z-10 flex min-h-[2.75rem] items-center justify-center rounded-full px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground antialiased",
  "bg-surface",
  "transition-[transform,background-color,color] duration-200 ease-out",
  "active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:shadow-none",
  "md:min-h-[3.125rem] md:justify-start md:rounded-l-[1.125rem] md:rounded-r-full md:py-0 md:pl-8 md:pr-10 md:leading-none md:tracking-[0.24em]",
  "md:translate-x-2",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
);

const tabInactive = cn(
  "flex min-h-[2.75rem] items-center justify-center rounded-full px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground antialiased",
  "transition-[color,background-color,transform,box-shadow] duration-200 ease-out",
  "hover:bg-primary-foreground/[0.1] hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary-foreground)_14%,transparent)]",
  "active:scale-[0.99] motion-reduce:transition-none",
  "md:min-h-[2.875rem] md:justify-start md:rounded-l-[0.875rem] md:px-6 md:py-0 md:pr-5 md:leading-none md:tracking-[0.22em]",
  "md:text-primary-foreground/90 md:hover:bg-primary-foreground/[0.08]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
);

export function AuthSplitShell({
  mode,
  children,
  signInHref = "/sign-in",
  signUpHref = "/sign-up",
}: {
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
  signInHref?: string;
  signUpHref?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[min(100%,980px)] flex-col overflow-hidden rounded-[1.5rem] border border-border/80 bg-card",
        "shadow-[0_24px_64px_-18px_color-mix(in_oklab,var(--foreground)_14%,transparent)]",
        "md:min-h-[32rem] md:flex-row md:rounded-[1.625rem]",
      )}
    >
      <aside
        className={cn(
          "relative order-2 flex min-h-[220px] flex-none flex-col justify-end md:order-1 md:w-[min(36%,300px)] md:min-h-full md:justify-between",
          "overflow-visible",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden max-md:rounded-b-[1.5rem] md:rounded-l-[1.625rem]"
          aria-hidden
        >
          <div className="auth-split-aside-base absolute inset-0" />
          <div
            className="absolute inset-0 opacity-[0.32] bg-[repeating-linear-gradient(-28deg,transparent,transparent_11px,color-mix(in_oklab,var(--primary-foreground)_11%,transparent)_11px,color-mix(in_oklab,var(--primary-foreground)_11%,transparent)_24px)]"
            aria-hidden
          />
          <div className="auth-split-glass absolute inset-0 max-md:rounded-b-[1.5rem] md:rounded-l-[1.625rem]" aria-hidden />
          <div className="absolute -right-12 top-8 size-48 rotate-12 rounded-[2rem] bg-primary/30 blur-3xl" aria-hidden />
          <div className="absolute bottom-1/4 -left-8 size-36 -rotate-6 rounded-3xl bg-secondary/40 blur-2xl" aria-hidden />
          <div className="absolute right-0 top-1/3 size-28 rotate-[-20deg] rounded-2xl bg-accent/25 blur-2xl" aria-hidden />
        </div>

        <div className="relative z-10 hidden px-7 pb-4 pt-9 md:block">
          <p className="text-lg font-semibold tracking-tight text-primary-foreground">Cobra Kill</p>
          <p className="mt-2 max-w-[12rem] text-xs leading-relaxed text-primary-foreground/75">
            Lutte contre le cyberharcèlement au Togo.
          </p>
        </div>

        <nav
          className={cn(
            "relative z-20 flex flex-row justify-center gap-2.5 px-4 pb-6 pt-4",
            "md:absolute md:left-0 md:right-0 md:top-1/2 md:w-[calc(100%+16px)] md:-translate-y-1/2 md:flex-col md:items-stretch md:gap-2.5 md:px-0 md:pb-0 md:pt-0",
          )}
          aria-label="Login or sign up"
        >
          <Link
            href={signInHref}
            aria-current={mode === "sign-in" ? "page" : undefined}
            className={cn(mode === "sign-in" ? tabActive : tabInactive)}
          >
            Login
          </Link>
          <Link
            href={signUpHref}
            aria-current={mode === "sign-up" ? "page" : undefined}
            className={cn(mode === "sign-up" ? tabActive : tabInactive)}
          >
            Sign up
          </Link>
        </nav>
      </aside>

      <div
        className={cn(
          "relative order-1 flex flex-1 flex-col bg-surface px-6 pb-10 pt-9 text-foreground md:order-2 md:rounded-r-[1.625rem] md:px-12 md:pb-12 md:pl-11 md:pt-11",
        )}
      >
        {children}
      </div>
    </div>
  );
}
