# GBINGBANCE Frontend

Application web de soirée sociale (chat, salons, musique, jeux Action/Vérité + Roue, MP, amis).

## Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS 3 (design system violet neon)
- React Router 6, TanStack Query, Zustand
- Lucide icons, React Hook Form + Zod
- Hébergement : GitHub Pages (SPA)

## Démarrage

```bash
cp .env.example .env
# Éditer VITE_API_BASE_URL vers ton backend PHP

npm install   # ou yarn
npm run dev
```

## Build & Deploy GH Pages

```bash
# Dans vite.config.ts : base: '/nom-du-repo/' si project pages
npm run build
# Déployer dist/ via GitHub Actions gh-pages ou branche
# public/404.html déjà présent pour le routing SPA
```

## Structure

```
src/
  app/           # guards
  components/ui  # Button, Input, Card, Toast...
  components/layout  # Sidebar, BottomNav, AppShell
  features/      # auth, home, salons, chat, music, games, friends, profile, admin
  lib/api.ts     # client fetch JWT
  stores/        # auth, ui, music, room, badges
  types/
```

## Routes

| Route | Auth |
|-------|------|
| `/` Landing | Non |
| `/login` `/register` | Non |
| `/app/home` Accueil | Oui |
| `/app/salons` Hub + `:id` | Oui |
| `/app/messages[/:userId]` | Oui |
| `/app/friends` | Oui |
| `/app/games[/av\|wheel\|defi]` | Oui |
| `/app/music` | Oui |
| `/app/profile` `/app/users/:id` | Oui |
| `/app/admin` | Admin |

## Critères v1

- [x] Auth JWT (login/register + persist)
- [x] Shell sidebar + bottom nav mobile
- [x] Hub salons + vue salon + messages
- [x] Musique (player + unlock audio)
- [x] AV + Roue (API, pas hardcodé)
- [x] MP liste + thread
- [x] Admin visible admin only
- [x] Structure prête GH Pages + 404.html
- [x] Mobile bottom nav

Backend API PHP fourni séparément. Voir le cahier des charges pour les endpoints.
