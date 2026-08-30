const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const apiPath = path.join(projectRoot, 'api', 'redis-room.js');

test('redis room API keeps Upstash credentials server-side only', () => {
  const source = fs.readFileSync(apiPath, 'utf8');
  assert.match(source, /process\.env\.UPSTASH_REDIS_REST_URL/);
  assert.match(source, /process\.env\.UPSTASH_REDIS_REST_TOKEN/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_UPSTASH/);
});

test('redis room API exposes one action router for live room operations', () => {
  const source = fs.readFileSync(apiPath, 'utf8');
  ['listRooms', 'createRoom', 'joinRoom', 'leaveRoom', 'heartbeat', 'sendChat'].forEach(action => {
    assert.match(source, new RegExp(`case ['"]${action}['"]`));
  });
});

test('redis room API uses expiring room, member, player and chat keys', () => {
  const source = fs.readFileSync(apiPath, 'utf8');
  assert.match(source, /const ROOM_TTL_SECONDS\s*=\s*900/);
  assert.match(source, /const PLAYER_TTL_SECONDS\s*=\s*240/);
  assert.match(source, /const CHAT_TTL_SECONDS\s*=\s*7200/);
  assert.match(source, /function roomKey\(roomId\)/);
  assert.match(source, /cy:pets:room:\$\{roomId\}/);
  assert.match(source, /function roomPlayerKey\(roomId,\s*studentId\)/);
  assert.match(source, /cy:pets:room:\$\{roomId\}:player:\$\{studentId\}/);
});

test('redis room API falls back to Supabase when the fast room store is not configured', () => {
  const source = fs.readFileSync(apiPath, 'utf8');
  assert.match(source, /const SUPABASE_ROOM_ACTION_MAP = Object\.freeze\(\{/);
  assert.match(source, /listRooms:\s*'listInteractionRooms'/);
  assert.match(source, /listFriendRooms:\s*'listFriendInteractionRooms'/);
  assert.match(source, /heartbeat:\s*'heartbeatInteractionRoom'/);
  assert.match(source, /leaveRoom:\s*'leaveInteractionRoom'/);
  assert.match(source, /async function callSupabaseRoomFallback\(action,\s*body = \{\}\)/);
  assert.match(source, /error\.code === 'REDIS_NOT_CONFIGURED'/);
  assert.match(source, /const payload = await callSupabaseRoomFallback\(action,\s*body\)/);
});
