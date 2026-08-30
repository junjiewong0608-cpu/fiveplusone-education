const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');

const roleSkillFolders = {
  'sunny-wing': 'sunny wing',
  sprouty: 'sprouty',
  hydroblob: 'hydroblob',
  fluffbit: 'fluffbit',
  'shadow-wing': 'shadow wing专属',
  'flame-rex': 'flame rex 专属',
  'thunder-beetle': 'thunder beetle 专属',
  'frost-fang': 'frost fang 专属',
  'volt-cheetah': 'volt cheetah 专属',
  'shadow-stalker': 'shadow stalker 专属'
};

const beforeSkillFiles = ['skill-passive.png', 'skill-1.png', 'skill-2.png', 'skill-3.png', 'skill-ultimate.png'];
const afterSkillFiles = ['after-skill-passive.png', 'after-skill-1.png', 'after-skill-2.png', 'after-skill-3.png', 'after-skill-ultimate.png'];

test('every existing role catalog entry references its before and after skill sheets', () => {
  for (const [roleId, folder] of Object.entries(roleSkillFolders)) {
    const beforePath = `assets/roles/${folder}/前.png`;
    const afterPath = `assets/roles/${folder}/后.png`;
    assert.match(appSource, new RegExp(`id: ['"]${roleId}['"][\\s\\S]{0,500}${escapeRegExp(beforePath)}`), `${roleId} is missing its before skill sheet reference`);
    assert.match(appSource, new RegExp(`id: ['"]${roleId}['"][\\s\\S]{0,500}${escapeRegExp(afterPath)}`), `${roleId} is missing its after skill sheet reference`);
  }
});

test('every existing role has five cropped before/after skill images', () => {
  for (const folder of Object.values(roleSkillFolders)) {
    for (const fileName of [...beforeSkillFiles, ...afterSkillFiles]) {
      const filePath = path.join(projectRoot, 'assets', 'roles', folder, fileName);
      assert.ok(fs.existsSync(filePath), `${folder}/${fileName} is missing`);
      assert.ok(fs.statSync(filePath).size > 0, `${folder}/${fileName} is empty`);
    }
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}
