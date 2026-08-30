const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const htmlSource = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const cssSource = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
const backendApiSource = fs.readFileSync(path.join(projectRoot, 'supabase', 'functions', 'cy-pets-api', 'index.ts'), 'utf8');
const backendBundleSource = fs.readFileSync(path.join(projectRoot, 'cy-pets-api-impl.mjs'), 'utf8');

function sourceBetween(start, end, source = appSource) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing start marker ${start}`);
  assert.notEqual(endIndex, -1, `missing end marker ${end}`);
  return source.slice(startIndex, endIndex);
}

const petInteractionAssets = [
  ['assets/room-demo/kuromi-room-panorama.png', 1600, 540],
  ['assets/room-demo/map-school.png', 1800, 700],
  ['assets/room-demo/map-forest.png', 1800, 700],
  ['assets/room-demo/map-food-street.png', 1800, 700],
  ['assets/room-demo/kuromi-run.png', 256, 256],
  ['assets/room-demo/kuromi-duck.png', 256, 256],
  ['assets/pet-interactions/scenes/blank-meadow-builder.png', 1200, 800],
  ['assets/pet-interactions/furniture/tree.png', 256, 256],
  ['assets/pet-interactions/furniture/tall-grass.png', 256, 256],
  ['assets/pet-interactions/furniture/lounge-chair.png', 256, 256],
  ['assets/pet-interactions/furniture/flower-bush.png', 256, 256],
  ['assets/pet-interactions/furniture/study-mat.png', 256, 256],
  ['assets/pet-interactions/creeper/creeper-q-base.png', 900, 900],
  ['assets/pet-interactions/pets/twinkle-twinkle-q.png', 900, 900],
  ['assets/pet-interactions/pets/cinnamoroll-q.png', 900, 900],
  ['assets/pet-interactions/pets/enderdragon-q.png', 900, 900]
];

const newRoomMapSets = [
  {
    id: 'tokyo-night',
    name: '东京夜景',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/map-tokyo-tower-night.png',
      'assets/room-demo/map-tokyo-station-night.png',
      'assets/room-demo/map-tokyo-neon-night.png',
      'assets/room-demo/map-tokyo-loop-street-night.png',
      'assets/room-demo/map-tokyo-riverside-night.png'
    ]
  },
  {
    id: 'kl-pavilion-night',
    name: 'Pavilion KL',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/01-kl-pavilion-fountain.png',
      'assets/room-demo/02-kl-pavilion-bukit-bintang-walk.png',
      'assets/room-demo/03-kl-pavilion-glass-bridge.png',
      'assets/room-demo/04-kl-pavilion-boutique-row.png',
      'assets/room-demo/05-kl-pavilion-night-lights.png',
      'assets/room-demo/06-kl-pavilion-city-night.png'
    ]
  },
  {
    id: 'sunset-farm',
    name: '日落农场',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/map-farm-sheep-meadow-sunset.png',
      'assets/room-demo/map-farm-house-interior-sunset.png',
      'assets/room-demo/map-farm-pony-stable-sunset.png',
      'assets/room-demo/map-farm-calf-pasture-sunset.png',
      'assets/room-demo/map-farm-vegetable-garden-sunset.png'
    ]
  },
  {
    id: 'movie-park',
    name: '电影乐园',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/map-studio-globe-entrance.png',
      'assets/room-demo/map-studio-boulevard.png',
      'assets/room-demo/map-studio-sci-fi-zone.png',
      'assets/room-demo/map-studio-dino-jungle.png',
      'assets/room-demo/map-studio-city-backlot.png',
      'assets/room-demo/map-studio-magic-street.png',
      'assets/room-demo/map-studio-water-harbor.png',
      'assets/room-demo/map-studio-fireworks-exit.png'
    ]
  },
  {
    id: 'cy-school',
    name: '诚意校园',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/map-school-gate.png',
      'assets/room-demo/map-school-corridor.png',
      'assets/room-demo/map-school-classroom.png',
      'assets/room-demo/map-school-cafeteria.png',
      'assets/room-demo/map-school-auditorium.png',
      'assets/room-demo/map-school-field.png'
    ]
  },
  {
    id: 'paris-trip',
    name: '巴黎旅行',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/map-paris-eiffel-riverside.png',
      'assets/room-demo/map-paris-seine-bridge.png',
      'assets/room-demo/map-paris-cafe-street.png',
      'assets/room-demo/map-paris-museum-courtyard.png',
      'assets/room-demo/map-paris-montmartre-lane.png',
      'assets/room-demo/map-paris-garden-square.png'
    ]
  },
  {
    id: 'xian-trip',
    name: '西安旅行',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/map-xian-city-wall-gate.png',
      'assets/room-demo/map-xian-bell-tower-street.png',
      'assets/room-demo/map-xian-pagoda-garden.png',
      'assets/room-demo/map-xian-qin-mausoleum-park.png',
      'assets/room-demo/map-xian-terracotta-hall.png',
      'assets/room-demo/map-xian-bronze-chariot-museum.png'
    ]
  },
  {
    id: 'beijing-trip',
    name: '北京旅行',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/map-beijing-forbidden-city-gate.png',
      'assets/room-demo/map-beijing-temple-of-heaven.png',
      'assets/room-demo/map-beijing-great-wall.png',
      'assets/room-demo/map-beijing-hutong-lane.png',
      'assets/room-demo/map-beijing-summer-palace.png',
      'assets/room-demo/map-beijing-modern-night.png'
    ]
  },
  {
    id: 'usa-trip',
    name: '美国旅行',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/map-usa-new-york-harbor.png',
      'assets/room-demo/map-usa-washington-dc-mall.png',
      'assets/room-demo/map-usa-san-francisco-bay.png',
      'assets/room-demo/map-usa-los-angeles-beach.png',
      'assets/room-demo/map-usa-chicago-riverwalk.png',
      'assets/room-demo/map-usa-new-orleans-quarter.png'
    ]
  },
  {
    id: 'uk-trip',
    name: '英国旅行',
    backgroundMode: 'single-screen',
    maps: [
      'assets/room-demo/map-uk-london-thames.png',
      'assets/room-demo/map-uk-royal-garden.png',
      'assets/room-demo/map-uk-oxford-college.png',
      'assets/room-demo/map-uk-york-old-town.png',
      'assets/room-demo/map-uk-edinburgh-castle.png',
      'assets/room-demo/map-uk-cornwall-harbor.png'
    ]
  }
];

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  assert.equal(buffer.subarray(1, 4).toString('ascii'), 'PNG', `${filePath} should be a PNG screenshot`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function loadKuromiRoomDemoConfig() {
  const start = appSource.indexOf('const KUROMI_ROOM_DEMO = ');
  const end = appSource.indexOf('\n\n  // 经济平衡', start);
  assert.notEqual(start, -1, 'KUROMI_ROOM_DEMO config should exist');
  assert.notEqual(end, -1, 'KUROMI_ROOM_DEMO config should end before rewards config');
  return Function(`${appSource.slice(start, end)}\nreturn KUROMI_ROOM_DEMO;`)();
}

function countPetCatalogEntries() {
  const start = appSource.indexOf('const PET_CATALOG = ');
  const end = appSource.indexOf('\n\n  const ROLE_SKILL_COPY', start);
  assert.notEqual(start, -1, 'PET_CATALOG should exist');
  assert.notEqual(end, -1, 'PET_CATALOG should end before role copy');
  const catalogSource = appSource.slice(start, end);
  return (catalogSource.match(/\{\s*id: '[^']+'[\s\S]*?rarity: '[^']+'/g) || []).length;
}

function extractAppFunction(name) {
  const start = appSource.indexOf(`function ${name}`);
  assert.notEqual(start, -1, `${name} should exist in app.js`);
  const parenStart = appSource.indexOf('(', start);
  let parenDepth = 0;
  let signatureEnd = -1;
  for (let index = parenStart; index < appSource.length; index += 1) {
    if (appSource[index] === '(') parenDepth += 1;
    if (appSource[index] === ')') parenDepth -= 1;
    if (parenDepth === 0) {
      signatureEnd = index;
      break;
    }
  }
  const braceStart = appSource.indexOf('{', signatureEnd);
  let depth = 0;
  for (let index = braceStart; index < appSource.length; index += 1) {
    if (appSource[index] === '{') depth += 1;
    if (appSource[index] === '}') depth -= 1;
    if (depth === 0) return appSource.slice(start, index + 1);
  }
  throw new Error(`Could not extract function ${name}`);
}

function runPetInteractionTarget({ action, movement, scene, currentX, currentY }) {
  const clampFunction = appSource.includes('function clampPetInteractionValue')
    ? extractAppFunction('clampPetInteractionValue')
    : '';
  return Function(`
    const PET_INTERACTION_WALK_ZONES = {
      home: { minX: 24, maxX: 75, minY: 0, maxY: 22 }
    };
    const PET_INTERACTION_FLIGHT_ZONES = {
      home: { minX: 18, maxX: 82, minY: 30, maxY: 62 }
    };
    function $(selector) {
      return selector === '#pet-interaction-stage' ? { dataset: { scene: ${JSON.stringify(scene)} } } : null;
    }
    function getCurrentPetInteractionProfile() {
      return { movement: ${JSON.stringify(movement)} };
    }
    ${extractAppFunction('readPetInteractionPercent')}
    ${extractAppFunction('readPetInteractionNumber')}
    ${extractAppFunction('getPetInteractionZone')}
    ${extractAppFunction('randomPetInteractionPercent')}
    ${clampFunction}
    ${extractAppFunction('getPetInteractionTarget')}
    const pet = {
      style: {
        getPropertyValue(property) {
          if (property === '--pet-x') return ${JSON.stringify(String(currentX))};
          if (property === '--pet-y') return ${JSON.stringify(String(currentY))};
          return '';
        }
      }
    };
    return getPetInteractionTarget(pet, ${JSON.stringify(action)}, { movement: ${JSON.stringify(movement)} });
  `)();
}

test('app replaces the gameplay guide with a single-player Kuromi room demo', () => {
  assert.match(htmlSource, /data-view="guide-view"[^>]*>互动区<\/button>/);
  assert.match(htmlSource, /id="guide-view" class="view"/);
  assert.match(htmlSource, /INTERACTION AREA/);
  assert.match(htmlSource, /id="pet-interaction-stage"/);
  assert.match(htmlSource, /id="kuromi-room-canvas"/);
  assert.match(htmlSource, /class="kuromi-room-controls"/);
  assert.match(htmlSource, /class="kuromi-room-orientation-hint"/);
  assert.match(htmlSource, /data-kuromi-fullscreen/);
  assert.match(appSource, /map-school\.png/);
  assert.match(appSource, /map-forest\.png/);
  assert.match(appSource, /map-food-street\.png/);
  assert.match(appSource, /function handleKuromiRoomMapTransition/);
  assert.match(appSource, /function moveKuromiRoomToMap/);
  assert.match(htmlSource, /class="kuromi-control-cluster kuromi-control-cluster-move"/);
  assert.match(htmlSource, /class="kuromi-control-cluster kuromi-control-cluster-action"/);
  assert.match(htmlSource, /data-kuromi-control="left"/);
  assert.match(htmlSource, /data-kuromi-control="jump"/);
  assert.match(htmlSource, /data-kuromi-control="duck"/);
  assert.match(htmlSource, /data-kuromi-control="lie"/);
  assert.match(htmlSource, /data-kuromi-control="right"/);
  assert.match(htmlSource, /id="kuromi-room-chat-panel"/);
  assert.match(appSource, /function closeKuromiRoomChatFromStage/);
  assert.match(appSource, /isKuromiRoomFullscreenMode\(\) \|\| !isKuromiRoomChatOpen\(\)/);
  assert.match(appSource, /#pet-interaction-stage, #kuromi-room-canvas/);
  assert.match(appSource, /setKuromiRoomChatOpen\(false, \{ focus: false \}\)/);
  assert.match(appSource, /input\?\.blur\?\.\(\)/);
  assert.match(htmlSource, /data-pet-interaction-share/);
  assert.doesNotMatch(htmlSource, /id="room-lobby-panel"/);
  assert.doesNotMatch(htmlSource, /class="pet-interaction-track"/);
  assert.doesNotMatch(htmlSource, /id="pet-interaction-pet"/);
  assert.doesNotMatch(htmlSource, /id="pet-food-tray"/);
  assert.doesNotMatch(htmlSource, /id="pet-builder-grid"/);
  assert.doesNotMatch(htmlSource, /id="pet-furniture-tray"/);
  assert.doesNotMatch(htmlSource, /id="pet-interaction-creeper"/);
  assert.doesNotMatch(htmlSource, /data-pet-scene="home"/);
  assert.doesNotMatch(htmlSource, /id="pet-call-button"/);
  assert.doesNotMatch(htmlSource, /id="pet-animation-toggle"/);
  assert.doesNotMatch(htmlSource, /如何获得更多宠物/);
  assert.doesNotMatch(htmlSource, /网站里还有什么好玩的/);
  const renderSource = extractAppFunction('renderPetInteraction');
  assert.match(renderSource, /initKuromiRoomDemo\(\)/);
  assert.doesNotMatch(renderSource, /loadFriendsDashboard\(\)/);
  assert.doesNotMatch(renderSource, /startRoomAutoRefresh\(\)/);
  assert.doesNotMatch(renderSource, /renderRoomLobby\(/);
});

test('shared interaction room smooths remote players and only sways idle pets', () => {
  assert.match(appSource, /remoteRenderPlayers:\s*new Map\(\)/);
  assert.match(appSource, /remoteLerpSpeed:\s*0\.18/);
  assert.match(appSource, /remoteMaxStepPerSecond:\s*720/);
  assert.match(appSource, /function syncInteractionRoomRemoteRenderPlayer/);
  assert.match(appSource, /renderState\.displayX/);
  assert.match(appSource, /visualVelocityX/);
  assert.match(appSource, /const idleSwaying = action === 'idle' && player\.onGround/);
  assert.match(appSource, /function drawKuromiRoomSleepZzz/);
  assert.doesNotMatch(appSource, /player\.sitting\s*\?\s*'sit'/);
  assert.match(sourceBetween('function getKuromiRoomPlayerAction', 'function getKuromiRoomPlayerHeight'), /if \(player\?\.lying\) return 'lie'/);
  assert.match(sourceBetween('function getInteractionRoomHeartbeatPayload', 'function getInteractionRoomHeartbeatSignature'), /const action = getKuromiRoomPlayerAction\(player\)/);
  assert.match(appSource, /const renderScale = getInteractionRoomPlayerRenderScale\(remote\)/);
  assert.match(appSource, /const renderFloatOffset = getInteractionRoomPlayerFloatOffset\(remote,\s*action,\s*groundY,\s*renderScale\)/);
  assert.match(appSource, /drawKuromiRoomPlayer\(ctx, remotePlayer, sprites \|\| \{\}, groundY, now, \{/);
  assert.match(appSource, /floatOffset:\s*renderFloatOffset/);
  assert.match(appSource, /applyInteractionRoomResult\(result, \{ render: !options\.silent \}\)/);
});

test('shared interaction rooms offer all travel and school map sets', () => {
  const config = loadKuromiRoomDemoConfig();
  const mapSetsById = new Map(config.mapSets.map(mapSet => [mapSet.id, mapSet]));
  for (const expectedMapSet of newRoomMapSets) {
    const mapSet = mapSetsById.get(expectedMapSet.id);
    assert.ok(mapSet, `${expectedMapSet.id} should be selectable when creating an interaction room`);
    assert.equal(mapSet.name, expectedMapSet.name);
    assert.equal(mapSet.backgroundMode || '', expectedMapSet.backgroundMode);
    assert.equal(mapSet.maps.length, expectedMapSet.maps.length);
    assert.ok(expectedMapSet.maps.includes(mapSet.previewSrc), `${expectedMapSet.id} preview should use one of its maps`);
    assert.deepEqual(mapSet.maps.map(map => map.backgroundSrc), expectedMapSet.maps);
    if (expectedMapSet.backgroundMode) {
      assert.ok(mapSet.maps.every(map => map.backgroundMode === expectedMapSet.backgroundMode), `${expectedMapSet.id} maps should render as one fixed image in the room canvas`);
    } else {
      assert.ok(mapSet.maps.every(map => !map.backgroundMode), `${expectedMapSet.id} maps should keep the long-world camera system`);
    }
    for (const relativePath of expectedMapSet.maps) {
      const imagePath = path.join(projectRoot, ...relativePath.split('/'));
      const { width, height } = readPngSize(imagePath);
      assert.ok(width >= 1536, `${relativePath} should be wide enough for the room world`);
      assert.ok(height >= 864, `${relativePath} should be tall enough for the room crop`);
    }
  }
  assert.match(appSource, /function isKuromiRoomSingleScreenMap\(map\)/);
  assert.match(appSource, /function getKuromiRoomWorldWidthForMap\(map\)/);
  assert.match(appSource, /function getKuromiRoomTargetCameraX\(map, playerX\)/);
  assert.match(appSource, /drawKuromiRoomFitImage\(ctx, image, KUROMI_ROOM_DEMO\.viewWidth, KUROMI_ROOM_DEMO\.viewHeight\)/);
  assert.doesNotMatch(appSource, /drawKuromiRoomRepeatFitHeightImage/);
});

test('interaction area starts with three large actions and pet mini games', () => {
  assert.match(htmlSource, /id="mini-game-overlay"/);
  assert.match(htmlSource, /id="mini-game-canvas"/);
  assert.match(htmlSource, /data-mini-game-action/);
  assert.match(htmlSource, /data-mini-game-retry/);
  assert.match(appSource, /data-interaction-lobby-mode="join"/);
  assert.match(appSource, /data-interaction-lobby-mode="create"/);
  assert.match(appSource, /data-mini-game-open/);
  assert.match(appSource, /CY反应轮盘/);
  assert.match(appSource, /CY跳跳跳/);
  assert.match(appSource, /CY跑跑跑/);
  assert.match(appSource, /CY跳一跳/);
  assert.match(appSource, /function startFlappyMiniGame/);
  assert.match(appSource, /function startRunnerMiniGame/);
  assert.match(appSource, /function drawMiniGamePetHead/);
  assert.match(appSource, /function bindMiniGameKeyboardInput/);
  assert.match(appSource, /function loadMiniGamePetSprites/);
  assert.match(appSource, /function drawRunnerMiniGamePet/);
  assert.match(appSource, /function setRunnerMiniGameDuck/);
  assert.match(appSource, /function pressRunnerMiniGameJump/);
  assert.match(appSource, /RUNNER_MAX_JUMP_HOLD_MS/);
  assert.match(appSource, /RUNNER_FAST_DROP_GRAVITY/);
  assert.match(appSource, /player\.fastDropping/);
  assert.match(appSource, /const treeChance = game\.score > 18 \? Math\.min\(0\.22, 0\.1 \+ difficulty \* 0\.12\) : 0;/, 'runner tree obstacles should stay rare and kid-friendly');
  assert.match(appSource, /const height = 52 \+ variant \* 10;/, 'runner trees should not spawn as huge impossible obstacles');
  assert.match(appSource, /ArrowDown|KeyS/, 'runner should support keyboard crouch controls');
  assert.match(appSource, /data-runner-control="jump"/, 'runner should expose a dedicated mobile jump button');
  assert.match(appSource, /data-runner-control="duck"/, 'runner should expose a dedicated mobile crouch button');
  assert.match(appSource, /assets\/8bit\/characters-crouch\/\$\{fileName\}/, 'runner should use the room crouch sprite instead of a head-only pet');
  assert.match(appSource, /assets\/8bit\/characters-jump\/\$\{fileName\}/, 'runner should use the room jump sprite instead of a head-only pet');
  assert.doesNotMatch(extractAppFunction('drawRunnerMiniGame'), /drawMiniGamePetSprite/, 'runner should draw full room action sprites, not a head-only sprite');
  assert.match(appSource, /function renderEmbeddedMiniGameShell/);
  assert.match(appSource, /data-mini-game-fullscreen/);
  assert.match(appSource, /assets\/8bit\/heads\/\$\{fileName\}/);
  assert.match(appSource, /function enterMiniGameFullscreen/);
  assert.match(cssSource, /\.interaction-room-menu-grid/);
  assert.match(cssSource, /\.interaction-room-menu-card strong/);
  assert.match(cssSource, /\.mini-game-picker\s*\{[\s\S]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/, 'mini game choices should stay compact enough for four games in one row on desktop');
  assert.match(cssSource, /\.mini-game-choice\s*\{[\s\S]*min-height:\s*104px/, 'mini game choice buttons should be compact instead of oversized cards');
  assert.match(cssSource, /\.mini-game-page/);
  assert.match(cssSource, /body\.mini-game-fullscreen-mode/);
  assert.match(cssSource, /\.mini-game-canvas/);
  assert.match(cssSource, /\.mini-game-runner-controls\s*\{[\s\S]*touch-action:\s*none/, 'runner touch controls should not trigger mobile browser gestures');
  assert.match(cssSource, /body\.mini-game-fullscreen-mode\s+\.mini-game-page\s*\{[\s\S]*position:\s*fixed;[\s\S]*width:\s*100dvw;[\s\S]*height:\s*100dvh/s, 'mini games should use a true fixed fullscreen layout on phones');
  const headAssets = fs.readdirSync(path.join(projectRoot, 'assets', '8bit', 'heads')).filter(file => file.endsWith('.png'));
  assert.equal(headAssets.length, countPetCatalogEntries(), 'mini games should have one clean 8-bit head asset for each current pet');
});

test('jump charge mini game uses pet action sprites, no aim line, and cloud-safe scoring', () => {
  const choices = extractAppFunction('getMiniGameChoices');
  const startJump = extractAppFunction('startJumpChargeMiniGame');
  const drawJump = extractAppFunction('drawJumpChargeMiniGame');

  assert.match(appSource, /const MINI_GAME_SCORE_KEYS = \['reaction', 'flappy', 'runner', 'jumpCharge'\];/, 'new mini game scores should be normalized through one shared key list');
  assert.match(choices, /type:\s*'jumpCharge'[\s\S]*title:\s*'CY跳一跳'/, 'the interaction page should offer CY jump charge as a fourth mini game');
  assert.match(startJump, /按住蓄力/, 'jump charge should teach students to hold before releasing');
  assert.match(appSource, /function startJumpChargeMiniGameCharge/, 'jump charge should start power charging on pointer down');
  assert.match(appSource, /function releaseJumpChargeMiniGame/, 'jump charge should release into a jump on pointer up');
  assert.match(appSource, /JUMP_CHARGE_MAX_HOLD_MS/, 'jump charge should cap hold time');
  assert.match(appSource, /JUMP_CHARGE_CENTER_BONUS_RADIUS/, 'jump charge should treat the platform center as a special hit zone');
  assert.match(appSource, /JUMP_CHARGE_PERFECT_RINGS/, 'perfect center hits should create ripple rings');
  assert.match(appSource, /playMiniGameSound\('charge'\)/, 'starting charge should play a charge sound');
  assert.match(appSource, /playMiniGameSound\('jump'\)/, 'releasing charge should play a jump sound');
  assert.match(appSource, /playMiniGameSound\('perfect'\)/, 'center landings should play a perfect sound');
  assert.match(drawJump, /drawJumpChargeRippleFeedback/, 'center landings should draw a ripple under the pet');
  assert.match(drawJump, /drawJumpChargePetSprite/, 'the game should draw the full 8-bit pet sprite');
  assert.match(appSource, /assets\/8bit\/characters\/\$\{fileName\}/, 'charging should have access to the standing pet sprite');
  assert.match(appSource, /assets\/8bit\/characters-jump\/\$\{fileName\}/, 'right jumps should use right-facing jump art');
  assert.match(appSource, /assets\/8bit\/characters-jump-left\/\$\{fileName\}/, 'left jumps should use left-facing jump art');
  assert.doesNotMatch(drawJump, /drawJumpChargeAimLine|lineTo\(\s*screenCurrent|strokeStyle\s*=\s*['"]#fff|strokeStyle\s*=\s*['"]rgba\(255,\s*255,\s*255/i, 'the charge game should not draw the old white aim line');
  assert.match(backendApiSource, /jumpCharge:\s*Math\.max\(readScore\(existing, 'jumpCharge', 'jump_charge'\), readScore\(incoming, 'jumpCharge', 'jump_charge'\)\)/, 'Supabase merge should preserve jump charge high scores');
  assert.match(backendApiSource, /state:\s*\{\s*\.\.\.student,\s*studentId,\s*miniGameHighScores\s*\}/, 'Supabase writes should normalize all mini game score keys before saving state');
  assert.match(backendApiSource, /if \(!existingStudent\)\s*\{[\s\S]*miniGameHighScores:\s*mergeMiniGameHighScores\(\{\},\s*incomingStudent\.miniGameHighScores \|\| incomingStudent\.mini_game_scores\)/, 'new Supabase states should get a complete mini game score object');
  assert.match(backendBundleSource, /jumpCharge:\s*Math\.max\(readScore\(existing,\s*"jumpCharge",\s*"jump_charge"\),\s*readScore\(incoming,\s*"jumpCharge",\s*"jump_charge"\)\)/, 'the deployed local Edge bundle should preserve jump charge high scores too');
  assert.match(backendBundleSource, /state:\s*\{\s*\.\.\.student,\s*studentId,\s*miniGameHighScores\s*\}/, 'the deployed local Edge bundle should normalize mini game score keys before saving state');
  [
    'assets/mini-games/jump-one-jump/background/sky-city.png',
    'assets/mini-games/jump-one-jump/platforms/platform-left.png',
    'assets/mini-games/jump-one-jump/platforms/platform-right.png',
    'assets/mini-games/jump-one-jump/platforms/platform-round.png'
  ].forEach(relativePath => {
    assert.equal(fs.existsSync(path.join(projectRoot, relativePath)), true, `${relativePath} should be available in the app`);
  });
});

test('mini game records refresh cloud and leaderboard state after a new high score', () => {
  const recordScore = extractAppFunction('recordMiniGameScore');
  const finishRound = extractAppFunction('finishMiniGameRound');

  assert.match(appSource, /async function persistMiniGameHighScore/, 'mini game high scores should use a narrow cloud save path');
  assert.match(appSource, /function mergeWallLeaderboardStudent/, 'new local records should update the leaderboard cache immediately');
  assert.match(recordScore, /mergeWallLeaderboardStudent\(student\)/, 'recording a new score should patch the current player into leaderboard data');
  assert.match(recordScore, /persistMiniGameHighScore\(student,\s*key,\s*nextScore,\s*event\)/, 'mini game saves should not depend on a full student state overwrite');
  assert.match(recordScore, /loadWallLeaderboardStudents\(\)/, 'successful cloud saves should refresh leaderboard rows from Supabase');
  assert.match(finishRound, /recordMiniGameScore\(type,\s*safeScore\)/, 'round completion should still persist high scores');
  assert.match(finishRound, /setMiniGameStatus\(getMiniGameResultStatus\(type,\s*safeScore\)\)/, 'round status should update again after the async save finishes');
  assert.match(backendApiSource, /async function recordMiniGameScore/, 'Supabase API should expose a dedicated mini game high score action');
  assert.match(backendApiSource, /if \(action === 'recordMiniGameScore'\) return recordMiniGameScore\(payload\);/, 'the deployed Supabase handler should route mini game score saves');
  assert.match(backendBundleSource, /async function recordMiniGameScore/, 'local Edge bundle should include the mini game high score action too');
});

test('flappy mini game uses forgiving thin pipe collision edges for younger players', () => {
  assert.match(appSource, /const FLAPPY_PIPE_COLLISION_INSET = 10;/, 'flappy pipes should keep a visible safety inset around pillar edges');
  const drawFlappy = extractAppFunction('drawFlappyMiniGame');
  assert.match(drawFlappy, /pipe\.x \+ FLAPPY_PIPE_COLLISION_INSET/, 'flappy collision should inset the left and right pillar edges');
  assert.match(drawFlappy, /FLAPPY_PIPE_WIDTH - FLAPPY_PIPE_COLLISION_INSET \* 2/, 'flappy collision should use a thinner hit box than the visible pipe');
  assert.match(drawFlappy, /topHeight - FLAPPY_PIPE_COLLISION_INSET/, 'flappy collision should soften the upper gap lip');
  assert.match(drawFlappy, /bottomY \+ FLAPPY_PIPE_COLLISION_INSET/, 'flappy collision should soften the lower gap lip');
});

test('mini game pet art resets per pet and runner mobile controls stay playable', () => {
  const loadHead = extractAppFunction('loadMiniGamePetHead');
  const shell = extractAppFunction('renderEmbeddedMiniGameShell');
  const startRunner = extractAppFunction('startRunnerMiniGame');
  const drawRunnerPet = extractAppFunction('drawRunnerMiniGamePet');

  assert.match(appSource, /headPetId:\s*''/, 'mini games should track which pet and stage owns the cached head image');
  assert.match(appSource, /cacheKey:\s*profile\.cacheKey \|\| getKuromiRoomSpriteCacheKey\(petId,\s*profile\.stage,\s*profile\.style\)/, 'mini games should cache pet art by evolution stage and route style');
  assert.match(loadHead, /miniGameState\.headPetId !== cacheKey/, 'switching pets or evolution stages should invalidate stale mini game head art');
  assert.match(loadHead, /miniGameState\.headImage = null/, 'stale head art should be cleared before async image loading finishes');
  assert.match(shell, /data-runner-control="jump"[\s\S]*aria-hidden="true">↑<\/span>/, 'runner jump control should show only a clear arrow');
  assert.match(shell, /data-runner-control="duck"[\s\S]*aria-hidden="true">↓<\/span>/, 'runner duck control should show only a clear arrow');
  assert.match(shell, /mini-game-page-back-button[\s\S]*data-mini-game-close[\s\S]*>←<\/button>/, 'mini games should keep the return button in the page header');
  assert.doesNotMatch(shell, /mini-game-return-button/, 'mini games should not render a second return button inside the game controls');
  assert.doesNotMatch(shell, /data-runner-control="(?:jump|duck)"[\s\S]{0,240}<small>/, 'runner controls should not add text that can overflow on phones');
  assert.match(shell, /建议横屏游玩/, 'mini games should remind phone users to play in landscape');
  assert.match(startRunner, /updateMiniGameSurfaceStateClasses\(\)/, 'restarting runner should clear the ended shell before showing mobile controls');
  assert.match(startRunner, /if \(actions\) actions\.hidden = true;/, 'runner should hide the generic wide action button and use canvas or arrow controls');
  assert.match(appSource, /const RUNNER_PET_SCALE = 0\.[0-9]+;/, 'runner should have a game-specific pet scale instead of room-size sprites');
  assert.match(drawRunnerPet, /RUNNER_PET_SCALE/, 'runner drawing should apply the game-specific pet scale');
});

test('runner full-body pet art keeps its feet anchored to the track after mini-game scaling', () => {
  const drawRunnerPet = extractAppFunction('drawRunnerMiniGamePet');
  assert.match(drawRunnerPet, /const scaledWidth = getKuromiRoomActionWidth\(action\) \* RUNNER_PET_SCALE/);
  assert.match(drawRunnerPet, /const scaledHeight = getKuromiRoomActionHeight\(action\) \* RUNNER_PET_SCALE/);
  assert.match(drawRunnerPet, /const baseY = player\.y \+ player\.height/);
  assert.match(drawRunnerPet, /y:\s*baseY - getKuromiRoomActionHeight\(action\)/, 'runner should pass unscaled room-player y before drawKuromiRoomPlayer applies RUNNER_PET_SCALE');
  assert.match(drawRunnerPet, /drawKuromiRoomPlayer\(ctx,\s*roomPlayer,\s*miniGameState\.spriteImages,\s*RUNNER_GROUND_Y,\s*time,\s*\{[\s\S]*scale:\s*RUNNER_PET_SCALE/);
  assert.doesNotMatch(drawRunnerPet, /y:\s*baseY - height/, 'scaled height pushes the room renderer foot anchor below the track');
});

test('embedded mini games use a clean manual fullscreen player on phones', () => {
  assert.match(appSource, /function updateMiniGameSurfaceStateClasses/, 'mini games should keep shell classes in sync with play state');
  assert.match(appSource, /mini-game-playing-shell/, 'playing mini games should get a dedicated player shell class');
  assert.match(appSource, /mini-game-ended-shell/, 'finished mini games should reveal result actions without cluttering active play');
  assert.doesNotMatch(appSource, /startMiniGame[\s\S]*void enterMiniGameFullscreen\(\);/, 'embedded mini games should not force fullscreen before students choose it');
  assert.match(cssSource, /body\.mini-game-fullscreen-mode\s+\.mini-game-page\.mini-game-playing-shell\s*\{[\s\S]*padding:\s*0;[\s\S]*overflow:\s*hidden;/, 'fullscreen player should remove card padding');
  assert.match(cssSource, /body\.mini-game-fullscreen-mode\s+\.mini-game-page\.mini-game-playing-shell\s+\.mini-game-page-header\s+div\s*\{[\s\S]*display:\s*none/, 'fullscreen player should hide title text while playing');
  assert.match(cssSource, /body\.mini-game-fullscreen-mode\s+\.mini-game-page\.mini-game-playing-shell\s+\.mini-game-status[\s\S]*display:\s*none/, 'fullscreen player should hide status text while playing');
  assert.match(cssSource, /body\.mini-game-fullscreen-mode\s+\.mini-game-page\.mini-game-playing-shell\s+\.mini-game-canvas\s*\{[\s\S]*position:\s*fixed;[\s\S]*width:\s*min\(100dvw,\s*calc\(100dvh\s*\*\s*5\s*\/\s*3\)\);[\s\S]*height:\s*min\(100dvh,\s*calc\(100dvw\s*\*\s*3\s*\/\s*5\)\);/, 'fullscreen mini games should stay centered without stretching');
  assert.match(cssSource, /body\.mini-game-fullscreen-mode\s+\.mini-game-page\.mini-game-playing-shell:not\(\.mini-game-ended-shell\)\s+\.mini-game-actions\s*\{[\s\S]*display:\s*none/, 'active play should hide extra action buttons and rely on touch or game controls');
  assert.match(cssSource, /body\.mini-game-fullscreen-mode\s+\.mini-game-page\.mini-game-runner-shell\.mini-game-ended-shell\s+\.mini-game-actions\s*\{[\s\S]*display:\s*none/, 'runner results should not cover the mobile jump and duck controls after a crash');
  assert.match(cssSource, /mini-game-page-back-button[\s\S]*top:\s*calc\(env\(safe-area-inset-top\) \+ 10px\);[\s\S]*left:\s*calc\(env\(safe-area-inset-left\) \+ 12px\);/s, 'fullscreen mini games should keep the back button at the top-left edge');
});

test('reaction wheel practice is endless while evolution challenge stays fixed', () => {
  const drawReaction = extractAppFunction('drawReactionWheelGame');
  const attemptReaction = extractAppFunction('attemptReactionWheel');
  const startReaction = extractAppFunction('startReactionWheelGame');

  assert.match(drawReaction, /drawMiniGamePetSprite\(ctx, cx, cy, 132, 132/, 'reaction wheel should draw the full 8-bit pet sprite instead of a cropped head');
  assert.doesNotMatch(drawReaction, /drawMiniGamePetHead\(ctx, cx, cy/, 'reaction wheel center should not use the cropped head renderer');
  assert.match(startReaction, /const requiredHits = challenge \? Math\.max\(1,[\s\S]*\) : 0;/, 'normal reaction practice should not keep the old five-hit finish limit');
  assert.match(startReaction, /endless: !challenge/, 'normal reaction practice should be marked as endless score practice');
  assert.match(startReaction, /maxSpeed: challenge \? 380 : 320/, 'normal reaction practice should have a lower kid-friendly speed cap');
  assert.match(attemptReaction, /if \(reaction\.challenge && reaction\.hits >= reaction\.requiredHits\)/, 'only evolution challenges should complete after the required hit count');
});

test('pet interaction supports a grid-based furniture builder', () => {
  assert.match(appSource, /const PET_INTERACTION_GRID = \{ rows: 10, cols: 20 \};/);
  assert.match(appSource, /const PET_INTERACTION_FURNITURE = \[/);
  assert.match(appSource, /id: 'tree'/);
  assert.match(appSource, /image: 'assets\/pet-interactions\/furniture\/tree\.png'/);
  assert.match(appSource, /function renderPetBuilderGrid\(\)/);
  assert.match(appSource, /function renderPetFurnitureTray\(student = getStudent\(\)\)/);
  assert.match(appSource, /function startFurniturePlacement\(itemId\)/);
  assert.match(appSource, /function placeFurnitureAtCell\(row, col\)/);
  assert.match(appSource, /student\.petRoomDecorations/);
  assert.match(appSource, /data-builder-cell/);
  assert.match(appSource, /data-furniture-item/);
  assert.match(appSource, /data-remove-furniture/);
  assert.match(cssSource, /blank-meadow-builder\.png/);
  assert.match(cssSource, /\.pet-interaction-stage\.placing-furniture/);
  assert.match(cssSource, /\.pet-interaction-stage\.placing-furniture::before/);
  assert.match(cssSource, /\.pet-builder-cell\s*\{[\s\S]*background:\s*rgba\(86,\s*183,\s*255,\s*\.18\)/);
  assert.match(cssSource, /\.placed-furniture/);
  assert.match(cssSource, /\.placed-furniture img/);
});

test('student app hides local reset controls from the footer', () => {
  assert.doesNotMatch(htmlSource, /id="reset-demo-button"/);
  assert.doesNotMatch(htmlSource, /重置本机演示资料/);
  assert.doesNotMatch(appSource, /\$\('#reset-demo-button'\)\.addEventListener/);
});

test('pet interaction uses generated full-size scene and transparent pet assets', () => {
  for (const [relativePath, minWidth, minHeight] of petInteractionAssets) {
    const imagePath = path.join(projectRoot, ...relativePath.split('/'));
    const { width, height } = readPngSize(imagePath);
    assert.ok(width >= minWidth, `${relativePath} should be wide enough for the interaction stage`);
    assert.ok(height >= minHeight, `${relativePath} should be tall enough for the interaction stage`);
  }
  assert.deepEqual(
    readPngSize(path.join(projectRoot, 'assets', 'pet-interactions', 'creeper', 'creeper-q-base.png')),
    { width: 900, height: 900 },
    'Creeper interaction art should use a grounded square canvas without excessive transparent air'
  );
});

test('pet interaction follows the current pet and keeps flying pets bounded', () => {
  assert.match(appSource, /const PET_INTERACTION_SPRITES = \{/);
  assert.match(appSource, /'twinkle-twinkle':\s*\{[^}]*src:\s*'assets\/pet-interactions\/pets\/twinkle-twinkle-q\.png'[^}]*movement:\s*'hover_bounded'/s);
  assert.match(appSource, /cinnamoroll:\s*\{[^}]*movement:\s*'fly_bounded'/s);
  assert.match(appSource, /enderdragon:\s*\{[^}]*movement:\s*'fly_bounded'/s);
  assert.match(appSource, /function getCurrentPetInteractionProfile\(\)/);
  assert.match(appSource, /function syncPetInteractionPet\(student = getStudent\(\)\)/);
  assert.match(appSource, /const profileSrc = withAssetVersion\(profile\.src\)/);
  assert.match(appSource, /pet\.querySelector\('img'\)\.src = profileSrc/);
  assert.match(appSource, /stage\.dataset\.movement = profile\.movement/);
  assert.match(appSource, /const zone = getPetInteractionZone\(profile\)/);
  assert.match(appSource, /PET_INTERACTION_FLIGHT_ZONES/);
  assert.doesNotMatch(appSource, /const creeper = \$\('#pet-interaction-creeper'\)/);
});

test('pet interaction includes playful motion and cute explosion styling', () => {
  assert.match(cssSource, /\.pet-interaction-stage\[data-scene="home"\][\s\S]*blank-meadow-builder\.png/);
  assert.doesNotMatch(cssSource, /\.pet-interaction-stage\[data-scene="meadow"\]/);
  assert.doesNotMatch(cssSource, /\.pet-interaction-stage\[data-scene="bedroom"\]/);
  assert.doesNotMatch(cssSource, /\.pet-interaction-stage\[data-scene="candy"\]/);
  assert.doesNotMatch(cssSource, /\.pet-interaction-stage\[data-scene="courtyard"\]/);
  assert.match(cssSource, /@keyframes\s+creeper-walk/);
  assert.match(cssSource, /@keyframes\s+creeper-run/);
  assert.match(cssSource, /@keyframes\s+creeper-sleep/);
  assert.match(cssSource, /@keyframes\s+creeper-wave/);
  assert.match(cssSource, /@keyframes\s+creeper-explode/);
  assert.match(cssSource, /\.pet-interaction-stage\s*\{[^}]*overflow:\s*hidden/s);
});

test('ground pet interaction stays grounded and favors walking over flying actions', () => {
  assert.match(appSource, /const PET_INTERACTION_WALK_ZONES = \{/);
  assert.match(appSource, /home:\s*\{\s*minX:\s*24,\s*maxX:\s*75,\s*minY:\s*0,\s*maxY:\s*22\s*\}/s);
  assert.doesNotMatch(appSource, /meadow:\s*\{\s*minX:\s*18,\s*maxX:\s*78,\s*minY:\s*2,\s*maxY:\s*28\s*\}/s);
  assert.match(appSource, /pet\.style\.setProperty\('--pet-x'/);
  assert.match(appSource, /pet\.style\.setProperty\('--pet-scale'/);
  assert.doesNotMatch(appSource, /setProperty\('--pet-bottom'/);
  assert.doesNotMatch(appSource, /function getPetInteractionBottomPixels/);
  assert.match(appSource, /const actions = \['walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'idle', 'run', 'sleep', 'wave', 'explode'\]/);
  assert.doesNotMatch(extractAppFunction('triggerPetInteractionAction'), /'jump'/);
  assert.doesNotMatch(appSource, /triggerPetInteractionAction\(petInteractionTapCount >= 4 \? 'explode' : 'jump'\)/);
  assert.match(cssSource, /\.pet-interaction-track\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0/s);
  assert.match(cssSource, /\.pet-interaction-pet\s*\{[^}]*bottom:\s*calc\(var\(--pet-y/s);
  assert.match(cssSource, /max-height:\s*calc\(100%\s*-\s*28px\)/);
  assert.doesNotMatch(cssSource, /\.pet-interaction-pet\s*\{[^}]*transition:[^}]*bottom/s);
  assert.doesNotMatch(cssSource, /@keyframes\s+creeper-jump/);
  assert.match(cssSource, /scale\(var\(--pet-scale,\s*1\)\)/);
  assert.doesNotMatch(cssSource, /\.pet-interaction-creeper\[data-pet-action="explode"\]\s*\{[^}]*animation:\s*creeper-explode/s);
  assert.match(cssSource, /\.pet-interaction-pet::before/);
  assert.match(cssSource, /@keyframes\s+creeper-footsteps/);
  assert.doesNotMatch(cssSource, /translateY\(-8[0-9]px\)/);
});

test('pet interaction clamps carried-over coordinates when the pet movement zone changes', () => {
  assert.deepEqual(
    runPetInteractionTarget({
      action: 'idle',
      movement: 'ground',
      scene: 'home',
      currentX: 90,
      currentY: 70
    }),
    {
      x: 75,
      y: 22,
      zone: { minX: 24, maxX: 75, minY: 0, maxY: 22 }
    }
  );
  assert.deepEqual(
    runPetInteractionTarget({
      action: 'feed',
      movement: 'fly_bounded',
      scene: 'home',
      currentX: 5,
      currentY: 0
    }),
    {
      x: 18,
      y: 30,
      zone: { minX: 18, maxX: 82, minY: 30, maxY: 62 }
    }
  );
});

test('pet interaction supports free drag-and-drop feeding', () => {
  assert.match(appSource, /const PET_INTERACTION_FOODS = \[/);
  assert.match(appSource, /const PET_FEED_RESPONSES = \[/);
  assert.match(appSource, /谢谢你！❤️/);
  assert.match(appSource, /好吃好吃！/);
  assert.match(appSource, /function setSelectedPetFood\(foodId = '', options = \{\}\)/);
  assert.match(appSource, /function getPetFeedTargetFromPoint\(clientX, clientY\)/);
  assert.match(appSource, /function feedPetInteraction\(foodId, target =/);
  assert.match(appSource, /function showPetFeedReaction\(target, food, message\)/);
  assert.match(appSource, /addEventListener\('dragstart'/);
  assert.match(appSource, /addEventListener\('dragover'/);
  assert.match(appSource, /addEventListener\('drop'/);
  assert.match(appSource, /addEventListener\('pointerdown'/);
  assert.match(appSource, /function startPetFoodPointerDrag/);
  assert.match(appSource, /event\.dataTransfer\.setData\('text\/plain'/);
  assert.match(appSource, /setSelectedPetFood\(foodButton\.dataset\.petFood\)/);
  assert.match(appSource, /feedPetInteraction\(selectedPetFoodId, guestPet\)/);
  assert.match(appSource, /feedPetInteraction\(selectedPetFoodId, interactionPet\)/);
  assert.match(appSource, /3000/);
  assert.match(cssSource, /\.pet-food-tray/);
  assert.match(cssSource, /\.pet-food-button/);
  assert.match(cssSource, /\.pet-food-button\.selected/);
  assert.match(cssSource, /\.pet-interaction-effects\[data-pet-action="feed"\]/);
  assert.match(cssSource, /\.pet-feed-bubble/);
  assert.match(cssSource, /\.pet-feed-hearts/);
  assert.match(cssSource, /@keyframes\s+pet-feed-bubble-pop/);
  assert.match(cssSource, /@keyframes\s+creeper-feed-bounce/);
  assert.match(cssSource, /\.pet-heart/);
  assert.match(appSource, /class="pet-feed-bubble"/);
  assert.doesNotMatch(appSource, /coins.*pet.*food|food.*coins/i);
});

test('gameplay screens reuse the character wallpaper behind translucent panels', () => {
  assert.match(cssSource, /\.app-screen::before\s*\{[\s\S]*login-characters-wallpaper\.png/);
  assert.match(cssSource, /\.app-screen::after\s*\{/);
  assert.match(cssSource, /\.app-screen\s+\.panel-card[\s\S]*background:\s*rgba\(255,\s*255,\s*255,\s*\.\d+\)/);
  assert.match(cssSource, /backdrop-filter:\s*blur\(/);
});
