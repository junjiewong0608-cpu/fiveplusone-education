# CY PETS STORY Branch Starter

This package is a portable starter copy of the CY PETS STORY classroom pet-learning platform. It includes the frontend, Supabase Edge Function source, Vercel live-room API, game assets, music assets, room maps, sharing card frames, and tests needed for another branch to begin customization.

No private teacher list, student roster, production Supabase project, Vercel project folder, Redis credentials, or local machine cache is included.

## Start Here

1. Open this folder in a fresh Codex task.
2. Read `AGENTS.md` first.
3. Read `HANDOFF.md` for the human setup checklist.
4. Copy `.env.example` to `.env.local` and fill your own values.
5. Run a local static server and test the app.

```bash
python3 -m http.server 8787
```

Then open:

```text
http://127.0.0.1:8787/
```

## What The Next Branch Must Configure

- Branch logo and display text.
- Student and teacher roster in Supabase.
- Supabase Edge Function URL and public function key.
- Vercel project and production domain.
- Upstash Redis / Vercel KV variables for live rooms.
- Permanent room names and map assignments.

## Redis Is Recommended For Live Rooms

The app can fall back to Supabase for room lists, but production classroom use should connect Redis. Redis handles short-lived room presence, player positions, chat, and offline cleanup much faster than writing every heartbeat to Supabase.

The live-room API reads either variable naming style:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
KV_REST_API_URL
KV_REST_API_TOKEN
```

After deployment, verify Redis is active:

```bash
curl -fsS -X POST https://YOUR_DOMAIN/api/redis-room \
  -H 'content-type: application/json' \
  --data '{"action":"listRooms","studentId":"CY0000"}'
```

Expected:

```json
{"source":"redis-room","ok":true}
```

If it says `source: "supabase"` with `fallbackFrom: "redis-room"`, the app still works but Redis is not connected.

## Project Shape

- `index.html`, `styles.css`, `app.js`: browser app.
- `backend-client.js`: frontend backend adapter.
- `api/redis-room.js`: Vercel Serverless Function for fast room state.
- `api/warmup.js`: optional production warmup endpoint.
- `supabase/functions/cy-pets-api/index.ts`: Supabase Edge Function source.
- `assets/`: visual, music, room, pet, 8-bit, share-card, and mini-game assets.
- `tests/`: Node contract tests for catalog, backend, social features, guides, and room logic.
- `scripts/`: helper scripts used for asset repair and migration.

## Local Checks

Run targeted checks before deploying changes:

```bash
node --check app.js
node --check api/redis-room.js
node --test tests/redis-room-api.test.js tests/full-role-catalog.test.js tests/social-feature-contract.test.js
```

For asset-heavy edits, also run:

```bash
python3 scripts/repair_8bit_sprite_assets.py --check
```

## Deployment Outline

1. Create or choose a Vercel project.
2. Add environment variables from `.env.example`.
3. Deploy the static app and API.
4. Create a Supabase project.
5. Deploy the Edge Function.
6. Add your roster and teacher/admin records.
7. Connect Upstash Redis or Vercel KV.
8. Test two browsers in the same room and confirm both players see the same forms, sizes, messages, and maps.

Detailed steps are in `HANDOFF.md`.
