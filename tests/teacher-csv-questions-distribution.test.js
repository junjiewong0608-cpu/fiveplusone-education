const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

test('index.html contains teacher CSV question import and daily allocation UI elements', () => {
  assert.match(indexSource, /id="download-question-csv-template-btn"/);
  assert.match(indexSource, /id="open-question-csv-modal-btn"/);
  assert.match(indexSource, /id="open-daily-allocation-modal-btn"/);
  assert.match(indexSource, /id="teacher-question-csv-modal"/);
  assert.match(indexSource, /id="question-csv-dropzone"/);
  assert.match(indexSource, /id="question-csv-file-input"/);
  assert.match(indexSource, /id="question-csv-textarea"/);
  assert.match(indexSource, /id="preview-question-csv-btn"/);
  assert.match(indexSource, /id="submit-question-csv-btn"/);
  assert.match(indexSource, /id="teacher-daily-allocation-modal"/);
  assert.match(indexSource, /id="daily-alloc-form-select"/);
  assert.match(indexSource, /id="daily-alloc-subject-select"/);
  assert.match(indexSource, /id="daily-allocation-questions-list"/);
});

test('app.js defines CSV template generator, parser, and deterministic 10-question allocator', () => {
  assert.match(appSource, /function downloadQuestionCsvTemplate\(\)/);
  assert.match(appSource, /function parseQuestionCsvRows\(/);
  assert.match(appSource, /function previewQuestionCsvImport\(\)/);
  assert.match(appSource, /async function submitQuestionCsvImport\(\)/);
  assert.match(appSource, /async function getDailyDistributedQuestions\(/);
  assert.match(appSource, /async function renderTeacherDailyAllocation\(/);
});

test('parseQuestionCsvRows parses Chinese forms, subjects, and supports overrides', () => {
  const vm = require('node:vm');
  const code = [
    appSource.slice(appSource.indexOf('const QUESTION_SUBJECT_MAP = {'), appSource.indexOf('const DEFAULT_CURATED_QUESTIONS = [')),
    appSource.slice(appSource.indexOf('function normalizeQuestionSubject(raw) {'), appSource.indexOf('function downloadQuestionCsvTemplate() {')),
    appSource.slice(appSource.indexOf('function parseCsvRawGrid(text) {'), appSource.indexOf('function previewQuestionCsvImport() {')),
    '({ normalizeQuestionForm, normalizeQuestionSubject, parseQuestionCsvRows });'
  ].join('\n');
  const context = vm.runInNewContext(code);

  assert.equal(context.normalizeQuestionForm('初一'), 'Form 1');
  assert.equal(context.normalizeQuestionForm('初二'), 'Form 2');
  assert.equal(context.normalizeQuestionForm('初三'), 'Form 3');
  assert.equal(context.normalizeQuestionForm('中一'), 'Form 1');
  assert.equal(context.normalizeQuestionForm('F2'), 'Form 2');

  assert.equal(context.normalizeQuestionSubject('华语'), 'bc');
  assert.equal(context.normalizeQuestionSubject('数学'), 'math');
  assert.equal(context.normalizeQuestionSubject('科学'), 'science');

  // Test CSV with Chinese headers and Chinese form/subject
  const csvText = [
    '年级,科目,单元章节,题目内容,选项A,选项B,选项C,选项D,正确答案,考点重点,难度,解析',
    '初一,华语,第一单元,下列哪个词语字形完全正确？,提纲挈领,按部就班,再接再厉,走投无路,A,字词辨析,Easy,全对。',
    '初二,科学,力学,关于浮力的说法正确的是？,物体浸没越深浮力越大,浮力方向竖直向上,浮力大小等于物体自身重力,浮力与液体密度无关,B,浮力计算,Normal,浮力方向垂直向上。'
  ].join('\n');

  const parsed = context.parseQuestionCsvRows(csvText);
  assert.equal(parsed.errors.length, 0);
  assert.equal(parsed.rows.length, 2);
  assert.equal(parsed.rows[0].form, 'Form 1');
  assert.equal(parsed.rows[0].subjectId, 'bc');
  assert.equal(parsed.rows[0].correctAnswer, '提纲挈领');
  assert.equal(parsed.rows[1].form, 'Form 2');
  assert.equal(parsed.rows[1].subjectId, 'science');
  assert.equal(parsed.rows[1].correctAnswer, '浮力方向竖直向上');

  // Test CSV with overrides
  const csvWithoutForm = [
    '题目内容,选项A,选项B,选项C,选项D,正确答案',
    '1+1等于几？,1,2,3,4,B'
  ].join('\n');
  const parsedWithOverride = context.parseQuestionCsvRows(csvWithoutForm, {
    formOverride: 'Form 3',
    subjectOverride: 'math'
  });
  assert.equal(parsedWithOverride.errors.length, 0);
  assert.equal(parsedWithOverride.rows.length, 1);
  assert.equal(parsedWithOverride.rows[0].form, 'Form 3');
  assert.equal(parsedWithOverride.rows[0].subjectId, 'math');
});


