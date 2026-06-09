# Le Pass 78 — Landing Page

Page d'accueil marketing (SaaS, dark mode, glassmorphism) pour promouvoir le réseau de fidélité **Le Pass 78**.

## Stack
- **React 18** + **Vite**
- **Tailwind CSS** (dark mode, thème de marque)
- **Framer Motion** (apparitions au scroll, lévitation du mockup)
- **Lucide React** (icônes)

## Lancer
```bash
cd landing
npm install
cp .env.example .env   # VITE_API_URL → URL du backend (liste d'attente)
npm run dev            # http://localhost:5174
```

> Le formulaire de liste d'attente envoie un `POST {VITE_API_URL}/api/waitlist`.
> Le backend Le Pass 78 doit donc tourner (voir `../backend`). En production,
> ajoutez l'origine de la landing à `CORS_ORIGINS` du backend.

## Build
```bash
npm run build    # génère dist/
npm run preview
```

## Structure
- `src/LandingPage.jsx` — **composant principal** : toutes les sections.
  - `ScrollProgress` — barre de progression de lecture (haut de page)
  - `Navbar` — fond au scroll + menu mobile animé
  - `Hero` — accroche + **carte Apple Wallet sur-mesure (CSS)** avec **tilt 3D** au survol et lévitation
  - `PartnersMarquee` — bandeau de catégories en défilement infini
  - `HowItWorks` — 3 étapes (cartes avec effet **spotlight** au curseur)
  - `StatsBand` — chiffres clés avec **compteurs animés** (count-up au scroll)
  - `Merchants` — **Bento Grid** asymétrique (spotlight + images)
  - `Testimonial` — citation partenaire
  - `FAQ` — accordéon animé (`AnimatePresence`)
  - `FinalCTA` — capture d'email (liste d'attente)
  - `Footer`
- `src/index.css` — police Inter, fond sombre, effet `spotlight`, respect de `prefers-reduced-motion`.
- `tailwind.config.js` — couleurs `ink` / `electric`, animations (`glow`, `marquee`, `shine`), grille de fond.

## Détails techniques
- **Carte Wallet** : construite en CSS/SVG (pas d'image externe), QR factice généré, reflet animé.
- **Tilt 3D** : `useMotionValue` + `useSpring` (rotation suivant la souris, ressort doux).
- **Spotlight** : halo radial suivant le curseur via variables CSS `--mx`/`--my`.
- **Compteurs** : `animate()` de Framer Motion déclenché par `useInView`.
- **Accessibilité** : `prefers-reduced-motion` désactive les animations.

> Les images proviennent d'Unsplash (liens directs). Pour la production, héberger
> des visuels définitifs (et un vrai mockup de la carte dans Apple Wallet).
> Le formulaire d'email est en mode démo : brancher `FinalCTA.submit()` sur votre
> backend ou un outil d'emailing (ex : `POST /api/waitlist`).
