# Redis Live Room Rollout

CY PETS STORY keeps permanent game data in Supabase:

- students
- coins
- pets and equipment
- gifts and mailbox
- message wall posts
- mini-game high scores

Redis is only for temporary live room state:

- open room list
- who is inside a room
- each player's current map, position, facing, and action
- short-lived room chat bubbles/messages

## Vercel Environment Variables

Add these server-side variables in Vercel before expecting Redis to be active:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Do not prefix them with `NEXT_PUBLIC_`. The browser must never receive the Redis token.

If these variables are missing or Redis is temporarily unavailable, the frontend falls back to the existing permanent backend path so students are not blocked from the whole app.

## Expiry Rules

- Room metadata: `60` seconds
- Player presence: `15` seconds
- Room chat: `2` hours

Temporary rooms disappear after the last player leaves or when their Redis keys expire. Permanent rooms can be recreated by backend setup if needed.

## What Changed In The App

- Interaction room list/create/join/leave/heartbeat now call `/api/redis-room` first.
- Movement heartbeat is throttled:
  - moving players: about every `350ms`
  - idle players: about every `1500ms`
- Local animation still runs in the browser, so movement feels smoother while network writes are reduced.
- App cache version is bumped to `20260823-01`.

