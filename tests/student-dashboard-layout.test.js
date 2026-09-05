const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

test('student dashboard tolerates removed legacy labels and keeps the game layout', () => {
  const renderHome = app.slice(app.indexOf('function renderHome()'), app.indexOf('function getMaxLevelInfo()'));
  assert.match(app, /const welcomeName = \$\('#welcome-name'\);\s*if \(welcomeName\)/);
  assert.match(app, /const todayLabel = \$\('#today-label'\);\s*if \(todayLabel\)/);
  assert.match(renderHome, /const streakCount = \$\('#streak-count'\);\s*if \(streakCount\)/);
  assert.match(styles, /\.daily-challenge-hero\s*\{[^}]*#091338/s);
  assert.match(styles, /@media \(max-width: 768px\)[\s\S]*body\.app-mode \.eduverse-main-nav\s*\{[^}]*flex-wrap:\s*nowrap;[^}]*overflow-x:\s*auto;/s);
});

test('starter selection and pet shop keep their responsive game layout', () => {
  const start = styles.indexOf('/* Student repair layer:');
  assert.notEqual(start, -1);
  const gameUi = styles.slice(start);
  assert.match(gameUi, /\.pet-selection-card\s*\{[^}]*max-height:\s*calc\(100dvh - 28px\);[^}]*overflow-y:\s*auto/s);
  assert.match(gameUi, /\.initial-pet-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(gameUi, /\.pet-series-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(gameUi, /@media \(max-width: 1060px\)[\s\S]*\.pet-series-grid\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(gameUi, /@media \(max-width: 720px\)[\s\S]*\.initial-pet-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test('character gacha hall uses complete base, evolved, skill and equipment artwork', () => {
  assert.match(app, /class="hero-gacha-forms"/);
  assert.match(app, /withAssetVersion\(hero\.image\)/);
  assert.match(app, /withAssetVersion\(hero\.evolvedImage \|\| hero\.image\)/);
  assert.match(app, /hero\.skills\.slice\(0, 5\)/);
  assert.match(app, /class="hero-gacha-equipment-group"/);
  assert.match(styles, /\.hero-gacha-forms img\s*\{[^}]*object-fit:\s*contain/s);
});

test('mini game world uses the active pet artwork instead of emoji-only cards', () => {
  assert.match(app, /const petImage = getRolePreviewAsset\(getPetDisplayImage\(student\)/);
  assert.match(app, /class="mini-game-choice-pet"/);
  assert.match(app, /class="mini-game-choice-copy"/);
  assert.doesNotMatch(app, /<span aria-hidden="true">\$\{choice\.icon\}<\/span>/);
  assert.match(styles, /\.mini-game-choice-art\s*\{/);
  assert.match(styles, /\.mini-game-choice-pet\s*\{[^}]*object-fit:\s*contain/s);
});

test('EduVerse arcade shell is connected to the existing four-game engine', () => {
  assert.match(app, /arcadeOpen:\s*false/);
  assert.match(app, /if \(miniGameState\.arcadeOpen\)[\s\S]*canvas:\s*\$\('#arcade-game-canvas'\)/);
  assert.match(app, /canvas:\s*\$\('#arcade-game-canvas'\),[\s\S]*actionButton:\s*null,[\s\S]*retryButton:\s*null/);
  assert.match(app, /miniGameState\.arcadeOpen = true;[\s\S]*startMiniGame\(gameType\)/);
  assert.match(app, /#mini-game-canvas, #arcade-game-canvas, \[data-mini-game-canvas\]/);
  assert.match(app, /arcade-pause-btn'\)\?\.addEventListener\('click', toggleArcadeMiniGamePause\)/);
  assert.match(app, /previousViewId === 'arcade-view'[\s\S]*closeArcadeGame\(\)/);
});
