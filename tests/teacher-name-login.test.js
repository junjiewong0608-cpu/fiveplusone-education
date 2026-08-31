const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const edge = fs.readFileSync(path.join(root, 'supabase/functions/cy-pets-api/index.ts'), 'utf8');

test('teacher login uses a typed name while preserving all 12 backend accounts', () => {
  assert.match(html, /id="teacher-name-input"[^>]+required/);
  assert.doesNotMatch(html, /id="teacher-quick-select-grid"/);
  assert.doesNotMatch(app, /selectTeacher|renderTeacherQuickGrid|teacher-selected-id-input/);
  assert.match(app, /normalizeTeacherLoginName/);
  assert.match(app, /teacherId:\s*teacher\.teacherId,\s*password/);

  for (const teacherId of ['TCH01_JIE', 'TCH02_RACHEL', 'TCH03_HUANG', 'TCH04_TIAN', 'TCH05_EN', 'TCH06_DU', 'TCH07_HUI', 'TCH08_YI', 'TCH09_QI', 'TCH10_YI2', 'TCH11_HU', 'TCH12_WEN']) {
    assert.match(app, new RegExp(teacherId));
    assert.match(edge, new RegExp(teacherId));
  }
});
