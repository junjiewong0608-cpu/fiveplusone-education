const assert = require('node:assert/strict');
const { test } = require('node:test');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
const htmlSource = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const cssSource = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');
const gasBackendUrl = 'https://script.google.com/macros/s/AKfycbzdtgs7gam949IkRB-fJFiFTvSYRiJnYd2WF2PCS5rtPwp6DeX3sQslrbE6D3jUdYVHVg/exec';

function sourceBetween(start, end) {
  const startIndex = appSource.indexOf(start);
  const endIndex = appSource.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return appSource.slice(startIndex, endIndex);
}

function extractAppFunction(name) {
  let start = appSource.indexOf(`function ${name}`);
  assert.notEqual(start, -1, `Missing function: ${name}`);
  if (appSource.slice(start - 6, start) === 'async ') start -= 6;
  const braceStart = appSource.indexOf('{', start);
  let depth = 0;
  for (let index = braceStart; index < appSource.length; index += 1) {
    if (appSource[index] === '{') depth += 1;
    if (appSource[index] === '}') depth -= 1;
    if (depth === 0) return appSource.slice(start, index + 1);
  }
  throw new Error(`Could not extract function ${name}`);
}

async function runSheetSyncHarness() {
  return Function(`
    let activeStudent = {
      studentId: 'CY6437',
      studentName: 'Maggie队长',
      name: 'Maggie队长',
      profileNameUpdatedAt: '2026-08-24T10:00:00.000Z',
      coins: 22,
      totalStars: 115,
      demoMode: false,
      petType: 'hydroblob',
      petName: '闪闪水滴',
      petNameUpdatedAt: '2026-08-24T10:01:00.000Z',
      ownedItems: ['hydro-core', 'hydro-crown'],
      equippedItems: { weapon: 'hydro-core', head: 'hydro-crown' },
      ownedPets: ['hydroblob'],
      evolvedPets: { hydroblob: true },
      petEvolved: true,
      miniPetEvolved: true,
      petCollection: {
        hydroblob: {
          petId: 'hydroblob',
          ownedItems: ['hydro-core', 'hydro-crown'],
          equippedItems: { weapon: 'hydro-core', head: 'hydro-crown' },
          miniEvolved: true,
          evolved: true,
          evolutionStage: 'final',
          evolutionStyle: 'cute',
          petName: '闪闪水滴',
          petNameUpdatedAt: '2026-08-24T10:01:00.000Z'
        }
      }
    };
    const database = { CY6437: activeStudent };
    const supabaseCalls = [];
    const statuses = [];
    const APP_CONFIG = {};
    const backend = {
      getStudentFromGas: async () => ({
        ok: true,
        student: {
          studentId: 'CY6437',
          name: 'Maggie老师',
          studentName: 'Maggie老师',
          coins: 7777,
          totalStars: 30,
          petType: 'hydroblob',
          petName: '旧宠物名',
          ownedItems: [],
          equippedItems: {},
          ownedPets: ['hydroblob'],
          evolvedPets: {},
          petEvolved: false,
          miniPetEvolved: true,
          petCollection: {
            hydroblob: {
              petId: 'hydroblob',
              ownedItems: [],
              equippedItems: {},
              miniEvolved: true,
              evolved: false,
              evolutionStage: 'mini',
              petName: '旧宠物名'
            }
          }
        },
        classes: []
      })
    };
    const HolidayBackendClient = {
      normalizeId: value => String(value || '').trim().toUpperCase(),
      normalizeStudent: (sheetStudent, classes, existingProfile) => ({ ...existingProfile, ...sheetStudent, classes }),
      isSupabaseMode: () => true
    };
    function getStudent() { return activeStudent; }
    function isGasBackend() { return true; }
    function setSyncStatus(message) { statuses.push(message); }
    function showToast() {}
    function saveDatabase() { activeStudent = database.CY6437; }
    function renderAppShell() {}
    function renderActiveStudentView() {}
    function getDateKey() { return '2026-08-14'; }
    function formatDisplayDate() { return '2026年8月14日'; }
    async function persistStudentToSupabase(student, event) {
      supabaseCalls.push({ student: { ...student }, event: { ...event } });
      return { ok: true };
    }
    ${extractAppFunction('mergeSheetRosterAndCoins')}
    ${extractAppFunction('syncStudentFromSheet')}
    return syncStudentFromSheet().then(result => ({
      result,
      student: database.CY6437,
      supabaseCalls,
      statuses
    }));
  `)();
}

test('index loads backend-client before app.js', () => {
  assert.ok(htmlSource.indexOf('backend-client.js') > -1, 'backend-client.js should be loaded by index.html');
  assert.ok(
    htmlSource.indexOf('backend-client.js') < htmlSource.indexOf('app.js'),
    'backend-client.js should load before app.js'
  );
});

test('student login can request and normalize a GAS student', () => {
  assert.match(appSource, /async function login\(studentId\)/);
  assert.match(appSource, /backend\.getStudent\(normalized, \{ includeClasses: false \}\)/);
  assert.match(appSource, /HolidayBackendClient\.normalizeStudent/);
  assert.match(htmlSource, /placeholder="请输入老师给你的 ID"/);
  assert.doesNotMatch(htmlSource, /例如 CY0015/);
  assert.match(appSource, /'请输入老师给你的 ID': 'Enter the ID from your teacher'/);
});

test('student login no longer refreshes from Sheet when Supabase has an empty pet cache', () => {
  const loginSource = sourceBetween('async function login(studentId)', 'function startFreeDemo');
  assert.match(loginSource, /const normalizedStudent = HolidayBackendClient\.normalizeStudent\(result\.student \|\| \{\}, result\.classes \|\| \[\], existingLocalStudent\)/);
  assert.doesNotMatch(loginSource, /result\.fallbackFrom === 'supabase'/);
  assert.doesNotMatch(loginSource, /mergeSheetRosterAndCoins\(result\.student \|\| \{\}, result\.classes \|\| \[\], existingLocalStudent\)/);
  assert.doesNotMatch(loginSource, /shouldRefreshEmptyPetStateFromSheet\(result, remoteStudent\)/);
  assert.doesNotMatch(loginSource, /hydrateEmptyPetStateFromSheet\(normalized, remoteStudent\)/);
  assert.match(loginSource, /database\[normalized\] = normalizedStudent/);
  assert.doesNotMatch(appSource, /async function hydrateEmptyPetStateFromSheet\(studentId, currentStudent\)/);
});

test('login screen hides teacher entry and free demo controls', () => {
  assert.match(htmlSource, /class="demo-login[^"]*\bhidden\b"[^>]*hidden/, 'demo account shortcuts should be hidden on the live login screen');
  assert.match(htmlSource, /id="free-demo-button"[^>]*(?:hidden|class="[^"]*\bhidden\b)/);
  assert.match(htmlSource, /id="teacher-entry-button"[^>]*(?:hidden|class="[^"]*\bhidden\b)/);
});

test('student login is remembered and restored after refresh', () => {
  assert.match(appSource, /const SESSION_KEY = 'holiday-checkin-session-v1'/);
  assert.match(appSource, /function saveLoginSession\(studentId\)/);
  assert.match(appSource, /function loadLoginSession\(\)/);
  assert.match(appSource, /function clearLoginSession\(\)/);
  assert.match(sourceBetween('async function login(studentId)', 'function startFreeDemo'), /saveLoginSession\(normalized\)/);
  assert.match(sourceBetween('function logout()', 'function resetDemo'), /clearLoginSession\(\)/);
  assert.match(appSource, /async function restoreSavedLogin\(\)/);
  assert.match(appSource, /const saved = loadLoginSession\(\)/);
  assert.match(appSource, /await login\(saved\.studentId\)/);
  assert.match(appSource, /restoreSavedLogin\(\)/);
});

test('saved login survives temporary backend restore failure when cached student exists', () => {
  const restoreSource = sourceBetween('async function restoreSavedLogin()', 'function logout()');
  assert.match(restoreSource, /const cachedStudent = database\[studentId\]/);
  assert.match(restoreSource, /const restored = await login\(saved\.studentId\)/);
  assert.match(restoreSource, /if \(restored\) return/);
  assert.match(restoreSource, /if \(cachedStudent\)/);
  assert.match(restoreSource, /session = \{ studentId, activeView: DEFAULT_APP_VIEW/);
  assert.match(restoreSource, /saveLoginSession\(studentId\)/);
  assert.ok(
    restoreSource.indexOf("showToast('云端暂时较慢，先使用本机资料。');") < restoreSource.indexOf('if (!session.studentId) clearLoginSession();'),
    'cached students should return to the app before any saved login cleanup'
  );
});

test('app supports instant CH/ENG language switching from the login screen', () => {
  assert.match(htmlSource, /class="language-toggle"/);
  assert.match(htmlSource, /data-language="zh"[^>]*>CH<\/button>/);
  assert.match(htmlSource, /data-language="en"[^>]*>ENG<\/button>/);

  assert.match(appSource, /const LANGUAGE_KEY = 'holiday-checkin-language-v1'/);
  assert.match(appSource, /const TRANSLATIONS\s*=\s*\{/);
  assert.match(appSource, /function setLanguage\(language\)/);
  assert.match(appSource, /function applyLanguage\(root = document\.body\)/);
  assert.match(appSource, /function startLanguageObserver\(\)/);
  assert.match(appSource, /new MutationObserver/);
  assert.match(sourceBetween("document.addEventListener('click'", "const modalCloseButton = event.target.closest('[data-modal-close]')"), /\[data-language\]/);
  assert.match(appSource, /localStorage\.setItem\(LANGUAGE_KEY/);
  assert.match(appSource, /document\.documentElement\.lang = currentLanguage === 'en' \? 'en' : 'zh-CN'/);
});

test('mobile stats and language toggle stay readable after evolution multipliers', () => {
  const formatter = sourceBetween('function formatStatValue(key, value, petType = \'\')', 'function updateCombatPowerDisplay');
  assert.match(formatter, /Math\.abs\(numericValue\) >= 100/);
  assert.match(formatter, /Math\.round\(\(numericValue \+ Number\.EPSILON\) \* 10\) \/ 10/);
  assert.match(formatter, /rounded\.toFixed\(1\)/);
  assert.doesNotMatch(formatter, /return String\(value\)/);
  assert.match(cssSource, /\.attribute-chip strong\s*\{[^}]*font-variant-numeric:\s*tabular-nums/);
  assert.match(cssSource, /\.attribute-chip\s*\{[^}]*overflow:\s*hidden/);
  assert.match(cssSource, /\.app-mode \.language-toggle/);
  assert.match(appSource, /function setScreenMode\(mode\)/);
  assert.match(sourceBetween('async function login(studentId)', 'function startFreeDemo'), /setScreenMode\('app'\)/);
  assert.match(sourceBetween('function logout()', 'function resetDemo'), /setScreenMode\('login'\)/);
});

test('student-facing project name is CY PETS STORY or 5+1教育补习中心', () => {
  assert.match(htmlSource, /<title>(?:CY PETS STORY|5\+1教育补习中心)[^<]*<\/title>/);
  assert.match(htmlSource, /<h1 class="[^"]*">(?:CY PETS STORY|5\+1教育补习中心)<\/h1>/);
  assert.match(htmlSource, /(?:<span>CY PETS STORY ·|<span class="[^"]*">5\+1教育补习中心)/);
  assert.match(appSource, /name:\s*'(?:CY PETS STORY|5\+1教育补习中心)'/);
});

test('guide view is replaced by a single-player Kuromi room demo', () => {
  assert.match(htmlSource, /data-view="guide-view">互动区<\/button>/);
  assert.match(htmlSource, /id="pet-interaction-stage"/);
  assert.match(htmlSource, /id="kuromi-room-canvas"/);
  assert.match(htmlSource, /class="kuromi-room-controls"/);
  assert.match(htmlSource, /data-kuromi-fullscreen/);
  assert.match(appSource, /function toggleKuromiRoomFullscreen\(\)/);
  assert.match(appSource, /screen\.orientation\?\.lock/);
  assert.match(appSource, /kuromi-room-fullscreen-mode/);
  assert.match(htmlSource, /id="kuromi-room-chat-panel"/);
  assert.doesNotMatch(htmlSource, /id="pet-interaction-pet"/);
  assert.doesNotMatch(htmlSource, /id="room-lobby-panel"/);
  assert.doesNotMatch(htmlSource, /id="pet-scene-home"/);
  assert.doesNotMatch(htmlSource, /id="pet-scene-meadow"/);
  assert.doesNotMatch(htmlSource, /id="pet-scene-bedroom"/);
  assert.doesNotMatch(htmlSource, /id="pet-scene-candy"/);
  assert.doesNotMatch(htmlSource, /id="pet-scene-courtyard"/);
  assert.doesNotMatch(htmlSource, /id="pet-call-button"/);
  assert.doesNotMatch(htmlSource, /id="guide-more-pets-title"/);
});

test('Creeper interaction controller supports playful random behavior and explosion', () => {
  assert.match(appSource, /const PET_INTERACTION_ACTIONS = \['idle', 'walk', 'run', 'sleep', 'wave', 'explode', 'feed'\]/);
  assert.match(appSource, /function renderPetInteraction\(\)/);
  assert.match(appSource, /function triggerPetInteractionAction\(action/);
  assert.match(appSource, /function stopPetInteractionLoop\(\)/);
  assert.match(appSource, /pet-interaction-effects/);
  assert.match(appSource, /data-pet-action/);
});

test('pet interaction playground can share the single-player Kuromi canvas', () => {
  assert.match(htmlSource, /id="pet-interaction-share-button"/);
  assert.match(htmlSource, /data-pet-interaction-share/);
  assert.match(appSource, /const SHARE_BRAND_LOGO_SRC = 'assets\/brand\/center-logo\.png'/);
  assert.match(appSource, /const ROLE_SHARE_FRAMES = Object\.freeze\(\[/);
  assert.match(appSource, /role-frame-heroic\.png/);
  assert.match(appSource, /role-frame-cute\.png/);
  assert.match(appSource, /function drawShareBrandLogo\(ctx, logoImage, x, y, options = \{\}\)/);
  assert.match(appSource, /function drawSharePowerBadge\(ctx, power, x, y/);
  assert.match(sourceBetween('async function canvasToShareFile', 'async function loadCanvasImage'), /canvas\.toBlob\(result => \{/);
  assert.match(sourceBetween('async function canvasToShareFile', 'async function loadCanvasImage'), /15000/);
  assert.match(appSource, /async function runNativeShareWithTimeout\(sharePayload, timeoutMs = 15000\)/);
  assert.match(sourceBetween('async function shareImageFile', 'async function shareCurrentRoleCardImage'), /await runNativeShareWithTimeout\(\{ title, text: shareText, files: \[file\] \}\)/);
  assert.match(sourceBetween('async function loadCanvasImage', 'function drawCanvasRoundRect'), /window\.setTimeout\(\(\) => \{/);
  assert.match(sourceBetween('async function loadCanvasImage', 'function drawCanvasRoundRect'), /window\.clearTimeout\(timeout\)/);
  assert.match(appSource, /function getDefaultRoleShareFrameId\(student = getStudent\(\)\)/);
  assert.match(sourceBetween('function getDefaultRoleShareFrameId', 'function drawRoleShareFrame'), /style === EVOLUTION_STYLE_CUTE \? 'cute' : 'heroic'/);
  assert.match(appSource, /async function createKuromiRoomShareFile\(\)/);
  assert.match(appSource, /async function createPetInteractionShareFile\(\)/);
  assert.match(appSource, /async function sharePetInteractionImage\(\)/);
  const shareSource = sourceBetween('async function createPetInteractionShareFile()', 'async function createRoleCardShareFile(options = {})');
  const roleShareSource = sourceBetween('async function createRoleCardShareFile(options = {})', 'async function createEvolutionComparisonShareFile');
  assert.match(shareSource, /\$\('#kuromi-room-canvas'\)/);
  assert.match(shareSource, /createKuromiRoomShareFile\(\)/);
  assert.match(shareSource, /drawShareBrandLogo\(ctx, brandLogo/);
  assert.match(roleShareSource, /drawShareBrandLogo\(ctx, brandLogo/);
  assert.match(roleShareSource, /drawSharePowerBadge\(ctx, combat\.power/);
  assert.match(roleShareSource, /loadRoleShareFrameImage\(frameId\)/);
  assert.match(roleShareSource, /drawRoleShareFrame\(ctx, frameImage/);
  assert.match(roleShareSource, /ctx\.filter = 'blur\(54px\) saturate\(1\.12\) brightness\(\.82\)'/);
  assert.match(appSource, /function getRoleShareInviteText\(student = getStudent\(\)\)/);
  assert.match(appSource, /`加好友：\$\{playerName\}的\$\{inviteId\}`/);
  assert.match(sourceBetween('function getSimpleRoleShareDisplayName', 'function getRoleShareInviteText'), /startsWith\(`\$\{playerName\}的`\)/);
  assert.match(sourceBetween('function getSimpleRoleShareDisplayName', 'function getRoleShareInviteText'), /replace\(\/\(老师\|大师\|同学\|小号\)\$\/g/);
  assert.match(sourceBetween('function getSimpleRoleShareDisplayName', 'function getRoleShareInviteText'), /normalizedPlayerName\.includes\(normalizedPetOwner\)/);
  assert.doesNotMatch(roleShareSource, /加我好友/);
  assert.match(roleShareSource, /const panelTextCenterX = panelX \+ panelWidth \/ 2/);
  assert.match(roleShareSource, /ctx\.fillText\(displayName, panelTextCenterX/);
  assert.match(roleShareSource, /ctx\.fillText\(metaText, panelTextCenterX/);
  assert.match(roleShareSource, /ctx\.fillText\(badgeText, panelTextCenterX/);
  assert.match(shareSource, /canvasToShareFile\(canvas/);
  const clickSource = sourceBetween("document.addEventListener('click'", "const roleCardShareButton = event.target.closest('[data-role-card-share]')");
  assert.match(clickSource, /data-pet-interaction-share/);
  assert.match(clickSource, /sharePetInteractionImage\(\)/);
});

test('english translations cover the main student-facing game surfaces', () => {
  const translations = sourceBetween('const TRANSLATIONS = {', 'const TRANSLATION_PATTERNS = [');
  [
    'CY PETS STORY',
    'Enter My Learning World',
    'How to Play',
    'My Pets',
    'Daily Check-in',
    'Equipment Guide',
    'Message Wall',
    'Share to Message Wall',
    'Share Pet Wall',
    'Choose Your Companion',
    'Pet Name',
    'Pet Birthday',
    'Combat Power',
    'HP',
    'Attack',
    'Defense',
    'Speed',
    'Luck',
    'Choose A Pet First',
    'LEGEND Rank',
    'LIMITED Rank'
  ].forEach(text => assert.ok(translations.includes(text), `missing translation: ${text}`));
});

test('pet selection modal localizes dynamic English labels and button states', () => {
  assert.match(appSource, /function getPetRarityDisplayLabel\(rarity\)/);
  assert.match(sourceBetween('function updateAdoptionConfirmState()', 'function setPetSelectionModalClosable'), /localize\('先选择一只宠物'\)/);
  assert.match(sourceBetween('function renderPetSelection()', 'function openPetPurchaseModal'), /getPetRarityDisplayLabel\(pet\.rarity\)/);
  assert.match(sourceBetween('function openPetPurchaseModal', 'function maybeShowPetSelection'), /getPetRarityDisplayLabel\(pet\.rarity\)/);
});

test('app is configured to use Supabase as the only production student backend', () => {
  assert.match(appSource, /backendMode:\s*'supabase'/);
  assert.doesNotMatch(appSource, /backendMode:\s*'hybrid'/);
  assert.doesNotMatch(appSource, /backendUrl:\s*'https:\/\/script\.google\.com\/macros\//);
  assert.match(appSource, /supabaseFunctionUrl:\s*'https:\/\/YOUR_SUPABASE_PROJECT_REF\.supabase\.co\/functions\/v1\/cy-pets-api'/);
  assert.match(appSource, /supabaseAnonKey:\s*'YOUR_PUBLIC_FUNCTION_KEY'/);
  assert.match(appSource, /supabaseRequestTimeoutMs:\s*35000/);
  assert.match(appSource, /HolidayBackendClient\.isSupabaseMode\(APP_CONFIG\)/);
});

test('student login no longer hydrates Supabase from Sheet fallback data', () => {
  const loginSource = sourceBetween('async function login(studentId)', 'function startFreeDemo');
  assert.doesNotMatch(loginSource, /result\.fallbackFrom === 'supabase'/);
  assert.doesNotMatch(loginSource, /backend\.requestSupabase\('saveStudentState'/);
  assert.doesNotMatch(loginSource, /type: 'hydrateSupabaseFromSheet'/);
});

test('teacher screen can load GAS classes and reward selected students', () => {
  assert.match(htmlSource, /id="teacher-id-input"/);
  assert.match(htmlSource, /id="teacher-class-select"/);
  assert.match(htmlSource, /id="teacher-refresh-button"/);
  assert.match(appSource, /teacherState\s*=\s*\{\s*teacherId:\s*'T001'/);
  assert.match(htmlSource, /styles\.css\?v=20\d{6}-\d+/);
  assert.match(htmlSource, /equipment-catalog\.js\?v=20\d{6}-\d+/);
  assert.match(htmlSource, /app\.js\?v=20\d{6}-\d+/);
  assert.match(htmlSource, /<span>老师 ID<\/span>\s*<input id="teacher-id-input"/);
  assert.match(htmlSource, /<span>班级<\/span>\s*<select id="teacher-class-select"/);
  assert.match(appSource, /backend\.listTeacherClasses/);
  assert.match(appSource, /backend\.getClassStudents/);
  assert.match(appSource, /backend\.rewardStudents/);
  assert.match(appSource, /async function rewardSelectedStudents\(amount\)/);
});

test('teacher screen can preview and submit bulk student imports', () => {
  assert.match(htmlSource, /data-admin-teacher-only/);
  assert.match(htmlSource, /id="teacher-import-default-branch"/);
  assert.match(htmlSource, /id="teacher-import-default-class"/);
  assert.match(htmlSource, /id="teacher-import-default-teacher"/);
  assert.match(htmlSource, /id="teacher-import-textarea"/);
  assert.match(htmlSource, /id="teacher-import-file"/);
  assert.match(htmlSource, /data-teacher-import-template/);
  assert.match(htmlSource, /data-teacher-import-preview/);
  assert.match(htmlSource, /data-teacher-import-submit/);
  assert.match(htmlSource, /id="teacher-import-preview"/);
  assert.match(htmlSource, /负责老师 ID/);
  const importPanelHtml = htmlSource.slice(
    htmlSource.indexOf('<section class="teacher-import-panel'),
    htmlSource.indexOf('<section class="teacher-panel panel-card">')
  );
  assert.doesNotMatch(importPanelHtml, /诚意朋友 ID/);
  assert.doesNotMatch(importPanelHtml, /,status/);
  assert.doesNotMatch(importPanelHtml, /状态/);

  assert.match(appSource, /function normalizeBulkImportStudentId\(value\)/);
  assert.match(appSource, /function isTeacherGlobalAdminId\(teacherId\)/);
  assert.match(appSource, /function getTeacherBulkImportDefaults/);
  assert.match(appSource, /function parseTeacherBulkImportRows\(text,\s*defaults\s*=\s*\{\}\)/);
  assert.match(appSource, /function renderTeacherImportPreview/);
  assert.match(appSource, /async function importTeacherBulkStudents/);
  assert.match(appSource, /backend\.bulkImportStudents\(\{\s*teacherId,\s*defaultBranch,\s*defaultClassName,\s*defaultTeacherId,\s*rows:\s*result\.rows\s*\}\)/);
  assert.match(appSource, /学生 ID 请填写 4 位数字或 CY\+4 位数字/);
  assert.match(appSource, /请先设定班级名字/);
  assert.match(appSource, /请先设定负责老师 ID/);
  assert.match(appSource, /<th>负责老师<\/th>/);
  const teacherImportSource = sourceBetween('function normalizeTeacherImportHeader', 'function renderTeacherControls');
  assert.doesNotMatch(teacherImportSource, /sincereFriendId/);
  assert.doesNotMatch(teacherImportSource, /normalizeTeacherImportStatus/);
  assert.doesNotMatch(teacherImportSource, /<th>状态<\/th>/);
  assert.match(cssSource, /\.teacher-import-panel/);
  assert.match(cssSource, /\.teacher-import-defaults/);
  assert.match(cssSource, /\.teacher-import-table/);
});

test('student login shows one-time teacher reward congratulations from Supabase rewards', () => {
  assert.match(appSource, /const TEACHER_REWARD_NOTICE_STORAGE_KEY/);
  assert.match(appSource, /function getTeacherRewardNoticeId\(reward\)/);
  assert.match(appSource, /function maybeShowTeacherRewardModal\(student = getStudent\(\)\)/);
  assert.match(appSource, /showGiftClaimModal\(\{\s*title: '恭喜获得老师奖励！'/);
  assert.match(appSource, /teacherName/);
  assert.match(appSource, /老师奖励/);
  assert.match(appSource, /setTimeout\(\(\) => maybeShowTeacherRewardModal\(database\[normalized\]\), 980\)/);
});

test('teacher reward controls include larger classroom reward shortcuts', () => {
  const rewardAmounts = [...htmlSource.matchAll(/data-teacher-reward="(\d+)"/g)].map(match => Number(match[1]));
  assert.deepEqual(rewardAmounts, [2, 4, 6, 8, 10, 20, 50, 100, 250, 1000]);
  assert.match(htmlSource, /data-teacher-reward="20"[^>]*>\+20<\/button>/);
  assert.match(htmlSource, /data-teacher-reward="50"[^>]*>\+50<\/button>/);
  assert.match(htmlSource, /data-teacher-reward="100"[^>]*>\+100<\/button>/);
  assert.match(htmlSource, /data-teacher-reward="250"[^>]*>\+250<\/button>/);
  assert.match(htmlSource, /data-teacher-reward="1000"[^>]*>\+1000<\/button>/);
  assert.match(htmlSource, /学生每日最多 250，CY0000\/CY0001 可给老师账号无上限/);
});

test('teacher rewards cap student targets while CY0000 and CY0001 teacher targets stay unlimited', () => {
  assert.match(appSource, /teacherDailyRewardLimit:\s*250/);
  assert.match(appSource, /isTeacherAccount\(student\)/);
  assert.match(appSource, /function isTeacherRewardAdminId\(teacherId\)/);
  assert.match(appSource, /TEACHER_REWARD_ADMIN_IDS = new Set\(\['CY0000', 'CY0001'\]\)/);
  assert.match(appSource, /const canRewardTeacherTargets = isTeacherRewardAdminId\(teacherId\)/);
  assert.match(appSource, /if \(teacherTarget && !canRewardTeacherTargets\) \{[\s\S]*?limitedCount \+= 1;[\s\S]*?return;[\s\S]*?\}/);
  assert.match(appSource, /remainingDailyReward/);
  assert.match(appSource, /appliedAmount/);
  assert.match(appSource, /CY0000 和 CY0001 可以给老师账号无上限加分/);
});

test('student purchases and pet state changes are persisted to GAS', () => {
  assert.match(appSource, /async function persistStudentState\(student, event = \{\}\)/);
  assert.match(appSource, /backend\.saveStudentState\(student, event\)/);
  assert.match(appSource, /let studentSaveQueue = Promise\.resolve\(\)/);
  assert.match(appSource, /function enqueueStudentSave\(task\)/);
  assert.match(sourceBetween('async function persistStudentState(student, event = {})', 'async function commitStudentState'), /return enqueueStudentSave\(async \(\) =>/);
  assert.match(appSource, /async function commitStudentState\(student, snapshot, event, onSuccess\)/);
  assert.match(appSource, /保存到云端失败，刚才的操作没有完成/);

  assert.match(sourceBetween("if (pendingPetMode === 'purchase')", 'student.petType = pet.id;'), /await commitStudentState\([\s\S]*type: 'purchasePet'/);
  assert.match(sourceBetween('student.petType = pet.id;', 'showToast(`${displayName} 已成为你的学习伙伴！`);'), /await commitStudentState\([\s\S]*type: 'adoptInitialPet'/);
  assert.match(sourceBetween('async function buyAndEquipItem', 'async function buyPet'), /await commitStudentState\([\s\S]*type: 'purchaseAndEquipItem'/);
  assert.match(sourceBetween('async function equipItem', 'async function unequipItem'), /await commitStudentState\([\s\S]*type: 'equipItem'/);
  const unequipBlock = sourceBetween('async function unequipItem', 'function renderHistory');
  assert.match(unequipBlock, /showToast\(localize\('为了保护进化进度，已装备的物品不能卸下。'\)\)/);
  assert.doesNotMatch(unequipBlock, /commitStudentState/);
  assert.doesNotMatch(unequipBlock, /type: 'unequipItem'/);
  assert.match(sourceBetween('function switchActivePet', 'function getPetDisplayImage'), /await persistStudentState\(student, \{ type: 'switchPet'/);
  assert.match(sourceBetween('async function evolvePet', 'function updateAdoptionConfirmState'), /await commitStudentState\([\s\S]*type: 'evolvePet'/);
  assert.match(appSource, /const MINI_EVOLUTION_COIN_COST = 80/);
  assert.match(appSource, /const FINAL_EVOLUTION_COIN_COST = 100/);
  assert.match(sourceBetween('async function miniEvolvePet()', 'async function evolvePet'), /price: student\.demoMode \? 0 : MINI_EVOLUTION_COIN_COST/);
  assert.match(sourceBetween('async function evolvePet', 'function updateAdoptionConfirmState'), /price: student\.demoMode \? 0 : FINAL_EVOLUTION_COIN_COST/);
});

test('new players get a guided first-pet onboarding tour with focused color highlights', () => {
  assert.match(htmlSource, /id="new-player-guide-overlay"/);
  assert.match(htmlSource, /class="new-player-guide-bubble"/);
  assert.match(htmlSource, /class="new-player-guide-meta"/);
  assert.match(htmlSource, /class="new-player-guide-language-toggle"/);
  assert.match(htmlSource, /data-new-player-guide-language/);
  assert.match(htmlSource, /data-language="zh"[^>]*>CH<\/button>/);
  assert.match(htmlSource, /data-language="en"[^>]*>ENG<\/button>/);
  assert.match(htmlSource, /data-new-player-guide-shade="top"/);
  assert.match(htmlSource, /class="new-player-guide-spotlight-ring"/);
  assert.match(htmlSource, /data-new-player-guide-close/);
  assert.match(htmlSource, /data-new-player-guide-next/);
  assert.match(htmlSource, /data-onboarding-target="nav-pets"/);
  assert.match(htmlSource, /id="pet-stage"[^>]*data-onboarding-target="role-card"/);
  assert.match(htmlSource, /data-onboarding-target="skills"/);
  assert.match(htmlSource, /data-onboarding-target="exclusive-gear"/);
  assert.match(htmlSource, /data-onboarding-target="pet-collection"/);
  assert.match(htmlSource, /data-onboarding-target="interaction-area"/);
  assert.match(htmlSource, /data-onboarding-target="checkin"/);
  assert.match(htmlSource, /data-onboarding-target="pet-shop"/);
  assert.match(htmlSource, /data-onboarding-target="message-wall"/);
  assert.match(htmlSource, /data-onboarding-target="friends"/);
  assert.match(htmlSource, /data-onboarding-target="music-box"/);

  assert.match(appSource, /const NEW_PLAYER_GUIDE_STEPS\s*=\s*\[/);
  assert.match(appSource, /holiday-new-player-guide-completed-v7/);
  assert.match(appSource, /const NEW_PLAYER_GUIDE_COMPLETION_VERSION = '20260824-26'/);
  assert.match(appSource, /const NEW_PLAYER_GUIDE_TYPE_SPEED_MS/);
  assert.match(appSource, /你好啊！主人！/);
  assert.match(appSource, /titleEn:\s*'Hello, owner!'/);
  assert.match(appSource, /我是会和你一起度过假期的/);
  assert.match(appSource, /copyEn:\s*student => `I am \$\{getNewPlayerGuidePetName\(student\)\}, your holiday learning buddy\.`/);
  assert.match(appSource, /id:\s*'welcome'[\s\S]{0,160}target:\s*''[\s\S]{0,80}spotlight:\s*false/);
  assert.match(appSource, /titleEn:\s*'Let’s start here!'/);
  assert.match(appSource, /titleEn:\s*'This is me!'/);
  assert.match(appSource, /titleEn:\s*'My skills are here!'/);
  assert.match(appSource, /titleEn:\s*'Help me collect gear!'/);
  assert.match(appSource, /titleEn:\s*'Everyone stays here!'/);
  assert.match(appSource, /titleEn:\s*'We can play here!'/);
  assert.match(appSource, /titleEn:\s*'Study a little every day!'/);
  assert.match(appSource, /titleEn:\s*'Want to meet new friends\?'/);
  assert.match(appSource, /titleEn:\s*'Share the happy moments!'/);
  assert.match(appSource, /titleEn:\s*'Friends matter too!'/);
  assert.match(appSource, /titleEn:\s*'Finally, choose a song!'/);
  assert.match(appSource, /target:\s*'nav-pets'/);
  assert.match(appSource, /target:\s*'role-card'/);
  assert.match(appSource, /target:\s*'skills'/);
  assert.match(appSource, /target:\s*'exclusive-gear'/);
  assert.match(appSource, /id:\s*'exclusive-gear'[\s\S]{0,220}scrollBlock:\s*'center'/);
  assert.match(appSource, /id:\s*'exclusive-gear'[\s\S]{0,260}guidePlacement:\s*'top'/);
  assert.match(appSource, /这里是下方购买专属装备的地方/);
  assert.match(appSource, /target:\s*'pet-collection'/);
  assert.match(appSource, /id:\s*'pet-collection'[\s\S]{0,220}guidePlacement:\s*'top'/);
  assert.match(appSource, /target:\s*'interaction-area'/);
  assert.match(appSource, /extraTargets:\s*\['nav-guide'\]/);
  assert.match(appSource, /target:\s*'checkin'/);
  assert.match(appSource, /extraTargets:\s*\['nav-checkin'\]/);
  assert.match(appSource, /target:\s*'pet-shop'/);
  assert.match(appSource, /extraTargets:\s*\['nav-shop'\]/);
  assert.match(appSource, /target:\s*'message-wall'/);
  assert.match(appSource, /extraTargets:\s*\['nav-wall'\]/);
  assert.match(appSource, /target:\s*'friends'/);
  assert.match(appSource, /extraTargets:\s*\['nav-friends'\]/);
  assert.match(appSource, /target:\s*'music-box'/);
  assert.match(appSource, /extraTargets:\s*\['nav-music'\]/);
  assert.match(appSource, /function shouldShowNewPlayerGuide\(student\)/);
  assert.doesNotMatch(appSource, /NEW_PLAYER_GUIDE_PREVIEW_STUDENT_IDS/);
  assert.doesNotMatch(appSource, /function isNewPlayerGuidePreviewStudent/);
  assert.match(sourceBetween('function shouldShowNewPlayerGuide(student)', 'function getOnboardingTargetElement'), /if \(!student\?\.petType\) return false/);
  assert.match(sourceBetween('function shouldShowNewPlayerGuide(student)', 'function getOnboardingTargetElement'), /forceNewPlayerGuide \|\| student\.forceOnboardingTour \|\| student\.newPlayerGuideEligible/);
  assert.match(sourceBetween('function shouldShowNewPlayerGuide(student)', 'function getOnboardingTargetElement'), /student\.newPlayerGuideCompletedVersion === NEW_PLAYER_GUIDE_COMPLETION_VERSION/);
  assert.match(sourceBetween('function shouldShowNewPlayerGuide(student)', 'function getOnboardingTargetElement'), /if \(!forceGuide && \(hasCompletedCurrentGuideVersion \|\| hasLocalNewPlayerGuideCompletion\(student\)\)\) return false/);
  assert.doesNotMatch(sourceBetween('function shouldShowNewPlayerGuide(student)', 'function getOnboardingTargetElement'), /newPlayerGuideCompletedAt \|\| hasLocalNewPlayerGuideCompletion/);
  assert.match(sourceBetween('function shouldShowNewPlayerGuide(student)', 'function getOnboardingTargetElement'), /return true/);
  assert.match(appSource, /function preloadNewPlayerGuideSprites\(student = getStudent\(\)\)/);
  assert.match(sourceBetween('function preloadNewPlayerGuideSprites', 'function shouldShowNewPlayerGuide'), /new Image\(\)/);
  assert.match(sourceBetween('function preloadNewPlayerGuideSprites', 'function shouldShowNewPlayerGuide'), /getNewPlayerGuideSprite\(student\)/);
  assert.match(sourceBetween('function preloadNewPlayerGuideSprites', 'function shouldShowNewPlayerGuide'), /getNewPlayerGuideFallbackSprite\(student\)/);
  assert.match(appSource, /const NEW_PLAYER_GUIDE_GREETING_PET_IDS = new Set\(\['sunny-wing', 'sprouty', 'hydroblob', 'fluffbit'\]\)/);
  assert.match(sourceBetween('function getNewPlayerGuideSprite', 'function getNewPlayerGuideFallbackSprite'), /NEW_PLAYER_GUIDE_GREETING_PET_IDS\.has\(petId\) \? 'characters-greeting' : 'characters'/);
  assert.match(appSource, /function getNewPlayerGuideStepTitle\(step, student = getStudent\(\)\)/);
  assert.match(appSource, /function getNewPlayerGuideStepCopy\(step, student = getStudent\(\)\)/);
  assert.match(sourceBetween('function getNewPlayerGuideStepTitle', 'function getNewPlayerGuideStepCopy'), /currentLanguage === 'en' && step\.titleEn/);
  assert.match(sourceBetween('function getNewPlayerGuideStepCopy', 'function shouldShowNewPlayerGuide'), /currentLanguage === 'en' && step\.copyEn/);
  assert.match(appSource, /function setNewPlayerGuideSpotlightRect/);
  assert.match(appSource, /function setNewPlayerGuideNoSpotlight/);
  assert.match(appSource, /function setNewPlayerGuidePlacement/);
  assert.match(appSource, /currentStep\.spotlight === false \|\| !currentStep\.target/);
  assert.match(appSource, /setNewPlayerGuidePlacement\(step\.guidePlacement \|\| 'bottom'\)/);
  assert.match(appSource, /getNewPlayerGuideFocusTargets\(step\)\.forEach/);
  assert.match(appSource, /getBoundingClientRect/);
  assert.match(appSource, /--new-player-guide-spotlight-x/);
  assert.match(appSource, /window\.addEventListener\('scroll', scheduleNewPlayerGuideSpotlightUpdate, true\)/);
  assert.match(appSource, /visualViewport\.addEventListener\('resize', scheduleNewPlayerGuideSpotlightUpdate\)/);
  assert.match(appSource, /function startNewPlayerGuideTyping/);
  assert.match(appSource, /function completeNewPlayerGuideTyping/);
  assert.match(sourceBetween('function setLanguage(language)', 'function setScreenMode'), /if \(newPlayerGuideState\.active\)/);
  assert.match(sourceBetween('function setLanguage(language)', 'function setScreenMode'), /renderNewPlayerGuideStep\(\)/);
  assert.match(sourceBetween('function setLanguage(language)', 'function setScreenMode'), /applyLanguage\(\$\('#new-player-guide-overlay'\) \|\| document\.body\)/);
  assert.match(sourceBetween('function setLanguage(language)', 'function setScreenMode'), /scheduleNewPlayerGuideSpotlightUpdate\(\)/);
  assert.match(appSource, /function startNewPlayerGuide/);
  assert.match(sourceBetween('function startNewPlayerGuide', 'function queueNewPlayerGuide'), /preloadNewPlayerGuideSprites\(student\)/);
  assert.match(appSource, /function closeNewPlayerGuide/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /student\.newPlayerGuideCompletedVersion = NEW_PLAYER_GUIDE_COMPLETION_VERSION/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /student\.forceNewPlayerGuide = false/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /student\.forceOnboardingTour = false/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /student\.newPlayerGuideEligible = false/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /if \(shouldShowDailyCheckinGuide\(student\)\) \{/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /queueNewPlayerGuide\(getStudent\(\)\)/);
  assert.match(appSource, /session\.activeView !== DEFAULT_APP_VIEW\) switchView\(DEFAULT_APP_VIEW\)/);
  assert.match(sourceBetween('student.petType = pet.id;', 'showToast(`${displayName} 已成为你的学习伙伴！`);'), /queueNewPlayerGuide\(student\)/);
  assert.match(sourceBetween('function queueNewPlayerGuide', 'function maybeQueueNewPlayerGuide'), /preloadNewPlayerGuideSprites\(student\)/);
  assert.match(appSource, /function maybeQueueNewPlayerGuide\(student = getStudent\(\)\)/);
  assert.match(sourceBetween('function renderAppShell()', 'function renderHome()'), /setTimeout\(\(\) => maybeQueueNewPlayerGuide\(getStudent\(\)\), 540\)/);
  assert.match(sourceBetween("document.addEventListener('click'", "const avatarCropSaveButton = event.target.closest('[data-avatar-crop-save]')"), /data-new-player-guide-close/);
  assert.match(cssSource, /body\.new-player-guide-active/);
  assert.match(cssSource, /body\.new-player-guide-active \.language-toggle/);
  assert.match(cssSource, /\.new-player-guide-meta/);
  assert.match(cssSource, /\.new-player-guide-language-toggle/);
  assert.match(cssSource, /\.new-player-guide-language-toggle \.language-button/);
  assert.match(cssSource, /\.new-player-guide-focus/);
  assert.match(cssSource, /\.new-player-guide-overlay\.new-player-guide-no-spotlight \.new-player-guide-scrim/);
  assert.match(cssSource, /background:\s*rgba\(0,\s*0,\s*0,\s*\.86\)/);
  assert.match(cssSource, /\.new-player-guide-overlay\.new-player-guide-no-spotlight \.new-player-guide-spotlight-ring/);
  assert.match(cssSource, /--new-player-guide-spotlight-x/);
  assert.match(cssSource, /\.new-player-guide-shade-top/);
  assert.match(cssSource, /\.new-player-guide-shade-right/);
  assert.match(cssSource, /\.new-player-guide-spotlight-ring/);
  assert.match(cssSource, /var\(--new-player-guide-spotlight-w\)/);
  assert.match(cssSource, /\.new-player-guide-overlay\[data-guide-placement="top"\] \.new-player-guide-stage/);
  assert.match(cssSource, /max-height:\s*min\(36dvh,\s*320px\)/);
  assert.match(cssSource, /\.new-player-guide-bubble p:not\(\.new-player-guide-step\)[\s\S]{0,180}overflow:\s*auto/);
  const guideBubbleStart = cssSource.indexOf('.new-player-guide-bubble {');
  assert.notEqual(guideBubbleStart, -1, 'Missing new player guide bubble styles.');
  const guideBubbleEnd = cssSource.indexOf('}', guideBubbleStart);
  const guideBubbleBlock = cssSource.slice(guideBubbleStart, guideBubbleEnd);
  assert.match(guideBubbleBlock, /right:/);
  assert.doesNotMatch(guideBubbleBlock, /left:\s*50%/);
});

test('guide module can preview the yiyan blind-box apology without writing cloud completion', () => {
  assert.match(appSource, /const YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID = 'yiyan-blind-box-apology'/);
  assert.match(appSource, /const YIYAN_BLIND_BOX_APOLOGY_MAX_RUNS = 2/);
  assert.match(appSource, /const YIYAN_BLIND_BOX_APOLOGY_GUIDE_STEPS = \[/);
  assert.match(appSource, /Yiyan老师，对不起！/);
  assert.match(appSource, /额外补送 2 个盲盒/);
  assert.match(appSource, /guidePreview'\) \|\| params\.get\('guide'\)/);
  assert.match(appSource, /function canUseLocalGuidePreview\(\)/);
  assert.match(appSource, /\['localhost', '127\.0\.0\.1', ''\]/);
  assert.match(appSource, /value === 'yiyan-apology' \|\| value === YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID/);
  assert.match(appSource, /function startLocalGuidePreviewFromUrl\(\)/);
  assert.match(appSource, /buildYiyanApologyPreviewStudent\(\)/);
  assert.match(appSource, /if \(!startLocalGuidePreviewFromUrl\(\)\) restoreSavedLogin\(\)/);
  assert.match(appSource, /function getNewPlayerGuideSteps\(student = getStudent\(\)\)/);
  assert.match(appSource, /function getApologyGuideMaxRuns\(guideId\)/);
  assert.match(appSource, /function getApologyGuideCompletedCount\(student, guideId\)/);
  assert.doesNotMatch(sourceBetween('function getApologyGuideCompletedCount', 'function hasCompletedApologyGuide'), /toNumber\(/);
  assert.match(sourceBetween('function hasCompletedApologyGuide', 'function hasLocalNewPlayerGuideCompletion'), /getApologyGuideCompletedCount\(student, guideId\) >= getApologyGuideMaxRuns\(guideId\)/);
  assert.match(sourceBetween('function renderNewPlayerGuideStep()', 'function showNewPlayerGuideStep'), /`\$\{newPlayerGuideState\.index \+ 1\} \/ \$\{steps\.length\}`/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /if \(completedGuidePreview \|\| options\.localOnly \|\| !student\?\.petType\) return/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /completedCount = Math\.min\(maxRuns, getApologyGuideCompletedCount/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /completedCount >= maxRuns/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /type: 'completeApologyGuide'/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /maxCompletions: maxRuns/);
  assert.match(sourceBetween('async function login', 'function isGasBackend'), /setTimeout\(\(\) => maybeQueueNewPlayerGuide\(database\[normalized\]\), 700\)/);
});

test('teacher-only guide announces new music with each teacher standing 8bit pet', () => {
  assert.match(appSource, /const TEACHER_NEW_MUSIC_GUIDE_ID = 'teacher-new-music'/);
  assert.match(appSource, /const TEACHER_NEW_MUSIC_GUIDE_COMPLETION_VERSION = '20260826-01'/);
  assert.match(appSource, /const TEACHER_NEW_MUSIC_GUIDE_STEPS = \[/);
  assert.match(appSource, /老师，新歌上线啦！/);
  assert.match(appSource, /BLACKPINK、BTS、IVE、SEVENTEEN、Stray Kids、TWICE、Hachimi/);
  assert.match(appSource, /抽到没有拥有的歌曲/);
  assert.match(appSource, /歌曲也可以送给好友/);
  assert.match(appSource, /function getTeacherNewMusicGuideSprite\(student = getStudent\(\)\)/);
  assert.match(sourceBetween('function getTeacherNewMusicGuideSprite', 'function getNewPlayerGuideSprite'), /getKuromiRoomSpriteProfile\(student\)/);
  assert.match(sourceBetween('function getTeacherNewMusicGuideSprite', 'function getNewPlayerGuideSprite'), /profile\.idleSrc \|\| profile\.fallbackSrc/);
  assert.match(sourceBetween('function shouldShowNewPlayerGuide', 'function getOnboardingTargetElement'), /mode === TEACHER_NEW_MUSIC_GUIDE_ID/);
  assert.match(sourceBetween('function shouldShowNewPlayerGuide', 'function getOnboardingTargetElement'), /isTeacherAccount\(student\)/);
  assert.match(sourceBetween('function shouldShowNewPlayerGuide', 'function getOnboardingTargetElement'), /hasCompletedTeacherNewMusicGuide\(student\)/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /completedGuideMode === TEACHER_NEW_MUSIC_GUIDE_ID/);
  assert.match(sourceBetween('async function closeNewPlayerGuide', 'async function nextNewPlayerGuideStep'), /markLocalTeacherNewMusicGuideCompletion\(student\)/);
  assert.match(sourceBetween('function getNewPlayerGuidePreviewMode', 'function getStudentApologyGuideId'), /value === 'teacher-music' \|\| value === TEACHER_NEW_MUSIC_GUIDE_ID/);
  assert.match(appSource, /buildTeacherMusicGuidePreviewStudent\(\)/);
  assert.match(sourceBetween('async function login', 'function isGasBackend'), /setTimeout\(\(\) => maybeQueueNewPlayerGuide\(database\[normalized\]\), 700\)/);
});

test('pet skill and equipment artwork is cache-busted after asset replacements', () => {
  assert.match(sourceBetween('function renderPetSkills(student)', 'function renderPetShop(student)'), /withAssetVersion\(image \|\| ''\)/);
  assert.match(sourceBetween('function renderEquipmentGrid(student)', 'function renderOwnedEquipment'), /withAssetVersion\(item\.image\)/);
  assert.match(sourceBetween('function renderPetExclusiveShop(student)', 'function renderOwnedEquipment'), /withAssetVersion\(item\.image\)/);
  assert.match(sourceBetween('function renderOwnedEquipment(student)', 'function renderPetSkills'), /withAssetVersion\(item\.image\)/);
});

test('student pages do not expose the legacy Sheet refresh button', () => {
  assert.doesNotMatch(htmlSource, /id="sync-sheet-button"/);
  assert.doesNotMatch(htmlSource, /data-sync-sheet/);
  assert.doesNotMatch(appSource, /async function syncStudentFromSheet\(\)/);
  assert.doesNotMatch(appSource, /backend\.getStudentFromGas\(student\.studentId, \{ includeClasses: false \}\)/);
  assert.doesNotMatch(sourceBetween("document.addEventListener('click'", "const languageButton = event.target.closest('[data-language]')"), /\[data-sync-sheet\]/);
});

test('student app no longer contains manual Sheet sync event wiring', () => {
  assert.doesNotMatch(appSource, /manualSheetSync/);
  assert.doesNotMatch(appSource, /mergeSheetRosterAndCoins/);
  assert.doesNotMatch(appSource, /setSyncStatus/);
});

test('app shell does not pre-render hidden heavy views after login', () => {
  const shellRenderer = sourceBetween('function renderAppShell()', 'function renderHome()');
  assert.doesNotMatch(shellRenderer, /renderShop\(\)/, 'shop catalog should render only when its tab is opened');
  assert.doesNotMatch(shellRenderer, /renderMessageWall\(student\)/, 'message wall should render only when its tab is opened');
  assert.doesNotMatch(shellRenderer, /renderHistory\(\)/, 'history should render only when its tab is opened');
  assert.match(shellRenderer, /maybeShowPetSelection\(\)/);
});

test('pet shop renders one selected series with each pet exclusive gear panel', () => {
  assert.match(appSource, /let selectedPetSeries = 'all'/);
  const shopRenderer = sourceBetween('function renderPetShop(student)', 'function messageWallUsesGas');
  assert.match(shopRenderer, /PET_SERIES_GROUPS/);
  assert.match(shopRenderer, /data-pet-series-select/);
  assert.match(shopRenderer, /data-pet-series/);
  assert.match(shopRenderer, /getPetSeriesPets\(selectedPetSeries\)/);
  assert.match(shopRenderer, /getExclusiveItemsForPet\(pet\.id\)/);
  assert.match(shopRenderer, /getVisibleExclusiveItemsForPet\(student, pet\.id, items\)/);
  assert.match(shopRenderer, /pet-shop-gear-panel/);
  assert.match(sourceBetween("document.addEventListener('change'", "const wallPresetSelect = event.target.closest('[data-wall-post-select]')"), /\[data-pet-series-select\]/);
});

test('current pet gear can be bought and equipped in a single Sheet save', () => {
  assert.match(appSource, /async function buyAndEquipItem\(itemId\)/);
  assert.match(sourceBetween("const buyButton = event.target.closest('[data-buy-item]')", "const buyPetButton = event.target.closest('[data-buy-pet]')"), /buyAndEquipItem\(buyButton\.dataset\.buyItem\)/);
  const combinedAction = sourceBetween('async function buyAndEquipItem(itemId)', 'async function buyPet');
  assert.match(combinedAction, /type: 'purchaseAndEquipItem'/);
  assert.match(combinedAction, /student\.equippedItems\[item\.slot\] = itemId/);
  assert.doesNotMatch(combinedAction, /await equipItem/);
});

test('sheet write buttons show loading while waiting for GAS', () => {
  assert.match(appSource, /async function withButtonLoading\(button, task, label = '保存中'\)/);
  assert.match(appSource, /classList\.add\('is-loading'\)/);
  assert.match(appSource, /button-spinner/);

  assert.match(appSource, /async function runEquipmentAction\(button, task, label = '保存中'\)/);
  assert.match(sourceBetween('async function runEquipmentAction', 'function renderPetInteraction'), /withButtonLoading\(button, task, label\)/);
  assert.match(sourceBetween("const buyButton = event.target.closest('[data-buy-item]')", "const buyPetButton = event.target.closest('[data-buy-pet]')"), /await runEquipmentAction\(buyButton, \(\) => buyAndEquipItem/);
  assert.match(sourceBetween("const teacherRewardButton = event.target.closest('[data-teacher-reward]')", "const equipButton = event.target.closest('[data-equip-item]')"), /await withButtonLoading\(teacherRewardButton, \(\) => rewardSelectedStudents/);
  assert.match(sourceBetween("const equipButton = event.target.closest('[data-equip-item]')", "const unequipButton = event.target.closest('[data-unequip-item]')"), /await runEquipmentAction\(equipButton, \(\) => equipItem/);
  assert.match(sourceBetween("const unequipButton = event.target.closest('[data-unequip-item]')", "const initialPetButton = event.target.closest('[data-initial-pet]')"), /await runEquipmentAction\(unequipButton, \(\) => unequipItem/);
  const evolutionActions = sourceBetween("const miniEvolveButton = event.target.closest('[data-mini-evolve-pet]')", "const switchPetButton = event.target.closest('[data-switch-pet]')");
  assert.match(evolutionActions, /await withButtonLoading\(miniEvolveButton, \(\) => miniEvolvePet/);
  assert.match(evolutionActions, /openEvolutionChoiceModal\(\)/);
  assert.match(evolutionActions, /await withButtonLoading\(evolutionStyleButton, \(\) => evolvePet\(evolutionStyleButton\.dataset\.evolutionStyle, evolutionStyleButton\)/);
  assert.match(sourceBetween("const switchPetButton = event.target.closest('[data-switch-pet]')", "const confirmInitialPetButton = event.target.closest('#confirm-initial-pet')"), /await withButtonLoading\(switchPetButton/);
  assert.match(sourceBetween("const confirmInitialPetButton = event.target.closest('#confirm-initial-pet')", "const submitAnswerButton = event.target.closest('#submit-answer')"), /await withButtonLoading\(confirmInitialPetButton, \(\) => chooseInitialPet/);
  assert.match(sourceBetween("const submitAnswerButton = event.target.closest('#submit-answer')", '});\n\n  window.__holidayCheckinApp'), /await withButtonLoading\(submitAnswerButton, \(\) => nextQuestion/);
});

test('student message wall uses preset sharing, likes, preset comments and GAS persistence', () => {
  assert.match(htmlSource, /data-view="wall-view"/);
  assert.match(htmlSource, /id="wall-view"/);
  assert.match(htmlSource, /id="pet-card-actions"/);
  assert.match(htmlSource, /id="message-wall-list"/);
  assert.match(appSource, /const WALL_POST_PRESETS\s*=\s*\[/);
  assert.match(appSource, /const WALL_COMMENT_PRESETS\s*=\s*\[/);
  assert.match(appSource, /function renderHomeWallShare\(student\)/);
  assert.match(appSource, /async function loadMessageWall\(\)/);
  assert.match(appSource, /async function createWallPost\(\)/);
  assert.match(appSource, /async function likeWallPost\(postId\)/);
  assert.match(appSource, /async function commentWallPost\(postId, text\)/);
  assert.match(appSource, /backend\.listWallPosts\(\)/);
  assert.match(appSource, /backend\.createWallPost/);
  assert.match(appSource, /backend\.likeWallPost/);
  assert.match(appSource, /backend\.commentWallPost/);
  assert.match(appSource, /我的宠物进化了！/);
  assert.match(appSource, /今天战力又变强了！/);
  assert.match(appSource, /谁要和我一起打卡？/);
  assert.match(appSource, /太帅了吧！/);
  assert.match(appSource, /function validateWallCommentText\(text\)/);
  assert.match(appSource, /id="wall-custom-comment-/);
  assert.match(appSource, /data-wall-custom-comment/);
  assert.match(appSource, /留言里有不适合公开展示的词/);
  assert.match(sourceBetween("const wallShareButton = event.target.closest('#share-wall-post-button')", "const submitAnswerButton = event.target.closest('#submit-answer')"), /createWallPost\(\)/);
});

test('student avatar upload saves a compact avatar and shows it on message wall posts', () => {
  assert.match(htmlSource, /id="student-avatar-upload"/);
  assert.match(htmlSource, /id="student-profile-edit-button"/);
  assert.match(htmlSource, /id="student-avatar-menu-button"/);
  assert.match(htmlSource, /id="student-profile-overlay"/);
  assert.match(htmlSource, /id="student-profile-form"/);
  assert.equal((htmlSource.match(/data-student-avatar-preset=/g) || []).length, 6);
  assert.equal((htmlSource.match(/id="avatar-crop-overlay"/g) || []).length, 1);
  assert.match(htmlSource, /class="avatar-upload-control"/);
  assert.match(htmlSource, /id="avatar-crop-overlay"/);
  assert.match(htmlSource, /id="avatar-crop-canvas"/);
  assert.match(htmlSource, /data-avatar-crop-save/);
  assert.match(appSource, /const AVATAR_IMAGE_MAX_DATA_URL_LENGTH = 42000/);
  assert.match(appSource, /async function prepareStudentAvatarCrop\(file\)/);
  assert.match(appSource, /function createStudentAvatarImageFromCrop\(\)/);
  assert.match(appSource, /async function saveStudentAvatarFromCrop\(\)/);
  assert.match(appSource, /async function saveStudentPresetAvatar\(value\)/);
  assert.match(sourceBetween('async function saveStudentPresetAvatar(value)', 'function renderStudentAvatarVisual'), /student\.avatar = avatar/);
  assert.match(sourceBetween('async function saveStudentPresetAvatar(value)', 'function renderStudentAvatarVisual'), /student\.avatarImage = ''/);
  assert.match(sourceBetween('async function saveStudentPresetAvatar(value)', 'function renderStudentAvatarVisual'), /type: 'updateAvatarPreset'/);
  assert.match(sourceBetween("document.addEventListener('change'", "const interactionLockToggle"), /#student-avatar-upload/);
  assert.match(sourceBetween('function renderAppShell()', 'function renderHome()'), /student-avatar-preview/);
  assert.match(sourceBetween('function buildWallPostPayload(message)', 'async function createWallPost'), /__studentAvatarImage:\s*getStudentAvatarImage\(student\)/);
  assert.match(sourceBetween('function normalizeWallPost(post = {})', 'function dedupeWallComments'), /studentAvatarImage/);
  assert.match(sourceBetween('function renderMessageWall(student)', 'function openImageViewer'), /wall-owner-avatar/);
  assert.match(cssSource, /\.avatar-upload-control/);
  assert.match(cssSource, /\.student-chip #student-chip-avatar/);
  assert.doesNotMatch(cssSource, /\.student-chip span:first-child/);
  assert.match(cssSource, /\.wall-owner-avatar/);
});

test('pet home uses a compact share menu instead of full message wall presets', () => {
  assert.doesNotMatch(htmlSource, /id="home-wall-share-panel"/);
  assert.doesNotMatch(htmlSource, /id="home-share-menu-button"/);
  const homeRenderer = sourceBetween('function renderHome()', 'function getMaxLevelInfo()');
  assert.match(homeRenderer, /data-role-card-share/);
  assert.match(homeRenderer, /role-card-share-button/);
  assert.match(appSource, /async function shareCurrentRoleCardImage\(frameId = ''\)/);
  assert.match(appSource, /async function shareImageFile/);
  assert.match(appSource, /runNativeShareWithTimeout\(\{ title, text: shareText, files: \[file\] \}\)/);
  assert.match(appSource, /navigator\.canShare\(\{ files: \[file\] \}\)/);
  assert.match(sourceBetween('async function shareImageFile', 'async function shareCurrentRoleCardImage'), /openImageViewer\(\{/);
  assert.match(sourceBetween('async function shareImageFile', 'async function shareCurrentRoleCardImage'), /imageViewerObjectUrls\.add\(imageUrl\)/);
  assert.match(sourceBetween('function closeImageViewer', 'function openEvolutionBeforePreview'), /imageViewerObjectUrls\.forEach\(url => URL\.revokeObjectURL\(url\)\)/);
  assert.doesNotMatch(appSource, /https:\/\/wa\.me\/\?text=/);
  const clickSource = sourceBetween("document.addEventListener('click'", "const skillToggle = event.target.closest('[data-skill-toggle]')");
  assert.match(clickSource, /data-role-card-share/);
});

test('message wall sharing updates the screen before the slow Sheet write returns', () => {
  const createWallPostSource = sourceBetween('async function createWallPost()', 'async function likeWallPost(postId)');
  assert.match(appSource, /async function syncWallPostToGas\(post, localPost\)/);
  assert.match(createWallPostSource, /likedBy:\s*\[\]/);
  assert.match(createWallPostSource, /comments:\s*\[\]/);
  assert.match(createWallPostSource, /updateWallPost\(\{[\s\S]*\}, \{ moveToTop: true \}\)/);
  assert.match(createWallPostSource, /renderMessageWall\(student\);[\s\S]*renderHomeWallShare\(student\);[\s\S]*if \(messageWallUsesGas\(student\)\) \{[\s\S]*showToast\('已经分享到留言墙，正在同步。'\);[\s\S]*syncWallPostToGas\(localPost, localPost\)\.finally\(\(\) => pendingWallActions\.delete\(pendingKey\)\);[\s\S]*return true;/);
  assert.doesNotMatch(createWallPostSource, /await backend\.createWallPost/);
});

test('message wall reactions update optimistically before slow Sheet writes return', () => {
  assert.match(appSource, /async function syncWallLikeToGas\(postId, studentId, fallbackPost\)/);
  assert.match(appSource, /async function syncWallCommentToGas\(postId, comment, fallbackPost\)/);
  const likeWallPostSource = sourceBetween('async function likeWallPost(postId)', 'async function commentWallPost(postId, text)');
  assert.match(likeWallPostSource, /post\.likedBy = liked \? post\.likedBy\.filter\(id => id !== normalizedStudentId\) : \[\.\.\.post\.likedBy, normalizedStudentId\]/);
  assert.match(likeWallPostSource, /renderMessageWall\(student\);[\s\S]*if \(messageWallUsesGas\(student\)\) \{[\s\S]*syncWallLikeToGas\(postId, normalizedStudentId, post\)\.finally\(\(\) => pendingWallActions\.delete\(pendingKey\)\);[\s\S]*return true;/);
  assert.doesNotMatch(likeWallPostSource, /await backend\.likeWallPost/);
  const commentWallPostSource = sourceBetween('async function commentWallPost(postId, text)', "function renderWallStatGrid(stats = {}, petType = '')");
  assert.match(commentWallPostSource, /post\.comments = dedupeWallComments\(\[\.\.\.post\.comments, comment\]\);/);
  assert.match(commentWallPostSource, /renderMessageWall\(student\);[\s\S]*if \(messageWallUsesGas\(student\)\) \{[\s\S]*syncWallCommentToGas\(postId, comment, post\)\.finally\(\(\) => pendingWallActions\.delete\(pendingKey\)\);[\s\S]*return true;/);
  assert.doesNotMatch(commentWallPostSource, /await backend\.commentWallPost/);
  assert.doesNotMatch(sourceBetween("const wallLikeButton = event.target.closest('[data-wall-like]')", "const wallImageButton = event.target.closest('[data-wall-image-preview]')"), /await withButtonLoading/);
  assert.doesNotMatch(sourceBetween("const wallCommentButton = event.target.closest('[data-wall-comment]')", "const wallShareButton = event.target.closest('#share-wall-post-button')"), /await withButtonLoading/);
  assert.doesNotMatch(sourceBetween("const wallShareButton = event.target.closest('#share-wall-post-button')", "const submitAnswerButton = event.target.closest('#submit-answer')"), /await withButtonLoading/);
});

test('message wall preset sharing supports a compact mobile dropdown', () => {
  assert.match(appSource, /class="wall-preset-select-wrap"/);
  assert.match(appSource, /class="wall-preset-select"/);
  assert.match(appSource, /data-wall-post-select/);
  assert.match(appSource, /document\.addEventListener\('change'/);
});

test('message wall keeps one post per student and replaces older shares', () => {
  const updater = sourceBetween('function updateWallPost(post, options = {})', 'async function loadMessageWall');
  assert.match(appSource, /function dedupeWallPosts\(posts = \[\]\)/);
  const deduper = sourceBetween('function dedupeWallPosts(posts = [])', 'function buildWallEquipmentSnapshot(student)');
  assert.match(deduper, /const key = post\.studentId \|\| post\.postId/);
  assert.match(deduper, /post\.createdAt \|\| post\.updatedAt/);
  assert.match(updater, /function updateWallPost\(post, options = \{\}\)/);
  assert.match(updater, /options\.moveToTop/);
  assert.match(sourceBetween('async function loadMessageWall()', 'function buildWallPostPayload(message)'), /messageWallPosts = dedupeWallPosts\(Array\.isArray\(result\.posts\) \? result\.posts : \[\]\)/);

  const backendContract = fs.readFileSync(path.join(projectRoot, 'backend', 'Code.gs'), 'utf8');
  const createWallPostSource = backendContract.slice(
    backendContract.indexOf('function createWallPost_(payload)'),
    backendContract.indexOf('function likeWallPost_(payload)')
  );
  assert.match(createWallPostSource, /getCachedWallRowByStudent_\(wallSheet, studentId\)/);
  assert.match(createWallPostSource, /wallSheet\.getRange\(existingWallRow, 1, 1, HEADERS\.MessageWall\.length\)\.setValues/);
});

test('message wall comments and pending writes are deduped to avoid double display', () => {
  assert.match(appSource, /const pendingWallActions = new Set\(\)/);
  assert.match(appSource, /function dedupeWallComments\(comments = \[\]\)/);
  assert.match(sourceBetween('function dedupeWallComments(comments = [])', 'function dedupeWallPosts(posts = [])'), /const commentId = String\(comment\.commentId \|\| ''\)\.trim\(\)/);
  assert.match(sourceBetween('function normalizeWallPost(post = {})', 'function buildWallEquipmentSnapshot(student)'), /comments: dedupeWallComments\(Array\.isArray\(comments\) \? comments\.map\(comment =>/);
  assert.match(sourceBetween('function normalizeWallPost(post = {})', 'function dedupeWallComments(comments = [])'), /petName: String\(comment\.petName \|\| comment\.pet_name/);
  assert.match(sourceBetween('async function createWallPost()', 'async function likeWallPost(postId)'), /const pendingKey = `wall-post-\$\{HolidayBackendClient\.normalizeId\(student\.studentId\)\}`/);
  assert.match(sourceBetween('async function likeWallPost(postId)', 'async function commentWallPost(postId, text)'), /const pendingKey = `wall-like-\$\{postId\}-\$\{normalizedStudentId\}`/);
  assert.match(sourceBetween('async function commentWallPost(postId, text)', "function renderWallStatGrid(stats = {}, petType = '')"), /const pendingKey = `wall-comment-\$\{postId\}-\$\{HolidayBackendClient\.normalizeId\(student\.studentId\)\}-\$\{textValidation\.text\}`/);
});

test('message wall fills missing legacy pet artwork and zero stats from the role catalog', () => {
  const normalizer = sourceBetween('function normalizeWallPost(post = {})', 'function dedupeWallComments(comments = [])');
  assert.match(normalizer, /const fallbackPet = getPetInfo\(post\.petType\)/);
  assert.match(normalizer, /const normalizedStats = petStats && typeof petStats === 'object' && !Array\.isArray\(petStats\) \? petStats : \{\}/);
  assert.match(normalizer, /const statsAreEmpty = \['hp', 'attack', 'defense', 'speed', 'luck'\]\.every\(key => !Number\(normalizedStats\[key\] \|\| 0\)\)/);
  assert.match(normalizer, /petImage: String\(post\.petImage \|\| fallbackPet\?\.image \|\| ''\)/);
  assert.match(normalizer, /petStats: statsAreEmpty && fallbackPet\?\.baseStats \? fallbackPet\.baseStats : normalizedStats/);
});

test('shared message wall pet cards include name, level, stats, equipment and role card', () => {
  const payloadBuilder = sourceBetween('function buildWallPostPayload(message)', 'async function createWallPost');
  assert.match(payloadBuilder, /petStats:\s*\{\s*\.\.\.\(combat\.stats \|\| \{\}\)/);
  assert.match(payloadBuilder, /__totalCombatPower:\s*totalCombatPower/);
  assert.match(payloadBuilder, /equipment:\s*buildWallEquipmentSnapshot\(student\)/);
  assert.match(payloadBuilder, /petImage:\s*getPetDisplayImage\(student\)/);

  const equipmentSnapshot = sourceBetween('function buildWallEquipmentSnapshot(student)', 'function updateWallPost(post, options = {})');
  assert.match(equipmentSnapshot, /getEquippedItemList\(student\)\.map/);
  assert.match(equipmentSnapshot, /slotLabel:\s*slotInfo\.label/);

  const wallRenderer = sourceBetween('function renderMessageWall(student)', 'function openImageViewer');
  assert.match(wallRenderer, /renderWallStatGrid\(post\.petStats, post\.petType\)/);
  assert.match(wallRenderer, /renderWallEquipmentList\(post\.equipment\)/);
  assert.match(wallRenderer, /data-wall-comments-panel/);
  assert.match(wallRenderer, /class="wall-comments-summary"/);
  assert.match(wallRenderer, /class="wall-comments-content"/);
  assert.doesNotMatch(wallRenderer, /post\.comments\.slice\(-2\)/);
  assert.match(appSource, /function getWallPostDisplayName\(post\)/);
  assert.match(sourceBetween('function getWallPostDisplayName(post)', 'function getWallPostTitle(post)'), /post\?\.studentName/);
  assert.match(wallRenderer, /post\.petLevel/);
  assert.match(wallRenderer, /post\.petImage/);
  assert.match(wallRenderer, /data-wall-image-preview/);
  assert.match(wallRenderer, /openImageViewer/);
  assert.match(wallRenderer, /const wallOwnerName = getWallPostDisplayName\(post\) \|\| '学习伙伴'/);
  assert.match(wallRenderer, /comment\.studentName \|\| comment\.name \|\| comment\.studentId/);
  assert.doesNotMatch(wallRenderer, /<h3>\$\{escapeHtml\(post\.studentName\)\}<\/h3>/);

  const statRenderer = sourceBetween("function renderWallStatGrid(stats = {}, petType = '')", 'function renderWallEquipmentList(equipment = [])');
  assert.match(statRenderer, /wall-stat-grid/);
  const equipmentRenderer = sourceBetween('function renderWallEquipmentList(equipment = [])', 'function renderWallPostPresetButtons(target)');
  assert.match(equipmentRenderer, /wall-equipment-list/);
});

test('pet display names evolve by stage while keeping the student nickname separate from saved petName', () => {
  assert.match(appSource, /const PET_EVOLUTION_NAMES\s*=\s*\{/);
  assert.match(appSource, /function getPetFullDisplayName\(student, petType = student\?\.petType\)/);
  assert.match(appSource, /formatPetDisplayName\(getPetNickname\(student, petType\), getPetSpeciesNameForStudent\(student, petType\)\)/);
  assert.match(sourceBetween('function formatPetDisplayName(nickname, speciesName)', 'function getPetFullDisplayName'), /toLocaleLowerCase\(\) === cleanSpecies\.toLocaleLowerCase\(\)/);
  assert.match(appSource, /Hydro Wyrmling/);
  assert.match(appSource, /Hydro Dragonlord/);
  assert.match(appSource, /Hydro Bubblebun/);

  const homeRenderer = sourceBetween('function renderHome()', 'function getMaxLevelInfo()');
  assert.match(homeRenderer, /getPetFullDisplayNameWithTitle\(student\)/);
  assert.match(homeRenderer, /getPetSpeciesNameForStudent\(student\)/);

  const wallRenderer = sourceBetween('function renderMessageWall(student)', 'function openImageViewer');
  assert.match(wallRenderer, /getWallPostDisplayName\(post\)/);
  assert.match(wallRenderer, /getWallPostSpeciesName\(post\)/);

  const wallPayload = sourceBetween('function buildWallPostPayload(message)', 'async function createWallPost');
  assert.match(wallPayload, /petName:\s*student\?\.petName \|\| pet\?\.name \|\| ''/);
  assert.doesNotMatch(wallPayload, /getPetFullDisplayName/);

  const interactionProfile = sourceBetween('function getPetInteractionProfileForStudent', 'function getCurrentPetInteractionProfile');
  assert.match(interactionProfile, /getPetNickname\(student, student\.petType\)/);
  assert.doesNotMatch(interactionProfile, /getPetFullDisplayName\(student\)/);
});

test('evolved pets can show their pre-evolution artwork without leaving the page', () => {
  assert.match(htmlSource, /id="image-viewer-overlay"/);
  assert.match(htmlSource, /id="image-viewer-share-button"/);
  assert.match(htmlSource, /id="pet-card-actions"/);
  assert.match(appSource, /function openEvolutionBeforePreview\(\)/);
  assert.match(appSource, /data-evolution-before-preview/);
  assert.match(appSource, /查看进化前/);
  assert.match(appSource, /查看进化路线/);
  assert.match(appSource, /async function shareActiveImageViewerImage\(\)/);
  assert.match(appSource, /async function createEvolutionComparisonShareFile/);
  assert.match(sourceBetween('async function createEvolutionComparisonShareFile', 'async function shareImageFile'), /images\.slice\(0, 3\)/);
  const homeRenderer = sourceBetween('function renderHome()', 'function getMaxLevelInfo()');
  assert.match(homeRenderer, /\$\('#pet-card-actions'\)/);
  assert.match(homeRenderer, /role-card-before-button/);
  assert.match(homeRenderer, /role-card-share-button/);
  assert.match(homeRenderer, /data-evolution-before-preview/);
  assert.match(homeRenderer, /\(miniEvolved \|\| evolved\)/);
  const previewSource = sourceBetween('function openEvolutionBeforePreview()', 'function showPowerFeedback');
  assert.match(previewSource, /isPetMiniEvolved\(student\)/);
  assert.match(previewSource, /getPetMiniEvolutionImage\(pet\)/);
  assert.match(previewSource, /小进化样子/);
  assert.match(previewSource, /share:\s*\{\s*type:\s*'evolution-comparison'/);
  assert.match(htmlSource, /data-image-viewer-share/);
  assert.match(sourceBetween("document.addEventListener('click'", "const switchPetButton = event.target.closest('[data-switch-pet]')"), /\[data-evolution-before-preview\]/);
  assert.match(sourceBetween("document.addEventListener('click'", "const skillToggle = event.target.closest('[data-skill-toggle]')"), /\[data-image-viewer-share\]/);
});

test('pets that meet evolution requirements highlight final evolution route buttons without covering the role card', () => {
  assert.doesNotMatch(htmlSource, /id="home-evolution-panel"/);
  assert.doesNotMatch(htmlSource, /id="evolution-panel"/);
  const homeRenderer = sourceBetween('function renderHome()', 'function getMaxLevelInfo()');
  assert.match(homeRenderer, /const progress = syncEvolutionState\(student\)/);
  assert.match(homeRenderer, /const evolved = isPetEvolved\(student\)/);
  assert.match(homeRenderer, /renderPetEvolutionFormControls\(student, progress\)/);
  assert.doesNotMatch(homeRenderer, /pet-evolution-overlay/);
  assert.doesNotMatch(cssSource, /\.pet-evolution-overlay/);
  assert.match(appSource, /const isFinalReadyToUnlock = isFinalEvolutionForm\(form\) && canUnlockFinal && !isUnlocked/);
  assert.match(appSource, /cute-route/);
  assert.match(appSource, /heroic-route/);
  assert.match(appSource, /evolution-ready/);
  assert.match(cssSource, /\.pet-form-button\.evolution-ready\.cute-route/);
  assert.match(cssSource, /\.pet-form-button\.evolution-ready\.heroic-route/);
  assert.match(cssSource, /@keyframes\s+pet-form-ready-border-spin/);
  assert.doesNotMatch(homeRenderer, /renderEvolutionPanel\(student\)/);
  assert.doesNotMatch(sourceBetween('function renderShop()', 'function getStatLabel'), /renderEvolutionPanel\(student\)/);
});

test('pets support half-set mini evolution and cute or heroic final evolution routes', () => {
  assert.match(htmlSource, /id="evolution-choice-overlay"/);
  assert.match(htmlSource, /data-evolution-style="cute"/);
  assert.match(htmlSource, /data-evolution-style="heroic"/);
  assert.doesNotMatch(htmlSource, /id="initial-evolution-style-section"/);
  assert.doesNotMatch(htmlSource, /data-initial-evolution-style=/);
  assert.match(appSource, /function getMiniEvolutionRequiredCount\(required\)/);
  assert.match(appSource, /function isPetMiniEvolved\(student, petType = student\?\.petType\)/);
  assert.match(appSource, /const PET_EVOLUTION_FORM_ORIGINAL = 'original'/);
  assert.match(appSource, /const PET_EVOLUTION_FORM_MINI = 'mini'/);
  assert.match(appSource, /function getActivePetEvolutionForm\(student, petType = student\?\.petType\)/);
  assert.match(appSource, /function selectPetEvolutionForm\(form, triggerButton = null\)/);
  assert.match(appSource, /function getStudentEvolutionStylePreference\(student\)/);
  assert.match(appSource, /function getPetCuteEvolvedImage\(pet\)/);
  assert.match(appSource, /function getPetMiniEvolutionImage\(pet\)/);
  assert.match(appSource, /const APP_ASSET_VERSION = '20\d{6}-\d+'/);
  assert.match(appSource, /function isRoleCardAsset\(src\)/);
  assert.match(appSource, /function withAssetVersion\(src\)/);
  assert.match(appSource, /function getVersionedRoleCardAsset\(src\)/);
  assert.match(cssSource, /\.pet-stage\.role-card-stage/);
  assert.match(cssSource, /@keyframes\s+role-card-sway/);
  assert.match(cssSource, /\.role-card-stage \.pet-avatar\s*\{[^}]*animation:\s*role-card-sway/s);
  assert.doesNotMatch(cssSource, /\.role-card-stage \.pet-avatar\s*\{[^}]*animation:\s*none/s);
  assert.match(htmlSource, /styles\.css\?v=20\d{6}-\d+/);
  assert.match(htmlSource, /app\.js\?v=20\d{6}-\d+/);
  assert.doesNotMatch(sourceBetween('function getPetCuteEvolvedImage(pet)', 'function getPetMiniEvolutionImage(pet)'), /getPetQStyleImage/);
  assert.doesNotMatch(sourceBetween('function getPetMiniEvolutionImage(pet)', 'function isValidEvolutionStyle'), /getPetQStyleImage/);
  assert.match(appSource, /function getVisibleExclusiveItemsForPet\(student, petType = student\?\.petType/);
  assert.match(appSource, /function getLockedExclusiveItemsForPet\(student, petType = student\?\.petType/);
  assert.match(appSource, /function isExclusiveItemUnlockedForStudent\(student, item\)/);
  assert.match(appSource, /async function miniEvolvePet\(\)/);
  assert.match(appSource, /async function evolvePet\(evolutionStyle = ''\)/);
  assert.match(appSource, /student\.evolutionStylePreference = ''/);
  assert.match(appSource, /record\.evolutionStyle = finalStyle/);
  assert.match(appSource, /record\.miniEvolved = true/);
  const progressSource = sourceBetween('function getEvolutionProgress(student)', 'function syncEvolutionState(student)');
  assert.match(progressSource, /const miniRequired = getMiniEvolutionRequiredCount\(required\)/);
  assert.match(progressSource, /miniRequired,/);
  assert.match(progressSource, /miniComplete: equippedCount >= miniRequired/);
  assert.match(progressSource, /finalReady: miniAlreadyEvolved && equippedCount >= required/);
  assert.match(sourceBetween('function syncEvolutionState(student)', 'function syncExclusiveEvolutionState(student)'), /student\.evolutionReady = progress\.finalReady && !progress\.allFinalRoutesUnlocked/);
  const homeRenderer = sourceBetween('function renderHome()', 'function getMaxLevelInfo()');
  assert.match(homeRenderer, /renderPetEvolutionFormControls\(student, progress\)/);
  assert.match(homeRenderer, /role-card-form-glow/);
  assert.match(homeRenderer, /role-card-cute-glow/);
  assert.match(homeRenderer, /role-card-heroic-glow/);
  assert.match(cssSource, /\.pet-stage\.role-card-stage\.role-card-form-glow::after/);
  assert.match(cssSource, /\.pet-stage\.role-card-stage\.role-card-cute-glow/);
  assert.match(cssSource, /\.pet-stage\.role-card-stage\.role-card-heroic-glow/);
  const formRenderer = sourceBetween('function renderPetEvolutionFormControls(student', 'async function refreshActiveInteractionRoomPetAppearance');
  assert.match(formRenderer, /const canUnlockMini = form === PET_EVOLUTION_FORM_MINI && progress\.miniComplete/);
  assert.match(formRenderer, /const canUnlockFinal = isFinalEvolutionForm\(form\) && progress\.finalReady/);
  assert.match(formRenderer, /data-pet-evolution-form/);
  const exclusiveShopSource = sourceBetween('function renderPetExclusiveShop(student)', 'function renderOwnedEquipment');
  assert.match(exclusiveShopSource, /getVisibleExclusiveItemsForPet\(student, student\.petType, exclusiveItems\)/);
  assert.match(exclusiveShopSource, /getLockedExclusiveItemsForPet\(student, student\.petType, exclusiveItems\)/);
  assert.match(exclusiveShopSource, /等待小进化/);
  assert.match(sourceBetween('function renderPetShop(student)', 'function messageWallUsesGas'), /getVisibleExclusiveItemsForPet\(student, pet\.id, items\)/);
  assert.match(sourceBetween('async function buyAndEquipItem', 'async function buyPet'), /isExclusiveItemUnlockedForStudent\(student, item\)/);
  assert.match(sourceBetween('async function miniEvolvePet()', 'async function evolvePet'), /showEvolutionSequence\(student, before, after, \{ stage: 'mini' \}\)/);
  assert.match(sourceBetween('async function miniEvolvePet()', 'async function evolvePet'), /runEvolutionChallenge\(\{ stage: 'mini', requiredHits: 3, allowedMisses: 3 \}\)/);
  assert.match(sourceBetween('async function evolvePet', 'function updateAdoptionConfirmState'), /runEvolutionChallenge\(\{ stage: 'final', requiredHits: 6, allowedMisses: 3 \}\)/);
  assert.match(appSource, /function startReactionWheelGame/);
  assert.match(appSource, /function runEvolutionChallenge/);
  assert.match(appSource, /allowedMisses:\s*Math\.max\(0,\s*Number\(options\.allowedMisses/, 'reaction challenge should carry an allowed-misses setting');
  assert.match(appSource, /reaction\.misses > reaction\.allowedMisses/, 'reaction challenge should fail only after the mistake allowance is exceeded');
  assert.match(appSource, /角色进化失败。可以重新挑战/);
  const finalChoiceSource = sourceBetween('function openEvolutionChoiceModal()', 'function closeEvolutionChoiceModal()');
  assert.match(finalChoiceSource, /必须先完成小进化/);
  assert.match(finalChoiceSource, /\$\(\'#evolution-choice-pet-name\'\)\.textContent/);
  assert.doesNotMatch(finalChoiceSource, /const preferredStyle = getStudentEvolutionStylePreference\(student\)/);
  assert.doesNotMatch(finalChoiceSource, /return evolvePet\(preferredStyle\)/);
  assert.match(sourceBetween("document.addEventListener('click'", "const evolutionBeforeButton = event.target.closest('[data-evolution-before-preview]')"), /\[data-mini-evolve-pet\]/);
  assert.match(sourceBetween("document.addEventListener('click'", "const evolutionBeforeButton = event.target.closest('[data-evolution-before-preview]')"), /\[data-pet-evolution-form\]/);
  assert.doesNotMatch(sourceBetween("document.addEventListener('click'", "const evolutionBeforeButton = event.target.closest('[data-evolution-before-preview]')"), /\[data-initial-evolution-style\]/);
  assert.match(sourceBetween("document.addEventListener('click'", "const evolutionBeforeButton = event.target.closest('[data-evolution-before-preview]')"), /\[data-evolution-style\]/);
});

test('cute-only final evolution pets hide heroic route and migrate old heroic saves to cute', () => {
  const unlockedSource = sourceBetween('function getUnlockedPetEvolutionForms', 'function hasUnlockedPetEvolutionForm');
  const fallbackSource = sourceBetween('function getFallbackActivePetEvolutionForm', 'function getActivePetEvolutionForm');
  const syncSource = sourceBetween('function syncPetEvolutionFormState', 'function unlockPetEvolutionForm');
  const formRenderer = sourceBetween('function renderPetEvolutionFormControls(student', 'async function refreshActiveInteractionRoomPetAppearance');
  const selectorSource = sourceBetween('async function selectPetEvolutionForm', 'function renderExclusiveSetStatus');
  const evolveSource = sourceBetween('async function evolvePet', 'function updateAdoptionConfirmState');

  assert.match(appSource, /function petSupportsHeroicEvolution\(petType\)/);
  assert.match(appSource, /'my-melody'/);
  assert.match(appSource, /function getFinalPetEvolutionForms\(petType\)/);
  assert.match(appSource, /function getAvailablePetEvolutionForms\(petType\)/);
  assert.match(appSource, /function normalizePetEvolutionFormForPet\(value, petType\)/);
  assert.match(unlockedSource, /normalizePetEvolutionFormForPet\(form,\s*petType\)/);
  assert.match(unlockedSource, /getAvailablePetEvolutionForms\(petType\)\.filter/);
  assert.match(fallbackSource, /getFinalPetEvolutionForms\(petType\)/);
  assert.match(syncSource, /record\.evolutionStyle = normalizePetEvolutionFormForPet\(record\.evolutionStyle,\s*petType\)/);
  assert.match(formRenderer, /getAvailablePetEvolutionForms\(student\.petType\)\.map/);
  assert.match(selectorSource, /const safeForm = normalizePetEvolutionFormForPet\(form,\s*student\.petType\)/);
  assert.match(evolveSource, /const requestedStyle = normalizePetEvolutionFormForPet\(evolutionStyle,\s*student\.petType\)/);
  assert.match(appSource, /const finalRouteTotal = Math\.max\(1,\s*Number\(progress\.finalRouteTotal/);
  assert.doesNotMatch(appSource, /progress\.finalRoutesUnlocked\.length} \/ 2/);
});

test('successful evolution plays the cinematic video and pauses background music until it closes', () => {
  const videoPath = path.join(projectRoot, 'assets', 'videos', 'evolution-cinematic-fixed-start.mp4');
  assert.ok(fs.existsSync(videoPath), 'evolution cinematic video should be bundled as a local asset');
  assert.equal(
    crypto.createHash('sha256').update(fs.readFileSync(videoPath)).digest('hex'),
    'afeff60a07b22e2dce7fd8137f2c95ea48230af0edb5c122c1979f54de7d86d2',
    'the bundled evolution video should be the fixed-start export',
  );
  assert.match(htmlSource, /id="evolution-video"[^>]*src="assets\/videos\/evolution-cinematic-fixed-start\.mp4\?v=20\d{6}-\d+"/);
  assert.match(htmlSource, /id="evolution-title"/);
  assert.match(htmlSource, /playsinline/);
  assert.match(htmlSource, /preload="auto"/);
  assert.match(appSource, /let evolutionVideoActive = false/);
  assert.match(appSource, /let evolutionCinematicPrimeScheduled = false/);
  assert.match(appSource, /let evolutionCinematicPrimeStarted = false/);
  assert.match(appSource, /function pauseBackgroundMusicForEvolution\(\)/);
  assert.match(appSource, /function restoreBackgroundMusicAfterEvolution\(\)/);
  assert.match(appSource, /function primeEvolutionCinematic\(\)/);
  assert.match(appSource, /function scheduleEvolutionCinematicPrime\(\)/);
  assert.match(appSource, /function playEvolutionCinematic\(\)/);
  assert.match(appSource, /function waitForVideoMetadata\(video\)/);
  assert.match(appSource, /function stopEvolutionCinematic\(\)/);
  assert.match(appSource, /function finishEvolutionCinematic\(\)/);
  assert.match(sourceBetween('function runEvolutionChallenge(options = {})', 'function stopKuromiRoomDemo'), /primeEvolutionCinematic\(\)/);
  assert.doesNotMatch(sourceBetween('startLanguageObserver();', 'warmProductionBackend();'), /scheduleEvolutionCinematicPrime\(\)/);
  assert.match(sourceBetween('async function login(studentId)', 'function isGasBackend()'), /scheduleEvolutionCinematicPrime\(\)/);
  assert.match(sourceBetween('function tryStartBackgroundMusic()', 'function loadDatabase'), /if \(evolutionVideoActive\) return/);
  const sequenceSource = sourceBetween('function showEvolutionSequence(student, before, after, options = {})', 'function closeLevelUpOverlay');
  assert.match(sequenceSource, /pauseBackgroundMusicForEvolution\(\)/);
  assert.match(sequenceSource, /playEvolutionCinematic\(\)/);
  assert.doesNotMatch(sequenceSource, /playEvolutionSound\(\)/);
  const cinematicSource = sourceBetween('function playEvolutionCinematic()', 'function replayEvolutionCinematicFromButton');
  assert.match(cinematicSource, /primeEvolutionCinematic\(\)/);
  assert.doesNotMatch(cinematicSource, /await waitForVideoMetadata\(video\)/);
  assert.match(cinematicSource, /video\.currentTime = 0/);
  assert.match(cinematicSource, /video\.muted = true/);
  assert.match(cinematicSource, /video\.onended = finishEvolutionCinematic/);
  const metadataSource = sourceBetween('function waitForVideoMetadata(video)', 'function stopEvolutionCinematic');
  assert.match(metadataSource, /loadedmetadata/);
  const closeSource = sourceBetween('function closeEvolutionOverlay', 'function playEvolutionSound');
  assert.match(closeSource, /stopEvolutionCinematic\(\)/);
  assert.match(closeSource, /restoreBackgroundMusicAfterEvolution\(\)/);
  assert.match(cssSource, /\.evolution-cinematic-layer\s*\{[\s\S]*position:\s*fixed;[\s\S]*inset:\s*0/);
  assert.match(cssSource, /\.evolution-video\s*\{[\s\S]*width:\s*100%;[\s\S]*height:\s*100%;[\s\S]*max-width:\s*none;[\s\S]*max-height:\s*none;[\s\S]*object-fit:\s*cover/);
  assert.match(cssSource, /@media \(max-width: 760px\) and \(orientation: portrait\)[\s\S]*\.evolution-video\s*\{[\s\S]*width:\s*100dvh;[\s\S]*height:\s*100dvw;[\s\S]*transform:\s*translate\(-50%, -50%\) rotate\(90deg\)/);
  assert.match(cssSource, /\.evolution-cinematic-finished \.evolution-cinematic-layer/);
  assert.match(cssSource, /\.evolution-cinematic-finished \.evolution-card/);
  assert.match(cssSource, /\.evolution-card\s*\{[\s\S]*width:\s*min\(820px, 94vw\)/);
});

test('touch devices get a lighter evolution mini-game canvas loop', () => {
  assert.match(appSource, /function isTouchOptimizedMiniGameDevice\(\)/);
  assert.match(appSource, /navigator\.maxTouchPoints/);
  const capSource = sourceBetween('function getMiniGamePixelRatioCap()', 'function getMiniGameFrameIntervalMs()');
  assert.match(capSource, /miniGameState\.type === 'reaction'/);
  assert.match(capSource, /1\.25/);
  const frameIntervalSource = sourceBetween('function getMiniGameFrameIntervalMs()', 'function prepareMiniGameCanvasFrame');
  assert.match(frameIntervalSource, /miniGameState\.type === 'reaction'/);
  assert.match(frameIntervalSource, /1000 \/ 30/);
  const prepareSource = sourceBetween('function prepareMiniGameCanvasFrame', 'function startMiniGameLoop');
  assert.match(prepareSource, /getMiniGamePixelRatioCap\(\)/);
  const loopSource = sourceBetween('function startMiniGameLoop', 'function clampMiniGame');
  assert.match(loopSource, /getMiniGameFrameIntervalMs\(\)/);
  assert.match(loopSource, /time - miniGameState\.lastDrawTime < frameInterval/);
});

test('top bar uses the center logo in a translucent brand tile', () => {
  assert.match(htmlSource, /class="app-logo-lockup"/);
  assert.match(htmlSource, /<img class="app-header-logo" src="assets\/brand\/center-logo\.png"/);
  assert.doesNotMatch(htmlSource, /id="holiday-status"/);
});

test('home page has a non-sticky integrated Imagen story banner above the welcome row', () => {
  assert.match(htmlSource, /class="story-title-banner"/);
  assert.match(htmlSource, /CY PETS STORY/);
  assert.match(htmlSource, /assets\/brand\/cy-pets-story-integrated-title-banner-imagen\.png/);
  assert.doesNotMatch(htmlSource, /class="story-logo-text"/);
  assert.ok(fs.existsSync(path.join(projectRoot, 'assets', 'brand', 'cy-pets-story-integrated-title-banner-imagen.png')));
  const bannerCss = cssSource.match(/\.story-title-banner\s*\{[^}]*\}/)?.[0] || '';
  assert.match(bannerCss, /position:\s*relative/);
  assert.doesNotMatch(bannerCss, /position:\s*(?:sticky|fixed)/);
  assert.match(cssSource, /\.app-screen \.story-title-banner-copy\s*\{[\s\S]*display:\s*none/);
});

test('pet names are moderated before adoption or purchase', () => {
  assert.match(htmlSource, /id="pet-name-error"/);
  assert.match(appSource, /const BAD_PET_NAME_WORDS\s*=\s*\[/);
  assert.match(appSource, /function validatePetName\(name\)/);
  assert.match(appSource, /function showPetNameError\(message\)/);
  assert.match(sourceBetween('function updateAdoptionConfirmState()', 'function renderPetSelection'), /validatePetName\(name\)/);
  assert.match(sourceBetween('async function chooseInitialPet()', 'async function buyAndEquipItem'), /validatePetName\(displayName\)/);
  assert.match(appSource, /名字里有不适合公开展示的词/);
});

test('optional pet and reward overlays can be closed without skipping first pet adoption', () => {
  assert.match(htmlSource, /id="pet-selection-close"[^>]*data-modal-close="pet-selection"/);
  assert.match(htmlSource, /id="level-up-close"[^>]*data-modal-close="level-up"/);
  assert.match(htmlSource, /id="evolution-close"[^>]*data-modal-close="evolution"/);

  assert.match(appSource, /function setPetSelectionModalClosable\(closable\)/);
  assert.match(appSource, /function closePetSelectionModal\(\)/);
  assert.match(appSource, /function closeLevelUpOverlay\(\)/);
  assert.match(appSource, /function closeEvolutionOverlay\(\)/);
  assert.match(sourceBetween('function renderPetSelection()', 'function openPetPurchaseModal'), /setPetSelectionModalClosable\(false\)/);
  assert.match(sourceBetween('function openPetPurchaseModal(petId)', 'function maybeShowPetSelection'), /setPetSelectionModalClosable\(true\)/);
  assert.match(sourceBetween("document.addEventListener('click'", "const skillToggle = event.target.closest('[data-skill-toggle]')"), /\[data-modal-close\]/);
});
