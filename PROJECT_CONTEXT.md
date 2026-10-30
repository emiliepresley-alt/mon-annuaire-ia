Copier le contenu de ton fichier PROJECT_CONTEXT.md.

Le coller dans le premier message, avec une petite phrase du genre :
"Bonjour, je souhaite continuer le développement de mon annuaire AI Free Directory. Voici le contexte de mon projet (fichier ci-dessous). Peux-tu lire les règles et me dire si tu es prêt à m'aider pour la suite ?"

L'IA lira tout, comprendra ton code, ta stack, et te répondra instantanément sans que tu aies besoin de tout réexpliquer.

C'est la meilleure façon de travailler sur le long terme. Pense juste à mettre à jour la section "Ce qu'il reste à faire" quand tu accomplis de nouvelles choses ! 🚀



# 🌐 PROJET : AI Free Directory (aifreedirectory.com)
**Rôle de l'IA :** Expert Next.js 14 (App Router), React, Tailwind CSS et Supabase. Tu m'accompagnes dans le développement, le débogage et l'optimisation de mon annuaire d'outils IA.

## 1. 📋 Description du projet
Annuaire d'outils d'intelligence artificielle bilingue (Français / Anglais). Le site est en production et fonctionne. Objectif : référencer les meilleurs outils IA, permettre aux utilisateurs de chercher/filtrer, et aux créateurs de soumettre leurs outils. Monétisation via AdSense et potentiellement des listings sponsorisés.

## 2. 🛠️ Stack Technique
- **Frontend :** Next.js 14.2.35 (App Router), React, Tailwind CSS.
- **Backend / Base de données :** Supabase (PostgreSQL). Authentification Supabase Auth pour l'admin.
- **Internationalisation :** `next-intl` (dossiers `[locale]`, fichiers JSON dans `/messages`).
- **Déploiement :** Vercel (déploiement automatique via GitHub).
- **Domaine :** `aifreedirectory.com` (acheté chez OVH, DNS configuré pour Vercel).
- **Sécurité :** Cloudflare Turnstile (captcha) + Honeypot sur les formulaires.
- **Emails :** Resend (API) + redirection email OVH (`contact@aifreedirectory.com`).
- **Publicité :** Google AdSense (script installé, site en cours d'examen).

## 3. 🗄️ Structure de la Base de Données (Table `tools`)
- `id` (uuid, primary key)
- `name` (text)
- `url` (text)
- `categories` (text[], ex: `['texte', 'image']`)
- `tags` (text[], ex: `['chatbot', 'api']`)
- `description_fr` (text)
- `description_en` (text)
- `language` (text: 'fr', 'en', ou 'both')
- `status` (text: 'pending', 'approved', 'rejected')
- `pricing` (text: 'Gratuit', 'Freemium', 'Payant', 'Open Source')
- `contributor` (text, null = "Anonyme")
- `created_at` (timestamp)

**Sécurité Supabase (RLS) :** Activé. Le public peut lire les outils `approved` et insérer des outils `pending`. L'admin (authentifié) a tous les droits.

## 4. 📂 Architecture des dossiers clés
- `app/[locale]/` : Toutes les pages publiques (page.tsx, tools, categorie/[slug], tag/[tag], featured, contact, privacy, about).
- `app/[locale]/admin/` : Dashboard admin protégé (login requis).
- `app/[locale]/login/` : Page de connexion admin.
- `app/api/` : Routes API (`submit-tool`, `contact`).
- `components/` : Composants réutilisables (`SubmitToolModal`, `AdBanner`, `Footer`).
- `lib/supabase.ts` : Client Supabase.
- `messages/` : Fichiers de traduction `fr.json` et `en.json`.
- `middleware.ts` : Gestion des redirections de langue.

## 5. ✅ Ce qui est TERMINÉ (Ne pas refaire)
- Design sombre, responsive et bilingue.
- Base de données remplie avec plus de 30 outils (ChatGPT, DeepSeek, Midjourney, etc.).
- Admin complet : Modale d'édition (tags, catégories, prix, contributeur), suppression, pagination intelligente.
- Formulaires protégés (Turnstile + Honeypot).
- SEO de base : `sitemap.xml`, `robots.txt`, balises Open Graph dynamiques, Google Search Console validée.
- Modale de contact fonctionnelle (envoi via Resend).
- Pages légales et Footer.
- Bannière "Featured" sur l'accueil + page `/featured` avec badge.

## 6. 🚀 Ce qu'il reste à faire (To-Do List)
- [ ] **Attendre la validation AdSense** (en cours d'examen par Google). Si refusé, ajouter plus de contenu textuel (articles de blog).
- [ ] **Remplir massivement l'annuaire** : Utiliser un dataset Kaggle ou l'API de Toolify (ex: script Python/Node pour insérer dans Supabase).
- [ ] **Badge image** : Créer l'image `badge.png` et la mettre dans `public/` pour que le code de la page `/featured` fonctionne visuellement.
- [ ] **Système d'Upvotes** (J'aime) pour faire remonter les outils.
- [ ] **Amélioration du SEO** : Créer des articles de blog pour capter du trafic organique.
- [ ] **Monétisation** : Proposer des listings "Vérifiés" (payants) avec un badge spécial.

## 7. ⚠️ Règles et pièges à éviter
- Toujours utiliser l'alias `@/` (ex: `@/components/Footer`) pour les imports, évite les `../../`.
- Les composants interactifs doivent avoir `'use client';` en haut du fichier.
- Les fichiers de traduction (`fr.json`, `en.json`) doivent être parfaitement valides (attention aux virgules).
- Ne jamais supprimer le fichier HTML de validation Google dans le dossier `public/`.
- Ne pas toucher aux enregistrements DNS (Vercel, Resend, OVH) sans savoir ce qu'on fait.