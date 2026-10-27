# 📋 Plan de Développement - Annuaire de l'IA

## ✅ Ce qui a été fait (Terminé)
### 🎨 Frontend & Design
- [x] Design Desktop (Dark mode, grille de 3 colonnes, effets néon).
- [x] Design Mobile (Responsive, accordéons, navigation adaptée).
- [x] Composant Modale pour la soumission d'outils.
- [x] Intégration du captcha Cloudflare Turnstile (anti-bot).

### 🌍 Internationalisation (i18n)
- [x] Mise en place de `next-intl` (dossiers `[locale]`, `messages/fr.json`, `messages/en.json`).
- [x] Sélecteur de langue FR / EN dans le Header.
- [x] Traduction de la page d'accueil, des catégories et de la modale.

### 🗄️ Base de données & Backend (Supabase)
- [x] Création de la table `tools`.
- [x] Ajout des colonnes `language`, `description_fr`, `description_en`.
- [x] Transformation de la colonne `category` en `categories` (format tableau `text[]` pour le multi-catégories).
- [x] Création de la Route API (`/api/submit-tool`) pour sécuriser l'insertion (vérification Captcha -> Supabase).
- [x] Page Admin de base (Approuver / Refuser).

### ⚙️ Fonctionnalités
- [x] Affichage dynamique des compteurs d'outils par catégorie.
- [x] Section "Derniers outils approuvés" sur la page d'accueil.
- [x] Filtre des outils par langue (`fr`, `en`, `both`).

---

## 🚧 Ce qu'il reste à faire (To-Do)

### 1. Corrections & Finalisation Frontend
- [ ] **Page Catégorie** (`app/[locale]/categorie/[slug]/page.tsx`) : 
  - Mettre à jour la requête Supabase pour utiliser `.contains('categories', [slug])` (multi-catégories).
  - Ajouter le filtre `.in('language', [locale, 'both'])` pour n'afficher que les outils de la bonne langue.
  - Adapter l'affichage de la description (choisir `description_fr` ou `description_en` selon la langue).

### 2. Dashboard Admin (CRUD complet)
- [ ] **Éditer (Update)** : Créer une modale d'édition pour modifier un outil existant (corriger un nom, changer l'URL, ajouter/retirer des catégories).
- [ ] **Supprimer (Delete)** : Ajouter un bouton de suppression définitive avec confirmation.
- [ ] **Gestion des statuts** : Pouvoir voir la liste de *tous* les outils (pas seulement les `pending`), avec des onglets (En attente, Approuvés, Refusés).

### 3. Monétisation & Évolutions
- [ ] **Espace Annonceurs** : Créer un composant `<AdBanner />` (emplacement publicitaire).
- [ ] **Table `sponsors`** dans Supabase pour gérer les bannières dynamiquement sans toucher au code.
- [ ] *(Optionnel)* Ajouter un système d'Upvote (J'aime) fonctionnel.

### 4. Déploiement (Mise en ligne)
- [ ] Nettoyer le fichier `.env.local` (vérifier que les clés Supabase et Cloudflare sont bonnes).
- [ ] Créer le dépôt Git et pousser le code sur GitHub.
- [ ] Connecter le dépôt à Vercel.
- [ ] Ajouter les variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL`, `TURNSTILE_SECRET_KEY`, etc.) dans Vercel.
- [ ] Acheter un nom de domaine et le lier à Vercel.


Ce qui reste à faire :

□ Ajouter les cases à cocher des Tags dans la modale d'édition de l'Admin.
□ Sécuriser la page Admin avec un mot de passe (Login).
□ Acheter un nom de domaine.
□ Ajouter le SEO (Sitemap).


Ajouter pub dans les autres pages

ailinkszone.com
 Disponible
aifreedirectory.com
 Disponible
 
 Rendre les noms clickables
 Rendre les tags cliquables







