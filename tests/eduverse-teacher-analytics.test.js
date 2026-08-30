import test from 'node:test';
import assert from 'node:assert/strict';

import { default as api } from '../cy-pets-api-impl.mjs';

test('EduVerse: Glory Leaderboard & Achievements Contract', async () => {
  const lbRes = await api.handleAction({ action: 'getGloryLeaderboard', filter: 'all' });
  assert.equal(lbRes.ok, true, 'getGloryLeaderboard should succeed');
  assert.ok(Array.isArray(lbRes.top3), 'Should have Top 3 podium');
  assert.equal(lbRes.top3.length, 3, 'Top 3 podium must contain 3 ranks');
  assert.equal(lbRes.top3[0].rank, 1, 'Top 1 must be rank 1');

  // Test achievements
  const achRes = await api.handleAction({ action: 'listAchievements', studentId: 'CY1001' });
  assert.equal(achRes.ok, true, 'listAchievements should succeed');
  assert.ok(Array.isArray(achRes.achievements), 'Achievements should be an array');
  assert.ok(achRes.achievements.length >= 7, 'Must have at least 7 achievements');
});

test('EduVerse: Teacher Analytics & Question Bulk Import Contract', async () => {
  // Test Analytics
  const analyticsRes = await api.handleAction({ action: 'getTeacherAnalytics' });
  assert.equal(analyticsRes.ok, true, 'getTeacherAnalytics should succeed');
  assert.ok(analyticsRes.summary.totalStudents > 0);
  assert.ok(analyticsRes.summary.firstAttemptAccuracy > 0);
  assert.ok(analyticsRes.summary.retryAccuracy >= analyticsRes.summary.firstAttemptAccuracy, 'Retry accuracy should be higher than first attempt');
  assert.ok(Array.isArray(analyticsRes.weakestChapters), 'Should provide weakest chapters');
  assert.ok(Array.isArray(analyticsRes.mostWrongQuestions), 'Should provide most wrong questions');

  // Test Question Bulk Import
  const importRes = await api.handleAction({
    action: 'bulkImportQuestions',
    teacherId: 'TCH01_JIE',
    rows: [
      {
        questionId: 'q-bulk-01',
        subjectId: 'math',
        form: 'Form 1',
        chapterId: 'math-f1-c1',
        questionText: 'Hitung: 15 + (-7)',
        options: ['8', '-8', '22', '-22'],
        correctAnswer: '8',
        kssmFocus: '🔥 高频考点',
        difficulty: 'Easy'
      },
      {
        questionId: 'q-bulk-02',
        subjectId: 'science',
        form: 'Form 1',
        chapterId: 'sci-f1-c1',
        questionText: 'Unit S.I. bagi jisim ialah:',
        options: ['Kilogram (kg)', 'Gram (g)', 'Newton (N)', 'Meter (m)'],
        correctAnswer: 'Kilogram (kg)',
        kssmFocus: '⭐ 必会',
        difficulty: 'Easy'
      }
    ]
  });

  assert.equal(importRes.ok, true, 'bulkImportQuestions should succeed');
  assert.equal(importRes.importedCount, 2, 'Should have imported 2 questions');
});

test('EduVerse: Google Sheet Real-time Sync Contract', async () => {
  const syncRes = await api.handleAction({ action: 'syncGoogleSheetsData', teacherId: 'TCH01_JIE' });
  assert.equal(syncRes.ok, true, 'syncGoogleSheetsData should succeed');
  assert.equal(syncRes.job.status, 'synced');
  assert.equal(syncRes.job.syncedTabs.length, 5, 'Must sync all 5 tabs: Students, Performance, Quest Results, Leaderboard, Daily Challenge');

  const statusRes = await api.handleAction({ action: 'getGoogleSheetSyncStatus' });
  assert.equal(statusRes.ok, true);
  assert.equal(statusRes.status, 'synced');
  assert.ok(statusRes.logs.length > 0);
});
