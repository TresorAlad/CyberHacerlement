import { Card } from "@/components/ui/card";

export default function GuidePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            Guide de collecte de preuves
          </h1>
          <p className="pt-2 text-muted-foreground">
            Conseils pratiques pour préserver les preuves et faciliter le
            traitement du dossier.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="text-sm font-medium">Captures & messages</div>
            <div className="pt-2 text-sm text-muted-foreground">
              Fais des captures d’écran avec la date, l’URL, et le contexte.
              Évite de recadrer trop serré.
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium">Liens & profils</div>
            <div className="pt-2 text-sm text-muted-foreground">
              Copie les liens des publications, profils, commentaires et garde
              les identifiants (pseudo).
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium">Audio & vidéo</div>
            <div className="pt-2 text-sm text-muted-foreground">
              Conserve les fichiers originaux. Ne les renomme pas si possible,
              et note la date/heure.
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium">Sécurité</div>
            <div className="pt-2 text-sm text-muted-foreground">
              Si tu te sens en danger, demande de l’aide immédiatement autour de
              toi et contacte les services d’urgence.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

