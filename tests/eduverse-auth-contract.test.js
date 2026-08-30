import test from 'node:test';
import assert from 'node:assert/strict';

// Test backend functions from cy-pets-api-impl.mjs
import { default as api } from '../cy-pets-api-impl.mjs';
import BackendClient from '../backend-client.js';

test('EduVerse: 12 Preset Teachers & Authentication Contract', async () => {
  // 1. Verify 12 preset teachers are defined and accessible
  const teachersRes = await api.handleAction({ action: 'listTeachers' });
  assert.equal(teachersRes.ok, true, 'listTeachers should succeed');
  assert.equal(Array.isArray(teachersRes.teachers), true, 'teachers should be an array');
  assert.equal(teachersRes.teachers.length, 12, 'Must have exactly 12 preset teachers');

  const expectedNames = [
    '杰老师', 'Rachel老师', '黄老师', '天老师', '恩老师', '杜老师',
    '橞老师', '宜老师', '淇老师', '奕老师', '胡老师', '汶老师'
  ];

  expectedNames.forEach(name => {
    const found = teachersRes.teachers.find(t => t.name === name);
    assert.ok(found, `Expected teacher ${name} to be present in preset teachers list`);
    assert.ok(found.teacherId.startsWith('TCH'), `Teacher ${name} should have valid TCH ID`);
    assert.equal(found.role, 'teacher');
  });

  // 2. Verify initial password login with '5+1tuition'
  const jieTeacher = teachersRes.teachers.find(t => t.name === '杰老师');
  const loginRes = await api.handleAction({
    action: 'teacherLogin',
    teacherId: jieTeacher.teacherId,
    password: '5+1tuition'
  });
  assert.equal(loginRes.ok, true, 'Teacher login with default password 5+1tuition should succeed');
  assert.equal(loginRes.teacher.name, '杰老师');

  // 3. Verify incorrect password fails
  const wrongLogin = await api.handleAction({
    action: 'teacherLogin',
    teacherId: jieTeacher.teacherId,
    password: 'wrong_password_123'
  });
  assert.equal(wrongLogin.ok, false, 'Teacher login with incorrect password must fail');

  // 4. Verify teacher password change
  const changeRes = await api.handleAction({
    action: 'changeTeacherPassword',
    teacherId: jieTeacher.teacherId,
    currentPassword: '5+1tuition',
    newPassword: 'my_new_secret_pwd_2026'
  });
  assert.equal(changeRes.ok, true, 'Teacher change password should succeed');

  // 5. Verify login with new password works and old password fails
  const newLogin = await api.handleAction({
    action: 'teacherLogin',
    teacherId: jieTeacher.teacherId,
    password: 'my_new_secret_pwd_2026'
  });
  assert.equal(newLogin.ok, true, 'Login with new password should succeed');
  assert.equal(newLogin.teacher.initialPasswordChanged, true, 'Should mark initial password as changed');

  const oldLogin = await api.handleAction({
    action: 'teacherLogin',
    teacherId: jieTeacher.teacherId,
    password: '5+1tuition'
  });
  assert.equal(oldLogin.ok, false, 'Login with old password after change must fail');
});

test('EduVerse: Student Malaysian Phone Normalization & Registration Contract', async () => {
  // Test Malaysian phone number normalization
  assert.equal(BackendClient.normalizePhoneNumber('012-3456789'), '60123456789');
  assert.equal(BackendClient.normalizePhoneNumber('+60123456789'), '60123456789');
  assert.equal(BackendClient.normalizePhoneNumber('0198765432'), '60198765432');
  assert.equal(BackendClient.normalizePhoneNumber('123456789'), '60123456789');

  assert.equal(BackendClient.isValidMalaysianPhone('012-3456789'), true);
  assert.equal(BackendClient.isValidMalaysianPhone('0198765432'), true);
  assert.equal(BackendClient.isValidMalaysianPhone('12345'), false);

  // Register student with valid phone, name, Form 2, and PIN
  const testPhone = `012${Math.floor(1000000 + Math.random() * 9000000)}`;
  const regRes = await api.handleAction({
    action: 'registerStudentPhone',
    name: '林子轩 (Alex)',
    phone: testPhone,
    form: 'Form 2',
    pin: '8888'
  });

  assert.equal(regRes.ok, true, 'Student registration with phone should succeed');
  assert.ok(regRes.studentId, 'Should generate studentId');
  assert.equal(regRes.student.studentName, '林子轩 (Alex)');
  assert.equal(regRes.student.form, 'Form 2');

  // Verify Phone Login with normalized number and PIN
  const loginRes = await api.handleAction({
    action: 'loginStudentPhone',
    phone: testPhone,
    pin: '8888'
  });
  assert.equal(loginRes.ok, true, 'Student phone login should succeed');
});
