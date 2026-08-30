(() => {
  'use strict';

  const STAT_KEYS = ['hp', 'attack', 'defense', 'speed', 'luck'];

  function normalizeStats(...sources) {
    return STAT_KEYS.reduce((stats, key) => {
      stats[key] = sources.reduce((total, source) => total + Number(source?.[key] || 0), 0);
      return stats;
    }, {});
  }

  function getExclusiveBonus(item, context = {}) {
    if (!context.petType || item?.exclusivePetId !== context.petType) return {};
    const rate = Number(item?.exclusiveBonusRate || 0);
    return STAT_KEYS.reduce((bonus, key) => {
      const base = Number(item?.stats?.[key] || 0);
      bonus[key] = base > 0 && rate > 0 ? Math.ceil(base * rate) : 0;
      return bonus;
    }, {});
  }

  function calculateStats(baseStats = {}, levelBonus = {}, equippedItems = [], context = {}) {
    const equipmentBonus = equippedItems.reduce(
      (total, item) => normalizeStats(total, item?.stats || {}),
      normalizeStats()
    );
    const exclusiveBonus = equippedItems.reduce(
      (total, item) => normalizeStats(total, getExclusiveBonus(item, context)),
      normalizeStats()
    );
    return normalizeStats(baseStats, levelBonus, equipmentBonus, exclusiveBonus);
  }

  function calculateCombatPower(stats = {}) {
    return Math.max(0, Math.round(
      Number(stats.hp || 0) * 0.2
      + Number(stats.attack || 0) * 5
      + Number(stats.defense || 0) * 4
      + Number(stats.speed || 0) * 3
      + Number(stats.luck || 0) * 2
    ));
  }

  function getStatDelta(before = {}, after = {}) {
    return STAT_KEYS.reduce((delta, key) => {
      delta[key] = Number(after[key] || 0) - Number(before[key] || 0);
      return delta;
    }, {});
  }

  const api = { STAT_KEYS, normalizeStats, getExclusiveBonus, calculateStats, calculateCombatPower, getStatDelta };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.EquipmentEngine = api;
})();
