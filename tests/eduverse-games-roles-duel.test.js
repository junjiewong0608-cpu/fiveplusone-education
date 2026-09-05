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

test('EduVerse: limited hero gacha contract', () => {
  // 1. Check navigation and view existence
  assert.match(indexSource, /data-view="characters-view"/);
  assert.match(indexSource, /id="characters-view"/);
  assert.match(indexSource, /id="hero-gacha-pool-grid"/);
  assert.match(indexSource, /id="hero-gacha-equipment-preview"/);
  assert.match(indexSource, /id="hero-gacha-pity-count"/);
  assert.match(indexSource, /id="gacha-single-pull-btn"/);
  assert.match(indexSource, /id="gacha-ten-pull-btn"/);

  // 2. Check limited heroes and transparent rates
  assert.match(appSource, /arcflare-fox/);
  assert.match(appSource, /webshade-lynx/);
  assert.match(appSource, /stormmane-lion/);
  assert.match(appSource, /runeportal-owl/);
  assert.match(appSource, /vibranium-panther/);
  assert.match(appSource, /gamma-boulder-bear/);
  assert.match(indexSource, /限定 SSR 英雄 2%/);
  assert.match(indexSource, /十连至少 1 位限定英雄/);

  // 3. Check App Logic
  assert.match(appSource, /HERO_GACHA_PITY_LIMIT = 50/);
  assert.match(appSource, /function renderCharactersView\(/);
  assert.match(appSource, /async function triggerHeroGacha\(pullType/);
  assert.match(appSource, /pulls === 10 && index === pulls - 1 && !pulledHero/);
  assert.match(appSource, /grantItemToStudent\(student, item\)/);

  // 4. Check CSS styling
  assert.match(cssSource, /\.hero-gacha-hall/);
  assert.match(cssSource, /\.hero-gacha-pool-grid/);
  assert.match(cssSource, /\.hero-gacha-forms img/);
  assert.match(cssSource, /\.hero-gacha-skill-row img/);
  assert.match(cssSource, /\.hero-gacha-equipment-group/);
  // 5. Check Marquee wheel diversity (does not hardcode one single target slot)
  assert.match(appSource, /runHeroGachaMarquee/);
  assert.doesNotMatch(appSource, /targetSlot = 13;\s*\/\/\s*S-grade titanium blade slot/);
});

test('EduVerse: Friend PvP & AI Boss Duel Arena Contract', () => {
  // 1. Check navigation and view existence
  assert.match(indexSource, /data-view="duel-view"/);
  assert.match(indexSource, /id="duel-view"/);
  assert.match(indexSource, /id="duel-stage-panel"/);
  assert.match(indexSource, /id="battle-combatants-arena"/);
  assert.match(indexSource, /id="duel-combat-log-ticker"/);
  assert.match(indexSource, /id="duel-player-preview"/);
  assert.match(indexSource, /id="duel-scene-modal"/);
  assert.match(indexSource, /data-duel-scene="magic-academy"/);
  assert.match(indexSource, /data-duel-scene="lava-temple"/);
  assert.match(indexSource, /data-duel-scene="neon-city"/);
  assert.match(indexSource, /data-duel-scene="dinosaur-jungle"/);
  assert.match(indexSource, /好友宠物影子战/);
  assert.doesNotMatch(indexSource, /duel-win-count">5/);
  assert.doesNotMatch(indexSource, /duel-loss-count">1/);

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
  assert.match(appSource, /function getDuelPetArt\(/);
  assert.match(appSource, /function getDuelPetArt[\s\S]+?const sprite = getPetQStyleImage\(pet\);\s+if \(sprite\) return withAssetVersion\(sprite\);[\s\S]+?getPetRecordDisplayImage\(student, petId\)/);
  assert.match(appSource, /function getDuelPetUltimate\(/);
  assert.match(appSource, /const DUEL_SCENES = Object\.freeze/);
  assert.match(appSource, /function openDuelScenePicker\(/);
  assert.match(appSource, /function selectDuelScene\(/);
  assert.match(appSource, /arena\.style\.setProperty\('--duel-scene-image'/);
  assert.match(appSource, /getPetRecordDisplayImage\(student, petId\)/);
  assert.match(appSource, /const p1Stats = buildDuelStats\(student, playerPetId\)/);
  assert.match(appSource, /cp: p1Stats\.cp/);
  assert.match(appSource, /skillName: p1Skill\.name/);
  assert.match(appSource, /renderDuelFighterArt\(p1Sprite, p1\)/);
  assert.match(appSource, /function restartDuelBattle\(\)/);
  assert.doesNotMatch(appSource, /if \(p1Sprite\) p1Sprite\.textContent = p1\.avatar/);

  // 4. Check CSS styling
  assert.match(cssSource, /\.duel-mode-grid/);
  assert.match(cssSource, /\.fighter-card/);
  assert.match(cssSource, /\.battle-action-command-bar/);
  assert.match(cssSource, /\.battle-narration-box/);
  assert.match(cssSource, /\.duel-player-preview/);
  assert.match(cssSource, /body\.app-mode \.duel-preview-art img\s*\{[^}]*position:\s*absolute !important;[^}]*inset:\s*12px !important;[^}]*object-fit:\s*contain !important;/s);
  assert.match(cssSource, /body\.app-mode \.friend-duel-avatar img,[^\{]+\{[^}]*inset:\s*4px !important;[^}]*object-fit:\s*contain !important;/s);
  assert.match(cssSource, /body\.app-mode \.fighter-sprite\s*\{[^}]*position:\s*relative;/s);
  assert.match(cssSource, /body\.app-mode \.fighter-sprite img\s*\{[^}]*inset:\s*8px !important;[^}]*object-fit:\s*contain !important;/s);
  assert.match(cssSource, /\.fighter-sprite img/);
  assert.match(cssSource, /\.duel-damage-number/);
  assert.match(cssSource, /\.duel-scene-grid/);
  assert.match(cssSource, /var\(--duel-scene-image\)/);
});
