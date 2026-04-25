# Cobra Kill — Cahier des Charges + Design System

---

# 1. Présentation du Projet

## Nom du produit
**Cobra Kill**

## Description

Cobra Kill est une plateforme numérique de lutte contre le cyberharcèlement destinée au grand public au Togo.

Elle permettra aux victimes de :

- Signaler un cas rapidement
- Envoyer des preuves
- Recevoir assistance psychologique
- Recevoir orientation juridique
- Dialoguer avec une équipe dédiée
- Suivre leur dossier
- Obtenir de l’aide immédiate

---

# 2. Vision du Produit

Créer la plateforme de référence au Togo pour la protection des victimes de cyberharcèlement, avec une extension future en Afrique francophone.

---

# 3. Public Cible

- Grand public
- Étudiants
- Élèves
- Femmes victimes de harcèlement
- Utilisateurs réseaux sociaux
- ONG
- Institutions publiques
- Universités
- Écoles

---

# 4. Utilisateurs et Rôles

## Victime

- Faire un signalement
- Upload de preuves
- Chat sécurisé
- Suivi dossier

## Modérateur

- Vérifier dossiers
- Prioriser urgences
- Escalader cas sensibles

## Psychologue

- Soutien moral
- Accompagnement émotionnel

## Juriste

- Conseils légaux
- Orientation judiciaire

## Administrateur

- Gestion plateforme
- Analytics
- Utilisateurs

---

# 5. Fonctionnalités Principales

## Authentification

- Email / mot de passe
- Réinitialisation mot de passe
- Sessions sécurisées

## Signalement

Formulaire :

- Nom (optionnel)
- Anonyme possible
- Type de harcèlement
- Description
- Date
- Plateforme concernée

## Preuves

Formats :

- Images
- Vidéo
- Audio
- Liens URL
- Texte copié
- Captures écran

## Intelligence Artificielle

- Détection gravité
- Détection menace suicide
- Classement automatique
- Premiers conseils
- Génération PDF
- Résumé dossier

## Chat Interne

- Victime ↔ équipe
- Historique sécurisé
- Notifications

## Dashboard Victime

- Statut dossier
- Messages
- Conseils
- Historique

## Dashboard Admin

- Nombre cas
- Cas urgents
- Régions touchées
- Réseaux concernés
- Temps moyen réponse

## Base de Connaissance

- Comment réagir
- Loi togolaise
- Conseils psychologiques
- Guide collecte preuves

---

# 6. Fonctionnalités Futures

- App mobile
- WhatsApp Bot
- Liaison police
- Multilingue
- API publique

---

# 7. Stack Technique

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- TanStack Query

## Backend

- Next.js App Router
- Server Actions
- API Routes

## Base de Données

- PostgreSQL (Neon)

## ORM

- Prisma

## Auth

- Better Auth / NextAuth

## Déploiement

- Vercel

---

# 8. Sécurité

- Hash mots de passe
- HTTPS
- Validation fichiers
- Rate limiting
- Anti spam
- Logs admin
- Permissions RBAC
- Protection uploads

---

# 9. Base de Données

## Tables

- users
- reports
- evidences
- messages
- notifications
- categories
- analytics
- experts

---

# 10. Roadmap 7 Jours

## Jour 1

- Setup projet
- Prisma
- Auth

## Jour 2

- Signalement
- Upload fichiers

## Jour 3

- Dashboard victime

## Jour 4

- Dashboard admin

## Jour 5

- Chat interne

## Jour 6

- IA + PDF

## Jour 7

- UI final
- Déploiement

---

# 11. Business Model

- Gratuit victimes
- ONG
- Sponsoring
- Contrats État
- Abonnement institutions

---

# 12. KPI

- Cas traités
- Temps réponse
- Satisfaction
- Taux résolution
- Partenaires

---

# 13. Design System

## Branding

- Framework : Tailwind CSS
- Components : Shadcn UI
- Style : Moderne / Institutionnel / Startup
- Inspiration : Apple + Stripe

## Typography

- Font principale : Suisse
- Font titres : Suisse

### Sizes

- H1 : 60px
- H2 : 52px
- H3 : 32px
- Body : 16px
- Small : 14px

## Colors

- Primary : #007AFF
- Secondary : #5AC8FA
- Accent : #007AFF
- Background : #F9F9F9
- Surface : #FFFFFF
- Text Primary : #262626
- Text Secondary : #6B7280
- Border : #E5E7EB
- Success : #16A34A
- Warning : #F59E0B
- Danger : #DC2626

## Radius

- Small : 6px
- Medium : 10px
- Large : 16px
- XL : 24px

## Components

### Primary Button

- Background : #007AFF
- Text : #FFFFFF
- Radius : 10px

### Secondary Button

- Background : #EFEFEF
- Text : #262626
- Radius : 10px

### Card

- Background : #FFFFFF
- Border : #E5E7EB
- Radius : 16px

### Input

- Background : #FFFFFF
- Border : #D1D5DB
- Radius : 10px

### Badge Urgent

- Background : #FEE2E2
- Text : #DC2626

### Badge Safe

- Background : #DCFCE7
- Text : #16A34A

---

# 14. UX Direction

- Mobile first
- Clair
- Rapide
- Rassurant
- Interface émotionnellement sécurisante
- Accessibilité élevée

---

# 15. Résultat Final Attendu

Une plateforme premium prête pour :

- Startup
- Investisseurs
- ONG
- Gouvernement
- Portfolio haut niveau
- Déploiement réel

---