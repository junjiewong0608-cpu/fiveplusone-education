# CY PETS STORY Branch Handoff

This file is for the new branch owner and the next Codex agent. It explains what to configure before opening the app to students.

## Privacy Boundary

This starter does not include the original branch's teacher roster, student roster, Supabase project, Vercel project metadata, Redis credentials, or local generated-image cache. All IDs and branch names inside the package are generic demo placeholders.

Before launch, replace every placeholder with the new branch's own data.

## 1. Prepare Supabase

1. Create a new Supabase project.
2. Create the tables needed by `supabase/functions/cy-pets-api/index.ts`.
3. Add the new branch's teachers and students.
4. Deploy the Edge Function:

```bash
npx supabase functions deploy cy-pets-api --project-ref YOUR_SUPABASE_PROJECT_REF --no-verify-jwt --use-api --yes
```

5. Set a public function key for this branch. Do not reuse another branch's key.

The browser app calls:

```text
https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/cy-pets-api
```

## 2. Prepare Vercel

1. Create a new Vercel project for the branch.
2. Add the Supabase variables:

```text
SUPABASE_FUNCTION_URL=https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/cy-pets-api
SUPABASE_ANON_KEY=YOUR_PUBLIC_FUNCTION_KEY
```

3. Deploy production:

```bash
npx vercel --prod --yes
```

4. Add the branch's production domain or alias.

## 3. Prepare Redis For Rooms

Redis is strongly recommended for live classroom rooms. It keeps player presence, room chat, player positions, and offline cleanup fast.

Preferred Vercel Marketplace path:

```bash
npx vercel integration add upstash/upstash-kv \
  --name cy-pets-live-room-redis \
  --plan free \
  -m primaryRegion=sin1 \
  -m eviction=true \
  -m autoUpgrade=false \
  --json
```

If Vercel asks for marketplace terms, open the provided URL, accept the terms, then run the command again.

The API supports either variable set:

```text
KV_REST_API_URL
KV_REST_API_TOKEN
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

After Redis is connected and production is redeployed, verify:

```bash
curl -fsS -X POST https://YOUR_DOMAIN/api/redis-room \
  -H 'content-type: application/json' \
  --data '{"action":"listRooms","studentId":"CY0000"}'
```

Success means the response contains:

```json
{"source":"redis-room","ok":true}
```

If the response contains `fallbackFrom: "redis-room"`, Redis is not active yet and the app is using Supabase fallback.

## 4. Branch Customization Checklist

- Replace the logo in `assets/brand/`.
- Set the branch name and school wording in `app.js` and `index.html`.
- Configure `TEACHER_GLOBAL_ADMIN_IDS` and `TEACHER_REWARD_ADMIN_IDS`.
- Replace demo permanent room names in `app.js`, `api/redis-room.js`, and `supabase/functions/cy-pets-api/index.ts`.
- Add branch-specific room maps if needed.
- Import the real roster into Supabase only after privacy review.
- Test one student account, one teacher account, and one admin account.

## 5. Launch Smoke Test

Use two browsers or two devices.

1. Log in as two different users.
2. Confirm daily check-in appears first.
3. Confirm new-player guide appears before daily reminders.
4. Enter the same room.
5. Move both players and confirm both devices see the same pet form and size.
6. Send a chat message and emoji.
7. Switch pet in the room hero pool.
8. Play one mini game and confirm the record saves.
9. Share one role card and one music card.
10. Refresh the page and confirm progress remains.

## 6. Notes For The Next Team

- Do not put student rosters in frontend code.
- Do not commit `.env.local`, `.vercel`, generated output folders, or local image caches.
- Keep long-term player data in Supabase.
- Keep short-lived room state in Redis.
- After any asset change, bump `APP_ASSET_VERSION` and the query strings in `index.html`.
- Before public launch, run the local checks from `README.md`.
