const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');

const expectedRoles = [
  ['sunny-wing', 'Sunny Wing'],
  ['sprouty', 'Sprouty'],
  ['hydroblob', 'Hydroblob'],
  ['fluffbit', 'Fluffbit'],
  ['shadow-wing', 'Shadow Wing'],
  ['flame-rex', 'Flame Rex'],
  ['thunder-beetle', 'Thunder Beetle'],
  ['frost-fang', 'Frost Fang'],
  ['volt-cheetah', 'Volt Cheetah'],
  ['shadow-stalker', 'Shadow Stalker'],
  ['crybaby', 'Crybaby'],
  ['hacipupu', 'Hacipupu'],
  ['labubu', 'Labubu'],
  ['skullpanda', 'Skullpanda'],
  ['twinkle-twinkle', 'Twinkle Twinkle'],
  ['pikachu', 'Pikachu'],
  ['mewtwo', 'Mewtwo'],
  ['lucario', 'Lucario'],
  ['greninja', 'Greninja'],
  ['charizard', 'Charizard'],
  ['psyduck', 'Psyduck'],
  ['squirtle', 'Squirtle'],
  ['wolf', 'Wolf'],
  ['steve', 'Steve'],
  ['enderman', 'Enderman'],
  ['enderdragon', 'Ender Dragon'],
  ['creeper', 'Creeper'],
  ['kuromi', 'Kuromi'],
  ['my-melody', 'My Melody'],
  ['cinnamoroll', 'Cinnamoroll'],
  ['pochacco', 'Pochacco'],
  ['hello-kitty', 'Hello Kitty'],
  ['winnie-the-pooh', 'Winnie The Pooh'],
  ['crayon-shinchan', '蜡笔小新'],
  ['ugly-fish', '丑鱼'],
  ['yoyo', 'YOYO']
];

const newRoleAssets = {
  crybaby: ['popmart/crybaby/crybaby_before.png', 'popmart/crybaby/crybaby_after.png'],
  hacipupu: ['popmart/hacipupu/hacipupu_before.jpg', 'popmart/hacipupu/hacipupu_after.png'],
  labubu: ['popmart/labubu/labubu_before.png', 'popmart/labubu/labubu_after.png'],
  skullpanda: ['popmart/skullpanda/skullpanda_before.png', 'popmart/skullpanda/skullpanda_after.png'],
  'twinkle-twinkle': ['popmart/twinkle_twinkle/twinkle_twinkle_knight_before.png', 'popmart/twinkle_twinkle/twinkle_twinkle_after.png'],
  pikachu: ['pokemon/pikachu/pikachu_before.png', 'pokemon/pikachu/pikachu_after.png'],
  mewtwo: ['pokemon/mewtwo/mewtwo_before.png', 'pokemon/mewtwo/mewtwo_after.png'],
  lucario: ['pokemon/lucario/lucario_before.jpg', 'pokemon/lucario/lucario_after.png'],
  greninja: ['pokemon/greninja/greninja_before.png', 'pokemon/greninja/greninja_after.png'],
  charizard: ['pokemon/chalizard/chalizard_before.png', 'pokemon/chalizard/chalizard_after.png'],
  psyduck: ['pokemon/psyduck/psyduck_before.png', 'pokemon/psyduck/psyduck_after.png'],
  squirtle: ['pokemon/squirtle/squirtle_before.png', 'pokemon/squirtle/squirtle_after.png'],
  wolf: ['minecraft/wolf/wolf_before.png', 'minecraft/wolf/wolf_after.png'],
  steve: ['minecraft/steve/steve_before.jpg', 'minecraft/steve/steve_after.png'],
  enderman: ['minecraft/enderman/enderman_before.png', 'minecraft/enderman/enderman_after.png'],
  enderdragon: ['minecraft/enderdragon/enderdragon_before.png', 'minecraft/enderdragon/enderdragon_after.png'],
  creeper: ['minecraft/creeper/creeper_before.png', 'minecraft/creeper/creeper_after.png'],
  kuromi: ['sanrio/kuromi/kuromi_before.png', 'sanrio/kuromi/kuromi_after.png'],
  'my-melody': ['sanrio/my-melody/my-melody_before.png', 'sanrio/my-melody/my-melody_after.png'],
  cinnamoroll: ['sanrio/cinnamoroll/cinnamoroll_before.png', 'sanrio/cinnamoroll/cinnamoroll_after.png'],
  pochacco: ['sanrio/pochacco/pochacco_before.png', 'sanrio/pochacco/pochacco_after.png'],
  'hello-kitty': ['sanrio/hello-kitty/hello-kitty_before.png', 'sanrio/hello-kitty/hello-kitty_after.png'],
  'winnie-the-pooh': ['cartoon/winnie-the-pooh/winnie-the-pooh_before-v2.png', 'cartoon/winnie-the-pooh/winnie-the-pooh_after.png'],
  'crayon-shinchan': ['cartoon/crayon-shinchan/crayon-shinchan_before.jpg', 'cartoon/crayon-shinchan/crayon-shinchan_after.png'],
  'ugly-fish': ['cartoon/ugly-fish/ugly-fish_before.jpg', 'cartoon/ugly-fish/ugly-fish_after.png'],
  yoyo: ['cartoon/yoyo/yoyo_before.jpg', 'cartoon/yoyo/yoyo_after.png']
};

function loadEquipmentCatalog() {
  global.window = {};
  const catalogPath = path.join(projectRoot, 'equipment-catalog.js');
  delete require.cache[require.resolve(catalogPath)];
  require(catalogPath);
  return global.window;
}

function readImageSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.subarray(1, 4).toString('ascii') === 'PNG') {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7)
        };
      }
      offset += 2 + length;
    }
  }
  throw new Error(`Unsupported image file: ${filePath}`);
}

function collectFiles(folder, matcher, files = []) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const entryPath = path.join(folder, entry.name);
    if (entry.isDirectory()) collectFiles(entryPath, matcher, files);
    else if (matcher(entryPath)) files.push(entryPath);
  }
  return files;
}

test('catalog contains every role, including every new-character asset set', () => {
  const catalogSource = appSource.slice(appSource.indexOf('const PET_CATALOG'), appSource.indexOf('const ROLE_SKILL_COPY'));
  assert.equal((catalogSource.match(/^    \{ id: /gm) || []).length, expectedRoles.length, `PET_CATALOG should contain exactly ${expectedRoles.length} role entries`);
  for (const [roleId, roleName] of expectedRoles) {
    assert.match(catalogSource, new RegExp(`id: ['"]${roleId}['"][\\s\\S]{0,250}name: ['"]${roleName}['"]`), `${roleId} is missing from PET_CATALOG`);
  }
  for (const [roleId, [before, after]] of Object.entries(newRoleAssets)) {
    assert.match(appSource, new RegExp(`id: ['"]${roleId}['"][\\s\\S]{0,700}${escapeRegExp(before)}[\\s\\S]{0,700}${escapeRegExp(after)}`), `${roleId} is missing before/after new-character assets`);
  }
});

test('every role has a Q-style fallback asset for cute evolution routes', () => {
  const spriteSource = appSource.slice(appSource.indexOf('const PET_INTERACTION_SPRITES'), appSource.indexOf('const PET_CATALOG'));
  for (const [roleId] of expectedRoles) {
    const keyPattern = roleId.includes('-') ? `['"]${escapeRegExp(roleId)}['"]` : `(?:['"]${escapeRegExp(roleId)}['"]|${escapeRegExp(roleId)})`;
    assert.match(spriteSource, new RegExp(`${keyPattern}\\s*:\\s*\\{[\\s\\S]{0,180}src:\\s*['"]assets/pet-interactions/pets/${escapeRegExp(roleId)}-q\\.png['"]`), `${roleId} is missing a Q-style cute evolution fallback`);
    assert.ok(fs.existsSync(path.join(projectRoot, 'assets', 'pet-interactions', 'pets', `${roleId}-q.png`)), `${roleId} Q-style fallback file is missing`);
  }
});

test('every role has a non-empty exclusive equipment set and no generic catalog items remain', () => {
  const { EXCLUSIVE_EQUIPMENT_SETS, EQUIPMENT_CATALOG_DATA } = loadEquipmentCatalog();
  const setIds = new Set(EXCLUSIVE_EQUIPMENT_SETS.map(set => set.petId));
  const expectedItemCount = EXCLUSIVE_EQUIPMENT_SETS.reduce((total, set) => total + set.size, 0);
  assert.equal(EXCLUSIVE_EQUIPMENT_SETS.length, expectedRoles.length);
  assert.equal(EQUIPMENT_CATALOG_DATA.length, expectedItemCount);
  assert.equal(EQUIPMENT_CATALOG_DATA.every(item => item.exclusivePetId), true);
  assert.equal(new Set(EQUIPMENT_CATALOG_DATA.map(item => item.id)).size, EQUIPMENT_CATALOG_DATA.length);
  for (const [roleId] of expectedRoles) {
    assert.ok(setIds.has(roleId), `${roleId} has no exclusive equipment set`);
    const items = EQUIPMENT_CATALOG_DATA.filter(item => item.exclusivePetId === roleId);
    assert.ok(items.length === 4 || items.length === 6, `${roleId} should have 4 or 6 exclusive items`);
    assert.equal(new Set(items.map(item => item.slot)).size, items.length, `${roleId} has duplicate equipment slots`);
  }
});

test('exclusive equipment item artwork uses item-framed thumbnails instead of portrait strips', () => {
  const { EQUIPMENT_CATALOG_DATA } = loadEquipmentCatalog();
  for (const item of EQUIPMENT_CATALOG_DATA) {
    const imagePath = path.join(projectRoot, item.image);
    const { width, height } = readImageSize(imagePath);
    const ratio = Math.max(width / height, height / width);
    assert.ok(ratio <= 1.45, `${item.id} image is ${width}x${height}; equipment thumbnails should be cropped around the item, not saved as a tall strip`);
  }
});

test('role skill artwork uses clear square-ish icon thumbnails for before and evolved forms', () => {
  const skillFiles = collectFiles(
    path.join(projectRoot, 'assets', 'roles'),
    filePath => /(?:^|\/)(?:after-)?skill-(?:passive|1|2|3|ultimate)\.png$/.test(filePath)
  );
  assert.ok(skillFiles.length >= expectedRoles.length * 10, `Expected at least ${expectedRoles.length * 10} skill files, found ${skillFiles.length}`);
  for (const skillPath of skillFiles) {
    const { width, height } = readImageSize(skillPath);
    const ratio = Math.max(width / height, height / width);
    assert.ok(ratio <= 1.45, `${path.relative(projectRoot, skillPath)} is ${width}x${height}; skill icons should be cropped around the logo, not saved as a portrait strip`);
  }
});

test('new-character cropped skill and equipment files are present for all 20 roles', () => {
  for (const [roleId, [before, after]] of Object.entries(newRoleAssets)) {
    const folder = path.dirname(path.join(projectRoot, 'assets', 'roles', 'new character', before));
    assert.ok(fs.existsSync(path.join(folder, 'skill-passive.png')), `${roleId} missing skill-passive.png`);
    assert.ok(fs.existsSync(path.join(folder, 'after-skill-ultimate.png')), `${roleId} missing after-skill-ultimate.png`);
    for (let index = 1; index <= 4; index += 1) {
      const itemPath = path.join(projectRoot, 'assets', 'equipment-items', 'exclusive', roleId, `${String(index).padStart(2, '0')}.png`);
      assert.ok(fs.existsSync(itemPath), `${roleId} missing exclusive equipment item ${index}`);
      assert.ok(fs.statSync(itemPath).size > 0, `${roleId} exclusive equipment item ${index} is empty`);
    }
  }
});

test('sanrio role card artwork keeps the 1920x1080 landscape card format', () => {
  const sanrioRoleIds = ['kuromi', 'my-melody', 'cinnamoroll', 'pochacco', 'hello-kitty'];
  for (const roleId of sanrioRoleIds) {
    const folder = path.join(projectRoot, 'assets', 'roles', 'new character', 'sanrio', roleId);
    assert.deepEqual(readImageSize(path.join(folder, `${roleId}_before.png`)), { width: 1920, height: 1080 }, `${roleId} before artwork should be 1920x1080`);
    assert.deepEqual(readImageSize(path.join(folder, `${roleId}_after.png`)), { width: 1920, height: 1080 }, `${roleId} evolved artwork should be 1920x1080`);
  }
});

test('non-female battle and creature roles have 1920x1080 cute final evolution cards', () => {
  const cuteEvolutionRoleIds = [
    'sunny-wing',
    'sprouty',
    'hydroblob',
    'fluffbit',
    'shadow-wing',
    'flame-rex',
    'thunder-beetle',
    'frost-fang',
    'volt-cheetah',
    'shadow-stalker',
    'pikachu',
    'mewtwo',
    'lucario',
    'greninja',
    'charizard',
    'psyduck',
    'squirtle',
    'wolf',
    'steve',
    'enderman',
    'enderdragon',
    'creeper'
  ];
  const catalogSource = catalogSourceFor(appSource);
  for (const roleId of cuteEvolutionRoleIds) {
    const imagePath = `assets/roles/cute-evolved/${roleId}.png`;
    assert.match(catalogSource, new RegExp(`id: ['"]${escapeRegExp(roleId)}['"][\\s\\S]{0,260}cuteEvolvedImage: ['"]${escapeRegExp(imagePath)}['"]`), `${roleId} should expose its cute final evolution image`);
    assert.deepEqual(readImageSize(path.join(projectRoot, imagePath)), { width: 1920, height: 1080 }, `${roleId} cute final evolution card should be 1920x1080`);
  }
});

test('every role has a 1920x1080 mini evolution card wired into the catalog', () => {
  const miniSource = appSource.slice(appSource.indexOf('const MINI_EVOLUTION_IMAGES'), appSource.indexOf('PET_CATALOG.forEach((pet) =>'));
  assert.match(appSource, /pet\.miniEvolutionImage = MINI_EVOLUTION_IMAGES\[pet\.id\] \|\| ''/);
  assert.match(appSource, /function getVersionedRoleCardAsset\(src\)/);
  assert.doesNotMatch(miniSource, /pet-interactions/, 'mini evolution role cards must not point at Q-style interaction sprites');
  for (const [roleId] of expectedRoles) {
    const imagePath = `assets/roles/mini-evolved/${roleId}.png`;
    const keyPattern = roleId.includes('-') ? `['"]${escapeRegExp(roleId)}['"]` : `(?:['"]${escapeRegExp(roleId)}['"]|${escapeRegExp(roleId)})`;
    assert.match(miniSource, new RegExp(`${keyPattern}\\s*:\\s*['"]${escapeRegExp(imagePath)}['"]`), `${roleId} should expose its mini evolution image`);
    assert.deepEqual(readImageSize(path.join(projectRoot, imagePath)), { width: 1920, height: 1080 }, `${roleId} mini evolution card should be 1920x1080`);
  }
});

test('catalog role card previews have generated optimized thumbnails', () => {
  const miniSource = appSource.slice(appSource.indexOf('const MINI_EVOLUTION_IMAGES'), appSource.indexOf('PET_CATALOG.forEach((pet) =>'));
  const previewPaths = [];
  for (const [roleId] of expectedRoles) {
    const entry = roleCatalogEntry(roleId);
    ['image', 'evolvedImage', 'cuteEvolvedImage'].forEach(field => {
      const match = entry.match(new RegExp(`\\b${field}:\\s*['"]([^'"]*assets/roles/[^'"]+)['"]`));
      if (match) previewPaths.push(match[1]);
    });
  }
  previewPaths.push(...[...miniSource.matchAll(/:\s*['"]([^'"]*assets\/roles\/mini-evolved\/[^'"]+)['"]/g)].map(match => match[1]));
  assert.ok(previewPaths.length > expectedRoles.length, 'role previews should include base, final, cute and mini card paths');
  for (const imagePath of previewPaths) {
    assert.ok(fs.existsSync(path.join(projectRoot, imagePath)), `${imagePath} should exist`);
    assert.ok(fs.existsSync(rolePreviewThumbPath(imagePath)), `${imagePath} should have a matching optimized thumbnail`);
  }
});

test('every role has base, mini, heroic and cute evolution display names', () => {
  const namesStart = appSource.indexOf('const PET_EVOLUTION_NAMES');
  const namesEnd = appSource.indexOf('PET_CATALOG.forEach((pet) =>');
  const namesSource = appSource.slice(namesStart, namesEnd);
  assert.notEqual(namesStart, -1, 'PET_EVOLUTION_NAMES should exist');
  assert.equal((namesSource.match(/^\s{4}(?:['"][^'"]+['"]|\w+): \{ base:/gm) || []).length, expectedRoles.length, 'every role should have an evolution display-name entry');
  assert.match(appSource, /pet\.evolutionNames = PET_EVOLUTION_NAMES\[pet\.id\]/);
  for (const [roleId, roleName] of expectedRoles) {
    const keyPattern = roleId.includes('-') ? `['"]${escapeRegExp(roleId)}['"]` : `(?:['"]${escapeRegExp(roleId)}['"]|${escapeRegExp(roleId)})`;
    assert.match(
      namesSource,
      new RegExp(`${keyPattern}\\s*:\\s*\\{\\s*base:\\s*['"]${escapeRegExp(roleName)}['"],\\s*mini:\\s*['"][^'"]+['"],\\s*heroic:\\s*['"][^'"]+['"],\\s*cute:\\s*['"][^'"]+['"]\\s*\\}`),
      `${roleId} should define all evolution display names`,
    );
  }
  assert.match(namesSource, /hydroblob:\s*\{[^}]*mini:\s*'Hydro Wyrmling'[^}]*heroic:\s*'Hydro Dragonlord'[^}]*cute:\s*'Hydro Bubblebun'/);
  assert.match(namesSource, /pikachu:\s*\{[^}]*cute:\s*'Pika Starbuddy'/);
  assert.match(namesSource, /creeper:\s*\{[^}]*cute:\s*'Creeper Puffboom'/);
});

test('new-character rarities match the requested progression tiers', () => {
  const requestedRarities = {
    crybaby: 'SR',
    labubu: 'SSR',
    skullpanda: 'SSR',
    greninja: 'SSR',
    charizard: 'SSR',
    enderman: 'LEGEND',
    enderdragon: 'LEGEND',
    creeper: 'LEGEND',
    'twinkle-twinkle': 'SSR',
    pikachu: 'LIMITED',
    mewtwo: 'LEGEND',
    lucario: 'SSR',
    wolf: 'SSR',
    psyduck: 'SSR',
    squirtle: 'SSR',
    steve: 'SR',
    kuromi: 'SSR',
    'my-melody': 'SSR',
    cinnamoroll: 'SSR',
    pochacco: 'SSR',
    'hello-kitty': 'SSR',
    'winnie-the-pooh': 'SSR',
    'crayon-shinchan': 'SR',
    'ugly-fish': 'SR',
    yoyo: 'SSR'
  };
  for (const [roleId, rarity] of Object.entries(requestedRarities)) {
    assert.match(catalogSourceFor(appSource), new RegExp(`id: ['"]${roleId}['"][\\s\\S]{0,120}rarity: ['"]${rarity}['"]`), `${roleId} should be ${rarity}`);
  }
});

test('every new character has five named skill introductions', () => {
  const newRoleIds = ['crybaby', 'hacipupu', 'labubu', 'skullpanda', 'twinkle-twinkle', 'pikachu', 'mewtwo', 'lucario', 'greninja', 'charizard', 'psyduck', 'squirtle', 'wolf', 'steve', 'enderman', 'enderdragon', 'creeper', 'kuromi', 'my-melody', 'cinnamoroll', 'pochacco', 'hello-kitty', 'winnie-the-pooh', 'crayon-shinchan', 'ugly-fish', 'yoyo'];
  const skillCopySource = appSource.slice(appSource.indexOf('const ROLE_SKILL_COPY'), appSource.indexOf('const SKILL_IMAGE_FILES'));
  for (const roleId of newRoleIds) {
    const entry = skillCopySource.match(new RegExp(`(?:['"]${roleId}['"]|${roleId}): \\[([\\s\\S]*?)\\n    \\]`));
    assert.ok(entry, `${roleId} should have a ROLE_SKILL_COPY entry`);
    assert.equal(['被动', '技能 1', '技能 2', '技能 3', '大招'].filter(type => entry[1].includes(`['${type}'`)).length, 5, `${roleId} should have five skill entries`);
    assert.doesNotMatch(entry[1], /的专属(?:被动天赋|技能一|第二项专属技能|第三项专属技能|终极专属技能)/, `${roleId} should not use generic skill copy`);
  }
});

function catalogSourceFor(source) {
  return source.slice(source.indexOf('const PET_CATALOG'), source.indexOf('const ROLE_SKILL_COPY'));
}

test('demo mode can switch to any catalog pet', () => {
  const switcher = appSource.slice(appSource.indexOf('function switchActivePet'), appSource.indexOf('function getPetDisplayImage'));
  assert.match(switcher, /student\.demoMode/);
  assert.match(switcher, /student\.ownedPets\s*=\s*\[\.\.\.ownedPets, petType\]/);
});

test('Pikachu evolved combat power is fixed at 999999', () => {
  assert.match(appSource, /id: ['"]LIMITED['"]/);
  assert.match(appSource, /label: ['"]LIMITED EDITION['"]/);
  assert.match(appSource, /student\.petType === ['"]pikachu['"]/);
  assert.match(appSource, /999999/);
});

test('requested role identities have distinct battle stat profiles', () => {
  const stats = Object.fromEntries(expectedRoles.map(([roleId]) => [roleId, baseStatsFor(roleId)]));

  assert.deepEqual(stats['sunny-wing'], { hp: 105, attack: 12, defense: 10, speed: 12, luck: 14 }, 'Sunny Wing stats should stay rarity-balanced; only its ultimate has the requested rebirth identity');
  assert.ok(stats.sprouty.hp >= 160, 'Sprouty should have very high HP');
  assert.ok(stats.sprouty.defense >= 45, 'Sprouty should have very high defense');
  assert.ok(stats.sprouty.speed <= 5, 'Sprouty should be slow');
  assert.ok(stats['shadow-wing'].speed >= 40, 'Shadow Wing should be very fast');
  assert.ok(stats['shadow-wing'].hp <= 90, 'Shadow Wing should have lower HP than peers');
  assert.ok(stats['flame-rex'].attack >= 45, 'Flame Rex should have high damage');
  assert.ok(stats['flame-rex'].speed <= 8, 'Flame Rex should be slow');
  assert.ok(stats['volt-cheetah'].speed >= 60, 'Volt Cheetah should be extremely fast');
  assert.ok(stats['volt-cheetah'].attack >= 50, 'Volt Cheetah should hit hard');
  assert.ok(stats['volt-cheetah'].hp <= 130, 'Volt Cheetah should trade away some HP');
  assert.equal(stats['shadow-stalker'].luck, 0, 'Shadow Stalker should have 0 luck');
  assert.equal(stats['shadow-stalker'].defense, 0, 'Shadow Stalker should have 0 defense');
  assert.ok(stats['shadow-stalker'].attack >= 80, 'Shadow Stalker should put its points into damage');
  assert.ok(stats.pikachu.attack >= 50 && stats.pikachu.speed >= 60, 'Pikachu stats should support the 999999 evolved power fantasy');
  assert.ok(stats.enderman.speed >= 999, 'Enderman speed should read as effectively infinite');
  assert.ok(stats.enderman.hp <= 140 && stats.enderman.attack <= 40 && stats.enderman.defense <= 30, 'Enderman non-speed stats should stay medium');
  assert.ok(stats.enderdragon.defense >= 80, 'Ender Dragon should have very high defense');
  assert.ok(stats.creeper.attack >= 55 && stats.creeper.defense >= 50, 'Creeper should have high damage and defense');
  assert.ok(stats.creeper.speed <= 6, 'Creeper should be slow');
});

test('only requested stat-special roles break out of rarity-balanced ranges', () => {
  const statSpecialRoles = new Set([
    'sprouty',
    'shadow-wing',
    'flame-rex',
    'volt-cheetah',
    'shadow-stalker',
    'pikachu',
    'enderman',
    'enderdragon',
    'creeper',
    'winnie-the-pooh',
    'crayon-shinchan',
    'ugly-fish',
    'yoyo'
  ]);
  const rarityRanges = {
    A: { hp: [90, 115], attack: [8, 15], defense: [8, 15], speed: [8, 15], luck: [8, 16] },
    R: { hp: [105, 125], attack: [10, 18], defense: [9, 18], speed: [8, 18], luck: [8, 16] },
    SR: { hp: [110, 140], attack: [13, 26], defense: [10, 24], speed: [9, 22], luck: [8, 18] },
    SSR: { hp: [105, 150], attack: [15, 30], defense: [9, 28], speed: [10, 28], luck: [10, 20] },
    LEGEND: { hp: [120, 155], attack: [22, 38], defense: [12, 28], speed: [14, 30], luck: [12, 22] }
  };

  for (const [roleId] of expectedRoles) {
    if (statSpecialRoles.has(roleId)) continue;
    const entry = roleCatalogEntry(roleId);
    const rarity = entry.match(/rarity:\s*'([^']+)'/)[1];
    const ranges = rarityRanges[rarity];
    if (!ranges) continue;
    const stats = baseStatsFor(roleId);
    for (const [key, [min, max]] of Object.entries(ranges)) {
      assert.ok(
        stats[key] >= min && stats[key] <= max,
        `${roleId} ${key} should stay in ${rarity} rarity range (${min}-${max}), got ${stats[key]}`
      );
    }
  }
});

test('infinite speed display is reserved for Enderman only', () => {
  const formatter = appSource.slice(appSource.indexOf('function formatStatValue'), appSource.indexOf('function updateCombatPowerDisplay'));
  assert.match(formatter, /function formatStatValue\(key, value, petType = ''\)/);
  assert.match(formatter, /key === 'speed' && petType === 'enderman'/);

  const statsRenderer = appSource.slice(appSource.indexOf('function renderStatsSummary'), appSource.indexOf('function formatStatValue'));
  assert.match(statsRenderer, /function renderStatsSummary\(stats, previousStats, petType = ''\)/);
  assert.match(statsRenderer, /formatStatValue\(key, stats\[key\], petType\)/);
  assert.match(appSource, /renderStatsSummary\(combat\.stats, previous\?\.stats, student\.petType\)/);
  assert.match(appSource, /renderWallStatGrid\(post\.petStats, post\.petType\)/);
});

test('evolved stat multiplier differs by rarity instead of one fixed ten-times rule', () => {
  assert.match(appSource, /const EVOLUTION_RARITY_MULTIPLIERS\s*=\s*\{/);
  assert.match(appSource, /function getEvolutionMultiplier\(pet\)/);
  assert.match(appSource, /getEvolutionMultiplier\(pet\)/);
  assert.doesNotMatch(appSource, /const multiplier = isPetEvolved\(student\) \? 10 : 1/);
  assert.match(appSource, /进化后会依照稀有度/);
});

test('skill introductions match visible icons for corrected roles', () => {
  const skillCopySource = appSource.slice(appSource.indexOf('const ROLE_SKILL_COPY'), appSource.indexOf('const SKILL_IMAGE_FILES'));
  const sunnyWing = roleSkillEntry(skillCopySource, 'sunny-wing');
  const steve = roleSkillEntry(skillCopySource, 'steve');

  assert.match(sunnyWing, /重生/, 'Sunny Wing ultimate should mention rebirth');
  assert.doesNotMatch(steve, /TNT 投掷|建造护墙|末影终结/, 'Steve should not keep mismatched TNT, wall, or Ender copy');
  assert.match(steve, /钻石盾墙/);
  assert.match(steve, /金苹果守护/);
  assert.match(steve, /钻石终结/);
});

test('daily subject check-ins award 10 coins per subject for 50 daily check-in coins', () => {
  assert.match(appSource, /subjectsPerDay: 5/);
  assert.match(appSource, /dailySubjectCoins: 10/);
  const finishQuiz = appSource.slice(appSource.indexOf('async function finishQuiz'), appSource.indexOf('function renderShop'));
  assert.match(finishQuiz, /const subjectCoins = ECONOMY_CONFIG\.dailySubjectCoins/);
  assert.doesNotMatch(appSource, /checkinCoinsByCorrect/);
});

test('every equipment item costs no more than 100 coins', () => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(projectRoot, 'equipment-catalog.js'), 'utf8'), sandbox);
  const catalog = sandbox.window.EQUIPMENT_CATALOG_DATA;
  const expectedItemCount = sandbox.window.EXCLUSIVE_EQUIPMENT_SETS.reduce((total, set) => total + set.size, 0);
  assert.equal(catalog.length, expectedItemCount);
  assert.ok(catalog.every(item => Number(item.price) <= 100), `maximum equipment price was ${Math.max(...catalog.map(item => Number(item.price)))}`);
});

test('sanrio exclusive equipment uses custom descriptions and stat profiles', () => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(projectRoot, 'equipment-catalog.js'), 'utf8'), sandbox);
  const catalog = sandbox.window.EQUIPMENT_CATALOG_DATA;
  const sanrioRoleIds = ['kuromi', 'my-melody', 'cinnamoroll', 'pochacco', 'hello-kitty'];
  for (const roleId of sanrioRoleIds) {
    const items = catalog.filter(item => item.exclusivePetId === roleId);
    assert.equal(items.length, 4, `${roleId} should have four exclusive Sanrio items`);
    assert.equal(new Set(items.map(item => item.description)).size, 4, `${roleId} should not repeat equipment copy`);
    assert.equal(new Set(items.map(item => JSON.stringify(item.stats))).size, 4, `${roleId} should have distinct equipment stat profiles`);
    for (const item of items) {
      assert.doesNotMatch(item.description, new RegExp(`${item.exclusivePetName}专属(?:武器|头部装备|身体装备|饰品)`), `${item.id} should not use generic four-piece copy`);
      assert.ok(item.description.length >= 24, `${item.id} should have a useful custom description`);
    }
  }
});


function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

function rolePreviewThumbPath(imagePath) {
  const clean = String(imagePath || '').split('?')[0];
  const slug = clean
    .replace(/^assets\/roles\//, '')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return path.join(projectRoot, 'assets', 'optimized', 'role-thumbs', `${slug || 'role-card'}.webp`);
}

function roleCatalogEntry(roleId) {
  const source = catalogSourceFor(appSource);
  const idIndex = source.search(new RegExp(`id: ['"]${escapeRegExp(roleId)}['"]`));
  assert.notEqual(idIndex, -1, `${roleId} should have a PET_CATALOG entry`);
  const startIndex = source.lastIndexOf('\n    {', idIndex);
  const nextEntryIndex = source.indexOf('\n    { id:', idIndex + 1);
  const endIndex = nextEntryIndex === -1 ? source.indexOf('\n  ];', idIndex) : nextEntryIndex;
  const entry = source.slice(startIndex, endIndex);
  assert.match(entry, /baseStats:\s*\{[^}]+\}/, `${roleId} should have baseStats`);
  return entry;
}

function baseStatsFor(roleId) {
  const entry = roleCatalogEntry(roleId);
  const match = entry.match(/baseStats:\s*\{\s*hp:\s*([\d.]+),\s*attack:\s*([\d.]+),\s*defense:\s*([\d.]+),\s*speed:\s*([\d.]+),\s*luck:\s*([\d.]+)\s*\}/);
  assert.ok(match, `${roleId} should expose hp, attack, defense, speed and luck in baseStats`);
  return {
    hp: Number(match[1]),
    attack: Number(match[2]),
    defense: Number(match[3]),
    speed: Number(match[4]),
    luck: Number(match[5])
  };
}

function roleSkillEntry(source, roleId) {
  const entry = source.match(new RegExp(`(?:['"]${escapeRegExp(roleId)}['"]|${escapeRegExp(roleId)}): \\[([\\s\\S]*?)\\n    \\]`));
  assert.ok(entry, `${roleId} should have a ROLE_SKILL_COPY entry`);
  return entry[1];
}
