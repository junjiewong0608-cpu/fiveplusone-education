import test from 'node:test';
import assert from 'node:assert/strict';

import { default as api } from '../cy-pets-api-impl.mjs';

test('EduVerse: 8 KSSM Subjects & Anime Worlds Contract', async () => {
  const res = await api.handleAction({ action: 'listSubjects' });
  assert.equal(res.ok, true, 'listSubjects should succeed');
  assert.equal(res.subjects.length, 8, 'Must have exactly 8 KSSM subjects');

  const expectedSubjectIds = ['bc', 'bm', 'bi', 'math', 'science', 'sejarah', 'geografi', 'moral'];
  expectedSubjectIds.forEach(id => {
    const sub = res.subjects.find(s => s.subjectId === id);
    assert.ok(sub, `Subject ${id} must exist in catalog`);
    assert.ok(sub.nameZh, `Subject ${id} must have Chinese name`);
    assert.ok(sub.badgeIcon, `Subject ${id} must have 3D badge icon`);
    assert.ok(sub.description, `Subject ${id} must have anime world description`);
    assert.ok(Array.isArray(sub.kssmBadges) && sub.kssmBadges.length > 0, `Subject ${id} must have KSSM Focus Capsules`);
  });
});

test('EduVerse: Quest Scoring, Combo Multiplier & Mistakes Review Contract', async () => {
  // 1. Submit a quest result with 5 Combos (1.5x Multiplier)
  const studentId = 'CY1001';
  const answers = [
    { questionId: 'q-math-001', userAnswer: '-16', correctAnswer: '-16', questionText: 'Hitung nilai...' },
    { questionId: 'q-math-002', userAnswer: '12', correctAnswer: '12', questionText: 'Cari FSTB...' },
    { questionId: 'q-math-003', userAnswer: '99', correctAnswer: '39', questionText: 'Diberi jujukan nombor...' } // Wrong answer
  ];

  const questRes = await api.handleAction({
    action: 'submitQuestResult',
    studentId,
    subjectId: 'math',
    form: 'Form 2',
    chapterId: 'math-f2-c1',
    answers,
    maxCombo: 2,
    isRetry: false
  });

  assert.equal(questRes.ok, true, 'submitQuestResult should succeed');
  const settlement = questRes.settlement;
  assert.equal(settlement.totalQuestions, 3);
  assert.equal(settlement.correctCount, 2);
  assert.equal(settlement.accuracy, 67);
  assert.equal(settlement.isPerfect, false);
  assert.equal(settlement.mistakes.length, 1, 'Should record 1 mistake');
  assert.equal(settlement.mistakes[0].questionId, 'q-math-003');

  // 2. Submit a 100% Perfect Quest Result
  const perfectAnswers = [
    { questionId: 'q-math-001', userAnswer: '-16', correctAnswer: '-16' },
    { questionId: 'q-math-002', userAnswer: '12', correctAnswer: '12' },
    { questionId: 'q-math-003', userAnswer: '39', correctAnswer: '39' }
  ];

  const perfectRes = await api.handleAction({
    action: 'submitQuestResult',
    studentId,
    subjectId: 'math',
    form: 'Form 2',
    chapterId: 'math-f2-c1',
    answers: perfectAnswers,
    maxCombo: 5,
    isRetry: false
  });

  assert.equal(perfectRes.ok, true);
  assert.equal(perfectRes.settlement.accuracy, 100);
  assert.equal(perfectRes.settlement.isPerfect, true);
  assert.equal(perfectRes.settlement.multiplier, 1.5, '5 Combo should receive 1.5x multiplier');
  assert.equal(perfectRes.settlement.perfectExp, 150, '100% Perfect clear should award 150 bonus EXP');
});
