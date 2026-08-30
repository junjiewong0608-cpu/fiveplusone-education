const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.join(__dirname, '..');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
const scriptSource = fs.readFileSync(path.join(projectRoot, 'backend', 'Code.gs'), 'utf8');

function sourceBetween(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
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

function loadFrontendModeration() {
  const source = [
    sourceBetween(appSource, 'const BAD_PET_NAME_WORDS', 'const PET_CATALOG'),
    sourceBetween(appSource, 'function normalizeModerationText', 'function showPetNameError'),
    '({ validatePetName, validateWallCommentText, normalizeModerationText, BAD_PET_NAME_WORDS });'
  ].join('\n');
  return vm.runInNewContext(source);
}

function loadBackendModeration() {
  const source = [
    sourceBetween(scriptSource, 'const BAD_PET_NAME_WORDS', 'function onOpen'),
    '({ validatePetName_, validateWallCommentText_, normalizeModerationText_, BAD_PET_NAME_WORDS });'
  ].join('\n');
  return vm.runInNewContext(source);
}

function loadHomeProfileNameHarness() {
  const source = [
    sourceBetween(appSource, 'const BAD_PET_NAME_WORDS', 'const PET_CATALOG'),
    sourceBetween(appSource, 'function normalizeModerationText', 'function showPetNameError'),
    extractAppFunction('saveHomeProfileName'),
    `
      const commits = [];
      const toasts = [];
      const homeNameEditState = { field: '', value: '' };
      let renderedCombatState = {};
      const student = {
        studentId: 'CY1234',
        studentName: '旧名字',
        name: '旧名字',
        petType: 'hydroblob',
        petName: '旧宠物',
        petCollection: {
          hydroblob: { petId: 'hydroblob', petName: '旧宠物', birthday: '2026-08-01', needsNaming: false }
        }
      };
      function getStudent() { return student; }
      function cloneStudentState(value) { return JSON.parse(JSON.stringify(value)); }
      function ensurePetRecord(target, petType = target?.petType) {
        target.petCollection = target.petCollection || {};
        if (!target.petCollection[petType]) target.petCollection[petType] = { petId: petType };
        return target.petCollection[petType];
      }
      async function commitStudentState(target, snapshot, event, onSuccess) {
        commits.push({ student: JSON.parse(JSON.stringify(target)), snapshot, event });
        if (typeof onSuccess === 'function') onSuccess();
        return true;
      }
      function renderAppShell() {}
      function renderActiveStudentView() {}
      function renderHomeNameEditor() {}
      function showToast(message) { toasts.push(message); }
      ({ saveHomeProfileName, student, commits, toasts });
    `
  ].join('\n');
  return vm.runInNewContext(source);
}

const unsafeNames = [
  '我是SB王',
  '我是5B王',
  '我是$B王',
  'n m s l 战神',
  '超级lim peh',
  'Gong LJ Boss',
  'k1mak高手',
  'LancauKing',
  '冚家铲大王',
  '曹尼玛',
  '靠北仔',
  '法克小子',
  'bxxch Queen',
  'laseh hero'
];

const safeNames = [
  '小草莓',
  '云朵勇士',
  'Sunny Hero',
  '森林小王子',
  'Buzz Light',
  '聪明小星星'
];

test('frontend pet name moderation blocks Malaysian slang, Chinese variants and leetspeak', () => {
  const { validatePetName } = loadFrontendModeration();
  for (const name of unsafeNames) {
    assert.equal(validatePetName(name).ok, false, `${name} should be blocked`);
  }
});

test('frontend pet name moderation still allows ordinary child-friendly pet names', () => {
  const { validatePetName } = loadFrontendModeration();
  for (const name of safeNames) {
    assert.equal(validatePetName(name).ok, true, `${name} should be allowed`);
  }
});

test('Apps Script pet name moderation matches the frontend blocked examples', () => {
  const { validatePetName_ } = loadBackendModeration();
  for (const name of unsafeNames) {
    assert.equal(validatePetName_(name, { required: true }).ok, false, `${name} should be blocked by GAS`);
  }
  for (const name of safeNames) {
    assert.equal(validatePetName_(name, { required: true }).ok, true, `${name} should be allowed by GAS`);
  }
});

test('custom message wall comments are short, friendly and moderated on the frontend', () => {
  const { validateWallCommentText } = loadFrontendModeration();
  assert.equal(validateWallCommentText('一起加油！').ok, true);
  assert.equal(validateWallCommentText('太厉害了，我也要努力').ok, true);
  assert.equal(validateWallCommentText('n m s l').ok, false);
  assert.equal(validateWallCommentText('我是5B').ok, false);
  assert.equal(validateWallCommentText('这个留言真的真的真的真的真的真的太长了').ok, false);
});

test('custom message wall comments are moderated again in Apps Script', () => {
  const { validateWallCommentText_ } = loadBackendModeration();
  assert.equal(validateWallCommentText_('一起加油！').ok, true);
  assert.equal(validateWallCommentText_('Gong LJ').ok, false);
  assert.equal(validateWallCommentText_('f4ck').ok, false);
});

test('home profile rename saves the student display name after moderation', async () => {
  const { saveHomeProfileName, student, commits, toasts } = loadHomeProfileNameHarness();

  const saved = await saveHomeProfileName('student', '  安安   小队  ');

  assert.equal(saved, true);
  assert.equal(student.studentName, '安安 小队');
  assert.equal(student.name, '安安 小队');
  assert.match(student.profileNameUpdatedAt, /^20\d{2}-\d{2}-\d{2}T/);
  assert.equal(commits.length, 1);
  assert.equal(commits[0].event.type, 'renameStudent');
  assert.equal(toasts.at(-1), '名字已经保存。');
});

test('home profile rename saves the current pet nickname into the active pet record', async () => {
  const { saveHomeProfileName, student, commits, toasts } = loadHomeProfileNameHarness();

  const saved = await saveHomeProfileName('pet', '闪闪');

  assert.equal(saved, true);
  assert.equal(student.petName, '闪闪');
  assert.equal(student.petCollection.hydroblob.petName, '闪闪');
  assert.equal(student.petCollection.hydroblob.needsNaming, false);
  assert.match(student.petNameUpdatedAt, /^20\d{2}-\d{2}-\d{2}T/);
  assert.equal(student.petCollection.hydroblob.petNameUpdatedAt, student.petNameUpdatedAt);
  assert.equal(commits.length, 1);
  assert.equal(commits[0].event.type, 'renamePet');
  assert.equal(commits[0].event.petId, 'hydroblob');
  assert.equal(toasts.at(-1), '宠物名字已经保存。');
});

test('home profile rename rejects unsafe names before saving', async () => {
  const { saveHomeProfileName, student, commits, toasts } = loadHomeProfileNameHarness();

  assert.equal(await saveHomeProfileName('student', 'n m s l'), false);
  assert.equal(await saveHomeProfileName('pet', '我是5B王'), false);

  assert.equal(student.studentName, '旧名字');
  assert.equal(student.petName, '旧宠物');
  assert.equal(commits.length, 0);
  assert.match(toasts.join('\n'), /不适合公开展示/);
});

test('Apps Script validates saved pet names and shared wall card pet names before writing Sheets', () => {
  const saveStudentStateSource = sourceBetween(scriptSource, 'function saveStudentState_(payload)', 'function getStudentClasses_(studentId)');
  const createWallPostSource = sourceBetween(scriptSource, 'function createWallPost_(payload)', 'function likeWallPost_(payload)');
  const commentWallPostSource = sourceBetween(scriptSource, 'function commentWallPost_(payload)', 'function postFromWallRow_(row)');
  assert.match(saveStudentStateSource, /validateStudentPetNames_\(student\)/);
  assert.match(createWallPostSource, /validatePetName_\(post\.petName \|\| student\.petName/);
  assert.match(commentWallPostSource, /validateWallCommentText_\(comment\.text/);
});
