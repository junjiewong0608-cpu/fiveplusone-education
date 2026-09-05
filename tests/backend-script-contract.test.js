const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const scriptSource = fs.readFileSync(path.join(__dirname, '..', 'backend', 'Code.gs'), 'utf8');

test('Apps Script routes getClassStudents requests', () => {
  assert.match(scriptSource, /payload\.action === 'getClassStudents'/);
  assert.match(scriptSource, /getClassStudents_\(payload\)/);
});

test('Apps Script can return authorized students for a teacher class', () => {
  assert.match(scriptSource, /function getClassStudents_\(payload\)/);
  assert.match(scriptSource, /Teacher is not authorized for this class/);
  assert.match(scriptSource, /getStudentSummary_/);
  assert.match(scriptSource, /students: studentIds\.map/);
});

test('submitCheckin updates student aggregates only when the record is new', () => {
  assert.match(scriptSource, /if \(!existing\) \{[\s\S]*checkins\.appendRow[\s\S]*applyCheckinReward_/);
  assert.match(scriptSource, /function applyCheckinReward_/);
  assert.match(scriptSource, /studentSheet\.getRange\(studentRow, 9, 1, 6\)\.setValues/);
  assert.match(scriptSource, /function isCompleteStudyDay_/);
});

test('teacher rewards cap student targets at 250 coins per day in GAS', () => {
  assert.match(scriptSource, /const TEACHER_DAILY_REWARD_LIMIT = 250/);
  assert.match(scriptSource, /const TEACHER_REWARD_ADMIN_IDS = \['CY0000', 'CY0001'\]/);
  assert.match(scriptSource, /\[2, 4, 6, 8, 10, 20, 50, 100, 250, 1000\]\.indexOf\(amount\)/);
  assert.match(scriptSource, /function getTeacherDailyRewardTotal_\(rewardRows, studentId, dateKey\)/);
  assert.match(scriptSource, /function canRewardTeacherTargets_\(teacherId\)/);
  assert.match(scriptSource, /TEACHER_REWARD_ADMIN_IDS\.indexOf\(normalizeId_\(teacherId\)\) !== -1/);
  assert.match(scriptSource, /if \(teacherTarget && !canRewardTeacherTargets\) \{[\s\S]*?rejected\.push\(studentId\);[\s\S]*?return;[\s\S]*?\}/);
  assert.match(scriptSource, /const remainingDailyReward = Math\.max\(0, TEACHER_DAILY_REWARD_LIMIT - alreadyRewarded\)/);
  assert.match(scriptSource, /const appliedAmount = Math\.min\(amount, remainingDailyReward\)/);
  assert.match(scriptSource, /const finalAppliedAmount = unlimitedRewardTarget \? amount : appliedAmount/);
  assert.match(scriptSource, /daily-limit/);
});

test('Apps Script adds Sheet menu shortcuts for selected-row classroom rewards', () => {
  assert.match(scriptSource, /function onOpen\(\)/);
  assert.match(scriptSource, /SpreadsheetApp\.getUi\(\)\.createMenu\('假期打卡工具'\)/);
  assert.match(scriptSource, /\.addItem\('刷新班级加分名单', 'refreshClassRewardSheets'\)/);
  assert.match(scriptSource, /\.addItem\('给选中学生 \+20', 'rewardSelectedSheetRows20'\)/);
  assert.match(scriptSource, /\.addItem\('给选中学生 \+50', 'rewardSelectedSheetRows50'\)/);
  assert.match(scriptSource, /\.addItem\('给选中学生 \+100', 'rewardSelectedSheetRows100'\)/);
  assert.match(scriptSource, /\.addItem\('给选中学生 \+250', 'rewardSelectedSheetRows250'\)/);
  assert.match(scriptSource, /\.addItem\('给选中学生 \+1000', 'rewardSelectedSheetRows1000'\)/);
  assert.match(scriptSource, /\.addItem\('同步选中学生金币到网站', 'syncSelectedStudentCoinsToWebsite'\)/);
  assert.match(scriptSource, /\.addItem\('同步全部学生金币到网站', 'syncAllStudentCoinsToWebsite'\)/);
  assert.match(scriptSource, /function refreshClassRewardSheets\(\)/);
  assert.match(scriptSource, /function rewardSelectedSheetRows20\(\)\s*\{\s*return rewardSelectedSheetRows_\(20\);/);
  assert.match(scriptSource, /function rewardSelectedSheetRows50\(\)\s*\{\s*return rewardSelectedSheetRows_\(50\);/);
  assert.match(scriptSource, /function rewardSelectedSheetRows100\(\)\s*\{\s*return rewardSelectedSheetRows_\(100\);/);
  assert.match(scriptSource, /function rewardSelectedSheetRows250\(\)\s*\{\s*return rewardSelectedSheetRows_\(250\);/);
  assert.match(scriptSource, /function rewardSelectedSheetRows1000\(\)\s*\{\s*return rewardSelectedSheetRows_\(1000\);/);
});

test('Sheet reward shortcuts reward selected rows from Students or class roster sheets', () => {
  assert.match(scriptSource, /function rewardSelectedSheetRows_\(amount\)/);
  assert.match(scriptSource, /getActiveRangeList\(\)/);
  assert.match(scriptSource, /function getRewardSheetInfo_\(sheet\)/);
  assert.match(scriptSource, /isClassRewardSheet_\(sheet\)/);
  assert.match(scriptSource, /studentIdColumn/);
  assert.match(scriptSource, /sheet\.getRange\(row, rewardInfo\.studentIdColumn\)\.getValue\(\)/);
  assert.match(scriptSource, /applySheetRewardToStudents_\(studentIds, amount/);
  assert.match(scriptSource, /updateRewardSheetSelectedBalances_\(sheet, rewardInfo, rows, result\)/);
  assert.match(scriptSource, /function updateRewardSheetSelectedBalances_\(sheet, rewardInfo, selectedRows, result\)/);
  assert.match(scriptSource, /coinsColumn:\s*headers\.indexOf\('coins'\) \+ 1/);
  assert.match(scriptSource, /classId:\s*selectedClassId \|\| rewardInfo\.classId \|\| 'SHEET'/);
  assert.match(scriptSource, /requireMembership:\s*false/);
  assert.match(scriptSource, /SpreadsheetApp\.getActiveSpreadsheet\(\)\.toast/);
});

test('Sheet menu can sync manually edited coins to Supabase without overwriting pet state', () => {
  assert.match(scriptSource, /const SUPABASE_FUNCTION_URL = 'https:\/\/YOUR_SUPABASE_PROJECT_REF\.supabase\.co\/functions\/v1\/fiveplusone-education-api'/);
  assert.match(scriptSource, /const SUPABASE_PUBLIC_FUNCTION_KEY = 'YOUR_PUBLIC_FUNCTION_KEY'/);
  assert.match(scriptSource, /function syncSelectedStudentCoinsToWebsite\(\)/);
  assert.match(scriptSource, /function syncAllStudentCoinsToWebsite\(\)/);
  assert.match(scriptSource, /function getSelectedStudentIdsForSync_\(sheet\)/);
  assert.match(scriptSource, /getRewardSheetInfo_\(sheet\)/);
  assert.match(scriptSource, /function mergeSheetCoinIntoRemoteStudent_\(sheetStudent, remoteStudent\)/);
  assert.match(scriptSource, /requestSupabaseFunction_\('getStudent'/);
  assert.match(scriptSource, /requestSupabaseFunction_\('saveStudentState'/);

  const mergeSource = scriptSource.slice(
    scriptSource.indexOf('function mergeSheetCoinIntoRemoteStudent_(sheetStudent, remoteStudent)'),
    scriptSource.indexOf('function requestSupabaseFunction_(action, payload)')
  );
  assert.match(mergeSource, /const base = remoteStudent && typeof remoteStudent === 'object' \? remoteStudent : sheetStudent/);
  assert.match(mergeSource, /coins: Math\.max\(0, Number\(sheetStudent\.coins \|\| 0\)\)/);
  assert.doesNotMatch(mergeSource, /ownedPets:\s*sheetStudent\.ownedPets/);
  assert.doesNotMatch(mergeSource, /petCollection:\s*sheetStudent\.petCollection/);
  assert.doesNotMatch(mergeSource, /equippedItems:\s*sheetStudent\.equippedItems/);
});

test('Apps Script can build one selected-row reward sheet per teacher with class sections', () => {
  assert.match(scriptSource, /const TEACHER_REWARD_SHEET_PREFIX = 'Teacher - '/);
  assert.match(scriptSource, /const CLASS_REWARD_SHEET_PREFIX = 'Class - '/);
  assert.match(scriptSource, /const CLASS_REWARD_HEADERS = \['studentId', 'studentName', 'classId'/);
  assert.match(scriptSource, /function refreshClassRewardSheets\(\)/);
  assert.match(scriptSource, /hideLegacyClassRewardSheets_\(\)/);
  assert.match(scriptSource, /groupClassesByTeacher_\(classes\)/);
  assert.match(scriptSource, /groups\[teacherId\]\.sort\(compareClassOrder_\)/);
  assert.match(scriptSource, /function getClassOrderYear_\(classInfo\)/);
  assert.match(scriptSource, /getTeacherRewardSheetName_\(teacherId\)/);
  assert.match(scriptSource, /formatClassSectionTitle_\(classInfo, rosterRows\.length\)/);
  assert.match(scriptSource, /getStudentSummary_\(studentSheet, normalizeId_\(membership\.studentId\), classInfo\)/);
  assert.match(scriptSource, /sheet\.getRange\(cursor, 1, 1, CLASS_REWARD_HEADERS\.length\)\.setValues\(\[CLASS_REWARD_HEADERS\]\)/);
  assert.match(scriptSource, /sheet\.getRange\(cursor, 1, rosterRows\.length, CLASS_REWARD_HEADERS\.length\)\.setValues\(rosterRows\)/);
  assert.match(scriptSource, /setFormulaR1C1\('=IFERROR\(VLOOKUP\(RC\[-6\],Students!C1:C11,11,FALSE\),0\)'\)/);
  assert.match(scriptSource, /sheet\.setFrozenRows\(1\)/);
});

test('Apps Script can persist purchases and multi-pet state back to Students', () => {
  assert.match(scriptSource, /payload\.action === 'saveStudentState'/);
  assert.match(scriptSource, /function saveStudentState_\(payload\)/);
  assert.match(scriptSource, /'petBirthday', 'ownedPets', 'petCollection', 'evolvedPets', 'petEvolved', 'evolutionStylePreference', 'updatedAt'/);
  assert.match(scriptSource, /studentSheet\.getRange\(studentRow, 1, 1, HEADERS\.Students\.length\)\.setValues/);
  assert.match(scriptSource, /stringifyJsonField_\(student\.ownedPets/);
  assert.match(scriptSource, /stringifyJsonField_\(student\.petCollection/);
  assert.match(scriptSource, /stringifyJsonField_\(student\.evolvedPets/);
  assert.match(scriptSource, /const isProfileRename = String\(event\.type \|\| ''\) === 'renameStudent'/);
  assert.match(scriptSource, /studentName: String\(isProfileRename \? \(student\.studentName \|\| student\.name \|\| existing\.studentName \|\| studentId\) : \(existing\.studentName \|\| student\.studentName \|\| student\.name \|\| studentId\)\)\.trim\(\)/);
  assert.match(scriptSource, /evolutionStylePreference: normalizeEvolutionStyle_/);
  assert.match(scriptSource, /appendPurchaseLedger_\(ss, studentId, event, now\)/);
  assert.match(scriptSource, /return \{ ok: true, saved: true, eventType: String\(event\.type \|\| ''\), student: row, classes: \[\] \};/);
  const saveSource = scriptSource.slice(
    scriptSource.indexOf('function saveStudentState_(payload)'),
    scriptSource.indexOf('/**', scriptSource.indexOf('function saveStudentState_(payload)'))
  );
  assert.doesNotMatch(saveSource, /getStudent_\(studentId\)/);
});

test('Apps Script stores message wall posts, likes and preset comments', () => {
  assert.match(scriptSource, /messageWall:\s*'MessageWall'/);
  assert.match(scriptSource, /MessageWall:\s*\['postId', 'studentId', 'studentName', 'message'/);
  assert.match(scriptSource, /'petStats', 'equipment'/);
  assert.match(scriptSource, /const WALL_POST_PRESETS\s*=\s*\[/);
  assert.match(scriptSource, /const WALL_COMMENT_PRESETS\s*=\s*\[/);
  assert.match(scriptSource, /payload\.action === 'listWallPosts'/);
  assert.match(scriptSource, /payload\.action === 'createWallPost'/);
  assert.match(scriptSource, /payload\.action === 'likeWallPost'/);
  assert.match(scriptSource, /payload\.action === 'commentWallPost'/);
  assert.match(scriptSource, /function listWallPosts_\(payload\)/);
  assert.match(scriptSource, /function createWallPost_\(payload\)/);
  assert.match(scriptSource, /function likeWallPost_\(payload\)/);
  assert.match(scriptSource, /function commentWallPost_\(payload\)/);
  assert.match(scriptSource, /parseJsonField_\(row\.likedBy, \[\]\)/);
  assert.match(scriptSource, /parseJsonField_\(row\.comments, \[\]\)/);
  assert.match(scriptSource, /parseJsonField_\(row\.petStats, \{\}\)/);
  assert.match(scriptSource, /parseJsonField_\(row\.equipment, \[\]\)/);
});

test('Apps Script upgrades existing Sheets with newly required columns', () => {
  assert.match(scriptSource, /function ensureSheetHeaders_\(sheet, headers\)/);
  assert.match(scriptSource, /ensureSheetHeaders_\(sheet, HEADERS\[name\]\)/);
  assert.match(scriptSource, /const SCHEMA_CACHE_KEY = 'holiday-checkin-schema-ready-v20260812'/);
  assert.match(scriptSource, /cache\.get\(SCHEMA_CACHE_KEY\) === 'ready'/);
  assert.match(scriptSource, /sheet\.getRange\(1, 1, 1, headers\.length\)\.getValues\(\)\[0\]/);
  assert.match(scriptSource, /sheet\.getRange\(1, 1, 1, headers\.length\)\.setValues\(\[nextHeaders\]\)/);
});

test('Apps Script only locks shared write actions so student reads and personal saves do not queue behind class rewards', () => {
  assert.match(scriptSource, /const WRITE_ACTIONS = \{/);
  assert.doesNotMatch(scriptSource, /saveStudentState:\s*true/);
  assert.doesNotMatch(scriptSource, /getStudent:\s*true/);
  assert.match(scriptSource, /if \(WRITE_ACTIONS\[payload\.action\]\) \{[\s\S]*LockService\.getScriptLock\(\)[\s\S]*lock\.waitLock\(15000\)/);
  assert.match(scriptSource, /if \(lock\) lock\.releaseLock\(\)/);
});

test('Apps Script keeps wall posting out of the global write lock and caches wall rows', () => {
  assert.doesNotMatch(scriptSource, /createWallPost:\s*true/);
  assert.match(scriptSource, /likeWallPost:\s*true/);
  assert.match(scriptSource, /commentWallPost:\s*true/);
  assert.match(scriptSource, /const WALL_ROW_CACHE_PREFIX = 'holiday-wall-row-v20260813-'/);
  assert.match(scriptSource, /function getCachedWallRowByStudent_\(sheet, studentId\)/);
  assert.match(scriptSource, /cache\.put\(cacheKey, String\(row\), 21600\)/);
  assert.match(scriptSource, /getCachedWallRowByStudent_\(wallSheet, studentId\)/);
});

test('Apps Script can skip class lookup for lightweight student refreshes', () => {
  assert.match(scriptSource, /payload\.action === 'getStudent'[\s\S]*getStudent_\(payload\.studentId, payload\)/);
  assert.match(scriptSource, /function getStudent_\(studentId, payload\)/);
  assert.match(scriptSource, /const includeClasses = !\(payload && payload\.includeClasses === false\)/);
  assert.match(scriptSource, /classes: includeClasses \? getStudentClasses_\(studentId\)\.classes : \[\]/);
});

test('Apps Script caches student row and class membership lookups for faster login and saves', () => {
  assert.match(scriptSource, /const STUDENT_ROW_CACHE_PREFIX = 'holiday-student-row-v20260812-'/);
  assert.match(scriptSource, /const CLASS_LOOKUP_CACHE_KEY = 'holiday-class-lookup-v20260812'/);
  assert.match(scriptSource, /function getCachedStudentRow_\(sheet, studentId\)/);
  assert.match(scriptSource, /cache\.put\(cacheKey, String\(row\), 21600\)/);
  assert.match(scriptSource, /function getClassLookup_\(\)/);
  assert.match(scriptSource, /classesByStudent/);
  assert.match(scriptSource, /studentsByClass/);
  assert.match(scriptSource, /cache\.put\(CLASS_LOOKUP_CACHE_KEY, JSON\.stringify\(lookup\), 1800\)/);
  assert.match(scriptSource, /function invalidateClassLookupCache_\(\)/);
  assert.match(scriptSource, /getCachedStudentRow_\(studentSheet, studentId\)/);
  assert.match(scriptSource, /getClassLookup_\(\)\.classesByStudent\[studentId\]/);
});
