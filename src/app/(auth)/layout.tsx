import type { ReactNode } from "react";

import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page-root min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-4 sm:px-6">
        <header className="flex shrink-0 items-center justify-between pb-2">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            Cobra Kill
          </Link>
          <Link
            href="/signaler"
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Faire un signalement
          </Link>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center py-6 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
