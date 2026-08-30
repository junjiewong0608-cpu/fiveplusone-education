import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const indexSource = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
const cssSource = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');

test('EduVerse: Mini-Games Arcade Hub Contract', () => {
  // 1. Check navigation and view existence in index.html
  assert.match(indexSource, /data-view="arcade-view"/);
  assert.match(indexSource, /id="arcade-view"/);
  assert.match(indexSource, /id="arcade-game-canvas"/);
  assert.match(indexSource, /id="arcade-main-action-btn"/);
  assert.match(indexSource, /id="arcade-gameover-modal"/);

  // 2. Check 4 Mini Game Stations
  assert.match(indexSource, /launchArcadeGame\('reaction'\)/);
  assert.match(indexSource, /launchArcadeGame\('flappy'\)/);
  assert.match(indexSource, /launchArcadeGame\('runner'\)/);
  assert.match(indexSource, /launchArcadeGame\('jumpCharge'\)/);

  // 3. Check App Engine implementation
  assert.match(appSource, /function renderArcadeView\(\)/);
  assert.match(appSource, /function launchArcadeGame\(gameType\)/);
  assert.match(appSource, /function finishArcadeGame\(score\)/);
  assert.match(appSource, /arcadeBestScores/);

  // 4. Check CSS styling
  assert.match(cssSource, /\.arcade-stations-grid/);
  assert.match(cssSource, /\.arcade-game-card/);
  assert.match(cssSource, /\.arcade-canvas-wrapper/);
});

test('EduVerse: Hero Characters Sanctuary, Selection & Shop Contract', () => {
  // 1. Check navigation and view existence
  assert.match(indexSource, /data-view="characters-view"/);
  assert.match(indexSource, /id="characters-view"/);
  assert.match(indexSource, /id="hero-roster-grid"/);
  assert.match(indexSource, /id="hero-showcase-card"/);
  assert.match(indexSource, /id="gacha-single-pull-btn"/);
  assert.match(indexSource, /id="gacha-ten-pull-btn"/);

  // 2. Check Series categories
  assert.match(indexSource, /data-series="pokemon"/);
  assert.match(indexSource, /data-series="popmart"/);
  assert.match(indexSource, /data-series="sanrio"/);
  assert.match(indexSource, /data-series="minecraft"/);

  // 3. Check App Logic
  assert.match(appSource, /HERO_SERIES_MAP/);
  assert.match(appSource, /function renderCharactersView\(/);
  assert.match(appSource, /function selectHeroShowcase\(roleId\)/);
  assert.match(appSource, /async function switchHeroRole\(roleId\)/);
  assert.match(appSource, /async function buyHeroRole\(roleId\)/);
  assert.match(appSource, /function triggerHeroGacha\(pullType/);

  // 4. Check CSS styling
  assert.match(cssSource, /\.hero-sanctuary-layout/);
  assert.match(cssSource, /\.roster-hero-item/);
  assert.match(cssSource, /\.showcase-visual-banner/);
  assert.match(cssSource, /\.gacha-machine-section/);
});

test('EduVerse: Friend PvP & AI Boss Duel Arena Contract', () => {
  // 1. Check navigation and view existence
  assert.match(indexSource, /data-view="duel-view"/);
  assert.match(indexSource, /id="duel-view"/);
  assert.match(indexSource, /id="duel-stage-panel"/);
  assert.match(indexSource, /id="battle-combatants-arena"/);
  assert.match(indexSource, /id="duel-combat-log-ticker"/);

  // 2. Check 4 Combat Commands
  assert.match(indexSource, /id="battle-btn-attack"/);
  assert.match(indexSource, /id="battle-btn-skill"/);
  assert.match(indexSource, /id="battle-btn-guard"/);
  assert.match(indexSource, /id="battle-btn-quiz"/);
  assert.match(indexSource, /id="battle-quiz-modal"/);

  // 3. Check Battle Engine in app.js
  assert.match(appSource, /function renderDuelLobby\(\)/);
  assert.match(appSource, /function startFriendDuel\(targetStudentId\)/);
  assert.match(appSource, /function startBossDuel\(bossId\)/);
  assert.match(appSource, /function executeBattleAction\(actionType\)/);
  assert.match(appSource, /function triggerQuizBurstDuringBattle\(\)/);
  assert.match(appSource, /function finishDuelBattle\(isPlayerWin\)/);

  // 4. Check CSS styling
  assert.match(cssSource, /\.duel-mode-grid/);
  assert.match(cssSource, /\.fighter-card/);
  assert.match(cssSource, /\.battle-action-command-bar/);
  assert.match(cssSource, /\.battle-narration-box/);
});
