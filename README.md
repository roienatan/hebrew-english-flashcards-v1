# Citizen Café Flashcards

Hebrew ↔ English flashcards

## Stack

- Next.js
- Tailwind
- PostgreSQL (on Neon)
- Prisma

## Setup

```bash
npm install
add .env file with the correct DATABASE_URL
npm run db:migrate
npm run db:seed
npm run dev
```

## Schema

```
Level (tier, color, order)
  └── Type? (only for some Freedom levels)
        └── Card (hebrew, english)
```

Levels are the main thing (Red, Orange, etc).  
Types only exist for Dark Green (4), Turquoise (4), and Indigo (6) — same level, different content packs.  
Other levels have no type, so `typeId` is null on those cards.

Tier lives on Level, not on every card. Simpler that way.

## Key decisions

- Neon + Prisma — real Postgres, no local DB to manage
- Server Actions to load cards — small app, didn’t need a full API
- Vocab in a seed file — generated offline, then seeded. No LLM in the app
- useTransition for loading state — cleaner than manual loading flags (left the useState version commented)

## Trade-offs

- Simple vocab for demo app
- No saved progress yet — better with localStorage and ideally with auth and DB
- Shuffle should have a better algorithm

## TODO (with more time)

- Mark words as "Repeat" and "Know" so the system knows to re-show cards that marked as "Repeat" (need to update localStorage or ideally with DB and auth)
- Typing answers (for writing practice)
- Save progress (same as above, need either localStorage or auth and DB)
- Keyboard shortcuts (next and flip)
- Better shuffle logic

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local Next.js server |
| `npm run db:migrate` | Create/apply migrations |
| `npm run db:seed` | Load `seed/data.ts` into Neon |
| `npm run db:studio` | Browse data in Prisma Studio |
| `npm run build` | Generate client + production build |

## Design note

See `citizen-cafe-design-bible.md`