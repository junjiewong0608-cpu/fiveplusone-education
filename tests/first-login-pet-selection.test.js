const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const stylesSource = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
const clientSource = fs.readFileSync(path.join(__dirname, '..', 'backend-client.js'), 'utf8');
const functionSource = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'functions', 'cy-pets-api', 'index.ts'), 'utf8');

test('phone login preserves an empty pet so the first-login chooser can open', () => {
  const start = appSource.indexOf('function loginSuccess(student)');
  const end = appSource.indexOf('// Dashboard & Views Renderer', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const loginFlow = appSource.slice(start, end);
  assert.match(loginFlow, /petType:\s*student\.petType\s*\|\|\s*''/);
  assert.match(loginFlow, /petName:\s*student\.petName\s*\|\|\s*''/);
  assert.doesNotMatch(loginFlow, /petType:\s*student\.petType\s*\|\|\s*'pikachu'/);
});

test('new phone registrations do not receive a pet before the starter choice', () => {
  const clientRegister = clientSource.slice(clientSource.indexOf('async registerStudentPhone'), clientSource.indexOf('async loginStudentPhone'));
  const functionRegister = functionSource.slice(functionSource.indexOf('async function registerStudentPhone'), functionSource.indexOf('async function bulkImportStudentAccounts'));
  for (const source of [clientRegister, functionRegister]) {
    assert.match(source, /petType:\s*''/);
    assert.match(source, /petName:\s*''/);
    assert.doesNotMatch(source, /petType:\s*'(?:sunny-wing|pikachu)'/);
  }
  assert.match(functionRegister, /ownedPets:\s*\[\]/);
  assert.match(functionRegister, /petCollection:\s*\{\}/);
});

test('the three starter companions have five designed skills', () => {
  for (const skillName of ['静电尾巴', '电光冲刺', '十万伏特', '电气场地', '雷霆万钧', '方块生存', '钻石镐击', '钻石盾墙', '金苹果守护', '钻石终结', '能量核心', '脉冲光炮', '光子护盾', '火箭冲锋', '星际装甲觉醒']) {
    assert.match(appSource, new RegExp(skillName));
  }
});

test('Nova uses matching starter-card and narrator artwork without locking the page', () => {
  assert.match(appSource, /image: 'assets\/roles\/starter\/nova-robot-card-v2\.png'/);
  assert.match(appSource, /assets\/8bit\/characters\/nova-robot-8bit\.png/);
  assert.match(appSource, /NOVA_NEW_PLAYER_GUIDE_SCRIPT/);
  assert.match(appSource, /Nova 系统启动！/);
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'assets', 'roles', 'starter', 'nova-robot-card-v2.png')));
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'assets', 'optimized', 'role-thumbs', 'starter-nova-robot-card-v2.webp')));
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'assets', '8bit', 'characters', 'nova-robot-8bit.png')));
  assert.match(stylesSource, /body\.new-player-guide-active\s*\{\s*overflow:\s*auto;/);
  assert.doesNotMatch(stylesSource, /body\.new-player-guide-active\s*\{\s*overflow:\s*hidden;/);
});
