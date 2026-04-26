import Link from "next/link";
import { headers } from "next/headers";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

import { ReportForm } from "./report-form";

export default async function SignalerPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const categories = await prisma.category.findMany({ orderBy: { label: "asc" } });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight">Faire un signalement</h1>
          <p className="pt-2 text-muted-foreground">
            Décris la situation et ajoute des preuves (liens ou texte). Tu dois être connecté.
          </p>
        </div>

        {!session ? (
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Connecte-toi pour créer un dossier et le suivre dans ton tableau de bord.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href="/sign-in?next=%2Fsignaler" className={cn(buttonVariants({}))}>
                  Se connecter
                </Link>
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants({ variant: "secondary" }), "text-center")}
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <ReportForm categories={categories} />
        )}
      </div>
    </div>
  );
}
