const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
const htmlSource = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

function sourceBetween(startMarker, endMarker) {
  const start = appSource.indexOf(startMarker);
  const end = appSource.indexOf(endMarker, start + 1);
  assert.ok(start >= 0, `${startMarker} should exist`);
  assert.ok(end > start, `${endMarker} should appear after ${startMarker}`);
  return appSource.slice(start, end);
}

function parseRarityPrices() {
  const section = sourceBetween('const PET_RARITIES', 'const PET_CATALOG');
  const prices = {};
  const entryPattern = /\{\s*id: '([^']+)'[\s\S]*?price: (\d+)/g;
  let match;
  while ((match = entryPattern.exec(section)) !== null) {
    prices[match[1]] = Number(match[2]);
  }
  return prices;
}

function parsePetRarities() {
  const section = sourceBetween('const PET_CATALOG', 'const ROLE_SKILL_COPY');
  const pets = [];
  const entryPattern = /\{\s*id: '([^']+)'[\s\S]*?rarity: '([^']+)'/g;
  let match;
  while ((match = entryPattern.exec(section)) !== null) {
    pets.push({ id: match[1], rarity: match[2] });
  }
  return pets;
}

function loadEquipmentCatalog() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(projectRoot, 'equipment-catalog.js'), 'utf8'), sandbox);
  return sandbox.window;
}

test('pet rarity prices support a full-collection holiday economy', () => {
  assert.deepEqual(parseRarityPrices(), {
    A: 25,
    R: 45,
    SR: 70,
    SSR: 100,
    LEGEND: 140,
    LIMITED: 160,
    MYTHIC: 0
  });
});

test('daily check-ins award 50 coins and student teacher rewards cap at 250', () => {
  assert.match(appSource, /subjectsPerDay: 5/);
  assert.match(appSource, /dailySubjectCoins: 10/);
  assert.match(appSource, /teacherDailyRewardLimit: 250/);
  assert.match(appSource, /const MINI_EVOLUTION_COIN_COST = 80/);
  assert.match(appSource, /const FINAL_EVOLUTION_COIN_COST = 100/);
});

test('exclusive equipment set totals stay collectible but not disposable', () => {
  const { EXCLUSIVE_EQUIPMENT_SETS, EQUIPMENT_CATALOG_DATA } = loadEquipmentCatalog();
  const itemsByPet = new Map();
  for (const item of EQUIPMENT_CATALOG_DATA) {
    const items = itemsByPet.get(item.exclusivePetId) || [];
    items.push(item);
    itemsByPet.set(item.exclusivePetId, items);
  }

  const groups = new Map();
  for (const set of EXCLUSIVE_EQUIPMENT_SETS) {
    const items = itemsByPet.get(set.petId) || [];
    const key = `${set.tierKey}-${set.size}`;
    const totals = groups.get(key) || [];
    totals.push(items.reduce((sum, item) => sum + Number(item.price), 0));
    groups.set(key, totals);
  }

  assert.deepEqual(
    Object.fromEntries([...groups].map(([key, totals]) => [key, { count: totals.length, totals: [...new Set(totals)] }])),
    {
      'epic-6': { count: 2, totals: [190] },
      'mythic-6': { count: 2, totals: [262] },
      'legendary-6': { count: 2, totals: [362] },
      'epic-4': { count: 11, totals: [122] },
      'mythic-4': { count: 14, totals: [170] },
      'legendary-4': { count: 5, totals: [238] }
    }
  );

  const itemPrices = EQUIPMENT_CATALOG_DATA.map(item => Number(item.price));
  assert.equal(Math.min(...itemPrices), 28);
  assert.equal(Math.max(...itemPrices), 64);
});

test('buying every pet, item and evolution takes about 52 perfect earning days', () => {
  const rarityPrices = parseRarityPrices();
  const petTotal = parsePetRarities()
    .reduce((sum, pet) => sum + Number(rarityPrices[pet.rarity] || 0), 0) - rarityPrices.A;
  const { EQUIPMENT_CATALOG_DATA } = loadEquipmentCatalog();
  const equipmentTotal = EQUIPMENT_CATALOG_DATA.reduce((sum, item) => sum + Number(item.price), 0);
  const fullCollectionTotal = petTotal + equipmentTotal;
  const evolutionTotal = parsePetRarities().length * (80 + 100);
  const fullGrowthTotal = fullCollectionTotal + evolutionTotal;

  assert.equal(petTotal, 3315);
  assert.equal(equipmentTotal, 6540);
  assert.equal(fullCollectionTotal, 9855);
  assert.equal(evolutionTotal, 6480);
  assert.equal(fullGrowthTotal, 16335);
  const maxDailyIncome = 50 + 250;
  assert.equal(Math.ceil(fullGrowthTotal / maxDailyIncome), 55);
  assert.ok(fullGrowthTotal <= 16500);
});

test('evolution no longer grants a random free pet draw', () => {
  assert.doesNotMatch(appSource, /petDrawsAvailable/);
  assert.doesNotMatch(appSource, /drawAnotherPet/);
  assert.doesNotMatch(appSource, /data-draw-pet/);
  assert.doesNotMatch(htmlSource, /pet-draw-overlay|drawn-pet-image|drawn-pet-name/);
});
