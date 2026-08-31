const ROOM_TTL_SECONDS = 900;
const PLAYER_TTL_SECONDS = 240;
const CHAT_TTL_SECONDS = 7200;
const ROOM_LIST_KEY = 'cy:pets:rooms';
const ROOM_MEMBER_LIMIT = 10;
const PERMANENT_ROOM_LIMIT = 30;
const MAX_CHAT_MESSAGES = 30;
const INTERACTION_ROOM_MAP_SET_IDS = new Set(['cy-town', 'cy-bay', 'tokyo-night', 'kl-pavilion-night', 'sunset-farm', 'movie-park', 'cy-school', 'paris-trip', 'xian-trip', 'beijing-trip', 'usa-trip', 'uk-trip']);
const PERMANENT_INTERACTION_ROOMS = [
  { roomId: 'MKPRIMARY', roomName: '5+1 智慧总院', ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'paris-trip', memberLimit: 30 },
  { roomId: 'STPPRIMARY', roomName: '5+1 旗舰校区', ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'xian-trip', memberLimit: 30 },
  { roomId: 'CYMEET2026', roomName: '5+1 教师研讨室', ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'cy-school', memberLimit: 30 },
  { roomId: 'WSPRIMARY', roomName: '5+1 菁英校区', ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'uk-trip', memberLimit: 30 },
  { roomId: 'LEARNERS2026', roomName: "5+1 荣耀研习社", ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'beijing-trip', memberLimit: 30 }
];
const SUPABASE_FUNCTION_URL = process.env.SUPABASE_FUNCTION_URL || 'https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/cy-pets-api';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_PUBLIC_FUNCTION_KEY';
const SUPABASE_ROOM_TIMEOUT_MS = 30000;
const SUPABASE_ROOM_ACTION_MAP = Object.freeze({
  listRooms: 'listInteractionRooms',
  listFriendRooms: 'listFriendInteractionRooms',
  createRoom: 'createInteractionRoom',
  joinRoom: 'joinInteractionRoom',
  heartbeat: 'heartbeatInteractionRoom',
  sendChat: 'heartbeatInteractionRoom',
  leaveRoom: 'leaveInteractionRoom'
});

const JSON_HEADERS = {
  'Content-Type': 'application/json;charset=utf-8',
  'Cache-Control': 'no-store'
};

function json(res, status, payload) {
  res.statusCode = status;
  Object.entries(JSON_HEADERS).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(payload));
}

const CANONICAL_STUDENT_ID_MAP = Object.freeze({
  CY2223: 'CY0002',
  CY5305: 'CY0012',
  CY9657: 'CY0005',
  CY1006: 'CY0006',
  CY1003: 'CY0003',
  CY1004: 'CY0004',
  CY1007: 'CY0017',
  CY1008: 'CY0011',
  CY1009: 'CY0012',
  CY1010: 'CY0014',
  CY1019: 'CY0004',
  CY5678: 'CY0016',
  CY8868: 'CY0015',
  ET2322: 'CY0000'
});

const CANONICAL_STUDENT_NAME_MAP = Object.freeze({
  CY0005: 'Student A',
  CY0006: 'Student B',
  CY0003: 'Teacher C',
  CY0004: 'Teacher D',
  CY0017: 'Student C',
  CY0011: 'Teacher E',
  CY0012: 'Teacher J',
  CY0002: 'Teacher B',
  CY0013: 'Teacher F',
  CY0014: 'Teacher G'
});

function normalizeId(value) {
  const id = String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return CANONICAL_STUDENT_ID_MAP[id] || id;
}

function getCanonicalStudentName(studentId, fallback = '') {
  const id = normalizeId(studentId);
  return CANONICAL_STUDENT_NAME_MAP[id] || sanitizePublicText(fallback, 24, id || '同学');
}

function normalizeRoomId(value) {
  return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
}

function normalizeRoomMapSetId(value) {
  const mapSetId = String(value || '').trim().toLowerCase();
  return INTERACTION_ROOM_MAP_SET_IDS.has(mapSetId) ? mapSetId : 'cy-town';
}

function getRoomStartMapId(mapSetId) {
  const normalizedMapSetId = normalizeRoomMapSetId(mapSetId);
  if (normalizedMapSetId === 'cy-bay') return 'bay-amusement';
  if (normalizedMapSetId === 'tokyo-night') return 'tokyo-tower';
  if (normalizedMapSetId === 'kl-pavilion-night') return 'kl-pavilion-fountain';
  if (normalizedMapSetId === 'sunset-farm') return 'farm-sheep-meadow';
  if (normalizedMapSetId === 'movie-park') return 'studio-globe-entrance';
  if (normalizedMapSetId === 'cy-school') return 'school-gate';
  if (normalizedMapSetId === 'paris-trip') return 'paris-eiffel-riverside';
  if (normalizedMapSetId === 'xian-trip') return 'xian-city-wall-gate';
  if (normalizedMapSetId === 'beijing-trip') return 'beijing-forbidden-city-gate';
  if (normalizedMapSetId === 'usa-trip') return 'usa-new-york-harbor';
  if (normalizedMapSetId === 'uk-trip') return 'uk-london-thames';
  return 'home';
}

function getRoomStartY(mapSetId) {
  const normalizedMapSetId = normalizeRoomMapSetId(mapSetId);
  if (normalizedMapSetId === 'cy-bay') return 340;
  if (normalizedMapSetId === 'tokyo-night') return 336;
  if (normalizedMapSetId === 'kl-pavilion-night') return 360;
  if (normalizedMapSetId === 'sunset-farm') return 356;
  if (normalizedMapSetId === 'movie-park') return 354;
  if (normalizedMapSetId === 'cy-school') return 360;
  if (normalizedMapSetId === 'paris-trip') return 360;
  if (normalizedMapSetId === 'xian-trip') return 360;
  if (normalizedMapSetId === 'beijing-trip') return 362;
  if (normalizedMapSetId === 'usa-trip') return 358;
  if (normalizedMapSetId === 'uk-trip') return 358;
  return 328;
}

function roomKey(roomId) {
  return `cy:pets:room:${roomId}`;
}

function roomMembersKey(roomId) {
  return `cy:pets:room:${normalizeRoomId(roomId)}:members`;
}

function roomPlayerKey(roomId, studentId) {
  return `cy:pets:room:${roomId}:player:${studentId}`;
}

function studentRoomKey(studentId) {
  return `cy:pets:student:${normalizeId(studentId)}:room`;
}

function roomChatKey(roomId) {
  return `cy:pets:room:${normalizeRoomId(roomId)}:chat`;
}

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_KV_REST_API_URL || process.env.KV_REST_API_URL || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || '';
  if (!url || !token) throw Object.assign(new Error('Redis live room is not configured.'), { code: 'REDIS_NOT_CONFIGURED' });
  return { url: url.replace(/\/$/, ''), token };
}

async function redisCommand(command) {
  const { url, token } = getRedisConfig();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    throw new Error(payload.error || `Redis request failed: ${response.status}`);
  }
  return payload.result;
}

async function redisPipeline(commands) {
  if (!commands.length) return [];
  const { url, token } = getRedisConfig();
  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commands)
  });
  const payload = await response.json().catch(() => []);
  if (!response.ok) throw new Error(`Redis pipeline failed: ${response.status}`);
  if (!Array.isArray(payload)) throw new Error('Redis pipeline returned an invalid payload.');
  return payload.map(item => {
    if (item && item.error) throw new Error(item.error);
    return item ? item.result : null;
  });
}

async function callSupabaseRoomFallback(action, body = {}) {
  const fallbackAction = SUPABASE_ROOM_ACTION_MAP[action];
  if (!fallbackAction) return { ok: false, source: 'supabase', fallbackFrom: 'redis-room', error: 'Unknown room action.' };
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), SUPABASE_ROOM_TIMEOUT_MS) : null;
  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ ...body, action: fallbackAction }),
      signal: controller ? controller.signal : undefined
    });
    const text = await response.text();
    let payload = null;
    try {
      payload = JSON.parse(text);
    } catch (_) {
      payload = {
        ok: false,
        error: 'Supabase 房间备用通道暂时没有回传正确资料。'
      };
    }
    if (!response.ok) {
      return {
        ok: false,
        source: 'supabase',
        fallbackFrom: 'redis-room',
        retryable: response.status === 429 || response.status >= 500,
        error: payload?.error || `Supabase 房间备用通道连接失败（${response.status}）`
      };
    }
    return {
      source: 'supabase',
      fallbackFrom: 'redis-room',
      ...(payload || {})
    };
  } catch (error) {
    return {
      ok: false,
      source: 'supabase',
      fallbackFrom: 'redis-room',
      retryable: true,
      error: error?.name === 'AbortError'
        ? `Supabase 房间备用通道超过 ${Math.round(SUPABASE_ROOM_TIMEOUT_MS / 1000)} 秒。`
        : `暂时连接不到 Supabase 房间备用通道：${error?.message || error}`
    };
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function parseJson(value, fallback = null) {
  if (!value) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function sanitizePublicText(value, maxLength, fallback = '') {
  return String(value || fallback)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function samePublicName(first = '', second = '') {
  const left = String(first || '').trim().toLocaleLowerCase();
  const right = String(second || '').trim().toLocaleLowerCase();
  return Boolean(left && right && left === right);
}

function normalizeRoomPetName(value = '', studentId = '', studentName = '') {
  const petName = sanitizePublicText(value, 30, '');
  if (!petName) return '';
  if (samePublicName(petName, studentId) || samePublicName(petName, studentName)) return '';
  return petName;
}

function normalizeRoomPetSize(value = '') {
  const size = String(value || '').trim().toLowerCase();
  return ['small', 'big', 'super'].includes(size) ? size : 'small';
}

function normalizeRoomPetStage(value = '') {
  const stage = String(value || '').trim().toLowerCase();
  return ['base', 'mini', 'final'].includes(stage) ? stage : 'base';
}

function normalizeRoomPetStyle(value = '') {
  const style = String(value || '').trim().toLowerCase();
  return style === 'cute' ? 'cute' : 'heroic';
}

function normalizePassword(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 4);
}

function buildRoomId() {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ROOM${token}`;
}

function normalizeRoomPlayerSummary(player = {}) {
  const studentId = normalizeId(player.studentId || player.student_id);
  const studentName = getCanonicalStudentName(studentId, player.studentName || player.student_name || player.name);
  return {
    ...player,
    studentId,
    studentName,
    petName: normalizeRoomPetName(player.petName || player.pet_name, studentId, studentName),
    petSize: normalizeRoomPetSize(player.petSize || player.pet_size || player.roomPetSize || player.room_pet_size),
    petStage: normalizeRoomPetStage(player.petStage || player.pet_stage || player.evolutionStage || player.evolution_stage),
    petStyle: normalizeRoomPetStyle(player.petStyle || player.pet_style || player.evolutionStyle || player.evolution_style)
  };
}

function normalizeRoomMeta(room = {}, memberCount = 0, players = []) {
  const roomId = normalizeRoomId(room.roomId || room.room_id);
  const memberLimit = Math.max(1, Math.min(PERMANENT_ROOM_LIMIT, Number(room.memberLimit || room.member_limit || ROOM_MEMBER_LIMIT)));
  return {
    roomId,
    roomName: sanitizePublicText(room.roomName || room.room_name, 24, '小小房间'),
    ownerStudentId: normalizeId(room.ownerStudentId || room.owner_student_id || room.studentId),
    ownerName: getCanonicalStudentName(room.ownerStudentId || room.owner_student_id || room.studentId, room.ownerName || room.owner_name || room.studentName || room.student_name),
    isLocked: Boolean(room.isLocked || room.is_locked),
    isPermanent: Boolean(room.isPermanent || room.is_permanent),
    mapSetId: normalizeRoomMapSetId(room.mapSetId || room.map_set_id),
    memberCount: Math.max(0, memberCount),
    memberLimit,
    players: players.map(normalizeRoomPlayerSummary).filter(player => player.studentId),
    createdAt: String(room.createdAt || room.created_at || new Date().toISOString()),
    updatedAt: String(room.updatedAt || room.updated_at || new Date().toISOString())
  };
}

function buildPlayerSnapshot(body = {}, room = {}) {
  const studentId = normalizeId(body.studentId || body.student_id);
  const now = Date.now();
  const message = sanitizePublicText(body.message, 40, '');
  const action = sanitizePublicText(body.playerAction || body.action || 'idle', 16, 'idle');
  const studentName = getCanonicalStudentName(studentId, body.studentName || body.student_name || body.name || studentId);
  return {
    studentId,
    studentName,
    petId: sanitizePublicText(body.petId || body.pet_id || 'kuromi', 48, 'kuromi').toLowerCase(),
    petName: normalizeRoomPetName(body.petName || body.pet_name, studentId, studentName),
    petSize: normalizeRoomPetSize(body.petSize || body.pet_size || body.roomPetSize || body.room_pet_size),
    petStage: normalizeRoomPetStage(body.petStage || body.pet_stage || body.evolutionStage || body.evolution_stage),
    petStyle: normalizeRoomPetStyle(body.petStyle || body.pet_style || body.evolutionStyle || body.evolution_style),
    mapId: sanitizePublicText(body.mapId || body.map_id || getRoomStartMapId(room.mapSetId || room.map_set_id), 48, 'home'),
    x: Number.isFinite(Number(body.x)) ? Number(body.x) : 128,
    y: Number.isFinite(Number(body.y)) ? Number(body.y) : getRoomStartY(room.mapSetId || room.map_set_id),
    facing: Number(body.facing) < 0 ? -1 : 1,
    action,
    message,
    messageUntil: message ? new Date(now + 10000).toISOString() : '',
    roomId: normalizeRoomId(room.roomId || body.roomId || body.room_id),
    lastSeenAt: new Date(now).toISOString()
  };
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return parseJson(req.body, {});
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  return parseJson(text, {});
}

async function setJson(key, value, ttlSeconds) {
  return redisCommand(['SET', key, JSON.stringify(value), 'EX', ttlSeconds]);
}

async function getJson(key) {
  return parseJson(await redisCommand(['GET', key]), null);
}

async function refreshRoomExpiry(roomId) {
  await redisPipeline([
    ['EXPIRE', roomKey(roomId), ROOM_TTL_SECONDS],
    ['EXPIRE', roomMembersKey(roomId), ROOM_TTL_SECONDS],
    ['EXPIRE', roomChatKey(roomId), CHAT_TTL_SECONDS]
  ]);
}

async function getAlivePlayers(roomId, memberIds = []) {
  const ids = Array.from(new Set(memberIds.map(normalizeId).filter(Boolean)));
  if (!ids.length) return [];
  const values = await redisPipeline(ids.map(studentId => ['GET', roomPlayerKey(roomId, studentId)]));
  const staleIds = [];
  const players = values.map((value, index) => {
    const player = parseJson(value, null);
    if (!player) staleIds.push(ids[index]);
    return player;
  }).filter(Boolean);
  if (staleIds.length) await redisCommand(['SREM', roomMembersKey(roomId), ...staleIds]);
  return players.map(normalizeRoomPlayerSummary).sort((a, b) => String(a.studentId).localeCompare(String(b.studentId)));
}

async function getRoomWithPlayers(roomId) {
  const safeRoomId = normalizeRoomId(roomId);
  const room = await getJson(roomKey(safeRoomId));
  if (!room) return null;
  const memberIds = await redisCommand(['SMEMBERS', roomMembersKey(safeRoomId)]).then(value => Array.isArray(value) ? value : []);
  const players = await getAlivePlayers(safeRoomId, memberIds);
  const normalizedRoom = normalizeRoomMeta(room, players.length, players);
  await setJson(roomKey(safeRoomId), { ...room, memberCount: players.length, updatedAt: new Date().toISOString() }, ROOM_TTL_SECONDS);
  return { room: normalizedRoom, players };
}

async function getLatestMessages(roomId) {
  const rows = await redisCommand(['LRANGE', roomChatKey(roomId), 0, MAX_CHAT_MESSAGES - 1]).then(value => Array.isArray(value) ? value : []);
  return rows.map(row => parseJson(row, null)).filter(Boolean).reverse();
}

async function ensurePermanentRooms() {
  if (!PERMANENT_INTERACTION_ROOMS.length) return;
  const now = new Date().toISOString();
  const roomIds = PERMANENT_INTERACTION_ROOMS.map(room => normalizeRoomId(room.roomId)).filter(Boolean);
  const roomValues = await redisPipeline(roomIds.map(roomId => ['GET', roomKey(roomId)]));
  const commands = [['SADD', ROOM_LIST_KEY, ...roomIds]];
  PERMANENT_INTERACTION_ROOMS.forEach((config, index) => {
    const roomId = normalizeRoomId(config.roomId);
    if (!roomId) return;
    const existing = parseJson(roomValues[index], null) || {};
    const room = {
      ...existing,
      roomId,
      roomName: sanitizePublicText(config.roomName, 24, roomId),
      ownerStudentId: normalizeId(config.ownerStudentId),
      ownerName: sanitizePublicText(config.ownerName, 24, '5+1教育补习中心'),
      isLocked: false,
      passwordHash: '',
      isPermanent: true,
      mapSetId: normalizeRoomMapSetId(config.mapSetId),
      memberLimit: Math.max(1, Math.min(PERMANENT_ROOM_LIMIT, Number(config.memberLimit || PERMANENT_ROOM_LIMIT))),
      createdAt: existing.createdAt || now,
      updatedAt: now
    };
    commands.push(['SET', roomKey(roomId), JSON.stringify(room), 'EX', ROOM_TTL_SECONDS]);
    commands.push(['EXPIRE', roomMembersKey(roomId), ROOM_TTL_SECONDS]);
  });
  await redisPipeline(commands);
}

async function listRooms() {
  await ensurePermanentRooms();
  const roomIds = await redisCommand(['SMEMBERS', ROOM_LIST_KEY]).then(value => Array.isArray(value) ? value : []);
  const safeRoomIds = Array.from(new Set(roomIds.map(normalizeRoomId).filter(Boolean)));
  const roomValues = await redisPipeline(safeRoomIds.map(roomId => ['GET', roomKey(roomId)]));
  const rooms = [];
  const expiredRoomIds = [];

  for (let index = 0; index < safeRoomIds.length; index += 1) {
    const roomId = safeRoomIds[index];
    const room = parseJson(roomValues[index], null);
    if (!room) {
      expiredRoomIds.push(roomId);
      continue;
    }
    const memberIds = await redisCommand(['SMEMBERS', roomMembersKey(roomId)]).then(value => Array.isArray(value) ? value : []);
    const players = await getAlivePlayers(roomId, memberIds);
    if (!room.isPermanent && players.length === 0) {
      expiredRoomIds.push(roomId);
      await redisPipeline([['DEL', roomKey(roomId)], ['DEL', roomMembersKey(roomId)], ['DEL', roomChatKey(roomId)]]);
      continue;
    }
    rooms.push(normalizeRoomMeta(room, players.length, players));
  }
  if (expiredRoomIds.length) await redisCommand(['SREM', ROOM_LIST_KEY, ...expiredRoomIds]);
  rooms.sort((a, b) => Number(b.isPermanent) - Number(a.isPermanent) || String(b.updatedAt).localeCompare(String(a.updatedAt)));
  return { ok: true, source: 'redis-room', rooms };
}

async function listFriendRooms(body = {}) {
  const friendIds = Array.from(new Set((Array.isArray(body.friendIds) ? body.friendIds : [])
    .map(normalizeId)
    .filter(Boolean)))
    .slice(0, 80);
  if (!friendIds.length) return { ok: true, source: 'redis-room', friendRooms: [] };

  const roomIds = await redisPipeline(friendIds.map(friendId => ['GET', studentRoomKey(friendId)]));
  const roomById = new Map();
  const staleStudentIds = [];
  const uniqueRoomIds = Array.from(new Set(roomIds.map(normalizeRoomId).filter(Boolean)));
  if (uniqueRoomIds.length) {
    const roomValues = await redisPipeline(uniqueRoomIds.map(roomId => ['GET', roomKey(roomId)]));
    uniqueRoomIds.forEach((roomId, index) => {
      const room = parseJson(roomValues[index], null);
      if (room) roomById.set(roomId, room);
    });
  }

  const playerCommands = [];
  const pairs = [];
  friendIds.forEach((friendId, index) => {
    const roomId = normalizeRoomId(roomIds[index]);
    if (!roomId) return;
    const room = roomById.get(roomId);
    if (!room) {
      staleStudentIds.push(friendId);
      return;
    }
    pairs.push({ friendId, roomId, room });
    playerCommands.push(['GET', roomPlayerKey(roomId, friendId)]);
  });

  const playerValues = await redisPipeline(playerCommands);
  const friendRooms = [];
  const staleRoomMembers = new Map();
  playerValues.forEach((value, index) => {
    const pair = pairs[index];
    const player = parseJson(value, null);
    if (!player) {
      staleStudentIds.push(pair.friendId);
      if (!staleRoomMembers.has(pair.roomId)) staleRoomMembers.set(pair.roomId, []);
      staleRoomMembers.get(pair.roomId).push(pair.friendId);
      return;
    }
    friendRooms.push({
      friendStudentId: pair.friendId,
      player: normalizeRoomPlayerSummary(player),
      room: normalizeRoomMeta(pair.room, Number(pair.room.memberCount || 0), [])
    });
  });

  const cleanupCommands = [];
  staleStudentIds.forEach(friendId => cleanupCommands.push(['DEL', studentRoomKey(friendId)]));
  staleRoomMembers.forEach((ids, roomId) => cleanupCommands.push(['SREM', roomMembersKey(roomId), ...ids]));
  if (cleanupCommands.length) await redisPipeline(cleanupCommands);

  return { ok: true, source: 'redis-room', friendRooms };
}

async function createRoom(body = {}) {
  const studentId = normalizeId(body.studentId);
  if (!studentId) return { ok: false, error: '请先登入。' };
  const roomName = sanitizePublicText(body.roomName, 24, '');
  if (!roomName) return { ok: false, error: '请先给房间取名字。' };
  const isLocked = Boolean(body.isLocked || body.is_locked);
  const password = normalizePassword(body.password);
  if (isLocked && password.length !== 4) return { ok: false, error: '密码要写满4个数字。' };

  const now = new Date().toISOString();
  const roomId = buildRoomId();
  const room = {
    roomId,
    roomName,
    ownerStudentId: studentId,
    ownerName: getCanonicalStudentName(studentId, body.ownerName || body.studentName || body.name),
    isLocked,
    passwordHash: isLocked ? password : '',
    isPermanent: Boolean(body.isPermanent || body.is_permanent),
    mapSetId: normalizeRoomMapSetId(body.mapSetId || body.map_set_id),
    memberLimit: body.isPermanent ? PERMANENT_ROOM_LIMIT : ROOM_MEMBER_LIMIT,
    createdAt: now,
    updatedAt: now
  };
  const player = buildPlayerSnapshot(body, room);
  await redisPipeline([
    ['SADD', ROOM_LIST_KEY, roomId],
    ['SET', roomKey(roomId), JSON.stringify(room), 'EX', ROOM_TTL_SECONDS],
    ['SADD', roomMembersKey(roomId), studentId],
    ['EXPIRE', roomMembersKey(roomId), ROOM_TTL_SECONDS],
    ['SET', roomPlayerKey(roomId, studentId), JSON.stringify(player), 'EX', PLAYER_TTL_SECONDS],
    ['SET', studentRoomKey(studentId), roomId, 'EX', PLAYER_TTL_SECONDS]
  ]);
  return { ok: true, source: 'redis-room', room: normalizeRoomMeta(room, 1, [player]), players: [normalizeRoomPlayerSummary(player)], messages: [] };
}

async function joinRoom(body = {}) {
  const studentId = normalizeId(body.studentId);
  const roomId = normalizeRoomId(body.roomId);
  if (!studentId || !roomId) return { ok: false, error: '房间资料不完整。' };
  let room = await getJson(roomKey(roomId));
  if (!room && PERMANENT_INTERACTION_ROOMS.some(config => normalizeRoomId(config.roomId) === roomId)) {
    await ensurePermanentRooms();
    room = await getJson(roomKey(roomId));
  }
  if (!room) return { ok: false, error: '房间已经关闭。' };
  if (room.isLocked && normalizePassword(body.password) !== String(room.passwordHash || '')) {
    return { ok: false, error: '密码不正确。' };
  }
  const memberIds = await redisCommand(['SMEMBERS', roomMembersKey(roomId)]).then(value => Array.isArray(value) ? value : []);
  const players = await getAlivePlayers(roomId, memberIds);
  const memberLimit = Math.max(1, Math.min(PERMANENT_ROOM_LIMIT, Number(room.memberLimit || ROOM_MEMBER_LIMIT)));
  const alreadyInside = players.some(player => normalizeId(player.studentId) === studentId);
  if (!alreadyInside && players.length >= memberLimit) return { ok: false, error: '房间已经满了。' };
  const player = buildPlayerSnapshot(body, room);
  await redisPipeline([
    ['SADD', roomMembersKey(roomId), studentId],
    ['SET', roomPlayerKey(roomId, studentId), JSON.stringify(player), 'EX', PLAYER_TTL_SECONDS],
    ['SET', studentRoomKey(studentId), roomId, 'EX', PLAYER_TTL_SECONDS],
    ['SET', roomKey(roomId), JSON.stringify({ ...room, updatedAt: new Date().toISOString() }), 'EX', ROOM_TTL_SECONDS],
    ['EXPIRE', roomMembersKey(roomId), ROOM_TTL_SECONDS]
  ]);
  const state = await getRoomWithPlayers(roomId);
  return { ok: true, source: 'redis-room', room: state.room, players: state.players, messages: await getLatestMessages(roomId) };
}

async function leaveRoom(body = {}) {
  const studentId = normalizeId(body.studentId);
  const roomId = normalizeRoomId(body.roomId);
  if (!studentId || !roomId) return { ok: true, source: 'redis-room' };
  const room = await getJson(roomKey(roomId));
  await redisPipeline([
    ['SREM', roomMembersKey(roomId), studentId],
    ['DEL', roomPlayerKey(roomId, studentId)],
    ['DEL', studentRoomKey(studentId)]
  ]);
  const memberIds = await redisCommand(['SMEMBERS', roomMembersKey(roomId)]).then(value => Array.isArray(value) ? value : []);
  const players = await getAlivePlayers(roomId, memberIds);
  if (!room?.isPermanent && players.length === 0) {
    await redisPipeline([
      ['SREM', ROOM_LIST_KEY, roomId],
      ['DEL', roomKey(roomId)],
      ['DEL', roomMembersKey(roomId)],
      ['DEL', roomChatKey(roomId)]
    ]);
  } else if (room) {
    await setJson(roomKey(roomId), { ...room, memberCount: players.length, updatedAt: new Date().toISOString() }, ROOM_TTL_SECONDS);
    await refreshRoomExpiry(roomId);
  }
  return { ok: true, source: 'redis-room' };
}

async function heartbeat(body = {}) {
  const studentId = normalizeId(body.studentId);
  const roomId = normalizeRoomId(body.roomId);
  if (!studentId || !roomId) return { ok: false, error: '房间连接资料不完整。' };
  const room = await getJson(roomKey(roomId));
  if (!room) return { ok: false, error: '房间已经关闭。' };
  const player = buildPlayerSnapshot(body, room);
  const commands = [
    ['SADD', roomMembersKey(roomId), studentId],
    ['SET', roomPlayerKey(roomId, studentId), JSON.stringify(player), 'EX', PLAYER_TTL_SECONDS],
    ['SET', studentRoomKey(studentId), roomId, 'EX', PLAYER_TTL_SECONDS],
    ['SET', roomKey(roomId), JSON.stringify({ ...room, updatedAt: new Date().toISOString() }), 'EX', ROOM_TTL_SECONDS],
    ['EXPIRE', roomMembersKey(roomId), ROOM_TTL_SECONDS]
  ];
  const chatText = sanitizePublicText(body.message, 40, '');
  if (chatText) {
    const message = {
      messageId: `${roomId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId,
      studentName: player.studentName,
      petName: player.petName,
      text: chatText,
      createdAt: new Date().toISOString()
    };
    commands.push(['LPUSH', roomChatKey(roomId), JSON.stringify(message)]);
    commands.push(['LTRIM', roomChatKey(roomId), 0, MAX_CHAT_MESSAGES - 1]);
    commands.push(['EXPIRE', roomChatKey(roomId), CHAT_TTL_SECONDS]);
  }
  await redisPipeline(commands);
  const state = await getRoomWithPlayers(roomId);
  return { ok: true, source: 'redis-room', room: state.room, players: state.players, messages: await getLatestMessages(roomId) };
}

async function sendChat(body = {}) {
  return heartbeat({ ...body, playerAction: body.playerAction || body.action || 'idle' });
}

async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, source: 'redis-room', error: 'Method not allowed.' });
  const body = await readBody(req);
  const action = String(body.action || '');
  try {
    let payload;
    switch (action) {
      case 'listRooms':
        payload = await listRooms(body);
        break;
      case 'listFriendRooms':
        payload = await listFriendRooms(body);
        break;
      case 'createRoom':
        payload = await createRoom(body);
        break;
      case 'joinRoom':
        payload = await joinRoom(body);
        break;
      case 'leaveRoom':
        payload = await leaveRoom(body);
        break;
      case 'heartbeat':
        payload = await heartbeat(body);
        break;
      case 'sendChat':
        payload = await sendChat(body);
        break;
      default:
        payload = { ok: false, source: 'redis-room', error: 'Unknown room action.' };
        break;
    }
    return json(res, payload.ok ? 200 : 400, { source: 'redis-room', ...payload });
  } catch (error) {
    const notConfigured = error && error.code === 'REDIS_NOT_CONFIGURED';
    if (notConfigured) {
      const payload = await callSupabaseRoomFallback(action, body);
      return json(res, payload.ok ? 200 : 502, payload);
    }
    return json(res, 502, {
      ok: false,
      source: 'redis-room',
      retryable: true,
      fallbackAllowed: true,
      error: error.message || String(error)
    });
  }
}

module.exports = handler;
