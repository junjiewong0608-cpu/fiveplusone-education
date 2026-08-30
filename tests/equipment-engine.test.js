const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  calculateStats,
  calculateCombatPower,
  getStatDelta
} = require('../equipment-engine.js');

const baseStats = { hp: 100, attack: 10, defense: 8, speed: 6, luck: 5 };
const levelBonus = { hp: 4, attack: 1, defense: 0, speed: 1, luck: 0 };
const equippedItems = [
  { stats: { attack: 5, speed: 2 } },
  { stats: { defense: 4, luck: 3 } }
];

test('equipped item stats are added to base and level stats', () => {
  assert.deepEqual(calculateStats(baseStats, levelBonus, equippedItems), {
    hp: 104,
    attack: 16,
    defense: 12,
    speed: 9,
    luck: 8
  });
});

test('matching exclusive equipment receives an extra role bonus, while other roles receive only base stats', () => {
  const exclusiveItem = {
    exclusivePetId: 'frost-fang',
    exclusiveBonusRate: 0.2,
    stats: { attack: 14, speed: 6 }
  };
  const matching = calculateStats({}, {}, [exclusiveItem], { petType: 'frost-fang' });
  const otherRole = calculateStats({}, {}, [exclusiveItem], { petType: 'flame-rex' });
  assert.deepEqual(matching, { hp: 0, attack: 17, defense: 0, speed: 8, luck: 0 });
  assert.deepEqual(otherRole, { hp: 0, attack: 14, defense: 0, speed: 6, luck: 0 });
});

test('combat power is a positive derived value from final stats', () => {
  const stats = calculateStats(baseStats, levelBonus, equippedItems);
  assert.equal(typeof calculateCombatPower(stats), 'number');
  assert.ok(calculateCombatPower(stats) > 0);
});

test('stat delta reports both increases and decreases', () => {
  assert.deepEqual(getStatDelta(
    { hp: 104, attack: 16, defense: 12, speed: 9, luck: 8 },
    { hp: 104, attack: 12, defense: 15, speed: 9, luck: 8 }
  ), {
    hp: 0,
    attack: -4,
    defense: 3,
    speed: 0,
    luck: 0
  });
});

console.log('equipment-engine tests passed');
