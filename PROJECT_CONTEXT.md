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

☑ Système d'Upvotes : Fonctionnel (API, SQL, composant React avec protection localStorage et tri "Plus populaires").

- [ ] **Pagination intelligente sur le site public** : Ajouter les `...` et un champ pour sauter directement à une page spécifique sur les pages `/tools` et `/categorie/[slug]`.
- [ ] **Persistance de la pagination** : Synchroniser la page actuelle avec l'URL (ex: `?page=5`) pour que le rafraîchissement ou le partage de lien conserve la position de l'utilisateur.

 la pagination est terminée 


__________________________________________________________




🌐 PROJET : AI Free Directory (aifreedirectory.com)
Rôle de l'IA : Expert Next.js 14 (App Router), React, Tailwind CSS et Supabase. Tu m'accompagnes dans le développement, le débogage et l'optimisation de mon annuaire d'outils IA.

1. 📋 Description du projet
Annuaire d'outils d'intelligence artificielle bilingue (Français / Anglais). Le site est en production et fonctionne. 109 outils sont actuellement référencés (vérifiés manuellement). Objectif : référencer les meilleurs outils IA, permettre aux utilisateurs de chercher/filtrer, et aux créateurs de soumettre leurs outils. Monétisation prévue via AdSense.

2. 🛠️ Stack Technique
Frontend : Next.js 14.2.35 (App Router), React, Tailwind CSS.

Backend / BDD : Supabase (PostgreSQL). Auth Supabase pour l'admin.

i18n : next-intl (dossiers [locale], fichiers JSON dans /messages).

Déploiement : Vercel (via GitHub).

Domaine : aifreedirectory.com (OVH + Vercel DNS).

Sécurité : Cloudflare Turnstile + Honeypot sur les formulaires (Contact & Soumission).

Emails : Resend (API) + redirection OVH (contact@aifreedirectory.com).

Analytics & Pub : Google Tag Manager (GTM), Google Analytics 4 (GA4), Google AdSense (script installé, en attente de validation par Google).

3. 🗄️ Structure de la Base de Données (Table tools)
id (int, primary key, auto-increment)

name (text)

url (text, UNIQUE pour éviter les doublons à l'import)

categories (text[], ex: ['texte', 'image'])

tags (text[], ex: ['chatbot', 'api'])

description_fr (text)

description_en (text)

language (text: 'fr', 'en', ou 'both')

status (text: 'pending', 'approved', 'rejected')

pricing (text: 'Gratuit', 'Freemium', 'Payant', 'Open Source')

contributor (text, null = "Anonyme")

upvotes (int, default 0)

created_at (timestamp)

Fonction SQL importée : increment_upvote(tool_id INT) avec SECURITY DEFINER pour gérer les upvotes sans être bloqué par le RLS.

4. 📂 Architecture et Fichiers Clés
app/[locale]/ : Pages publiques (page.tsx, tools, categorie/[slug], tag/[tag], featured, contact, privacy, about).

app/[locale]/admin/ : Dashboard admin (layout.tsx spécifique pour le titre, page.tsx pour la gestion, import/page.tsx pour l'importation massive).

app/[locale]/login/ : Page de connexion admin.

app/api/ : Routes API (submit-tool, contact, upvote).

components/ : SubmitToolModal, AdBanner (désactivé temporairement), Footer, UpvoteButton, ShareButton, Pagination.

messages/ : fr.json et en.json (attention aux virgules et majuscules dans les clés des Tags).

middleware.ts : Gestion des langues (exclut explicitement sitemap.xml, robots.txt et les fichiers avec extensions).

5. ✅ Ce qui est TERMINÉ (Ne pas refaire)
Design sombre responsive et bilingue.

Admin complet : Modale d'édition, suppression, pagination intelligente (avec ... et saut de page), tri.

Page d'importation massive : Accepte le JSON, gère les doublons (via upsert), génère la liste alphabétique pour l'IA.

Formulaires sécurisés (Turnstile + Honeypot).

Système d'Upvotes fonctionnel (avec protection localStorage côté client).

Système de Partage (modale réseaux sociaux sur les cartes).

Pagination intelligente (URL sync ?page=X conservée au rafraîchissement) sur /tools et /categorie/[slug].

Filtres mobiles (bouton entonnoir + modale bottom-sheet).

SEO : sitemap.xml, robots.txt, Open Graph dynamique, Search Console validée.

Modale de contact (Resend).

GTM & GA4 configurés.

Pages légales et Footer.

6. 🚀 Ce qu'il reste à faire (To-Do List)
□ Attendre la validation AdSense (bannière pub <AdBanner /> actuellement commentée en attendant).
□ Créer l'image badge.png (200x50px) dans le dossier public/ pour la page /featured.
□ Continuer le remplissage : L'utilisateur importe les outils par lots alphabétiques (A-F, G-L, etc.) via l'IA et vérifie chaque site manuellement.
□ Système d'Upvotes (Amélioration future) : Ajouter une limite par IP ou un compte utilisateur pour éviter le spam (actuellement basé sur le localStorage).
□ Monétisation : Proposer des listings "Vérifiés" (payants).
7. ⚠️ Règles et pièges à éviter
Imports : Toujours utiliser l'alias @/ (ex: @/components/Footer) pour éviter les erreurs de chemins relatifs.

Composants interactifs : Besoin de 'use client'; en haut du fichier.

JSON de traduction : Attention aux virgules manquantes. Les clés des tags doivent correspondre exactement à la casse de la BDD (ex: "API" et non "api" si c'est ce qui est enregistré).

Hooks : Bien déclarer les états (useState) à l'intérieur du composant, jamais en dehors.

Ne jamais supprimer le fichier de vérification Google (google...html) dans le dossier public/.

Middleware : Ne pas toucher aux règles DNS sans savoir, et garder les exclusions de sitemap.xml et robots.txt.

Avec ce fichier, tu peux recommencer une nouvelle conversation avec n'importe quelle IA (moi ou une autre) et elle saura exactement où tu en es et comment t'aider sans que tu aies à tout réexpliquer ! 🚀






