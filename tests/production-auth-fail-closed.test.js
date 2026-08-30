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
  assert.match(authSource, /找不到这个手机号对应的学生账号/);
});
