const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const indexSource = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
const clientSource = fs.readFileSync(path.join(projectRoot, 'backend-client.js'), 'utf8');
const cssSource = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');
const functionSource = fs.readFileSync(path.join(projectRoot, 'supabase', 'functions', 'cy-pets-api', 'index.ts'), 'utf8');
const redisRoomSource = fs.readFileSync(path.join(projectRoot, 'api', 'redis-room.js'), 'utf8');

function sourceBetween(start, end, source = appSource) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing start marker ${start}`);
  assert.notEqual(endIndex, -1, `missing end marker ${end}`);
  return source.slice(startIndex, endIndex);
}

function extractAppFunction(name) {
  let start = appSource.indexOf(`function ${name}`);
  assert.notEqual(start, -1, `missing function ${name}`);
  if (appSource.slice(start - 6, start) === 'async ') start -= 6;
  const braceStart = appSource.indexOf('{', start);
  let depth = 0;
  for (let index = braceStart; index < appSource.length; index += 1) {
    if (appSource[index] === '{') depth += 1;
    if (appSource[index] === '}') depth -= 1;
    if (depth === 0) return appSource.slice(start, index + 1);
  }
  throw new Error(`could not extract function ${name}`);
}

test('Supabase function exposes friend and gift actions', () => {
  [
    'searchFriends',
    'sendFriendRequest',
    'respondFriendRequest',
    'listFriends',
    'getFriendProfile',
    'listNotifications',
	    'sendGift',
	    'sendBlindBoxDuplicateGift',
	    'claimGift',
	    'markNotificationRead',
	    'clearReadNotifications',
	    'listFriendInteractionRooms'
	  ].forEach(action => {
    assert.match(functionSource, new RegExp(`action === '${action}'`));
  });
  assert.match(functionSource, /function makeFriendPair\(firstId: string, secondId: string\)/);
  assert.match(functionSource, /async function isAcceptedFriend\(studentId: string, friendId: string\)/);
  assert.match(functionSource, /gift_type: 'coins'/);
  assert.match(functionSource, /status: 'claimed'/);
  assert.match(functionSource, /'marvel-the-avengers'/);
  assert.doesNotMatch(functionSource, /'marvel-infinity-war'/);
  assert.match(functionSource, /'marvel-sunflower-spider-verse'/);
});

test('frontend and client include social contracts', () => {
  assert.match(clientSource, /searchFriends\(studentId, query\)/);
  assert.match(clientSource, /sendFriendRequest\(requesterStudentId, receiverStudentId\)/);
  assert.match(clientSource, /respondFriendRequest\(studentId, requestId, response\)/);
	  assert.match(clientSource, /sendGift\(payload = \{\}\)/);
	  assert.match(clientSource, /claimGift\(studentId, giftId\)/);
	  assert.match(clientSource, /clearReadNotifications\(studentId\)/);
	  assert.match(clientSource, /listFriendInteractionRooms\(studentId, friendIds = \[\]\)/);
	  assert.match(appSource, /const friendState = \{/);
	  assert.match(appSource, /function renderFriendsView\(\)/);
	  assert.match(appSource, /function openGiftModal\(friendId\)/);
	  assert.match(appSource, /async function joinFriendInteractionRoom\(friendId\)/);
});

test('teacher old account aliases stay aligned across backends', () => {
  [clientSource, functionSource, redisRoomSource].forEach(source => {
    assert.match(source, /replace\(\s*\/\[\^A-Z0-9\]\/g,\s*''\s*\)/);
    assert.match(source, /CY1009:\s*'CY0012'/);
    assert.match(source, /CY1008:\s*'CY0011'/);
    assert.match(source, /CY1010:\s*'CY0014'/);
    assert.match(source, /CY0002:\s*'Teacher B'/);
    assert.match(source, /CY0013:\s*'Teacher F'/);
  });
});

test('interaction room head labels use pet name plus player name for everyone', () => {
  assert.match(appSource, /function getInteractionRoomHeadNameParts\(petName = '', playerName = ''\)/);
  assert.match(sourceBetween('function getInteractionRoomHeadNameParts', 'function formatInteractionRoomHeadName'), /playerName:\s*\(!cleanPlayerName \|\| sameInteractionRoomPublicName\(cleanPetName,\s*cleanPlayerName\)\) \? '' : `（\$\{cleanPlayerName\}）`/);
  assert.match(appSource, /function formatInteractionRoomHeadName\(petName = '', playerName = ''\)/);
  assert.match(sourceBetween('function formatInteractionRoomHeadName', 'function getInteractionRoomPlayerPetDisplayName'), /return getInteractionRoomHeadNameParts\(petName,\s*playerName\)\.petName/);
  assert.match(appSource, /function getInteractionRoomPlayerHeadName\(player = \{\}\)/);
  assert.match(appSource, /function getInteractionRoomPlayerHeadParts\(player = \{\}\)/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /const headName = getInteractionRoomPlayerHeadParts\(remote\)/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /drawKuromiRoomLabel\(ctx,\s*headName\.petName/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /subtext:\s*headName\.playerName/);
  assert.match(sourceBetween('function drawKuromiRoomHud', 'function drawKuromiRoomScene'), /const headName = getInteractionRoomHeadNameParts\(/);
  assert.match(sourceBetween('function drawKuromiRoomHud', 'function drawKuromiRoomScene'), /drawKuromiRoomLabel\(ctx,\s*headName\.petName/);
  assert.match(sourceBetween('function drawKuromiRoomHud', 'function drawKuromiRoomScene'), /subtext:\s*headName\.playerName/);
  assert.match(sourceBetween('function getInteractionRoomPresencePayload', 'function getInteractionRoomHeartbeatPayload'), /petName:\s*getPetNickname\(student,\s*petId\)\s*\|\|\s*getPetInfo\(petId\)\?\.name\s*\|\|\s*''/);
  assert.match(sourceBetween('function normalizeRoomPlayerSummary', 'function normalizeRoomMeta', redisRoomSource), /petName:\s*normalizeRoomPetName\(player\.petName \|\| player\.pet_name,\s*studentId,\s*studentName\)/);
  assert.match(sourceBetween('function buildPlayerSnapshot', 'async function readBody', redisRoomSource), /petName:\s*normalizeRoomPetName\(body\.petName \|\| body\.pet_name,\s*studentId,\s*studentName\)/);
  assert.match(sourceBetween('async function getInteractionProfile', 'function fromInteractionRoomRow', functionSource), /petName:\s*normalizeInteractionPetName\(/);
  assert.match(sourceBetween('function fromInteractionPlayerRows', 'async function cleanupInteractionRooms', functionSource), /petName:\s*normalizeInteractionPetName\(row\.pet_name,\s*studentId,\s*studentName\)/);
  assert.match(sourceBetween('async function heartbeatInteractionRoom', 'async function leaveInteractionRoom', functionSource), /pet_name:\s*normalizeInteractionPetName\(payload\.petName \|\| payload\.pet_name,\s*studentId,\s*studentName\)/);
});

test('interaction room lets every player choose a shared room pet size', () => {
  assert.match(appSource, /function getInteractionRoomPlayerRenderScale\(player = getStudent\(\)\)/);
  assert.match(appSource, /const INTERACTION_ROOM_PET_SIZE_OPTIONS = \[/);
  assert.match(appSource, /id:\s*'small'[\s\S]*scale:\s*1/);
  assert.match(appSource, /id:\s*'big'[\s\S]*scale:\s*INTERACTION_ROOM_BIG_SIZE_SCALE/);
  assert.match(appSource, /id:\s*'super'[\s\S]*scale:\s*INTERACTION_ROOM_SUPER_SIZE_SCALE/);
  assert.match(appSource, /const INTERACTION_ROOM_MAX_RENDER_SCALE = 2\.8/);
  assert.match(appSource, /function renderInteractionRoomSizeSelector\(student = getStudent\(\)\)/);
  assert.match(appSource, /data-interaction-room-pet-size/);
  assert.match(appSource, /class="interaction-room-size-sample"/);
  assert.match(sourceBetween('function getInteractionRoomPresencePayload', 'function getInteractionRoomHeartbeatPayload'), /petSize:\s*getInteractionRoomSelectedPetSize\(student\)/);
  assert.match(sourceBetween('function getInteractionRoomHeartbeatSignature', 'function getInteractionRoomHeartbeatInterval'), /petSize:\s*String\(payload\.petSize \|\| ''\)/);
  assert.match(sourceBetween('function renderInteractionRoomLobby', 'const rooms = interactionRoomState.rooms'), /renderInteractionRoomSizeSelector\(student\)[\s\S]*renderInteractionRoomFriendQuickJoin\(student\)/);
  assert.match(sourceBetween("const interactionLobbyModeButton = event.target.closest('[data-interaction-lobby-mode]');", "const miniGameOpenButton = event.target.closest('[data-mini-game-open]');"), /data-interaction-room-pet-size/);
  assert.match(sourceBetween('function normalizeRoomPlayerSummary', 'function normalizeRoomMeta', redisRoomSource), /petSize:\s*normalizeRoomPetSize\(/);
  assert.match(sourceBetween('function buildPlayerSnapshot', 'async function readBody', redisRoomSource), /petSize:\s*normalizeRoomPetSize\(/);
  assert.match(sourceBetween('function fromInteractionPlayerRows', 'async function cleanupInteractionRooms', functionSource), /petSize:\s*normalizeInteractionPetSize\(row\.pet_size\)/);
  assert.match(sourceBetween('async function createInteractionRoom', 'async function joinInteractionRoom', functionSource), /pet_size:\s*petSize/);
  assert.match(sourceBetween('async function joinInteractionRoom', 'async function getInteractionRoom', functionSource), /pet_size:\s*petSize/);
  assert.match(sourceBetween('async function heartbeatInteractionRoom', 'async function leaveInteractionRoom', functionSource), /pet_size:\s*normalizeInteractionPetSize\(payload\.petSize \|\| payload\.pet_size\)/);
  assert.match(sourceBetween('function drawKuromiRoomPlayer', 'function drawInteractionRoomRemotePlayers'), /Math\.min\(INTERACTION_ROOM_MAX_RENDER_SCALE,\s*Number\(options\.scale \|\| 1\)\)/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /const renderScale = getInteractionRoomPlayerRenderScale\(remote\)/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /scale:\s*renderScale/);
  assert.match(sourceBetween('function drawKuromiRoomScene', 'function initKuromiRoomDemo'), /const localRenderScale = getInteractionRoomPlayerRenderScale\(player\)/);
  assert.match(sourceBetween('function drawKuromiRoomScene', 'function initKuromiRoomDemo'), /scale:\s*localRenderScale/);
});

test('interaction room shares pet evolution stage so final flying pets work for everyone', () => {
  assert.match(appSource, /const INTERACTION_ROOM_FINAL_FLYING_PET_IDS = new Set\(\['sunny-wing', 'hydroblob'\]\)/);
  assert.match(appSource, /function getInteractionRoomPetStage\(student = getStudent\(\), petId = student\?\.petType\)/);
  assert.match(sourceBetween('function getInteractionRoomPresencePayload', 'function getInteractionRoomHeartbeatPayload'), /petStage:\s*getInteractionRoomPetStage\(student,\s*petId\)/);
  assert.match(sourceBetween('function getInteractionRoomPresencePayload', 'function getInteractionRoomHeartbeatPayload'), /petStyle:\s*getInteractionRoomPetStyle\(student,\s*petId\)/);
  assert.match(sourceBetween('function getInteractionRoomHeartbeatSignature', 'function getInteractionRoomHeartbeatInterval'), /petStage:\s*String\(payload\.petStage \|\| ''\)/);
  assert.match(sourceBetween('function getInteractionRoomHeartbeatSignature', 'function getInteractionRoomHeartbeatInterval'), /petStyle:\s*String\(payload\.petStyle \|\| ''\)/);
  assert.match(sourceBetween('function normalizeInteractionRoomPlayer', 'function sameInteractionRoomPublicName'), /petStage:\s*normalizeInteractionRoomPetStage\(/);
  assert.match(sourceBetween('function normalizeInteractionRoomPlayer', 'function sameInteractionRoomPublicName'), /petStyle:\s*normalizeInteractionRoomPetStyle\(/);
  assert.match(sourceBetween('function syncKuromiRoomPlayerPetProfile', 'function createKuromiRoomKeys'), /const wasFlying = isInteractionRoomFlyingPet\(player\)/);
  assert.match(sourceBetween('function syncKuromiRoomPlayerPetProfile', 'function createKuromiRoomKeys'), /petChanged \|\| !wasFlying \|\| typeof player\.flightGrounded !== 'boolean'/);
  const spriteProfileSource = sourceBetween('function getKuromiRoomSpriteProfileForPet', 'function getKuromiRoomSpriteProfile');
  const finalSpritePathSource = sourceBetween('function makeKuromiRoomFinalSpritePathMap', 'function getKuromiRoomSpriteSources');
  assert.match(spriteProfileSource, /stage === 'final'/);
  assert.match(spriteProfileSource, /makeKuromiRoomFinalSpritePathMap\(fileName,\s*style\)/);
  assert.match(finalSpritePathSource, /const folder = normalizeInteractionRoomPetStyle\(styleValue\) === EVOLUTION_STYLE_CUTE \? 'cute-final' : 'final'/);
  assert.match(finalSpritePathSource, /assets\/8bit\/\$\{folder\}\/characters-idle\/\$\{fileName\}/);
  assert.match(spriteProfileSource, /idleSrcs:\s*getKuromiRoomSpriteSources\(stagePaths\.idleSrc,\s*heroicPaths\.idleSrc,\s*basePaths\.idleSrc\)/);
  assert.match(spriteProfileSource, /cacheKey:\s*getKuromiRoomSpriteCacheKey\(petId,\s*stage,\s*style\)/);
  assert.match(sourceBetween('function preloadInteractionRoomSprites', 'function getInteractionFriendRoomLookup'), /const petStyle = getInteractionRoomPlayerPetStyle\(player\)/);
  assert.match(sourceBetween('function preloadInteractionRoomSprites', 'function getInteractionFriendRoomLookup'), /const spriteCacheKey = getKuromiRoomSpriteCacheKey\(petId,\s*petStage,\s*petStyle\)/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /interactionRoomSpriteCache\.get\(spriteCacheKey\)/);
  assert.match(sourceBetween('function getMiniGamePetHeadProfile', 'async function loadMiniGamePetHead'), /const profile = getKuromiRoomSpriteProfile\(student\)/);
  assert.match(sourceBetween('function loadMiniGamePetSprites', 'function stopMiniGameLoop'), /const profile = getKuromiRoomSpriteProfile\(getStudent\(\)\)/);
  assert.match(sourceBetween('function loadMiniGamePetSprites', 'function stopMiniGameLoop'), /spritePetId === spriteCacheKey/);
  [
    ['function startReactionWheelGame', 'const FLAPPY_WIDTH'],
    ['function startFlappyMiniGame', 'function drawFlappyMiniGame'],
    ['function startJumpChargeMiniGame', 'function startJumpChargeMiniGameCharge'],
    ['function startRunnerMiniGame', 'function pressRunnerMiniGameJump']
  ].forEach(([start, end]) => {
    assert.match(sourceBetween(start, end), /loadMiniGamePetSprites\(\)/);
  });

  const settingsSource = sourceBetween(
    'const INTERACTION_ROOM_PET_RENDER_SETTINGS = {',
    'const KUROMI_ROOM_SPRITE_TRIM_CACHE'
  );
  assert.match(settingsSource, /mewtwo:\s*\{[^}]*floatOffset:\s*96[^}]*flying:\s*true/s);
  assert.doesNotMatch(settingsSource, /hydroblob:\s*\{/);
  assert.match(sourceBetween('function getInteractionRoomPetRenderSettings', 'function isInteractionRoomFlyingPet'), /INTERACTION_ROOM_FINAL_FLYING_PET_IDS\.has\(petId\)/);
  assert.match(sourceBetween('function getInteractionRoomPetRenderSettings', 'function isInteractionRoomFlyingPet'), /getInteractionRoomPlayerPetStage\(player\) === 'final'/);

  assert.match(sourceBetween('function normalizeRoomPlayerSummary', 'function normalizeRoomMeta', redisRoomSource), /petStage:\s*normalizeRoomPetStage\(/);
  assert.match(sourceBetween('function normalizeRoomPlayerSummary', 'function normalizeRoomMeta', redisRoomSource), /petStyle:\s*normalizeRoomPetStyle\(/);
  assert.match(sourceBetween('function buildPlayerSnapshot', 'async function readBody', redisRoomSource), /petStage:\s*normalizeRoomPetStage\(/);
  assert.match(sourceBetween('function buildPlayerSnapshot', 'async function readBody', redisRoomSource), /petStyle:\s*normalizeRoomPetStyle\(/);
  assert.match(sourceBetween('function getInteractionProfile', 'function fromInteractionRoomRow', functionSource), /petStage:\s*getInteractionPetStageFromStudent\(student,\s*petId\)/);
  assert.match(sourceBetween('function getInteractionProfile', 'function fromInteractionRoomRow', functionSource), /petStyle:\s*getInteractionPetStyleFromStudent\(student,\s*petId\)/);
  assert.match(sourceBetween('function fromInteractionPlayerRows', 'async function cleanupInteractionRooms', functionSource), /petStage:\s*normalizeInteractionPetStage\(row\.pet_stage\)/);
  assert.match(sourceBetween('function fromInteractionPlayerRows', 'async function cleanupInteractionRooms', functionSource), /petStyle:\s*normalizeInteractionPetStyle\(row\.pet_style\)/);
  assert.match(sourceBetween('async function createInteractionRoom', 'async function joinInteractionRoom', functionSource), /pet_stage:\s*normalizeInteractionPetStage\(payload\.petStage \|\| payload\.pet_stage \|\| profile\.petStage\)/);
  assert.match(sourceBetween('async function createInteractionRoom', 'async function joinInteractionRoom', functionSource), /pet_style:\s*normalizeInteractionPetStyle\(payload\.petStyle \|\| payload\.pet_style \|\| payload\.evolutionStyle \|\| payload\.evolution_style \|\| profile\.petStyle\)/);
  assert.match(sourceBetween('async function joinInteractionRoom', 'async function getInteractionRoom', functionSource), /pet_stage:\s*normalizeInteractionPetStage\(payload\.petStage \|\| payload\.pet_stage \|\| profile\.petStage\)/);
  assert.match(sourceBetween('async function joinInteractionRoom', 'async function getInteractionRoom', functionSource), /pet_style:\s*normalizeInteractionPetStyle\(payload\.petStyle \|\| payload\.pet_style \|\| payload\.evolutionStyle \|\| payload\.evolution_style \|\| profile\.petStyle\)/);
  assert.match(sourceBetween('async function heartbeatInteractionRoom', 'async function leaveInteractionRoom', functionSource), /pet_stage:\s*normalizeInteractionPetStage\(payload\.petStage \|\| payload\.pet_stage\)/);
  assert.match(sourceBetween('async function heartbeatInteractionRoom', 'async function leaveInteractionRoom', functionSource), /pet_style:\s*normalizeInteractionPetStyle\(payload\.petStyle \|\| payload\.pet_style \|\| payload\.evolutionStyle \|\| payload\.evolution_style\)/);
});

test('interaction room lobby keeps permanent entrances while the backend recovers', () => {
  assert.match(appSource, /const PERMANENT_INTERACTION_ROOM_FALLBACKS = \[/);
  ['MKPRIMARY', 'STPPRIMARY', 'CYMEET2026', 'WSPRIMARY', 'LEARNERS2026'].forEach(roomId => {
    assert.match(appSource, new RegExp(`roomId:\\s*'${roomId}'`));
  });
  assert.match(appSource, /mapSetId:\s*'paris-trip'/);
  assert.match(appSource, /mapSetId:\s*'xian-trip'/);
  assert.match(appSource, /mapSetId:\s*'cy-school'/);
  assert.match(appSource, /mapSetId:\s*'uk-trip'/);
  assert.match(appSource, /mapSetId:\s*'beijing-trip'/);
  assert.match(appSource, /function applyPermanentInteractionRoomFallbackConfig\(room = \{\}\)/);
  assert.match(appSource, /function mergeInteractionRoomFallbackRooms\(rooms = \[\]\)/);
  const loadRoomsSource = sourceBetween('async function loadInteractionRooms', 'function isInteractionRoomLobbyInputActive');
  assert.match(loadRoomsSource, /interactionRoomState\.rooms = mergeInteractionRoomFallbackRooms\(result\.rooms \|\| \[\]\)/);
  assert.match(loadRoomsSource, /interactionRoomState\.roomsRecovering = false/);
  assert.match(loadRoomsSource, /interactionRoomState\.roomsRecovering = true/);
  assert.match(loadRoomsSource, /interactionRoomState\.rooms = mergeInteractionRoomFallbackRooms\(interactionRoomState\.rooms\)/);
  assert.match(sourceBetween('function renderInteractionRoomLobby', 'function setInteractionRoomLobbyMode'), /interaction-room-recovery-banner/);
});

test('interaction room role presets keep normal size until a player chooses a size', () => {
  const settingsSource = sourceBetween(
    'const INTERACTION_ROOM_PET_RENDER_SETTINGS = {',
    'const KUROMI_ROOM_SPRITE_TRIM_CACHE'
  );
  const configuredIds = Array
    .from(settingsSource.matchAll(/['"]?([a-z][a-z0-9-]+)['"]?:\s*\{/g))
    .map(match => match[1])
    .sort();
  assert.deepEqual(configuredIds, [
    'charizard',
    'enderdragon',
    'enderman',
    'mewtwo',
    'shadow-wing',
    'thunder-beetle'
  ]);
  assert.match(settingsSource, /'shadow-wing':\s*\{[^}]*floatOffset:\s*88[^}]*flying:\s*true/s);
  assert.match(settingsSource, /'thunder-beetle':\s*\{[^}]*floatOffset:\s*90[^}]*flying:\s*true/s);
  assert.match(settingsSource, /mewtwo:\s*\{[^}]*floatOffset:\s*96[^}]*flying:\s*true/s);
  assert.match(settingsSource, /charizard:\s*\{[^}]*floatOffset:\s*96[^}]*flying:\s*true/s);
  assert.match(settingsSource, /enderman:\s*\{[^}]*floatOffset:\s*112[^}]*flying:\s*true[^}]*alwaysFloating:\s*true[^}]*hoverTilt:\s*0\.11/s);
  assert.match(settingsSource, /enderdragon:\s*\{[^}]*floatOffset:\s*112[^}]*flying:\s*true/s);
  assert.doesNotMatch(settingsSource, /scale:/);
  assert.doesNotMatch(appSource, /INTERACTION_ROOM_GIANT_STUDENT_IDS/);
  assert.match(appSource, /const INTERACTION_ROOM_BIG_SIZE_SCALE = 2\.25/);
  assert.match(appSource, /const INTERACTION_ROOM_SUPER_SIZE_SCALE = 2\.7/);
  assert.match(sourceBetween('function getInteractionRoomPlayerRenderScale', 'function getInteractionRoomPlayerFloatOffset'), /const sizeOption = getInteractionRoomPetSizeOption\(getInteractionRoomPlayerPetSize\(player\)\)/);
  assert.match(sourceBetween('function getInteractionRoomPlayerRenderScale', 'function getInteractionRoomPlayerFloatOffset'), /Math\.max\(Number\(sizeOption\.scale \|\| 1\),\s*Number\(petSettings\.scale \|\| 1\)\)/);
  assert.match(appSource, /function getKuromiRoomSpriteTrimBounds\(image\)/);
  assert.match(sourceBetween('function drawKuromiRoomPlayer', 'function drawInteractionRoomRemotePlayers'), /const footAnchorOffset = sprite && sprite\.height \? \(spriteTrimBounds\.bottomInset \/ sprite\.height\) \* height : 0/);
  assert.match(sourceBetween('function drawKuromiRoomPlayer', 'function drawInteractionRoomRemotePlayers'), /const drawBaseY = player\.y \+ baseHeight - lift \+ footAnchorOffset - renderFloatOffset \+ floatBob/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /const renderFloatOffset = getInteractionRoomPlayerFloatOffset\(remote,\s*action,\s*groundY,\s*renderScale\)/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /floatOffset:\s*renderFloatOffset/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /const labelY = getKuromiRoomPlayerLabelY\(playerBounds,\s*displayY - 12\)/);
  assert.match(sourceBetween('function drawKuromiRoomScene', 'function initKuromiRoomDemo'), /const localRenderFloatOffset = getInteractionRoomPlayerFloatOffset\(player,\s*localAction,\s*map\.groundY,\s*localRenderScale\)/);
  assert.match(sourceBetween('function drawKuromiRoomScene', 'function initKuromiRoomDemo'), /floatOffset:\s*localRenderFloatOffset/);
  assert.match(sourceBetween('function drawKuromiRoomScene', 'function initKuromiRoomDemo'), /const screenY = player\.y - getKuromiRoomPlayerHeight\(player\) \* Math\.max\(0,\s*localRenderScale - 1\) - localRenderFloatOffset/);
});

test('flying interaction room pets use air and ground lines instead of normal jumps', () => {
  const playerDrawSource = sourceBetween('function drawKuromiRoomPlayer', 'function drawInteractionRoomRemotePlayers');
  assert.match(appSource, /function isInteractionRoomFlyingPet\(player = getStudent\(\)\)/);
  assert.match(appSource, /function isInteractionRoomAlwaysFloatingPet\(player = getStudent\(\)\)/);
  assert.match(appSource, /function setKuromiRoomFlightGrounded\(player,\s*grounded,\s*groundY = KUROMI_ROOM_DEMO\.fallbackGroundY\)/);
  assert.match(sourceBetween('function setKuromiRoomDuck', 'function startKuromiRoomJump'), /if \(petSettings\.flying && petSettings\.alwaysFloating\) \{[\s\S]*player\.flightGrounded = false[\s\S]*player\.ducking = Boolean\(ducking\)[\s\S]*return;[\s\S]*\}/);
  assert.match(sourceBetween('function setKuromiRoomDuck', 'function startKuromiRoomJump'), /if \(petSettings\.flying && player\.flightGrounded === false\) \{[\s\S]*setKuromiRoomFlightGrounded\(player,\s*true,\s*groundY\);[\s\S]*return;[\s\S]*\}/);
  assert.match(sourceBetween('function setKuromiRoomDuck', 'function startKuromiRoomJump'), /player\.duckHeld = ducking/);
  assert.match(sourceBetween('function startKuromiRoomJump', 'function mapKuromiRoomKeyboardKey'), /if \(isInteractionRoomFlyingPet\(player\)\) \{[\s\S]*setKuromiRoomFlightGrounded\(player,\s*false,\s*getKuromiRoomActiveGroundY\(kuromiRoomDemoState\)\);[\s\S]*return;[\s\S]*\}/);
  assert.match(sourceBetween('function getKuromiRoomPlayerAction', 'function getKuromiRoomPlayerHeight'), /if \(isInteractionRoomAlwaysFloatingPet\(player\) && Math\.abs\(Number\(player\?\.velocityX \|\| 0\)\) > KUROMI_ROOM_DEMO\.walkingVelocityThreshold\) return 'walk'/);
  assert.match(sourceBetween('function getKuromiRoomPlayerAction', 'function getKuromiRoomPlayerHeight'), /if \(player\?\.flightGrounded === false\) return 'fly'/);
  assert.match(playerDrawSource, /const flyingSprite = action === 'fly'/);
  assert.match(playerDrawSource, /const alwaysFloating = Boolean\(options\.alwaysFloating\)/);
  assert.match(playerDrawSource, /const hoverGlide = alwaysFloating && walking/);
  assert.match(playerDrawSource, /hoverTilt/);
  assert.match(playerDrawSource, /flyingSprite[\s\S]*\? \(sprites\.run \|\| sprites\.jump \|\| sprites\.idle\)/);
  assert.match(playerDrawSource, /flyingSprite[\s\S]*\? \(sprites\.runLeft \|\| sprites\.jumpLeft \|\| sprites\.idleLeft\)/);
  assert.match(sourceBetween('function getInteractionRoomHeartbeatPayload', 'function getInteractionRoomHeartbeatSignature'), /playerAction:\s*action/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /const renderFloatOffset = getInteractionRoomPlayerFloatOffset\(remote,\s*action,\s*groundY,\s*renderScale\)/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /onGround:\s*isInteractionRoomAlwaysFloatingPet\(remote\) \? true : action !== 'jump' && action !== 'fly'/);
});

test('flying interaction room pets hover at the upper flight line instead of the normal jump height', () => {
  const floatOffsetSource = sourceBetween('function getInteractionRoomPlayerFloatOffset', 'function getInteractionRoomHeadNameParts');
  assert.match(appSource, /const INTERACTION_ROOM_FLY_HEIGHT_RATIO = 0\.75/);
  assert.match(appSource, /const INTERACTION_ROOM_MAX_FLOAT_OFFSET = 320/);
  assert.match(floatOffsetSource, /groundY = KUROMI_ROOM_DEMO\.fallbackGroundY/);
  assert.match(floatOffsetSource, /renderScale = getInteractionRoomPlayerRenderScale\(player\)/);
  assert.match(floatOffsetSource, /const flyCenterY = safeGroundY \* \(1 - INTERACTION_ROOM_FLY_HEIGHT_RATIO\)/);
  assert.match(floatOffsetSource, /const flyHeightOffset = safeGroundY - flyCenterY - \(getKuromiRoomActionHeight\('fly'\) \* safeRenderScale\) \/ 2/);
  assert.match(floatOffsetSource, /Math\.max\(configuredFloatOffset,\s*flyHeightOffset\)/);
  assert.doesNotMatch(floatOffsetSource, /Math\.min\(160/);
  assert.match(sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect'), /const renderFloatOffset = getInteractionRoomPlayerFloatOffset\(remote,\s*action,\s*groundY,\s*renderScale\)/);
  assert.match(sourceBetween('function drawKuromiRoomScene', 'function initKuromiRoomDemo'), /const localRenderFloatOffset = getInteractionRoomPlayerFloatOffset\(player,\s*localAction,\s*map\.groundY,\s*localRenderScale\)/);
});

test('interaction room name labels stay by the head while flying speech stays on the body', () => {
  const playerDrawSource = sourceBetween('function drawKuromiRoomPlayer', 'function drawInteractionRoomRemotePlayers');
  const remoteDrawSource = sourceBetween('visiblePlayers.forEach', 'function drawKuromiRoomRoundedRect');
  const hudDrawSource = sourceBetween('function drawKuromiRoomHud', 'function drawKuromiRoomScene');
  const sceneDrawSource = sourceBetween('function drawKuromiRoomScene', 'function initKuromiRoomDemo');
  assert.match(appSource, /const INTERACTION_ROOM_LABEL_GAP = 6/);
  assert.match(appSource, /const INTERACTION_ROOM_MIN_LABEL_Y = 52/);
  assert.match(appSource, /const INTERACTION_ROOM_SPEECH_BUBBLE_GAP = 8/);
  assert.match(appSource, /const INTERACTION_ROOM_FLYING_SPEECH_BODY_RATIO = 0\.64/);
  assert.match(playerDrawSource, /const spriteTrimBounds = sprite \? getKuromiRoomSpriteTrimBounds\(sprite\) : null/);
  assert.match(playerDrawSource, /const visibleTopOffset = sprite && sprite\.height \? \(spriteTrimBounds\.topInset \/ sprite\.height\) \* height : 0/);
  assert.match(playerDrawSource, /const visibleBottomOffset = sprite && sprite\.height \? \(spriteTrimBounds\.bottomInset \/ sprite\.height\) \* height : 0/);
  assert.match(playerDrawSource, /visibleTopY:\s*drawBaseY - height \+ visibleTopOffset/);
  assert.match(playerDrawSource, /visibleBottomY:\s*drawBaseY - visibleBottomOffset/);
  assert.match(playerDrawSource, /flying:\s*action === 'fly' \|\| Boolean\(options\.flying\)/);
  assert.match(appSource, /function getKuromiRoomPlayerLabelY\(playerBounds,\s*fallbackY = INTERACTION_ROOM_MIN_LABEL_Y\)/);
  assert.match(appSource, /function getKuromiRoomSpeechBubbleY\(labelY,\s*playerBounds = null\)/);
  assert.match(sourceBetween('function getKuromiRoomSpeechBubbleY', 'function drawKuromiRoomHud'), /if \(playerBounds\?\.flying\)/);
  assert.match(sourceBetween('function getKuromiRoomSpeechBubbleY', 'function drawKuromiRoomHud'), /visibleTopY/);
  assert.match(sourceBetween('function getKuromiRoomSpeechBubbleY', 'function drawKuromiRoomHud'), /visibleBottomY/);
  assert.match(sourceBetween('function getKuromiRoomSpeechBubbleY', 'function drawKuromiRoomHud'), /INTERACTION_ROOM_FLYING_SPEECH_BODY_RATIO/);
  assert.match(remoteDrawSource, /const playerBounds = drawKuromiRoomPlayer\(ctx,\s*remotePlayer/);
  assert.match(remoteDrawSource, /const labelY = getKuromiRoomPlayerLabelY\(playerBounds,\s*displayY - 12\)/);
  assert.match(remoteDrawSource, /const speechBubbleY = getKuromiRoomSpeechBubbleY\(labelY,\s*playerBounds\)/);
  assert.match(remoteDrawSource, /drawKuromiRoomLabel\(ctx,\s*remote\.message,\s*displayX,\s*speechBubbleY/);
  assert.doesNotMatch(remoteDrawSource, /displayY - height \* Math\.max\(0,\s*renderScale - 1\) - renderFloatOffset - 12/);
  assert.doesNotMatch(remoteDrawSource, /labelY - 42/);
  assert.match(hudDrawSource, /const speechBubbleY = getKuromiRoomSpeechBubbleY\(labelY,\s*options\.playerBounds\)/);
  assert.match(hudDrawSource, /drawKuromiRoomLabel\(ctx,\s*state\.bubbleText,\s*screenX,\s*speechBubbleY/);
  assert.doesNotMatch(hudDrawSource, /screenY - 54/);
  assert.match(sceneDrawSource, /const localPlayerBounds = drawKuromiRoomPlayer\(ctx,\s*player/);
  assert.match(sceneDrawSource, /const fallbackLabelY = player\.y - getKuromiRoomPlayerHeight\(player\) \* Math\.max\(0,\s*localRenderScale - 1\) - localRenderFloatOffset - 12/);
  assert.match(sceneDrawSource, /const localLabelY = getKuromiRoomPlayerLabelY\(localPlayerBounds,\s*fallbackLabelY\)/);
  assert.match(sceneDrawSource, /drawKuromiRoomHud\(ctx,\s*state,\s*screenX,\s*localLabelY,\s*now,\s*\{\s*playerBounds:\s*localPlayerBounds,\s*sleepY:\s*screenY\s*\}\)/);
});

test('interaction room has emoji reactions above chat on desktop and above the chat button on mobile', () => {
  const chatRenderSource = sourceBetween('function renderKuromiRoomEmojiButtons', 'function getMiniGameChoices');
  const clickSource = sourceBetween("document.addEventListener('click'", "const kuromiChatToggleButton");
  const clearRoomSource = sourceBetween('function clearActiveInteractionRoom', 'async function loadInteractionRooms');

  assert.match(indexSource, /id="kuromi-room-emoji-dock"/);
  assert.match(appSource, /const KUROMI_ROOM_EMOJI_REACTIONS = \['😊', '😄', '😂', '😍'/);
  assert.match(appSource, /emojiOpen: false/);
  assert.match(chatRenderSource, /function renderKuromiRoomEmojiButtons/);
  assert.match(chatRenderSource, /data-kuromi-room-emoji/);
  assert.match(chatRenderSource, /function renderKuromiRoomEmojiDock/);
  assert.match(chatRenderSource, /data-kuromi-emoji-toggle/);
  assert.match(chatRenderSource, /renderKuromiRoomEmojiButtons\('kuromi-room-emoji-list-inline'\)/);
  assert.match(chatRenderSource, /async function sendKuromiRoomMessageText/);
  assert.match(chatRenderSource, /sendInteractionRoomHeartbeat\(\{ message: validation\.text, silent: true \}\)/);
  assert.match(clickSource, /data-kuromi-room-emoji/);
  assert.match(clickSource, /sendKuromiRoomMessageText\(kuromiEmojiButton\.dataset\.kuromiRoomEmoji/);
  assert.match(clickSource, /data-kuromi-emoji-toggle/);
  assert.match(clearRoomSource, /interactionRoomState\.emojiOpen = false/);
  assert.match(cssSource, /\.kuromi-room-emoji-list-inline/);
  assert.match(cssSource, /\.kuromi-room-emoji-dock/);
  assert.match(cssSource, /body\.kuromi-room-fullscreen-mode \.kuromi-room-emoji-dock/);
  assert.match(cssSource, /bottom:\s*calc\(env\(safe-area-inset-bottom\) \+ 168px\)/);
  assert.match(cssSource, /body\.kuromi-room-fullscreen-mode \.kuromi-room-emoji-list-inline\s*\{\s*display:\s*none/);
});

test('silent interaction room heartbeat failures do not clear the room before the grace period', () => {
  const heartbeatSource = sourceBetween('async function sendInteractionRoomHeartbeat', 'function startInteractionRoomHeartbeat');
  assert.match(heartbeatSource, /const graceExpired = now - lastOk > INTERACTION_ROOM_DISCONNECT_GRACE_MS/);
  assert.match(heartbeatSource, /if \(options\.silent && !graceExpired\) \{/);
  assert.doesNotMatch(heartbeatSource, /tooManyFailures/);
});

test('browser close sends a final interaction room leave signal', () => {
  const beaconSource = sourceBetween('function sendInteractionRoomLeaveBeacon', 'async function sendInteractionRoomHeartbeat');
  const pagehideSource = sourceBetween("window.addEventListener('pagehide'", "window.addEventListener('pageshow'");
  assert.match(beaconSource, /action:\s*'leaveRoom'/);
  assert.match(beaconSource, /roomId:\s*interactionRoomState\.activeRoomId/);
  assert.match(beaconSource, /studentId:\s*HolidayBackendClient\.normalizeId\(student\?\.studentId\)/);
  assert.match(beaconSource, /navigator\.sendBeacon\(APP_CONFIG\.interactionRoomApiUrl,\s*blob\)/);
  assert.match(beaconSource, /keepalive:\s*true/);
  assert.match(pagehideSource, /sendInteractionRoomLeaveBeacon\(\)/);
  assert.match(pagehideSource, /stopInteractionRoomHeartbeat\(\)/);
});

test('frontend renders friend search, requests, list and notifications', () => {
  assert.match(appSource, /async function searchFriendsFromForm\(form\)/);
  assert.match(appSource, /async function sendFriendRequestFromButton\(button\)/);
  assert.match(appSource, /async function respondToFriendRequest\(button\)/);
  assert.match(appSource, /function renderFriendList\(target\)/);
  assert.match(appSource, /function renderFriendSearchResults\(\)/);
  assert.match(appSource, /function renderFriendNotifications\(target\)/);
  assert.match(appSource, /function clearReadNotificationsFromButton\(\)/);
  assert.match(appSource, /function getFriendAttentionKey\(\)/);
  assert.match(appSource, /let friendAttentionSeenKey = ''/);
  assert.match(appSource, /has-friend-alert/);
  assert.match(appSource, /data-notification-clear/);
  assert.match(appSource, /data-friend-request-send/);
  assert.match(appSource, /data-friend-request-response/);
});

test('frontend supports coin gift send and claim modals', () => {
  assert.match(appSource, /function openGiftModal\(friendId\)/);
  assert.match(appSource, /async function sendCoinGiftFromModal\(\)/);
  assert.match(appSource, /async function claimGiftFromButton\(button\)/);
  assert.match(appSource, /function showGiftClaimModal\(config = \{\}\)/);
  assert.match(appSource, /function getAllGiftableShopItems\(\)/);
  assert.match(appSource, /function getAllGiftableShopPets\(\)/);
  assert.match(appSource, /function getAllGiftableMusicTracks\(\)/);
  assert.match(appSource, /BLIND_BOX_PRICE = 120/);
  assert.match(appSource, /MUSIC_BOX_TRACK_PRICE = 280/);
  assert.match(appSource, /friendState\.activeGiftType === 'blind-box'/);
  assert.match(appSource, /friendState\.activeGiftType === 'music'/);
  assert.match(appSource, /data-gift-reveal-open/);
  assert.match(appSource, /data-gift-item-select/);
  assert.match(appSource, /data-gift-pet-select/);
  assert.match(appSource, /data-gift-music-select/);
  assert.match(appSource, /data-music-wall-share/);
  assert.match(appSource, /shareMusicTrackToWall/);
  assert.match(appSource, /function refreshMusicBoxFromCloud\(\)/);
  assert.match(appSource, /backend\.requestSupabase\('getStudent'/);
  assert.match(appSource, /void refreshMusicBoxFromCloud\(\)/);
  assert.match(functionSource, /帮你买了一件装备/);
  assert.match(functionSource, /giftType === 'blind-box'/);
  assert.match(functionSource, /giftType === 'music'/);
  assert.match(functionSource, /MUSIC_BOX_TRACK_PRICE = 280/);
  assert.match(functionSource, /ownedMusicTracks = uniqueStringList/);
  assert.match(functionSource, /async function sendBlindBoxDuplicateGift\(payload: JsonRecord\)/);
  assert.match(functionSource, /payload\.petPayload/);
  assert.match(appSource, /data-friend-gift/);
  assert.match(appSource, /data-gift-claim/);
});

test('blind box pets require naming and wall shares reset stale reactions', () => {
  assert.match(appSource, /grantPetToStudent\(student, selectedPet, \{ needsNaming: true \}\)/);
  assert.match(appSource, /function repairPetNamingState\(student\)/);
  assert.match(appSource, /function maybePromptAnyPetNaming\(student = getStudent\(\)\)/);
  assert.match(appSource, /onClose: newPetId \? \(\) => openPetRenameModal\(newPetId\) : null/);
  assert.match(appSource, /likedBy:\s*\[\]/);
  assert.match(appSource, /comments:\s*\[\]/);
  assert.match(appSource, /function updateWallPost\(post, options = \{\}\)/);
  assert.match(functionSource, /wall_likes\?post_student_id=eq/);
  assert.match(functionSource, /wall_comments\?post_student_id=eq/);
  assert.match(functionSource, /order=created_at\.desc/);
});

test('blind boxes can award music and duplicate music can be sent to friends', () => {
  const shopSource = sourceBetween('const blindBoxCard = `<section class="blind-box-shop-panel">', 'const renderExclusiveGear = pet =>');
  const rollSource = sourceBetween('function rollBlindBoxRewards(student)', 'function getAssetComparisonKey');
  const duplicateSendSource = sourceBetween('async function sendBlindBoxDuplicateGift(payload: JsonRecord)', 'async function claimGift', functionSource);

  assert.match(appSource, /function getAllBlindBoxMusicTracks\(\)/);
  assert.match(appSource, /function grantMusicTrackToStudent\(student,\s*track\)/);
  assert.match(appSource, /function getBlindBoxDuplicateMusicCoins\(track\)/);
  assert.match(shopSource, /未拥有宠物或音乐/);
  assert.match(rollSource, /getAllBlindBoxMusicTracks\(\)/);
  assert.match(rollSource, /grantMusicTrackToStudent\(student,\s*selectedMusicTrack\)/);
  assert.match(rollSource, /rewards\.music\.push/);
  assert.match(rollSource, /createBlindBoxDuplicateReward\('music'/);
  assert.match(appSource, /giftType === 'blind-box' \? '神秘盲盒' : giftType === 'music' \? '音乐礼物' : '礼物'/);
  assert.match(duplicateSendSource, /\['item', 'pet', 'music'\]\.includes\(duplicateType\)/);
  assert.match(duplicateSendSource, /gift_type:\s*duplicateType/);
  assert.match(duplicateSendSource, /item_id:\s*duplicateType === 'music'/);
  assert.match(duplicateSendSource, /musicTrackId:\s*duplicateType === 'music'/);

  const duplicate = Function(`
    function createLocalId(prefix) { return prefix + '-fixed'; }
    function getEquipmentDisplayName(entry) { return entry && entry.name ? entry.name : ''; }
    function getVersionedRoleCardAsset(value) { return value; }
    function getMusicTrackAccent(track) { return track.series === 'BTS' ? '#7c4dff' : '#6f67f1'; }
    ${extractAppFunction('createBlindBoxDuplicateReward')}
    return createBlindBoxDuplicateReward('music', { id: 'bts-butter', title: 'Butter', series: 'BTS', src: 'assets/music-box/bts/butter.mp3' }, 140);
  `)();
  assert.equal(duplicate.type, 'music');
  assert.equal(duplicate.trackId, 'bts-butter');
  assert.equal(duplicate.itemId, 'bts-butter');
  assert.equal(duplicate.name, 'Butter');
  assert.equal(duplicate.series, 'BTS');
  assert.equal(duplicate.coinValue, 140);
});

test('music box catalog keeps series colors together and removes Infinity War', () => {
  const musicCatalogSource = sourceBetween('const MUSIC_SERIES_ORDER = [', 'const STORAGE_KEY =');
  const musicBoxRenderSource = sourceBetween('function renderMusicBox', 'function renderActiveStudentView');
  const musicPlayerSource = sourceBetween('function renderMusicPlayer', 'function activateMusicTrackForPlayback');
  const giftSource = sourceBetween('function renderGiftModal()', 'function openGiftModal');
  const rewardSource = sourceBetween('function buildGiftClaimRewardSummary', 'function renderRewardSummary');
  const wallNormalizeSource = sourceBetween('function normalizeWallMusicTrackPayload', 'function getWallPostSharedMusicTrack');
  const wallShareSource = sourceBetween('async function shareMusicTrackToWall', 'async function likeWallPost');

  assert.match(indexSource, /id="music-player-panel"/);
  assert.match(appSource, /const MUSIC_PLAYBACK_MODE_SINGLE = 'single'/);
  assert.match(appSource, /const MUSIC_PLAYBACK_MODE_SHUFFLE = 'shuffle'/);
  assert.match(appSource, /const MUSIC_PLAYBACK_MODE_SERIES = 'series'/);
  assert.match(appSource, /function getNextMusicTrackForPlayback/);
  assert.match(musicPlayerSource, /data-music-player-toggle/);
  assert.match(musicPlayerSource, /data-music-player-next/);
  assert.match(musicPlayerSource, /data-music-play-mode/);
  assert.match(sourceBetween('function tryStartBackgroundMusic', 'window.addEventListener'), /musicPlayerPausedManually/);
  assert.match(sourceBetween('function applyActiveBackgroundMusic', 'function stopMusicPreview'), /backgroundMusic\.loop = getMusicPlaybackMode\(student\) === MUSIC_PLAYBACK_MODE_SINGLE/);
  assert.match(musicCatalogSource, /const MUSIC_SERIES_ACCENTS = Object\.freeze/);
  assert.match(appSource, /function getMusicTrackAccent\(track = \{\}\)/);
  assert.match(musicCatalogSource, /src:\s*'assets\/music-box\/marvel\/the-avengers-from-32s\.mp3'/);
  assert.doesNotMatch(musicCatalogSource, /marvel-infinity-war/);
  assert.doesNotMatch(functionSource, /infinity-war/);
  [
    'aot-akuma-no-ko',
    'aot-call-of-silence',
    'aot-shinzou-wo-sasageyo',
    'demon-slayer-gurenge',
    'demon-slayer-homura',
    'demon-slayer-infinity-castle-theme',
    'demon-slayer-kamado-tanjiro-no-uta',
    'one-piece-we-are',
    'one-piece-very-very-very-strongest',
    'overlord-hollow-hunger',
    'overlord-clattanoia',
    'cortis-fashion',
    'cortis-go',
    'cortis-redred',
    'cortis-what-you-want',
    'treasure-boy',
    'treasure-going-crazy',
    'treasure-i-love-you',
    'treasure-jikjin',
    'blackpink-how-you-like-that',
    'bigbang-fantastic-baby',
    'bigbang-blue',
    'bigbang-lets-not-fall-in-love',
    'bigbang-bang-bang-bang',
    'bigbang-haru-haru',
    'bts-butter',
    'ive-love-dive',
    'seventeen-super',
    'stray-kids-gods-menu',
    'twice-fancy',
    'hachimi-daily-hachimi'
  ].forEach(trackId => {
    assert.match(musicCatalogSource, new RegExp(`id:\\s*'${trackId}'`));
    assert.match(functionSource, new RegExp(`'${trackId}'`));
  });
  assert.match(musicBoxRenderSource, /getMusicTrackAccent\(track\)/);
  assert.match(giftSource, /getMusicTrackAccent\(selected\)/);
  assert.match(rewardSource, /getMusicTrackAccent\(track\)/);
  assert.match(wallNormalizeSource, /getMusicTrackAccent\(track\)/);
  assert.match(wallShareSource, /getMusicTrackAccent\(track\)/);
  assert.match(cssSource, /\.music-series-track-grid/);
  assert.match(cssSource, /grid-auto-flow:\s*column/);
  assert.match(cssSource, /overflow-x:\s*auto/);
});

test('One Piece We Are starts from 30 seconds in playback and preview', () => {
  const musicCatalogSource = sourceBetween('const MUSIC_SERIES_ORDER = [', 'const STORAGE_KEY =');
  const playbackSource = sourceBetween('function applyActiveBackgroundMusic', 'function stopMusicPreview');
  const previewSource = sourceBetween('function previewMusicTrack', 'async function buyMusicTrack');

  assert.match(musicCatalogSource, /id:\s*'one-piece-we-are'[\s\S]{0,220}startAt:\s*30/);
  assert.match(appSource, /function getMusicTrackStartTime\(track\)/);
  assert.match(appSource, /function applyMusicTrackStartTime\(audio,\s*track\)/);
  assert.match(playbackSource, /applyMusicTrackStartTime\(backgroundMusic,\s*track\)/);
  assert.match(previewSource, /applyMusicTrackStartTime\(musicPreviewAudio,\s*track\)/);
});

test('BigBang BLUE starts from 8 seconds in playback and preview', () => {
  const musicCatalogSource = sourceBetween('const MUSIC_SERIES_ORDER = [', 'const STORAGE_KEY =');

  assert.match(musicCatalogSource, /id:\s*'bigbang-blue'[\s\S]{0,220}startAt:\s*8/);
});

test('frontend can open friend profile as a read-only pet home', () => {
  assert.match(appSource, /async function openFriendProfile\(friendId\)/);
  assert.match(appSource, /function renderFriendProfile\(target, friend\)/);
  assert.match(appSource, /function buildFriendPreviewStudent\(friend\)/);
  assert.match(appSource, /data-friend-profile/);
  assert.match(appSource, /进入主页/);
  assert.match(appSource, /friend-readonly-home/);
  assert.match(appSource, /data-friend-preview-pet/);
});

test('Supabase function exposes shared room actions', () => {
  ['listRooms', 'listRoom', 'joinRoomByCode', 'requestRoomJoin', 'respondRoomJoinRequest', 'updateRoomScene', 'addRoomPet', 'removeRoomPet', 'removeRoomMember', 'placeRoomDecoration', 'removeRoomDecoration', 'resetRoom', 'sendRoomMessage'].forEach(action => {
    assert.match(functionSource, new RegExp(`action === '${action}'`));
  });
  assert.match(functionSource, /async function ensureRoom\(roomOwnerStudentId: string\)/);
  assert.match(functionSource, /async function ensureRoomMembership\(studentId: string, roomOwnerStudentId: string\)/);
  assert.match(functionSource, /async function canEditRoom\(actorStudentId: string, roomOwnerStudentId: string\)/);
  assert.match(functionSource, /async function listRooms\(payload: JsonRecord\)/);
  assert.match(functionSource, /async function sendRoomMessage\(payload: JsonRecord\)/);
  assert.match(functionSource, /async function joinRoomByCode\(payload: JsonRecord\)/);
  assert.match(functionSource, /async function requestRoomJoinByOwner\(payload: JsonRecord\)/);
  assert.match(functionSource, /async function respondRoomJoinRequest\(payload: JsonRecord\)/);
  const listRoomsSource = sourceBetween('async function listRooms(payload: JsonRecord)', 'async function getRoomMembers', functionSource);
  assert.match(listRoomsSource, /const candidateIds = Array\.from\(new Set\(\[studentId, \.\.\.acceptedRoomIds\]\)\)/);
  assert.doesNotMatch(listRoomsSource, /listFriends/);
  assert.doesNotMatch(listRoomsSource, /friends\.map/);
  assert.match(functionSource, /generateRoomCode/);
  assert.match(functionSource, /Date\.now\(\) - 2 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(functionSource, /student_room_memberships/);
  assert.match(functionSource, /status=eq\.accepted/);
  assert.match(functionSource, /status=eq\.pending/);
  assert.match(functionSource, /pendingApproval/);
  assert.match(functionSource, /room_messages/);
  assert.match(functionSource, /ROOM_MEMBER_LIMIT = 10/);
  assert.match(functionSource, /ROOM_MEMBERSHIP_LIMIT = 3/);
  assert.match(functionSource, /currentMemberIds\.size >= ROOM_MEMBER_LIMIT - 1/);
  assert.match(functionSource, /ROOM_MEMBER_LIMIT - 1/);
  assert.match(functionSource, /async function removeRoomMember\(payload: JsonRecord\)/);
  assert.match(appSource, /--guest-dx/);
  assert.match(appSource, /roomMembers/);
});

test('frontend turns pet interaction into a shared pet wall with room selection and chat', () => {
  assert.match(appSource, /function renderRoomLobby\(student = getStudent\(\)\)/);
  assert.match(appSource, /function renderRoomChat\(student = getStudent\(\)\)/);
  assert.match(appSource, /async function loadSharedRooms\(force = false\)/);
  assert.match(appSource, /async function sendRoomChatMessage\(form\)/);
  assert.match(appSource, /async function resetCurrentRoom\(button\)/);
  assert.match(appSource, /function hasActivePetWallRoom\(\)/);
  assert.match(appSource, /function clearActivePetWallRoom\(options = \{\}\)/);
  assert.match(appSource, /pet-wall-lobby-only/);
  assert.match(appSource, /data-room-enter/);
  assert.match(appSource, /data-room-chat-form/);
  assert.match(appSource, /roomMessageDraft/);
  assert.match(appSource, /roomNameDraftDirty/);
  assert.match(sourceBetween('function renderRoomChat(student = getStudent())', 'async function loadSharedRooms(force = false)'), /nextInput\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(sourceBetween("document.addEventListener('input'", "document.addEventListener('submit'"), /roomMessageDraft = String\(roomChatInput\.value \|\| ''\)/);
  assert.match(sourceBetween("document.addEventListener('input'", "document.addEventListener('submit'"), /roomNameDraftDirty = true/);
  assert.match(appSource, /data-room-join-form/);
  assert.match(appSource, /data-room-reset/);
  assert.match(appSource, /data-room-member-remove/);
  assert.match(appSource, /data-room-request-response/);
  assert.match(appSource, /pendingApproval/);
  assert.match(appSource, /最多 3 间房/);
  assert.match(appSource, /最多 \$\{ROOM_MEMBER_LIMIT\} 位同学/);
  assert.match(functionSource, /roomName:\s*['"](?:5\+1 教师研讨室|Demo Meeting Room)['"]/);
  assert.match(functionSource, /memberLimit: 30/);
  assert.match(appSource, /房间 ID/);
	  assert.match(appSource, /async function joinRoomByCode\(form\)/);
	  assert.match(appSource, /宠物墙/);
	  assert.match(appSource, /data-friend-room/);
	  assert.match(appSource, /backend\.listFriendInteractionRooms\(student\.studentId, \[safeFriendId\]\)/);
	  assert.match(appSource, /joinInteractionRoomById\(summary\.roomId, '', \{ switchToGuide: true \}\)/);
	  assert.doesNotMatch(sourceBetween("const friendRoomButton = event.target.closest('[data-friend-room]');", "const giftTypeButton = event.target.closest('[data-gift-type]');"), /openFriendPetWall/);
	  assert.doesNotMatch(sourceBetween('function renderPetInteraction()', 'function setPetInteractionScene'), /loadSharedRoom\(\)/);
  assert.doesNotMatch(sourceBetween('function renderFriendList(target)', 'function renderFriendNotifications'), /data-friend-room/);
  assert.doesNotMatch(appSource, /data-room-friend-select/);
  assert.doesNotMatch(appSource, /data-room-add-friend-pet/);
});

test('student self registration requires a sincere friend id', () => {
  assert.match(indexSource, /class="register-id-field"/);
  assert.match(indexSource, /class="register-id-prefix"[^>]*>CY<\/span>/);
  assert.match(indexSource, /<label for="register-student-id">学生 ID（只填 4 位数字）<\/label>/);
  assert.match(indexSource, /<input id="register-student-id"[^>]*name="studentIdDigits"[^>]*inputmode="numeric"[^>]*pattern="\[0-9\]\{4\}"[^>]*maxlength="4"[^>]*required/);
  assert.match(indexSource, /<label for="register-referrer-id">诚意朋友 ID<\/label>/);
  assert.match(indexSource, /<input id="register-referrer-id"[^>]*name="sincereFriendId"[^>]*required/);
  assert.match(indexSource, /id="registration-success-modal"/);
  assert.match(indexSource, /id="registration-success-id"/);
  assert.match(indexSource, /data-registration-success-continue/);
  assert.match(sourceBetween('function getRegisterStudentIdFromForm(form)', 'async function registerStudentFromForm'), /`CY\$\{digits\}`/);
  assert.match(sourceBetween('function getRegisterStudentIdFromForm(form)', 'async function registerStudentFromForm'), /学生 ID 请填写 4 位数字。/);
  assert.doesNotMatch(sourceBetween('function getRegisterStudentIdFromForm(form)', 'async function registerStudentFromForm'), /if \(!digits\) return \{ ok: true/);
  assert.match(sourceBetween('async function registerStudentFromForm', 'async function login'), /const studentIdValidation = getRegisterStudentIdFromForm\(form\)/);
  assert.match(sourceBetween('async function registerStudentFromForm', 'async function login'), /studentId: studentIdValidation\.studentId/);
  assert.match(sourceBetween('async function registerStudentFromForm', 'async function login'), /showRegistrationSuccessModal\(registered\.studentId\)/);
  assert.doesNotMatch(sourceBetween('async function registerStudentFromForm', 'async function login'), /return login\(registered\.studentId\)/);
  assert.match(appSource, /async function continueRegistrationSuccessLogin\(\)/);
  assert.match(sourceBetween("document.addEventListener('click'", "const modalCloseButton = event.target.closest('[data-modal-close]')"), /data-registration-success-continue/);
  assert.match(sourceBetween("document.addEventListener('input'", "document.addEventListener('submit'"), /register-student-id/);
  assert.match(sourceBetween("document.addEventListener('input'", "document.addEventListener('submit'"), /replace\(\/\\D\/g, ''\)\.slice\(0, 4\)/);
  assert.match(sourceBetween('async function registerStudentFromForm', 'async function login'), /if \(!sincereFriendId\)/);
  assert.match(sourceBetween('async function registerStudentFromForm', 'async function login'), /请输入诚意朋友 ID。/);
  const registerSource = sourceBetween('async function registerStudent', 'function isTeacherRosterRow', functionSource);
  assert.match(registerSource, /if \(!sincereFriendId\)/);
  assert.match(registerSource, /SINCERE_FRIEND_ID_REQUIRED/);
  assert.match(registerSource, /await studentIdExists\(sincereFriendId\)/);
  assert.match(registerSource, /SINCERE_FRIEND_ID_NOT_FOUND/);
});
