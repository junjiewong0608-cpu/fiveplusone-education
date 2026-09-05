const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const { createClient, isSupabaseMode } = require('../backend-client.js');

test('Supabase placeholders are not treated as a configured backend', async () => {
  let fetchCount = 0;
  const config = {
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'YOUR_PUBLIC_FUNCTION_KEY'
  };
  const client = createClient(config, async () => {
    fetchCount += 1;
    throw new Error('placeholder configuration must not reach fetch');
  });

  assert.equal(isSupabaseMode(config), false);
  for (const result of await Promise.all([
    client.teacherLogin({ teacherId: 'TCH01_JIE', password: 'wrong' }),
    client.registerStudentPhone({ phone: '0123456789' }),
    client.loginStudentPhone({ phone: '0123456789', pin: '0000' })
  ])) {
    assert.equal(result.ok, false);
    assert.equal(result.errorCode, 'SUPABASE_NOT_CONFIGURED');
  }
  assert.equal(fetchCount, 0);
});

test('Supabase authentication failures never become local success responses', async () => {
  const client = createClient({
    backendMode: 'supabase',
    supabaseFunctionUrl: 'https://example.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'public-test-key',
    requestRetryCount: 0
  }, async () => new Response(JSON.stringify({ ok: false, error: 'denied' }), {
    status: 401,
    headers: { 'content-type': 'application/json' }
  }));

  const teacher = await client.teacherLogin({ teacherId: 'TCH01_JIE', password: 'wrong' });
  const registration = await client.registerStudentPhone({ phone: '0123456789' });
  const student = await client.loginStudentPhone({ phone: '0123456789', pin: '0000' });

  assert.equal(teacher.ok, false);
  assert.equal(registration.ok, false);
  assert.equal(student.ok, false);
  assert.notEqual(teacher.source, 'local-fallback');
  assert.notEqual(registration.source, 'local-fallback');
  assert.notEqual(student.source, 'local-fallback');
});

test('Edge student phone auth does not swallow database errors or create mock logins', () => {
  const source = fs.readFileSync(path.join(__dirname, '../supabase/functions/cy-pets-api/index.ts'), 'utf8');
  const start = source.indexOf('async function registerStudentPhone');
  const end = source.indexOf('async function listSubjects', start);
  const authSource = source.slice(start, end);

  assert.doesNotMatch(authSource, /catch \(_err\) \{\}/);
  assert.doesNotMatch(authSource, /const mockStudent/);
  assert.match(authSource, /if \(!rawName\) return \{ ok: false, error: '请输入学生姓名。' \}/);
  assert.match(authSource, /normalizeStudentLoginName\(rawName\) !== normalizeStudentLoginName\(studentData\.student_name\)/);
  assert.match(authSource, /学生姓名、电话号码或密码不正确/);
});

test('Teacher dashboard keeps infrastructure hidden and quick actions wired', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  const styles = fs.readFileSync(path.join(__dirname, '../styles.css'), 'utf8');
  const dashboard = html.slice(html.indexOf('id="tab-dashboard"'), html.indexOf('<!-- 2. Students Management -->'));

  assert.doesNotMatch(dashboard, /supabase-(?:url|key)-input|SUPABASE CLOUD DATABASE/);
  assert.doesNotMatch(app, /fo_supabase_(?:url|anon_key)/);
  assert.match(dashboard, /teacher-quick-actions-bar[\s\S]*<\/section>\s*<\/section>\s*$/);
  assert.match(app, /querySelectorAll\('\[data-teacher-jump\]'\)/);
  assert.match(app, /setScreenMode\('teacher'\)/);
  assert.match(app, /if \(!window\.location\.hash\.startsWith\('#\/teacher\/'\)\) window\.location\.hash = '#\/teacher\/dashboard'/);
  assert.match(styles, /\.teacher-quick-actions-bar\s*\{[\s\S]*grid-template-columns/);
});

test('Teacher student roster keeps recoverable removal and protects permanent deletion', () => {
  const edge = fs.readFileSync(path.join(__dirname, '../supabase/functions/cy-pets-api/index.ts'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

  assert.match(edge, /async function requireTeacherSession/);
  assert.match(edge, /async function listStudentAccounts[\s\S]*?await requireTeacherSession\(payload\)/);
  assert.match(edge, /async function setStudentAccountStatus[\s\S]*?\['active', 'disabled'\]/);
  assert.match(edge, /const studentId = String\(payload\.studentId \|\| ''\).*replace\(\/\[\^A-Z0-9\]\/g, ''\)/);
  assert.match(edge, /if \(studentData\.status !== 'active'\)/);
  assert.match(app, /backendClient\.listStudentAccounts\(currentTeacher\?\.sessionToken\)/);
  assert.match(app, /游戏资料和排行榜记录会保留/);
  assert.match(edge, /async function deleteStudentAccount[\s\S]*?await requireTeacherSession\(payload\)/);
  assert.match(edge, /student\.status !== 'disabled'/);
  assert.match(edge, /async function deleteStudentAccount[\s\S]*?students\?student_id=eq\.\$\{encodeURIComponent\(studentId\)\}[\s\S]*?method: 'DELETE'/);
  assert.match(app, /data-student-account-delete/);
  assert.match(app, /删除后原手机号可以重新注册/);
});

test('Teacher passwords persist and student PIN resets require a teacher session', () => {
  const edge = fs.readFileSync(path.join(__dirname, '../supabase/functions/cy-pets-api/index.ts'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

  assert.match(edge, /teachers\?teacher_id=eq\.\$\{encodeURIComponent\(teacherId\)\}[\s\S]*?password_hash/);
  assert.match(edge, /async function changeTeacherPassword[\s\S]*?await requireTeacherSession\(payload\)[\s\S]*?method: 'PATCH'/);
  assert.match(edge, /async function resetStudentPassword[\s\S]*?await requireTeacherSession\(payload\)[\s\S]*?password_hash: hashPasswordSync\(newPin\)/);
  assert.doesNotMatch(edge, /const TEACHER_PASSWORDS = new Map/);
  assert.match(app, /teacherSessionToken: currentTeacher\?\.sessionToken/);
  assert.match(html, /id="student-forgot-password-button"/);
  assert.match(html, /id="teacher-student-pin-form"/);
});
