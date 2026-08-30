const assert = require('node:assert/strict');
const { test } = require('node:test');
const { normalizeId, getCanonicalStudentName, normalizeStudent, createClient, isSupabaseMode, isGasMode } = require('../backend-client.js');

test('canonical teacher aliases redirect old cleanup IDs', () => {
  assert.equal(normalizeId('cy2223'), 'CY0002');
  assert.equal(getCanonicalStudentName('CY0002', 'Teacher B'), 'Teacher B');
  assert.equal(getCanonicalStudentName('CY0013', 'Teacher F'), 'Teacher F');
  assert.equal(normalizeId('cy5305'), 'CY0012');
  assert.equal(getCanonicalStudentName('CY1009', 'Hong老师'), 'Teacher J');
});

test('normalizes a Sheet student row into the app profile shape', () => {
  const result = normalizeStudent({
    studentId: 'demo001',
    studentName: '小明',
    branch: 'Wangsa Maju',
    classNameLegacy: 'Year 3',
    avatar: 'star',
    petName: '小太阳',
    petType: 'sunny-wing',
    petRarity: 'A',
    petLevel: '2',
    experience: '140',
    coins: '9',
    totalStars: '12',
    streak: '3',
    lastCheckinDate: '2026-08-10',
    ownedItems: '["sunny-wing-exclusive-01"]',
    equippedItems: '{"head":"sunny-wing-exclusive-01"}',
    petBirthday: '2026-08-01',
    ownedPets: '["sunny-wing","sprouty"]',
    petCollection: '{"sunny-wing":{"petId":"sunny-wing","ownedItems":["sunny-wing-exclusive-01"]}}',
    evolvedPets: '{"sunny-wing":true}',
    evolutionStylePreference: 'cute',
    petEvolved: 'TRUE',
    status: 'active'
  }, [{ classId: 'Y3-A', className: 'Year 3A' }], { checkins: [{ recordId: 'local-1' }] });

  assert.equal(result.studentId, 'DEMO001');
  assert.equal(result.studentName, '小明');
  assert.equal(result.name, '小明');
  assert.equal(result.branch, 'Wangsa Maju');
  assert.equal(result.className, 'Year 3A');
  assert.equal(result.petLevel, 2);
  assert.equal(result.experience, 140);
  assert.equal(result.coins, 9);
  assert.equal(result.totalStars, 12);
  assert.equal(result.streak, 3);
  assert.equal(result.lastCheckinDate, '2026-08-10');
  assert.deepEqual(result.ownedItems, ['sunny-wing-exclusive-01']);
  assert.deepEqual(result.equippedItems, { head: 'sunny-wing-exclusive-01' });
  assert.equal(result.petBirthday, '2026-08-01');
  assert.deepEqual(result.ownedPets, ['sunny-wing', 'sprouty']);
  assert.deepEqual(result.petCollection, { 'sunny-wing': { petId: 'sunny-wing', ownedItems: ['sunny-wing-exclusive-01'] } });
  assert.deepEqual(result.evolvedPets, { 'sunny-wing': true });
  assert.equal(result.evolutionStylePreference, 'cute');
  assert.equal(result.petEvolved, true);
  assert.deepEqual(result.classes, [{ classId: 'Y3-A', className: 'Year 3A' }]);
  assert.deepEqual(result.checkins, [{ recordId: 'local-1' }]);
});

test('normalizes remote student data when a fresh browser has no cached profile', () => {
  const result = normalizeStudent({
    studentId: 'cy6439',
    studentName: 'Zizi yap老师',
    coins: '1141',
    checkins: [{ recordId: 'remote-checkin-1' }],
    dailyLoginGifts: [{ date: '2026-08-24', amount: 53 }],
    lastDailyLoginGiftDate: '2026-08-24',
    lastDailyLoginGiftAmount: 53,
    ownedItems: '["exclusive-twinkle-twinkle-01"]',
    petCollection: '{"twinkle-twinkle":{"petId":"twinkle-twinkle","petName":"轰嘛你哄"}}'
  }, [], null);

  assert.equal(result.studentId, 'CY6439');
  assert.equal(result.studentName, 'Zizi yap老师');
  assert.equal(result.coins, 1141);
  assert.deepEqual(result.checkins, [{ recordId: 'remote-checkin-1' }]);
  assert.deepEqual(result.dailyLoginGifts, [{ date: '2026-08-24', amount: 53 }]);
  assert.equal(result.lastDailyLoginGiftDate, '2026-08-24');
  assert.equal(result.lastDailyLoginGiftAmount, 53);
  assert.deepEqual(result.ownedItems, ['exclusive-twinkle-twinkle-01']);
  assert.deepEqual(result.petCollection, {
    'twinkle-twinkle': { petId: 'twinkle-twinkle', petName: '轰嘛你哄' }
  });
});

test('normalizes account reset states without restoring stale cached pets', () => {
  const result = normalizeStudent({
    studentId: 'CY0000',
    studentName: 'Demo Admin',
    branch: 'Wangsa Maju',
    className: 'TEST',
    accountResetAt: '2026-08-28T07:10:00.000Z',
    petType: '',
    petName: '',
    ownedPets: [],
    ownedItems: [],
    petCollection: {},
    coins: 9999,
    totalStars: 0,
    newPlayerGuideEligible: true,
    forceNewPlayerGuide: true
  }, [], {
    studentId: 'CY0000',
    petType: 'crybaby',
    petName: '旧状态',
    ownedPets: ['crybaby'],
    ownedItems: ['crybaby-gear'],
    petCollection: { crybaby: { petId: 'crybaby', evolved: true } },
    coins: 10049,
    totalStars: 56
  });

  assert.equal(result.accountResetAt, '2026-08-28T07:10:00.000Z');
  assert.equal(result.petType, '');
  assert.equal(result.petName, '');
  assert.deepEqual(result.ownedPets, []);
  assert.deepEqual(result.ownedItems, []);
  assert.deepEqual(result.petCollection, {});
  assert.equal(result.coins, 9999);
  assert.equal(result.totalStars, 0);
  assert.equal(result.newPlayerGuideEligible, true);
  assert.equal(result.forceNewPlayerGuide, true);
});

test('normalizes mini game high scores without losing stronger local records', () => {
  const result = normalizeStudent({
    studentId: 'cy7430',
    studentName: 'Teacher H',
    miniGameHighScores: {
      reaction: 200,
      flappy: 62,
      runner: 500,
      jumpCharge: 10
    }
  }, [], {
    studentId: 'CY0001',
    miniGameHighScores: {
      reaction: 100,
      flappy: 140,
      runner: 480,
      jumpCharge: 56
    }
  });

  assert.deepEqual(result.miniGameHighScores, {
    reaction: 200,
    flappy: 140,
    runner: 500,
    jumpCharge: 56
  });
});

test('GAS client posts text/plain payloads and returns JSON', async () => {
  const calls = [];
  const client = createClient({ backendMode: 'gas', backendUrl: 'https://script.example/exec' }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, text: async () => JSON.stringify({ ok: true, student: { studentId: 'DEMO001' }, classes: [] }) };
  });

  const result = await client.getStudent('demo001');

  assert.equal(result.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://script.example/exec');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Content-Type'], 'text/plain;charset=utf-8');
  assert.equal(JSON.parse(calls[0].init.body).action, 'getStudent');
  assert.equal(JSON.parse(calls[0].init.body).studentId, 'DEMO001');
});

test('GAS client can request a lightweight student login without class lookup', async () => {
  const calls = [];
  const client = createClient({ backendMode: 'gas', backendUrl: 'https://script.example/exec' }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, text: async () => JSON.stringify({ ok: true, student: { studentId: 'CY0000' }, classes: [] }) };
  });

  const result = await client.getStudent('et2322', { includeClasses: false });
  const body = JSON.parse(calls[0].init.body);

  assert.equal(result.ok, true);
  assert.equal(body.action, 'getStudent');
  assert.equal(body.studentId, 'CY0000');
  assert.equal(body.includeClasses, false);
});

test('GAS client returns a friendly error for non-JSON backend responses', async () => {
  const client = createClient({ backendMode: 'gas', backendUrl: 'https://script.example/exec', requestRetryCount: 0 }, async () => {
    return { ok: true, text: async () => '<html>temporary Google page</html>' };
  });

  const result = await client.getStudent('EO-15001');

  assert.equal(result.ok, false);
  assert.match(result.error, /没有回传正确资料/);
});

test('GAS client times out slow requests instead of leaving the UI waiting forever', async () => {
  const client = createClient({ backendMode: 'gas', backendUrl: 'https://script.example/exec', requestTimeoutMs: 10, requestRetryCount: 0 }, async (url, init) => {
    await new Promise((resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
      setTimeout(resolve, 50);
    });
    return { ok: true, text: async () => JSON.stringify({ ok: true }) };
  });

  const result = await client.getStudent('EO-15001');

  assert.equal(result.ok, false);
  assert.match(result.error, /读取超过/);
});

test('GAS client retries temporary browser or Google transport failures', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'gas',
    backendUrl: 'https://script.example/exec',
    requestTimeoutMs: 200,
    requestRetryCount: 2,
    requestRetryDelayMs: 1
  }, async (url, init) => {
    calls.push({ url, init });
    if (calls.length === 1) {
      return { ok: true, text: async () => '<html>temporary Google page</html>' };
    }
    if (calls.length === 2) {
      throw new TypeError('Failed to fetch');
    }
    return { ok: true, text: async () => JSON.stringify({ ok: true, student: { studentId: 'EO-18039' }, classes: [] }) };
  });

  const result = await client.getStudent('eo-18039');

  assert.equal(result.ok, true);
  assert.equal(calls.length, 3);
  assert.equal(JSON.parse(calls[2].init.body).studentId, 'EO18039');
});

test('GAS client retries temporary Google echo 404 responses', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'gas',
    backendUrl: 'https://script.example/exec',
    requestRetryCount: 2,
    requestRetryDelayMs: 1
  }, async (url, init) => {
    calls.push({ url, init });
    if (calls.length === 1) {
      return {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        url: 'https://script.googleusercontent.com/macros/echo?user_content_key=temporary',
        text: async () => '<!DOCTYPE html><html><head><script>window.ppConfig={}</script></head></html>'
      };
    }
    return { ok: true, status: 200, url, text: async () => JSON.stringify({ ok: true, student: { studentId: 'CY0000' }, classes: [] }) };
  });

  const result = await client.getStudent('et2322');

  assert.equal(result.ok, true);
  assert.equal(calls.length, 2);
});

test('GAS client does not retry business errors returned by Apps Script', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'gas',
    backendUrl: 'https://script.example/exec',
    requestRetryCount: 2,
    requestRetryDelayMs: 1
  }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, text: async () => JSON.stringify({ ok: false, error: 'Student ID not found' }) };
  });

  const result = await client.getStudent('missing');

  assert.equal(result.ok, false);
  assert.equal(result.error, 'Student ID not found');
  assert.equal(calls.length, 1);
});

test('local client returns local-mode response without fetching', async () => {
  const client = createClient({ backendMode: 'local', backendUrl: '' }, async () => {
    throw new Error('fetch should not be called in local mode');
  });

  assert.deepEqual(await client.getStudent('DEMO001'), { ok: true, mode: 'local' });
  assert.deepEqual(await client.rewardStudents({ amount: 2 }), { ok: true, mode: 'local' });
  assert.deepEqual(await client.bulkImportStudents({ rows: [] }), { ok: true, mode: 'local' });
  assert.deepEqual(await client.listWallPosts(), { ok: true, mode: 'local' });
});

test('Supabase client sends teacher bulk import rows without touching GAS', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'hybrid',
    backendUrl: 'https://script.example/exec',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    requestRetryCount: 0
  }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, imported: 2, created: 1, updated: 1 }) };
  });

  const result = await client.bulkImportStudents({
    teacherId: 'et2322',
    defaultBranch: 'Demo Branch A',
    defaultClassName: '一年级A班',
    defaultTeacherId: 'cy1019',
    rows: [
      { studentId: '1234', studentName: '小明' },
      { id: 'CY0016', name: 'Student D', branch: 'Demo Branch C', className: 'A班', teacherId: 'CY0002' }
    ]
  });
  const body = JSON.parse(calls[0].init.body);

  assert.deepEqual(result, { ok: true, source: 'supabase', imported: 2, created: 1, updated: 1 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://project.supabase.co/functions/v1/cy-pets-api');
  assert.equal(body.action, 'bulkImportStudents');
  assert.equal(body.teacherId, 'CY0000');
  assert.equal(body.defaultBranch, 'Demo Branch A');
  assert.equal(body.defaultClassName, '一年级A班');
  assert.equal(body.defaultTeacherId, 'CY0004');
  assert.deepEqual(body.rows, [
    { studentId: '1234', studentName: '小明' },
    { id: 'CY0016', name: 'Student D', branch: 'Demo Branch C', className: 'A班', teacherId: 'CY0002' }
  ]);
});

test('GAS client can persist student purchases and pet state', async () => {
  const calls = [];
  const client = createClient({ backendMode: 'gas', backendUrl: 'https://script.example/exec' }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, text: async () => JSON.stringify({ ok: true, student: { studentId: 'DEMO001', coins: '55' } }) };
  });

  const result = await client.saveStudentState(
    { studentId: 'demo001', coins: 55, ownedPets: ['sunny-wing', 'sprouty'] },
    { type: 'purchasePet', petId: 'sprouty', price: 45 }
  );
  const body = JSON.parse(calls[0].init.body);

  assert.equal(result.ok, true);
  assert.equal(body.action, 'saveStudentState');
  assert.equal(body.studentId, 'DEMO001');
  assert.deepEqual(body.student.ownedPets, ['sunny-wing', 'sprouty']);
  assert.deepEqual(body.event, { type: 'purchasePet', petId: 'sprouty', price: 45 });
});

test('GAS client can persist message wall posts, likes and preset comments', async () => {
  const calls = [];
  const client = createClient({ backendMode: 'gas', backendUrl: 'https://script.example/exec' }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, text: async () => JSON.stringify({ ok: true }) };
  });

  await client.createWallPost({
    studentId: 'demo001',
    studentName: '小明',
    message: '我的宠物进化了！',
    petType: 'sunny-wing',
    combatPower: 1234,
    petStats: { hp: 100, attack: 20, defense: 10, speed: 15, luck: 8 },
    equipment: [{ itemId: 'sunny-wing-exclusive-01', name: '晨光羽冠', slotLabel: '头部' }]
  });
  await client.likeWallPost('post-1', 'demo001');
  await client.commentWallPost('post-1', { studentId: 'demo001', studentName: '小明', text: '太帅了吧！' });

  const bodies = calls.map(call => JSON.parse(call.init.body));
  assert.deepEqual(bodies.map(body => body.action), ['createWallPost', 'likeWallPost', 'commentWallPost']);
  assert.equal(bodies[0].post.studentId, 'DEMO001');
  assert.equal(bodies[0].post.message, '我的宠物进化了！');
  assert.deepEqual(bodies[0].post.petStats, { hp: 100, attack: 20, defense: 10, speed: 15, luck: 8 });
  assert.deepEqual(bodies[0].post.equipment, [{ itemId: 'sunny-wing-exclusive-01', name: '晨光羽冠', slotLabel: '头部' }]);
  assert.equal(bodies[1].postId, 'post-1');
  assert.equal(bodies[1].studentId, 'DEMO001');
  assert.equal(bodies[2].postId, 'post-1');
  assert.equal(bodies[2].comment.studentId, 'DEMO001');
  assert.equal(bodies[2].comment.text, '太帅了吧！');
});

test('Supabase client can request joining a room by owner id without entering it', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://project.functions.supabase.co/cy-pets-api',
    supabaseAnonKey: 'anon-key'
  }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, text: async () => JSON.stringify({ ok: true, pendingApproval: true }) };
  });

  await client.requestRoomJoin('cy1234', 'cy5678');

  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.action, 'requestRoomJoin');
  assert.equal(body.studentId, 'CY1234');
  assert.equal(body.roomOwnerStudentId, 'CY0016');
});

test('hybrid backend prefers Supabase and uses JSON auth headers', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'hybrid',
    backendUrl: 'https://script.example/exec',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key'
  }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, student: { studentId: 'CY0015', coins: 77 }, classes: [] }) };
  });

  const result = await client.getStudent('cy8868', { includeClasses: false });
  const body = JSON.parse(calls[0].init.body);

  assert.equal(result.ok, true);
  assert.equal(result.source, 'supabase');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://project.supabase.co/functions/v1/cy-pets-api');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.headers.apikey, 'anon-key');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer anon-key');
  assert.equal(body.action, 'getStudent');
  assert.equal(body.studentId, 'CY0015');
  assert.equal(body.includeClasses, false);
});

test('interaction heartbeat keeps backend action separate from player movement action', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key'
  }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, room: { roomId: 'ROOM123456' }, players: [] }) };
  });

  const result = await client.heartbeatInteractionRoom({
    studentId: 'et2322',
    roomId: 'room123456',
    mapId: 'home',
    action: 'walk'
  });
  const body = JSON.parse(calls[0].init.body);

  assert.equal(result.ok, true);
  assert.equal(calls[0].url, '/api/redis-room');
  assert.equal(body.action, 'heartbeat');
  assert.equal(body.playerAction, 'walk');
  assert.equal(body.studentId, 'CY0000');
  assert.equal(body.roomId, 'ROOM123456');
});

test('interaction room actions use the Redis room API before the permanent backend', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    interactionRoomApiUrl: '/api/redis-room'
  }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, source: 'redis-room', rooms: [] }) };
  });

  const result = await client.listInteractionRooms('et2322');
  const body = JSON.parse(calls[0].init.body);

  assert.equal(result.ok, true);
  assert.equal(result.source, 'redis-room');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/redis-room');
  assert.equal(body.action, 'listRooms');
  assert.equal(body.studentId, 'CY0000');
});

test('friend interaction room lookup uses the Redis room API first', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    interactionRoomApiUrl: '/api/redis-room'
  }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, source: 'redis-room', friendRooms: [] }) };
  });

  const result = await client.listFriendInteractionRooms('et2322', ['cy8868', ' cy8868 ', 'cy9657', '']);
  const body = JSON.parse(calls[0].init.body);

  assert.equal(result.ok, true);
  assert.equal(result.source, 'redis-room');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/redis-room');
  assert.equal(body.action, 'listFriendRooms');
  assert.equal(body.studentId, 'CY0000');
  assert.deepEqual(body.friendIds, ['CY0015', 'CY0005']);
});

test('friend interaction room lookup falls back to the permanent backend', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    interactionRoomApiUrl: '/api/redis-room',
    requestRetryCount: 0
  }, async (url, init) => {
    calls.push({ url, init });
    if (url === '/api/redis-room') {
      return { ok: false, status: 503, text: async () => JSON.stringify({ ok: false, retryable: true, fallbackAllowed: true }) };
    }
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, source: 'supabase', friendRooms: [{ friendStudentId: 'CY0015' }] }) };
  });

  const result = await client.listFriendInteractionRooms('et2322', ['cy8868']);
  const redisBody = JSON.parse(calls[0].init.body);
  const supabaseBody = JSON.parse(calls[1].init.body);

  assert.equal(result.ok, true);
  assert.equal(result.fallbackFrom, 'redis-room');
  assert.equal(calls.length, 2);
  assert.equal(redisBody.action, 'listFriendRooms');
  assert.equal(supabaseBody.action, 'listFriendInteractionRooms');
  assert.deepEqual(supabaseBody.friendIds, ['CY0015']);
});

test('interaction room actions fall back when the Redis room API is temporarily unavailable', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    interactionRoomApiUrl: '/api/redis-room',
    requestRetryCount: 0
  }, async (url, init) => {
    calls.push({ url, init });
    if (url === '/api/redis-room') {
      return { ok: false, status: 503, text: async () => JSON.stringify({ ok: false, retryable: true, fallbackAllowed: true }) };
    }
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, source: 'supabase', rooms: [{ roomId: 'ROOM123456' }] }) };
  });

  const result = await client.listInteractionRooms('et2322');
  const redisBody = JSON.parse(calls[0].init.body);
  const supabaseBody = JSON.parse(calls[1].init.body);

  assert.equal(result.ok, true);
  assert.equal(result.fallbackFrom, 'redis-room');
  assert.equal(calls.length, 2);
  assert.equal(redisBody.action, 'listRooms');
  assert.equal(supabaseBody.action, 'listInteractionRooms');
});

test('interaction room client skips the fast room API briefly after server-side Supabase fallback', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    interactionRoomApiUrl: '/api/redis-room',
    requestRetryCount: 0
  }, async (url, init) => {
    calls.push({ url, init });
    if (url === '/api/redis-room') {
      return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, source: 'supabase', fallbackFrom: 'redis-room', rooms: [] }) };
    }
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, source: 'supabase', rooms: [{ roomId: 'MKPRIMARY' }] }) };
  });

  const first = await client.listInteractionRooms('et2322');
  const second = await client.listInteractionRooms('et2322');
  const firstBody = JSON.parse(calls[0].init.body);
  const secondBody = JSON.parse(calls[1].init.body);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, '/api/redis-room');
  assert.equal(calls[1].url, 'https://project.supabase.co/functions/v1/cy-pets-api');
  assert.equal(firstBody.action, 'listRooms');
  assert.equal(secondBody.action, 'listInteractionRooms');
});

test('hybrid backend falls back to GAS when Supabase is temporarily unavailable', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'hybrid',
    backendUrl: 'https://script.example/exec',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    requestRetryCount: 0
  }, async (url, init) => {
    calls.push({ url, init });
    if (url.includes('supabase.co')) {
      return { ok: false, status: 503, text: async () => JSON.stringify({ ok: false, error: 'maintenance' }) };
    }
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, student: { studentId: 'CY0015', coins: 66 }, classes: [] }) };
  });

  const result = await client.getStudent('cy8868');
  const supabaseBody = JSON.parse(calls[0].init.body);
  const gasBody = JSON.parse(calls[1].init.body);

  assert.equal(result.ok, true);
  assert.equal(result.fallbackFrom, 'supabase');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, 'https://project.supabase.co/functions/v1/cy-pets-api');
  assert.equal(calls[1].url, 'https://script.example/exec');
  assert.equal(supabaseBody.action, 'getStudent');
  assert.equal(gasBody.action, 'getStudent');
  assert.equal(gasBody.studentId, 'CY0015');
});

test('hybrid backend falls back to GAS when Supabase function returns an internal function error', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'hybrid',
    backendUrl: 'https://script.example/exec',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    requestRetryCount: 0
  }, async (url, init) => {
    calls.push({ url, init });
    if (url.includes('supabase.co')) {
      return { ok: true, status: 200, text: async () => JSON.stringify({ ok: false, errorCode: 'SUPABASE_FUNCTION_ERROR', error: 'JWT issued at future' }) };
    }
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, student: { studentId: 'CY0000', coins: 3636 }, classes: [] }) };
  });

  const result = await client.getStudent('et2322');

  assert.equal(result.ok, true);
  assert.equal(result.fallbackFrom, 'supabase');
  assert.equal(result.student.studentId, 'CY0000');
  assert.equal(result.student.coins, 3636);
  assert.equal(calls.length, 2);
});

test('Supabase client retries transient PostgREST JWT clock skew errors from function bodies', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    requestRetryCount: 1,
    requestRetryDelayMs: 1
  }, async (url, init) => {
    calls.push({ url, init });
    if (calls.length === 1) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          ok: false,
          retryable: false,
          errorCode: 'SUPABASE_FUNCTION_ERROR',
          error: '{"code":"PGRST303","message":"JWT issued at future"}'
        })
      };
    }
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true, student: { studentId: 'CY9884' }, classes: [] })
    };
  });

  const result = await client.getStudent('cy9884');

  assert.equal(result.ok, true);
  assert.equal(result.student.studentId, 'CY9884');
  assert.equal(calls.length, 2);
});

test('hybrid backend can explicitly refresh a student from GAS for the manual Sheet sync button', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'hybrid',
    backendUrl: 'https://script.example/exec',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key'
  }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true, student: { studentId: 'CY0015', coins: 99 }, classes: [] }) };
  });

  const result = await client.getStudentFromGas('cy8868', { includeClasses: false });
  const body = JSON.parse(calls[0].init.body);

  assert.equal(result.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://script.example/exec');
  assert.equal(body.action, 'getStudent');
  assert.equal(body.studentId, 'CY0015');
  assert.equal(body.includeClasses, false);
});

test('supabase-only backend reports business errors without falling back', async () => {
  const calls = [];
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key',
    requestRetryCount: 0
  }, async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => JSON.stringify({ ok: false, error: 'Student ID not found' }) };
  });

  const result = await client.getStudent('missing');

  assert.equal(result.ok, false);
  assert.equal(result.error, 'Student ID not found');
  assert.equal(calls.length, 1);
});

test('backend mode helpers recognize hybrid Supabase and GAS availability', () => {
  const config = {
    backendMode: 'hybrid',
    backendUrl: 'https://script.example/exec',
    supabaseFunctionUrl: 'https://project.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'anon-key'
  };

  assert.equal(isSupabaseMode(config), true);
  assert.equal(isGasMode(config), true);
  assert.equal(isSupabaseMode({ backendMode: 'hybrid', backendUrl: config.backendUrl }), false);
});
