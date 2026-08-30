# AGENTS.md

You are helping a new branch adapt CY PETS STORY for its own teachers and students.

## First Moves

1. Read `README.md`.
2. Read `HANDOFF.md`.
3. Inspect `app.js`, `index.html`, `styles.css`, `backend-client.js`, `api/redis-room.js`, and `supabase/functions/cy-pets-api/index.ts`.
4. Confirm what the branch wants to customize before editing data-sensitive areas.

## Important Privacy Rule

Never ask for or copy another branch's private roster, production secrets, Supabase project reference, Redis tokens, or Vercel project metadata into this package. Use placeholders until the new branch owner provides their own data.

## Architecture Summary

- Frontend is a static browser app: `index.html`, `styles.css`, `app.js`.
- Long-term game data belongs in Supabase.
- Short-lived room state belongs in Redis through `api/redis-room.js`.
- The app has Supabase fallback for rooms, but production classroom rooms should use Redis.
- Assets are local files under `assets/`.
- Tests are Node contract tests under `tests/`.

## Setup Guidance

For a new branch:

1. Replace branding assets and visible branch text.
2. Configure Supabase tables and deploy the Edge Function.
3. Configure Vercel environment variables.
4. Configure Redis / Upstash / Vercel KV for rooms.
5. Import students and teachers into Supabase, never into frontend code.
6. Test two simultaneous users before deploying publicly.

## Redis Checklist

The live-room endpoint accepts these variables:

```text
KV_REST_API_URL
KV_REST_API_TOKEN
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

After deployment, test:

```bash
curl -fsS -X POST https://YOUR_DOMAIN/api/redis-room \
  -H 'content-type: application/json' \
  --data '{"action":"listRooms","studentId":"CY0000"}'
```

The healthy Redis response includes `source: "redis-room"`.

## Editing Rules

- Keep changes scoped.
- Do not delete working assets casually; many are hand-reviewed.
- When changing 8-bit sprites, preserve transparent backgrounds and inspect against a bright solid background before declaring the cutout good.
- When changing room behavior, test two users because self-view and other-player-view can differ.
- When changing pet form logic, make sure the chosen stage is persisted and broadcast to other room players.
- After asset changes, bump `APP_ASSET_VERSION` in `app.js` and matching query strings in `index.html`.

## Verification

Run at least:

```bash
node --check app.js
node --check api/redis-room.js
node --test tests/redis-room-api.test.js tests/full-role-catalog.test.js tests/social-feature-contract.test.js
```

For sprite updates:

```bash
python3 scripts/repair_8bit_sprite_assets.py --check
```

Before public deployment, perform the smoke test in `HANDOFF.md`.
