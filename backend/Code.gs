/**
 * 假期学习宠物打卡 - Google Apps Script 后端骨架
 *
 * 这是下一阶段接入 Google Sheet 时使用的草稿，不包含任何凭证。
 * 前端目前使用 localStorage 演示；完成部署后再把 app.js 的 backendMode 改为 gas。
 */

const SHEET_NAMES = {
  students: 'Students',
  classes: 'Classes',
  classStudents: 'ClassStudents',
  checkins: 'DailyCheckins',
  questions: 'QuestionBank',
  equipment: 'EquipmentCatalog',
  ledger: 'PurchaseLedger',
  teacherRewards: 'TeacherRewards',
  messageWall: 'MessageWall'
};

const HEADERS = {
  Students: ['studentId', 'studentName', 'branch', 'classNameLegacy', 'avatar', 'petName', 'petType', 'petRarity', 'petLevel', 'experience', 'coins', 'totalStars', 'streak', 'lastCheckinDate', 'ownedItems', 'equippedItems', 'status', 'petBirthday', 'ownedPets', 'petCollection', 'evolvedPets', 'petEvolved', 'evolutionStylePreference', 'updatedAt'],
  Classes: ['classId', 'className', 'teacherId', 'branch', 'status', 'createdAt', 'updatedAt'],
  ClassStudents: ['membershipId', 'classId', 'studentId', 'status', 'addedAt', 'removedAt'],
  DailyCheckins: ['recordId', 'studentId', 'date', 'subject', 'score', 'total', 'totalStars', 'coinsEarned', 'experienceEarned', 'durationSeconds', 'createdAt'],
  QuestionBank: ['questionId', 'subject', 'grade', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer', 'explanation', 'points', 'active'],
  EquipmentCatalog: ['itemId', 'itemName', 'category', 'price', 'requiredPetLevel', 'imagePath', 'active'],
  PurchaseLedger: ['purchaseId', 'studentId', 'itemId', 'price', 'createdAt'],
  TeacherRewards: ['rewardId', 'teacherId', 'classId', 'studentId', 'amount', 'reason', 'createdAt'],
  MessageWall: ['postId', 'studentId', 'studentName', 'message', 'petType', 'petName', 'petRarity', 'petLevel', 'combatPower', 'petImage', 'petStats', 'equipment', 'likedBy', 'comments', 'createdAt', 'updatedAt']
};

const TEACHER_DAILY_REWARD_LIMIT = 999999;
const TEACHER_REWARD_ADMIN_IDS = ['CY0000', 'CY0001'];
const TEACHER_REWARD_SHEET_PREFIX = 'Teacher - ';
const CLASS_REWARD_SHEET_PREFIX = 'Class - ';
const CLASS_REWARD_HEADERS = ['studentId', 'studentName', 'classId', 'className', 'teacherId', 'branch', 'coins', 'petName', 'petType', 'petLevel', 'streak', 'lastCheckinDate', 'status'];
const SCHEMA_CACHE_KEY = 'holiday-checkin-schema-ready-v20260812';
const STUDENT_ROW_CACHE_PREFIX = 'holiday-student-row-v20260812-';
const CLASS_LOOKUP_CACHE_KEY = 'holiday-class-lookup-v20260812';
const WALL_ROW_CACHE_PREFIX = 'holiday-wall-row-v20260813-';
const WRITE_ACTIONS = {
  submitCheckin: true,
  upsertClass: true,
  addStudentToClass: true,
  rewardStudents: true,
  likeWallPost: true,
  commentWallPost: true
};
const SUPABASE_FUNCTION_URL = 'https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/fiveplusone-education-api';
const SUPABASE_PUBLIC_FUNCTION_KEY = 'YOUR_PUBLIC_FUNCTION_KEY';

const WALL_POST_PRESETS = [
  '你们都收集几个了？',
  '我的宠物进化了！',
  '看看我的战力！',
  '我正在收集专属装备！',
  '今天也有认真打卡！',
  '今天战力又变强了！',
  '谁要和我一起打卡？',
  '我的装备快收集齐了！',
  '来看看我的新造型！',
  '我离进化更近了！',
  '今天也要冲满五科！',
  '这只伙伴太可靠了！'
];

const WALL_COMMENT_PRESETS = [
  '太帅了吧！',
  '加油！',
  '我也想要这只！',
  '战力好高！',
  '一起继续打卡！',
  '好强！',
  '这个装备很酷！',
  '继续冲！'
];

const BAD_PET_NAME_WORDS = [
  '粗口', '坏话', '笨蛋', '白痴', '神经病', '垃圾', '去死', '杀',
  '色情', '裸', '毒品', 'sex',
  '傻逼', '傻b', '伞兵', '鲨比', '萨比', '虾哔', 'shabi', 'sb',
  '操你妈', '草泥马', '曹尼玛', '查理马', '吵泥马', '艹', 'cnm', 'caonima',
  '卧槽', '我操', '我草', '握草', '哇擦', '挖槽', 'woc', 'wocao', 'cao',
  '他妈的', '你妈的', '特么的', '踏马的', '尼玛', '泥马', '他喵的', 'tmd', 'nmd', 'tamade',
  '你妈死了', '柠檬熟了', '你马没了', 'nmsl', '妈的智障', '玛德智障', 'mdzz',
  '脑残', '智障', '老残', 'naocan',
  '婊子', '贱人', '绿茶婊', '碧池', '逼池', '必娶', '剑人', '贱格', 'biao', 'jianren',
  '老色批', '老色痞', '老蛇皮', 'lsp',
  '傻吊', '傻鸟', '沙雕', 'shandiao',
  '哭爸哭母', '靠北', '靠母', '考杯', '哭爸', 'kpkb', 'kaopeh', 'kaobei',
  'limpeh', '林北', '零北', '拎北', '恁爸',
  '冚家铲', '咸家铲', '喊加产', '全家铲', 'hkc', 'hamkachan',
  '肚烂', '赌烂', '堵烂', 'dulan',
  '痴线', '痴汉', 'chisin',
  '起笑', '疯子', '肖仔', 'siao', 'qixiao',
  '烂散', 'lansan',
  '讲鸟话', '讲干话', '贡兰交', 'gonglj', 'gonglanjiao',
  '废柴', '废材', 'feichai', 'laseh', 'sampah',
  'fuck', 'fck', 'fak', 'faq', 'fack', '法克', '发克', '花克',
  'shit', 'bullshit', '狗屎', '拔粪', '卟屎',
  'bitch', 'bch', 'bxxch', 'biatch',
  'kimak', 'kmk', 'pukimak', '奇马', '几骂',
  'lancau', 'lncau', 'lanjiao', '兰草', '烂草'
];

const MODERATION_CHAR_REPLACEMENTS = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '8': 'b',
  '9': 'g',
  '@': 'a',
  '$': 's',
  '!': 'i',
  '|': 'i'
};

function normalizeModerationText_(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[01345789@$!|]/g, function(char) { return MODERATION_CHAR_REPLACEMENTS[char] || char; })
    .replace(/[\u200b-\u200f\ufeff]/g, '')
    .replace(/[\s._\-*~`@#%^&()+=[\]{}\\:;"'<>,.?/，。？！、；：（）【】《》「」『』]/g, '');
}

function validatePetName_(name, options) {
  const required = Boolean(options && options.required);
  const trimmed = String(name || '').trim();
  if (!trimmed) return required
    ? { ok: false, error: '先填写宠物名字。' }
    : { ok: true, name: '', error: '' };
  if (trimmed.length > 20) return { ok: false, error: '宠物名字最多 20 个字。' };
  const normalized = normalizeModerationText_(trimmed);
  const hasBadWord = BAD_PET_NAME_WORDS.some(function(word) {
    return normalized.indexOf(normalizeModerationText_(word)) >= 0;
  });
  if (hasBadWord) return { ok: false, error: '名字里有不适合公开展示的词，请换一个积极一点的名字。' };
  return { ok: true, name: trimmed, error: '' };
}

function validateWallCommentText_(text, options) {
  const required = !options || options.required !== false;
  const trimmed = String(text || '').trim().replace(/\s+/g, ' ');
  if (!trimmed) return required
    ? { ok: false, error: '先写一句留言。' }
    : { ok: true, text: '', error: '' };
  if (trimmed.length > 18) return { ok: false, error: '留言最多 18 个字。' };
  const normalized = normalizeModerationText_(trimmed);
  const hasBadWord = BAD_PET_NAME_WORDS.some(function(word) {
    return normalized.indexOf(normalizeModerationText_(word)) >= 0;
  });
  if (hasBadWord) return { ok: false, error: '留言里有不适合公开展示的词，请换一句积极一点的话。' };
  return { ok: true, text: trimmed, error: '' };
}

function validateStudentPetNames_(student) {
  const mainName = validatePetName_(student && student.petName, { required: false });
  if (!mainName.ok) return mainName;
  const collection = student && student.petCollection;
  if (!collection || typeof collection !== 'object' || Array.isArray(collection)) return { ok: true, error: '' };
  for (const petId in collection) {
    if (!Object.prototype.hasOwnProperty.call(collection, petId)) continue;
    const record = collection[petId] || {};
    const petName = validatePetName_(record.petName, { required: false });
    if (!petName.ok) return petName;
  }
  return { ok: true, error: '' };
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('假期打卡工具')
    .addItem('刷新班级加分名单', 'refreshClassRewardSheets')
    .addSeparator()
    .addItem('给选中学生 +20', 'rewardSelectedSheetRows20')
    .addItem('给选中学生 +50', 'rewardSelectedSheetRows50')
    .addItem('给选中学生 +100', 'rewardSelectedSheetRows100')
    .addItem('给选中学生 +250', 'rewardSelectedSheetRows250')
    .addItem('给选中学生 +1000', 'rewardSelectedSheetRows1000')
    .addSeparator()
    .addItem('同步选中学生金币到网站', 'syncSelectedStudentCoinsToWebsite')
    .addItem('同步全部学生金币到网站', 'syncAllStudentCoinsToWebsite')
    .addToUi();
}

function doGet(e) {
  return json_({ ok: true, service: 'cy-pets-story-branch', version: '0.1.0' });
}

function doPost(e) {
  let lock = null;
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (WRITE_ACTIONS[payload.action]) {
      lock = LockService.getScriptLock();
      lock.waitLock(15000);
    }
    ensureSheets_();
    if (payload.action === 'submitCheckin') return json_(submitCheckin_(payload));
    if (payload.action === 'getStudent') return json_(getStudent_(payload.studentId, payload));
    if (payload.action === 'saveStudentState') return json_(saveStudentState_(payload));
    if (payload.action === 'getStudentClasses') return json_(getStudentClasses_(payload.studentId));
    if (payload.action === 'listTeacherClasses') return json_(listTeacherClasses_(payload.teacherId));
    if (payload.action === 'getClassStudents') return json_(getClassStudents_(payload));
    if (payload.action === 'upsertClass') return json_(upsertClass_(payload));
    if (payload.action === 'addStudentToClass') return json_(addStudentToClass_(payload));
    if (payload.action === 'rewardStudents') return json_(rewardStudents_(payload));
    if (payload.action === 'listWallPosts') return json_(listWallPosts_(payload));
    if (payload.action === 'createWallPost') return json_(createWallPost_(payload));
    if (payload.action === 'likeWallPost') return json_(likeWallPost_(payload));
    if (payload.action === 'commentWallPost') return json_(commentWallPost_(payload));
    return json_({ ok: false, error: 'Unknown action' });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  } finally {
    if (lock) lock.releaseLock();
  }
}

function submitCheckin_(payload) {
  const studentId = String(payload.studentId || '').trim();
  const record = payload.record || {};
  if (!studentId || !record.recordId || !record.date || !record.subject) {
    return { ok: false, error: 'Missing student or check-in fields' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const students = ss.getSheetByName(SHEET_NAMES.students);
  const checkins = ss.getSheetByName(SHEET_NAMES.checkins);
  const student = getCachedStudentRow_(students, studentId);
  if (!student) return { ok: false, error: 'Student ID not found' };

  // 正式版本应再次从 QuestionBank 校验答案和奖励，不信任浏览器传来的分数。
  const existing = findRowByValue_(checkins, 1, record.recordId);
  if (!existing) {
    checkins.appendRow([
      record.recordId,
      studentId,
      record.date,
      record.subject,
      Number(record.score || 0),
      Number(record.total || 0),
      Number(record.totalStars || 0),
      Number(record.coinsEarned || 0),
      Number(record.experienceEarned || 0),
      Number(record.durationSeconds || 0),
      new Date()
    ]);
    applyCheckinReward_(ss, students, student, record, studentId);
  }
  return { ok: true, recordId: record.recordId, duplicate: Boolean(existing) };
}

function getStudent_(studentId, payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.students);
  const row = getCachedStudentRow_(sheet, String(studentId || '').trim());
  if (!row) return { ok: false, error: 'Student ID not found' };
  const values = sheet.getRange(row, 1, 1, HEADERS.Students.length).getValues()[0];
  const includeClasses = !(payload && payload.includeClasses === false);
  return { ok: true, student: rowToObject_(HEADERS.Students, values), classes: includeClasses ? getStudentClasses_(studentId).classes : [] };
}

function saveStudentState_(payload) {
  const student = payload.student || {};
  const event = payload.event || {};
  const studentId = normalizeId_(payload.studentId || student.studentId);
  if (!studentId) return { ok: false, error: 'Missing student ID' };
  const petNameValidation = validateStudentPetNames_(student);
  if (!petNameValidation.ok) return { ok: false, error: petNameValidation.error };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const studentSheet = ss.getSheetByName(SHEET_NAMES.students);
  const studentRow = getCachedStudentRow_(studentSheet, studentId);
  if (!studentRow) return { ok: false, error: 'Student ID not found' };

  const now = new Date();
  const existingValues = studentSheet.getRange(studentRow, 1, 1, HEADERS.Students.length).getValues()[0];
  const existing = rowToObject_(HEADERS.Students, existingValues);
  const isProfileRename = String(event.type || '') === 'renameStudent';
  const row = {
    studentId: studentId,
    studentName: String(isProfileRename ? (student.studentName || student.name || existing.studentName || studentId) : (existing.studentName || student.studentName || student.name || studentId)).trim(),
    branch: String(existing.branch || student.branch || '').trim(),
    classNameLegacy: String(existing.classNameLegacy || student.className || '').trim(),
    avatar: String(student.avatar || existing.avatar || '🌟'),
    petName: String(student.petName || ''),
    petType: String(student.petType || ''),
    petRarity: String(student.petRarity || 'A'),
    petLevel: Math.max(1, Math.floor(Number(student.petLevel || existing.petLevel || 1))),
    experience: Math.max(0, Number(student.experience || 0)),
    coins: Math.max(0, Number(student.coins || 0)),
    totalStars: Math.max(0, Number(student.totalStars || 0)),
    streak: Math.max(0, Number(student.streak || 0)),
    lastCheckinDate: normalizeDateKey_(student.lastCheckinDate || existing.lastCheckinDate),
    ownedItems: stringifyJsonField_(student.ownedItems, parseJsonField_(existing.ownedItems, [])),
    equippedItems: stringifyJsonField_(student.equippedItems, parseJsonField_(existing.equippedItems, {})),
    status: String(existing.status || student.status || 'active'),
    petBirthday: normalizeDateKey_(student.petBirthday || existing.petBirthday),
    ownedPets: stringifyJsonField_(student.ownedPets, parseJsonField_(existing.ownedPets, [])),
    petCollection: stringifyJsonField_(student.petCollection, parseJsonField_(existing.petCollection, {})),
    evolvedPets: stringifyJsonField_(student.evolvedPets, parseJsonField_(existing.evolvedPets, {})),
    petEvolved: student.petEvolved ? 'TRUE' : 'FALSE',
    evolutionStylePreference: normalizeEvolutionStyle_(student.evolutionStylePreference || existing.evolutionStylePreference),
    updatedAt: now
  };

  studentSheet.getRange(studentRow, 1, 1, HEADERS.Students.length).setValues([HEADERS.Students.map(function(header) {
    return Object.prototype.hasOwnProperty.call(row, header) ? row[header] : '';
  })]);
  appendPurchaseLedger_(ss, studentId, event, now);
  return { ok: true, saved: true, eventType: String(event.type || ''), student: row, classes: [] };
}

/**
 * 返回学生所属的全部班级。不要把结果压成 Students.classNameLegacy；
 * 同一个 studentId 可以在 ClassStudents 中有多行，分别属于不同老师的班。
 */
function getStudentClasses_(studentId) {
  studentId = normalizeId_(studentId);
  if (!studentId) return { ok: false, error: 'Missing student ID', classes: [] };
  return {
    ok: true,
    classes: getClassLookup_().classesByStudent[studentId] || []
  };
}

function listTeacherClasses_(teacherId) {
  teacherId = normalizeId_(teacherId);
  if (!teacherId) return { ok: false, error: 'Missing teacher ID', classes: [] };
  const lookup = getClassLookup_();
  const classes = lookup.classes
    .filter(function(row) { return normalizeId_(row.teacherId) === teacherId && String(row.status || 'active') !== 'archived'; });
  return { ok: true, classes: classes.map(function(item) {
    return Object.assign({}, item, { studentCount: lookup.classCounts[normalizeId_(item.classId)] || 0 });
  }) };
}

function getClassStudents_(payload) {
  const teacherId = normalizeId_(payload.teacherId);
  const classId = normalizeId_(payload.classId);
  if (!teacherId || !classId) return { ok: false, error: 'Missing teacher ID or class ID', students: [] };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const lookup = getClassLookup_();
  const classInfo = lookup.classesById[classId];
  if (!classInfo) return { ok: false, error: 'Class ID not found', students: [] };
  if (normalizeId_(classInfo.teacherId) !== teacherId) return { ok: false, error: 'Teacher is not authorized for this class', students: [] };

  const studentIds = lookup.studentsByClass[classId] || [];
  const studentSheet = ss.getSheetByName(SHEET_NAMES.students);
  return {
    ok: true,
    class: classInfo,
    students: studentIds.map(function(studentId) { return getStudentSummary_(studentSheet, studentId, classInfo); }).filter(Boolean)
  };
}

/** 创建新班或更新班级基础资料；正式版应在此处叠加教师账号认证。 */
function upsertClass_(payload) {
  const classId = normalizeId_(payload.classId);
  const teacherId = normalizeId_(payload.teacherId);
  const className = String(payload.className || '').trim();
  if (!classId || !teacherId || !className) return { ok: false, error: 'Missing classId, teacherId or className' };
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.classes);
  const row = findRowByValue_(sheet, 1, classId);
  const now = new Date();
  if (row) {
    const existing = sheet.getRange(row, 1, 1, HEADERS.Classes.length).getValues()[0];
    sheet.getRange(row, 1, 1, HEADERS.Classes.length).setValues([[
      classId, className, teacherId, String(payload.branch || '').trim(), String(payload.status || existing[4] || 'active'), existing[5] || now, now
    ]]);
  } else {
    sheet.appendRow([classId, className, teacherId, String(payload.branch || '').trim(), String(payload.status || 'active'), now, now]);
  }
  invalidateClassLookupCache_();
  return { ok: true, classId: classId, teacherId: teacherId };
}

/** 添加成员采用独立关系表，因此不会覆盖学生的其他班级。 */
function addStudentToClass_(payload) {
  const classId = normalizeId_(payload.classId);
  const teacherId = normalizeId_(payload.teacherId);
  const studentId = normalizeId_(payload.studentId);
  if (!classId || !teacherId || !studentId) return { ok: false, error: 'Missing classId, teacherId or studentId' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const classes = ss.getSheetByName(SHEET_NAMES.classes);
  const students = ss.getSheetByName(SHEET_NAMES.students);
  const classRow = findRowByValue_(classes, 1, classId);
  if (!classRow) return { ok: false, error: 'Class ID not found' };
  const classValues = classes.getRange(classRow, 1, 1, HEADERS.Classes.length).getValues()[0];
  if (normalizeId_(classValues[2]) !== teacherId) return { ok: false, error: 'Teacher is not authorized for this class' };
  if (!getCachedStudentRow_(students, studentId)) return { ok: false, error: 'Student ID not found' };
  const memberships = ss.getSheetByName(SHEET_NAMES.classStudents);
  const rows = getSheetObjects_(memberships, HEADERS.ClassStudents);
  const duplicate = rows.find(function(row) {
    return normalizeId_(row.classId) === classId && normalizeId_(row.studentId) === studentId && String(row.status || 'active') !== 'removed';
  });
  if (duplicate) return { ok: true, duplicate: true, membershipId: duplicate.membershipId, classId: classId, studentId: studentId };
  const membershipId = String(payload.membershipId || Utilities.getUuid());
  memberships.appendRow([membershipId, classId, studentId, 'active', new Date(), '']);
  invalidateClassLookupCache_();
  return { ok: true, duplicate: false, membershipId: membershipId, classId: classId, studentId: studentId };
}

function refreshClassRewardSheets() {
  ensureSheets_();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  hideLegacyClassRewardSheets_();
  const classes = getSheetObjects_(ss.getSheetByName(SHEET_NAMES.classes), HEADERS.Classes)
    .filter(function(classInfo) { return normalizeId_(classInfo.classId) && String(classInfo.status || 'active') !== 'archived'; });
  const memberships = getSheetObjects_(ss.getSheetByName(SHEET_NAMES.classStudents), HEADERS.ClassStudents);
  const studentSheet = ss.getSheetByName(SHEET_NAMES.students);
  const classesByTeacher = groupClassesByTeacher_(classes);
  const teacherIds = Object.keys(classesByTeacher).sort();
  teacherIds.forEach(function(teacherId) {
    const sheetName = getTeacherRewardSheetName_(teacherId);
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);
    sheet.clearContents();
    let cursor = 1;
    sheet.getRange(cursor, 1, 1, CLASS_REWARD_HEADERS.length).setValues([['老师分页', teacherId, '选中学生数据行后，用菜单加分', '', '', '', '', '', '', '', '', '', '']]);
    sheet.getRange(cursor, 1, 1, CLASS_REWARD_HEADERS.length).setFontWeight('bold').setBackground('#ede9fe');
    cursor += 2;
    classesByTeacher[teacherId].forEach(function(classInfo) {
      const rosterRows = buildClassRewardRosterRows_(memberships, studentSheet, classInfo);
      sheet.getRange(cursor, 1, 1, CLASS_REWARD_HEADERS.length).setValues([[formatClassSectionTitle_(classInfo, rosterRows.length), '', '', '', '', '', '', '', '', '', '', '', '']]);
      sheet.getRange(cursor, 1, 1, CLASS_REWARD_HEADERS.length).setFontWeight('bold').setBackground('#fef3c7');
      cursor += 1;
      sheet.getRange(cursor, 1, 1, CLASS_REWARD_HEADERS.length).setValues([CLASS_REWARD_HEADERS]);
      sheet.getRange(cursor, 1, 1, CLASS_REWARD_HEADERS.length).setFontWeight('bold').setBackground('#f5f3ff');
      cursor += 1;
      if (rosterRows.length) {
        sheet.getRange(cursor, 1, rosterRows.length, CLASS_REWARD_HEADERS.length).setValues(rosterRows);
        sheet.getRange(cursor, 7, rosterRows.length, 1).setFormulaR1C1('=IFERROR(VLOOKUP(RC[-6],Students!C1:C11,11,FALSE),0)');
        cursor += rosterRows.length;
      }
      cursor += 1;
    });
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, CLASS_REWARD_HEADERS.length);
  });
  ss.toast('已刷新 ' + teacherIds.length + ' 个老师分页、' + classes.length + ' 个班级名单。请打开 Teacher - 老师ID 的分页，选中学生行后加分。', '假期打卡工具', 6);
  return { ok: true, teacherCount: teacherIds.length, classCount: classes.length };
}

function getClassRewardSheetName_(classId) {
  const safeId = normalizeId_(classId).replace(/[\\/?*[\]:]/g, '-');
  return (CLASS_REWARD_SHEET_PREFIX + (safeId || 'CLASS')).slice(0, 99);
}

function getTeacherRewardSheetName_(teacherId) {
  const safeId = normalizeId_(teacherId).replace(/[\\/?*[\]:]/g, '-');
  return (TEACHER_REWARD_SHEET_PREFIX + (safeId || 'TEACHER')).slice(0, 99);
}

function groupClassesByTeacher_(classes) {
  return classes.reduce(function(groups, classInfo) {
    const teacherId = normalizeId_(classInfo.teacherId) || 'TEACHER';
    if (!groups[teacherId]) groups[teacherId] = [];
    groups[teacherId].push(classInfo);
    groups[teacherId].sort(compareClassOrder_);
    return groups;
  }, {});
}

function compareClassOrder_(a, b) {
  const yearA = getClassOrderYear_(a);
  const yearB = getClassOrderYear_(b);
  if (yearA !== yearB) return yearA - yearB;
  return String(a.className || a.classId || '').localeCompare(
    String(b.className || b.classId || ''),
    'en',
    { numeric: true, sensitivity: 'base' }
  );
}

function getClassOrderYear_(classInfo) {
  const text = String((classInfo && classInfo.className) || '') + ' ' + String((classInfo && classInfo.classId) || '');
  const ordinal = text.match(/(?:^|[^A-Za-z0-9])(\d{1,2})(?:st|nd|rd|th)(?:-\d{1,2}(?:st|nd|rd|th)?)?(?:[^A-Za-z0-9]|$)/i);
  if (ordinal) return Number(ordinal[1]);
  const year = text.match(/(?:^|[^A-Za-z0-9])Y\s*(\d{1,2})(?:[^A-Za-z0-9]|$)|Year\s*(\d{1,2})/i);
  if (year) return Number(year[1] || year[2]);
  return 999;
}

function buildClassRewardRosterRows_(memberships, studentSheet, classInfo) {
  return memberships
    .filter(function(membership) {
      return normalizeId_(membership.classId) === normalizeId_(classInfo.classId) && String(membership.status || 'active') !== 'removed';
    })
    .map(function(membership) { return getStudentSummary_(studentSheet, normalizeId_(membership.studentId), classInfo); })
    .filter(Boolean)
    .map(function(student) {
      return [
        student.studentId,
        student.studentName,
        normalizeId_(classInfo.classId),
        String(classInfo.className || ''),
        normalizeId_(classInfo.teacherId),
        student.branch,
        Number(student.coins || 0),
        student.petName,
        student.petType,
        Number(student.petLevel || 1),
        Number(student.streak || 0),
        student.lastCheckinDate,
        student.status
      ];
    });
}

function formatClassSectionTitle_(classInfo, studentCount) {
  return String(classInfo.className || classInfo.classId || '未命名班级') + ' · ' + normalizeId_(classInfo.classId) + ' · ' + studentCount + ' 位学生';
}

function hideLegacyClassRewardSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheets().forEach(function(sheet) {
    if (isLegacyClassRewardSheet_(sheet) && !sheet.isSheetHidden()) sheet.hideSheet();
  });
}

function isLegacyClassRewardSheet_(sheet) {
  return Boolean(sheet && String(sheet.getName() || '').indexOf(CLASS_REWARD_SHEET_PREFIX) === 0);
}

function isTeacherRewardSheet_(sheet) {
  return Boolean(sheet && String(sheet.getName() || '').indexOf(TEACHER_REWARD_SHEET_PREFIX) === 0);
}

function isClassRewardSheet_(sheet) {
  return isLegacyClassRewardSheet_(sheet) || isTeacherRewardSheet_(sheet);
}

function rewardSelectedSheetRows20() { return rewardSelectedSheetRows_(20); }
function rewardSelectedSheetRows50() { return rewardSelectedSheetRows_(50); }
function rewardSelectedSheetRows100() { return rewardSelectedSheetRows_(100); }
function rewardSelectedSheetRows250() { return rewardSelectedSheetRows_(250); }
function rewardSelectedSheetRows1000() { return rewardSelectedSheetRows_(1000); }

function rewardSelectedSheetRows_(amount) {
  ensureSheets_();
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const rewardInfo = getRewardSheetInfo_(sheet);
  if (!rewardInfo.ok) {
    ui.alert('请先切换到 Students 总名单，或打开 Teacher - 老师ID 的老师加分分页，然后选中要加分的学生行。');
    return { ok: false, error: rewardInfo.error };
  }
  if ([20, 50, 100, 250, 1000].indexOf(Number(amount)) === -1) {
    ui.alert('这个 Sheet 快捷加分按钮只支持 +20、+50、+100、+250 或 +1000。');
    return { ok: false, error: 'Invalid sheet reward amount' };
  }

  const rangeList = sheet.getActiveRangeList();
  const ranges = rangeList ? rangeList.getRanges() : [sheet.getActiveRange()].filter(Boolean);
  const rows = {};
  ranges.forEach(function(range) {
    const startRow = range.getRow();
    const endRow = startRow + range.getNumRows() - 1;
    for (let row = startRow; row <= endRow; row += 1) {
      if (row > 1) rows[row] = true;
    }
  });

  const studentIds = Object.keys(rows)
    .map(function(row) { return normalizeId_(sheet.getRange(row, rewardInfo.studentIdColumn).getValue()); })
    .filter(Boolean);
  if (!studentIds.length) {
    ui.alert('请至少选中一位学生的数据行；第 1 行标题不会被加分。');
    return { ok: false, error: 'No selected student rows' };
  }
  const firstSelectedRow = Number(Object.keys(rows)[0]);
  const selectedClassId = rewardInfo.classIdColumn ? normalizeId_(sheet.getRange(firstSelectedRow, rewardInfo.classIdColumn).getValue()) : rewardInfo.classId;
  const selectedTeacherId = rewardInfo.teacherIdColumn ? normalizeId_(sheet.getRange(firstSelectedRow, rewardInfo.teacherIdColumn).getValue()) : rewardInfo.teacherId;

  const result = applySheetRewardToStudents_(studentIds, amount, {
    teacherId: selectedTeacherId || rewardInfo.teacherId || getSheetRewardActor_(),
    classId: selectedClassId || rewardInfo.classId || 'SHEET',
    reason: rewardInfo.reason || 'Sheet 快捷加分'
  });
  updateRewardSheetSelectedBalances_(sheet, rewardInfo, rows, result);
  const acceptedCount = result.accepted.length;
  const limitedCount = result.limited.length;
  const rejectedCount = result.rejected.length;
  const message = acceptedCount
    ? '已为 ' + acceptedCount + ' 位学生加分；当前页金币已更新' + (limitedCount ? '；部分学生已接近或达到今日 ' + TEACHER_DAILY_REWARD_LIMIT + ' 上限。' : '。')
    : '没有学生获得加分；可能都已达到今日 ' + TEACHER_DAILY_REWARD_LIMIT + ' 上限。';
  SpreadsheetApp.getActiveSpreadsheet().toast(message + (rejectedCount ? ' 有 ' + rejectedCount + ' 行没有找到学生 ID。' : ''), '假期打卡工具', 5);
  return result;
}

function updateRewardSheetSelectedBalances_(sheet, rewardInfo, selectedRows, result) {
  const coinsColumn = Number(rewardInfo && rewardInfo.coinsColumn || 0);
  if (!sheet || !coinsColumn || !result || !Array.isArray(result.balances)) return;
  const balancesByStudent = result.balances.reduce(function(map, item) {
    map[normalizeId_(item.studentId)] = Number(item.coins || 0);
    return map;
  }, {});
  Object.keys(selectedRows || {}).forEach(function(rowText) {
    const row = Number(rowText);
    const studentId = normalizeId_(sheet.getRange(row, rewardInfo.studentIdColumn).getValue());
    if (!studentId || balancesByStudent[studentId] === undefined) return;
    const target = sheet.getRange(row, coinsColumn);
    if (isClassRewardSheet_(sheet)) {
      target.setFormulaR1C1('=IFERROR(VLOOKUP(RC[-6],Students!C1:C11,11,FALSE),0)');
    } else {
      target.setValue(balancesByStudent[studentId]);
    }
  });
}

function getRewardSheetInfo_(sheet) {
  if (!sheet) return { ok: false, error: 'No active sheet' };
  if (sheet.getName() === SHEET_NAMES.students) {
    return {
      ok: true,
      studentIdColumn: 1,
      coinsColumn: 11,
      classId: 'SHEET',
      teacherId: getSheetRewardActor_(),
      reason: 'Sheet 总名单快捷加分'
    };
  }
  if (isClassRewardSheet_(sheet)) {
    const headers = getRewardHeadersForSelectedRow_(sheet);
    const studentIdColumn = headers.indexOf('studentId') + 1;
    if (!studentIdColumn) return { ok: false, error: 'Class reward sheet is missing studentId column' };
    return {
      ok: true,
      studentIdColumn: studentIdColumn,
      classIdColumn: headers.indexOf('classId') + 1,
      teacherIdColumn: headers.indexOf('teacherId') + 1,
      coinsColumn: headers.indexOf('coins') + 1,
      classId: '',
      teacherId: '',
      reason: '班级名单快捷加分'
    };
  }
  return { ok: false, error: 'Active sheet is not a reward sheet' };
}

function getRewardHeadersForSelectedRow_(sheet) {
  const lastColumn = Math.max(1, sheet.getLastColumn());
  const activeRange = sheet.getActiveRange();
  const activeRow = activeRange ? Math.max(1, activeRange.getRow()) : 1;
  const rowsAbove = sheet.getRange(1, 1, activeRow, lastColumn).getDisplayValues();
  for (let index = rowsAbove.length - 1; index >= 0; index -= 1) {
    const headers = rowsAbove[index].map(function(header) { return String(header || '').trim(); });
    if (headers.indexOf('studentId') !== -1) return headers;
  }
  return sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0]
    .map(function(header) { return String(header || '').trim(); });
}

function applySheetRewardToStudents_(studentIds, amount, options) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const summary = applyTeacherRewards_(ss, studentIds, Number(amount), {
    teacherId: String(options && options.teacherId || 'SHEET'),
    classId: String(options && options.classId || 'SHEET'),
    reason: String(options && options.reason || 'Sheet 快捷加分'),
    requireMembership: false
  });
  return Object.assign({ ok: true, amount: Number(amount), dailyLimit: TEACHER_DAILY_REWARD_LIMIT }, summary);
}

function getSheetRewardActor_() {
  try {
    const email = Session.getActiveUser().getEmail();
    return email || 'SHEET';
  } catch (error) {
    return 'SHEET';
  }
}

function syncSelectedStudentCoinsToWebsite() {
  ensureSheets_();
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const studentIds = getSelectedStudentIdsForSync_(ss.getActiveSheet());
  if (!studentIds.length) {
    ui.alert('请先在 Students 总名单或老师班级分页里选中学生行，再同步金币。');
    return { ok: false, error: 'No selected students' };
  }

  const result = syncStudentCoinsToWebsite_(studentIds);
  const message = '已同步 ' + result.synced.length + ' 位学生金币到网站' + (result.failed.length ? '；失败 ' + result.failed.length + ' 位。' : '。');
  ss.toast(message, '假期打卡工具', 6);
  if (result.failed.length) ui.alert(message + '\n\n' + truncateSyncErrors_(result.failed));
  return result;
}

function syncAllStudentCoinsToWebsite() {
  ensureSheets_();
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetStudents = getAllSheetStudentProfiles_();
  if (!sheetStudents.length) {
    ui.alert('Students 页目前没有可同步的学生。');
    return { ok: false, error: 'No students' };
  }

  const result = syncStudentCoinsFromSheetRows_(sheetStudents);
  const message = '已同步全部学生金币：成功 ' + result.synced.length + ' 位' + (result.failed.length ? '，失败 ' + result.failed.length + ' 位。' : '。');
  ss.toast(message, '假期打卡工具', 8);
  if (result.failed.length) ui.alert(message + '\n\n' + truncateSyncErrors_(result.failed));
  return result;
}

function getSelectedStudentIdsForSync_(sheet) {
  const rewardInfo = getRewardSheetInfo_(sheet);
  if (!rewardInfo.ok) return [];
  const rangeList = sheet.getActiveRangeList();
  const ranges = rangeList ? rangeList.getRanges() : [sheet.getActiveRange()].filter(Boolean);
  const rows = {};
  ranges.forEach(function(range) {
    const startRow = range.getRow();
    const endRow = startRow + range.getNumRows() - 1;
    for (let row = startRow; row <= endRow; row += 1) {
      if (row > 1) rows[row] = true;
    }
  });
  return Array.from(new Set(Object.keys(rows)
    .map(function(row) { return normalizeId_(sheet.getRange(Number(row), rewardInfo.studentIdColumn).getValue()); })
    .filter(function(studentId) { return studentId && studentId !== 'STUDENTID'; })));
}

function syncStudentCoinsToWebsite_(studentIds) {
  const studentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.students);
  const seen = {};
  const sheetStudents = [];
  const failed = [];
  studentIds.map(normalizeId_).filter(Boolean).forEach(function(studentId) {
    if (seen[studentId]) return;
    seen[studentId] = true;
    const sheetStudent = getSheetStudentProfileById_(studentSheet, studentId);
    if (sheetStudent) {
      sheetStudents.push(sheetStudent);
    } else {
      failed.push({ studentId: studentId, error: 'Students 页找不到这个 ID' });
    }
  });

  const result = syncStudentCoinsFromSheetRows_(sheetStudents);
  return Object.assign({}, result, {
    ok: result.failed.length + failed.length === 0,
    failed: failed.concat(result.failed)
  });
}

function syncStudentCoinsFromSheetRows_(sheetStudents) {
  const synced = [];
  const failed = [];
  sheetStudents.forEach(function(sheetStudent) {
    try {
      const remoteStudent = getSupabaseStudentForSync_(sheetStudent.studentId);
      const mergedStudent = mergeSheetCoinIntoRemoteStudent_(sheetStudent, remoteStudent);
      const saved = saveSupabaseStudentForSync_(mergedStudent, {
        type: 'sheetCoinSync',
        source: 'GoogleSheet',
        coins: mergedStudent.coins
      });
      if (saved.ok) {
        synced.push({ studentId: mergedStudent.studentId, coins: mergedStudent.coins });
      } else {
        failed.push({ studentId: sheetStudent.studentId, error: saved.error || 'Supabase 保存失败' });
      }
    } catch (error) {
      failed.push({ studentId: sheetStudent.studentId, error: String(error) });
    }
  });
  return { ok: failed.length === 0, synced: synced, failed: failed };
}

function getAllSheetStudentProfiles_() {
  const studentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.students);
  if (!studentSheet || studentSheet.getLastRow() < 2) return [];
  return studentSheet.getRange(2, 1, studentSheet.getLastRow() - 1, HEADERS.Students.length).getValues()
    .map(function(values) { return sheetStudentRowToProfile_(rowToObject_(HEADERS.Students, values)); })
    .filter(function(student) { return Boolean(student.studentId); });
}

function getSheetStudentProfileById_(studentSheet, studentId) {
  const row = getCachedStudentRow_(studentSheet, studentId);
  if (!row) return null;
  const values = studentSheet.getRange(row, 1, 1, HEADERS.Students.length).getValues()[0];
  return sheetStudentRowToProfile_(rowToObject_(HEADERS.Students, values));
}

function sheetStudentRowToProfile_(row) {
  const studentId = normalizeId_(row.studentId);
  if (!studentId) return null;
  return {
    studentId: studentId,
    studentName: String(row.studentName || studentId).trim(),
    name: String(row.studentName || studentId).trim(),
    branch: String(row.branch || '').trim(),
    className: String(row.classNameLegacy || '').trim(),
    classNameLegacy: String(row.classNameLegacy || '').trim(),
    avatar: String(row.avatar || '🌟'),
    petName: String(row.petName || ''),
    petType: String(row.petType || ''),
    petRarity: String(row.petRarity || 'A'),
    petLevel: Math.max(1, Math.floor(Number(row.petLevel || 1))),
    experience: Math.max(0, Number(row.experience || 0)),
    coins: Math.max(0, Number(row.coins || 0)),
    totalStars: Math.max(0, Number(row.totalStars || 0)),
    streak: Math.max(0, Number(row.streak || 0)),
    lastCheckinDate: normalizeDateKey_(row.lastCheckinDate),
    ownedItems: parseJsonField_(row.ownedItems, []),
    equippedItems: parseJsonField_(row.equippedItems, {}),
    status: String(row.status || 'active'),
    petBirthday: normalizeDateKey_(row.petBirthday),
    ownedPets: parseJsonField_(row.ownedPets, []),
    petCollection: parseJsonField_(row.petCollection, {}),
    evolvedPets: parseJsonField_(row.evolvedPets, {}),
    evolutionStylePreference: normalizeEvolutionStyle_(row.evolutionStylePreference),
    petEvolved: row.petEvolved === true || String(row.petEvolved || '').toUpperCase() === 'TRUE'
  };
}

function mergeSheetCoinIntoRemoteStudent_(sheetStudent, remoteStudent) {
  const base = remoteStudent && typeof remoteStudent === 'object' ? remoteStudent : sheetStudent;
  const studentName = String(sheetStudent.studentName || base.studentName || base.name || sheetStudent.studentId).trim();
  return Object.assign({}, base, {
    studentId: normalizeId_(sheetStudent.studentId || base.studentId),
    studentName: studentName,
    name: studentName,
    branch: String(sheetStudent.branch || base.branch || '').trim(),
    className: String(sheetStudent.className || sheetStudent.classNameLegacy || base.className || '').trim(),
    classNameLegacy: String(sheetStudent.classNameLegacy || sheetStudent.className || base.classNameLegacy || '').trim(),
    avatar: String(sheetStudent.avatar || base.avatar || '🌟'),
    status: String(sheetStudent.status || base.status || 'active'),
    evolutionStylePreference: normalizeEvolutionStyle_(sheetStudent.evolutionStylePreference || base.evolutionStylePreference),
    coins: Math.max(0, Number(sheetStudent.coins || 0))
  });
}

function requestSupabaseFunction_(action, payload) {
  const response = UrlFetchApp.fetch(SUPABASE_FUNCTION_URL, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      apikey: SUPABASE_PUBLIC_FUNCTION_KEY,
      Authorization: 'Bearer ' + SUPABASE_PUBLIC_FUNCTION_KEY
    },
    payload: JSON.stringify(Object.assign({ action: action }, payload || {})),
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  const text = response.getContentText();
  let result = null;
  try {
    result = JSON.parse(text);
  } catch (error) {
    return { ok: false, error: 'Supabase 没有回传 JSON：' + text.slice(0, 160) };
  }
  if (status >= 400) return { ok: false, error: result.error || result.message || ('Supabase HTTP ' + status) };
  return result;
}

function getSupabaseStudentForSync_(studentId) {
  const result = requestSupabaseFunction_('getStudent', { studentId: normalizeId_(studentId), includeClasses: false });
  if (!result.ok) return null;
  return result.student || null;
}

function saveSupabaseStudentForSync_(student, event) {
  return requestSupabaseFunction_('saveStudentState', {
    studentId: normalizeId_(student.studentId),
    student: student,
    event: event || {}
  });
}

function truncateSyncErrors_(errors) {
  return errors.slice(0, 12).map(function(item) {
    return String(item.studentId || '-') + '：' + String(item.error || '未知错误');
  }).join('\n') + (errors.length > 12 ? '\n……还有 ' + (errors.length - 12) + ' 个失败没有显示。' : '');
}

/**
 * 老师按授权班级批量奖励金币。amount 只接受前端约定的奖励档位，
 * 且每个 studentId 必须是该 classId 的有效成员。
 */
function rewardStudents_(payload) {
  const teacherId = normalizeId_(payload.teacherId);
  const classId = normalizeId_(payload.classId);
  const amount = Number(payload.amount);
  const studentIds = Array.isArray(payload.studentIds) ? Array.from(new Set(payload.studentIds.map(normalizeId_).filter(Boolean))) : [];
  if (!teacherId || !classId || !studentIds.length || [2, 4, 6, 8, 10, 20, 50, 100, 250, 1000].indexOf(amount) === -1) return { ok: false, error: 'Invalid teacher, class, students or amount' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const classes = ss.getSheetByName(SHEET_NAMES.classes);
  const classRow = findRowByValue_(classes, 1, classId);
  if (!classRow) return { ok: false, error: 'Class ID not found' };
  const classValues = classes.getRange(classRow, 1, 1, HEADERS.Classes.length).getValues()[0];
  if (normalizeId_(classValues[2]) !== teacherId) return { ok: false, error: 'Teacher is not authorized for this class' };
  const membershipRows = getSheetObjects_(ss.getSheetByName(SHEET_NAMES.classStudents), HEADERS.ClassStudents);
  const summary = applyTeacherRewards_(ss, studentIds, amount, {
    teacherId: teacherId,
    classId: classId,
    reason: String(payload.reason || ''),
    membershipRows: membershipRows,
    requireMembership: true
  });
  return Object.assign({ ok: true, amount: amount, dailyLimit: TEACHER_DAILY_REWARD_LIMIT }, summary);
}

function applyTeacherRewards_(ss, studentIds, amount, options) {
  const studentSheet = ss.getSheetByName(SHEET_NAMES.students);
  const ledger = ss.getSheetByName(SHEET_NAMES.teacherRewards);
  const rewardRows = getSheetObjects_(ledger, HEADERS.TeacherRewards);
  const membershipRows = Array.isArray(options && options.membershipRows) ? options.membershipRows : [];
  const teacherId = String(options && options.teacherId || 'SHEET');
  const classId = String(options && options.classId || 'SHEET');
  const reason = String(options && options.reason || '');
  const requireMembership = Boolean(options && options.requireMembership);
  const now = new Date();
  const todayKey = normalizeDateKey_(now);
  const accepted = [];
  const rejected = [];
  const limited = [];
  const balances = [];
  Array.from(new Set(studentIds.map(normalizeId_).filter(Boolean))).forEach(function(studentId) {
    const member = !requireMembership || membershipRows.some(function(row) {
      return normalizeId_(row.classId) === normalizeId_(classId) && normalizeId_(row.studentId) === studentId && String(row.status || 'active') !== 'removed';
    });
    const studentRow = findRowByValue_(studentSheet, 1, studentId);
    if (!member || !studentRow) { rejected.push(studentId); return; }
    const studentValues = studentSheet.getRange(studentRow, 1, 1, HEADERS.Students.length).getValues()[0];
    const student = rowToObject_(HEADERS.Students, studentValues);
    const currentCoins = Number(student.coins || 0);
    const teacherTarget = isUnlimitedTeacherRewardTarget_(student);
    const canRewardTeacherTargets = canRewardTeacherTargets_(teacherId);
    if (teacherTarget && !canRewardTeacherTargets) {
      rejected.push(studentId);
      return;
    }
    const unlimitedRewardTarget = teacherTarget && canRewardTeacherTargets;
    const alreadyRewarded = getTeacherDailyRewardTotal_(rewardRows, studentId, todayKey);
    const remainingDailyReward = Math.max(0, TEACHER_DAILY_REWARD_LIMIT - alreadyRewarded);
    const appliedAmount = Math.min(amount, remainingDailyReward);
    const finalAppliedAmount = unlimitedRewardTarget ? amount : appliedAmount;
    const finalRemainingDailyReward = unlimitedRewardTarget ? '' : remainingDailyReward - finalAppliedAmount;
    if (finalAppliedAmount <= 0) {
      rejected.push(studentId);
      limited.push({ studentId: studentId, reason: 'daily-limit', appliedAmount: 0, remainingDailyReward: 0 });
      balances.push({ studentId: studentId, coins: currentCoins, appliedAmount: 0, remainingDailyReward: 0 });
      return;
    }
    const nextCoins = currentCoins + finalAppliedAmount;
    studentSheet.getRange(studentRow, 11).setValue(nextCoins);
    ledger.appendRow([Utilities.getUuid(), teacherId, classId, studentId, finalAppliedAmount, reason, now]);
    if (!unlimitedRewardTarget && finalAppliedAmount < amount) limited.push({ studentId: studentId, reason: 'daily-limit', appliedAmount: finalAppliedAmount, remainingDailyReward: 0 });
    balances.push({ studentId: studentId, coins: nextCoins, appliedAmount: finalAppliedAmount, remainingDailyReward: finalRemainingDailyReward });
    accepted.push(studentId);
  });
  return { accepted: accepted, rejected: rejected, limited: limited, balances: balances };
}

function isUnlimitedTeacherRewardTarget_(student) {
  const status = String(student && student.status || '').toLowerCase();
  const className = String(student && (student.className || student.classNameLegacy) || '').toLowerCase();
  const studentName = String(student && student.studentName || '').toLowerCase();
  return /teacher|internal|staff|test|内测/.test(status)
    || /internal test|cy大家庭|内测/.test(className)
    || /老师|teacher|^ms\b|^mr\b/.test(studentName);
}

function canRewardTeacherTargets_(teacherId) {
  return TEACHER_REWARD_ADMIN_IDS.indexOf(normalizeId_(teacherId)) !== -1;
}

function getTeacherDailyRewardTotal_(rewardRows, studentId, dateKey) {
  return rewardRows
    .filter(function(row) { return normalizeId_(row.studentId) === normalizeId_(studentId) && normalizeDateKey_(row.createdAt) === dateKey; })
    .reduce(function(sum, row) { return sum + Number(row.amount || 0); }, 0);
}

function listWallPosts_(payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.messageWall);
  const posts = getSheetObjects_(sheet, HEADERS.MessageWall)
    .map(postFromWallRow_)
    .sort(function(a, b) { return getWallTime_(b.createdAt || b.updatedAt) - getWallTime_(a.createdAt || a.updatedAt); })
    .slice(0, 50);
  return { ok: true, posts: posts };
}

function createWallPost_(payload) {
  const post = payload.post || {};
  const studentId = normalizeId_(post.studentId);
  const message = sanitizeWallPreset_(post.message, WALL_POST_PRESETS);
  if (!studentId || !message) return { ok: false, error: 'Missing student or invalid message preset' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const studentSheet = ss.getSheetByName(SHEET_NAMES.students);
  const studentRow = getCachedStudentRow_(studentSheet, studentId);
  if (!studentRow) return { ok: false, error: 'Student ID not found' };
  const wallSheet = ss.getSheetByName(SHEET_NAMES.messageWall);
  const existingWallRow = getCachedWallRowByStudent_(wallSheet, studentId);
  const existingWall = existingWallRow
    ? rowToObject_(HEADERS.MessageWall, wallSheet.getRange(existingWallRow, 1, 1, HEADERS.MessageWall.length).getValues()[0])
    : {};

  const studentValues = studentSheet.getRange(studentRow, 1, 1, HEADERS.Students.length).getValues()[0];
  const student = rowToObject_(HEADERS.Students, studentValues);
  const petNameValidation = validatePetName_(post.petName || student.petName, { required: false });
  if (!petNameValidation.ok) return { ok: false, error: petNameValidation.error };
  const now = new Date();
  const row = {
    postId: String(existingWall.postId || post.postId || Utilities.getUuid()),
    studentId: studentId,
    studentName: String(post.studentName || student.studentName || studentId).trim(),
    message: message,
    petType: String(post.petType || student.petType || '').trim(),
    petName: petNameValidation.name,
    petRarity: String(post.petRarity || student.petRarity || '').trim(),
    petLevel: String(post.petLevel || student.petLevel || '').trim(),
    combatPower: Number(post.combatPower || 0),
    petImage: String(post.petImage || '').trim(),
    petStats: stringifyJsonField_(sanitizePetStats_(post.petStats), {}),
    equipment: stringifyJsonField_(sanitizeWallEquipment_(post.equipment), []),
    likedBy: stringifyJsonField_([], []),
    comments: stringifyJsonField_([], []),
    createdAt: existingWall.createdAt || now,
    updatedAt: now
  };
  const rowValues = HEADERS.MessageWall.map(function(header) {
    return Object.prototype.hasOwnProperty.call(row, header) ? row[header] : '';
  });

  if (existingWallRow) wallSheet.getRange(existingWallRow, 1, 1, HEADERS.MessageWall.length).setValues([rowValues]);
  else wallSheet.appendRow(rowValues);
  return { ok: true, post: postFromWallRow_(row) };
}

function likeWallPost_(payload) {
  const postId = String(payload.postId || '').trim();
  const studentId = normalizeId_(payload.studentId);
  if (!postId || !studentId) return { ok: false, error: 'Missing post or student' };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.messageWall);
  const rowNumber = findRowByValue_(sheet, 1, postId);
  if (!rowNumber) return { ok: false, error: 'Wall post not found' };

  const values = sheet.getRange(rowNumber, 1, 1, HEADERS.MessageWall.length).getValues()[0];
  const row = rowToObject_(HEADERS.MessageWall, values);
  const likedBy = parseJsonField_(row.likedBy, []).map(normalizeId_).filter(Boolean);
  const existingIndex = likedBy.indexOf(studentId);
  if (existingIndex >= 0) likedBy.splice(existingIndex, 1);
  else likedBy.push(studentId);
  row.likedBy = stringifyJsonField_(Array.from(new Set(likedBy)), []);
  sheet.getRange(rowNumber, headerColumn_(HEADERS.MessageWall, 'likedBy')).setValue(row.likedBy);
  return { ok: true, post: postFromWallRow_(row) };
}

function commentWallPost_(payload) {
  const postId = String(payload.postId || '').trim();
  const comment = payload.comment || {};
  const studentId = normalizeId_(comment.studentId);
  const textValidation = validateWallCommentText_(comment.text, { required: true });
  const text = textValidation.text;
  if (!postId || !studentId || !textValidation.ok) return { ok: false, error: textValidation.error || 'Missing post, student or comment' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const studentSheet = ss.getSheetByName(SHEET_NAMES.students);
  const studentRow = findRowByValue_(studentSheet, 1, studentId);
  if (!studentRow) return { ok: false, error: 'Student ID not found' };
  const studentValues = studentSheet.getRange(studentRow, 1, 1, HEADERS.Students.length).getValues()[0];
  const student = rowToObject_(HEADERS.Students, studentValues);

  const sheet = ss.getSheetByName(SHEET_NAMES.messageWall);
  const rowNumber = findRowByValue_(sheet, 1, postId);
  if (!rowNumber) return { ok: false, error: 'Wall post not found' };

  const values = sheet.getRange(rowNumber, 1, 1, HEADERS.MessageWall.length).getValues()[0];
  const row = rowToObject_(HEADERS.MessageWall, values);
  const comments = parseJsonField_(row.comments, []);
  const now = new Date();
  comments.push({
    commentId: String(comment.commentId || Utilities.getUuid()),
    studentId: studentId,
    studentName: String(comment.studentName || student.studentName || studentId).trim(),
    petName: String(comment.petName || student.petName || studentId).trim(),
    text: text,
    createdAt: now
  });
  row.comments = stringifyJsonField_(comments, []);
  sheet.getRange(rowNumber, headerColumn_(HEADERS.MessageWall, 'comments')).setValue(row.comments);
  return { ok: true, post: postFromWallRow_(row) };
}

function postFromWallRow_(row) {
  const likedBy = parseJsonField_(row.likedBy, []);
  const comments = parseJsonField_(row.comments, []);
  const petStats = parseJsonField_(row.petStats, {});
  const equipment = parseJsonField_(row.equipment, []);
  return {
    postId: String(row.postId || ''),
    studentId: normalizeId_(row.studentId),
    studentName: String(row.studentName || row.studentId || '同学'),
    message: sanitizeWallPreset_(row.message, WALL_POST_PRESETS) || WALL_POST_PRESETS[0],
    petType: String(row.petType || ''),
    petName: String(row.petName || ''),
    petRarity: String(row.petRarity || ''),
    petLevel: String(row.petLevel || ''),
    combatPower: Number(row.combatPower || 0),
    petImage: String(row.petImage || ''),
    petStats: sanitizePetStats_(petStats),
    equipment: sanitizeWallEquipment_(equipment),
    likedBy: Array.isArray(likedBy) ? likedBy.map(normalizeId_).filter(Boolean) : [],
    comments: Array.isArray(comments) ? comments.map(function(comment) {
      return {
        commentId: String(comment.commentId || ''),
        studentId: normalizeId_(comment.studentId),
        studentName: String(comment.studentName || comment.studentId || '同学'),
        petName: String(comment.petName || comment.studentName || comment.studentId || '同学'),
        text: sanitizeWallCommentText_(comment.text) || WALL_COMMENT_PRESETS[0],
        createdAt: comment.createdAt || ''
      };
    }) : [],
    createdAt: row.createdAt || '',
    updatedAt: row.updatedAt || row.createdAt || ''
  };
}

function sanitizeWallPreset_(value, presets) {
  const text = String(value || '').trim();
  return presets.indexOf(text) >= 0 ? text : '';
}

function sanitizeWallCommentText_(value) {
  const validation = validateWallCommentText_(value, { required: false });
  return validation.ok ? validation.text : '';
}

function sanitizePetStats_(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return ['hp', 'attack', 'defense', 'speed', 'luck'].reduce(function(result, key) {
    result[key] = Math.max(0, Number(source[key] || 0));
    return result;
  }, {});
}

function sanitizeWallEquipment_(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 6).map(function(item) {
    return {
      itemId: String(item && item.itemId || '').trim(),
      name: String(item && item.name || '').trim(),
      slotLabel: String(item && item.slotLabel || '').trim(),
      image: String(item && item.image || '').trim()
    };
  }).filter(function(item) { return item.name; });
}

function getWallTime_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) return value.getTime();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function headerColumn_(headers, header) {
  return headers.indexOf(header) + 1;
}

function applyCheckinReward_(ss, studentSheet, studentRow, record, studentId) {
  const current = studentSheet.getRange(studentRow, 9, 1, 6).getValues()[0];
  const currentLevel = Number(current[0] || 1);
  const currentExperience = Number(current[1] || 0);
  const currentCoins = Number(current[2] || 0);
  const currentStars = Number(current[3] || 0);
  const currentStreak = Number(current[4] || 0);
  const lastCheckinDate = normalizeDateKey_(current[5]);
  const recordDate = normalizeDateKey_(record.date);
  const nextExperience = currentExperience + Number(record.experienceEarned || 0);
  const nextCoins = currentCoins + Number(record.coinsEarned || 0);
  const nextStars = currentStars + Number(record.totalStars || 0);
  let nextStreak = currentStreak;
  let nextLastCheckinDate = lastCheckinDate;

  if (recordDate && lastCheckinDate !== recordDate && isCompleteStudyDay_(ss, studentId, recordDate)) {
    nextStreak = lastCheckinDate === getPreviousDateKey_(recordDate) ? currentStreak + 1 : 1;
    nextLastCheckinDate = recordDate;
  }

  const nextLevel = Math.max(currentLevel, Math.floor(nextExperience / 100) + 1);
  studentSheet.getRange(studentRow, 9, 1, 6).setValues([[nextLevel, nextExperience, nextCoins, nextStars, nextStreak, nextLastCheckinDate]]);
}

function isCompleteStudyDay_(ss, studentId, dateKey) {
  const requiredSubjects = ['华文', '马来文', '英文', '数学', '科学'];
  const records = getSheetObjects_(ss.getSheetByName(SHEET_NAMES.checkins), HEADERS.DailyCheckins)
    .filter(function(row) { return normalizeId_(row.studentId) === normalizeId_(studentId) && normalizeDateKey_(row.date) === dateKey; });
  const completedSubjects = records.reduce(function(set, row) {
    set[String(row.subject || '').trim()] = true;
    return set;
  }, {});
  return requiredSubjects.every(function(subject) { return completedSubjects[subject]; });
}

function getStudentSummary_(studentSheet, studentId, classInfo) {
  const row = getCachedStudentRow_(studentSheet, studentId);
  if (!row) return null;
  const values = studentSheet.getRange(row, 1, 1, HEADERS.Students.length).getValues()[0];
  const student = rowToObject_(HEADERS.Students, values);
  return {
    studentId: normalizeId_(student.studentId),
    studentName: student.studentName,
    name: student.studentName,
    branch: student.branch || classInfo.branch || '',
    className: classInfo.className || student.classNameLegacy || '',
    avatar: student.avatar || '👤',
    petName: student.petName || '',
    petType: student.petType || '',
    petRarity: student.petRarity || 'A',
    petLevel: Number(student.petLevel || 1),
    experience: Number(student.experience || 0),
    coins: Number(student.coins || 0),
    totalStars: Number(student.totalStars || 0),
    streak: Number(student.streak || 0),
    lastCheckinDate: normalizeDateKey_(student.lastCheckinDate),
    status: student.status || 'active'
  };
}

function ensureSheets_() {
  const cache = CacheService.getScriptCache();
  if (cache.get(SCHEMA_CACHE_KEY) === 'ready') return;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(HEADERS).forEach(function(name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    ensureSheetHeaders_(sheet, HEADERS[name]);
  });
  cache.put(SCHEMA_CACHE_KEY, 'ready', 21600);
}

function ensureSheetHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }
  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  let changed = false;
  const nextHeaders = headers.map(function(header, index) {
    const current = String(currentHeaders[index] || '').trim();
    if (current) return currentHeaders[index];
    changed = true;
    return header;
  });
  if (changed) sheet.getRange(1, 1, 1, headers.length).setValues([nextHeaders]);
}

function setupSheets() {
  CacheService.getScriptCache().remove(SCHEMA_CACHE_KEY);
  CacheService.getScriptCache().remove(CLASS_LOOKUP_CACHE_KEY);
  ensureSheets_();
  return 'Sheets ready: ' + Object.keys(HEADERS).join(', ');
}

function getCachedStudentRow_(sheet, studentId) {
  studentId = normalizeId_(studentId);
  if (!sheet || !studentId) return 0;
  const cache = CacheService.getScriptCache();
  const cacheKey = STUDENT_ROW_CACHE_PREFIX + studentId;
  const cachedRow = Number(cache.get(cacheKey) || 0);
  if (cachedRow > 1) {
    const currentId = normalizeId_(sheet.getRange(cachedRow, 1).getDisplayValue());
    if (currentId === studentId) return cachedRow;
  }
  const row = findRowByValue_(sheet, 1, studentId);
  if (row) cache.put(cacheKey, String(row), 21600);
  return row;
}

function getCachedWallRowByStudent_(sheet, studentId) {
  studentId = normalizeId_(studentId);
  if (!sheet || !studentId) return 0;
  const cache = CacheService.getScriptCache();
  const cacheKey = WALL_ROW_CACHE_PREFIX + studentId;
  const studentIdColumn = headerColumn_(HEADERS.MessageWall, 'studentId');
  const cachedRow = Number(cache.get(cacheKey) || 0);
  if (cachedRow > 1) {
    const currentId = normalizeId_(sheet.getRange(cachedRow, studentIdColumn).getDisplayValue());
    if (currentId === studentId) return cachedRow;
  }
  const row = findRowByValue_(sheet, studentIdColumn, studentId);
  if (row) cache.put(cacheKey, String(row), 21600);
  return row;
}

function getClassLookup_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(CLASS_LOOKUP_CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      cache.remove(CLASS_LOOKUP_CACHE_KEY);
    }
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const classes = getSheetObjects_(ss.getSheetByName(SHEET_NAMES.classes), HEADERS.Classes);
  const memberships = getSheetObjects_(ss.getSheetByName(SHEET_NAMES.classStudents), HEADERS.ClassStudents);
  const classesById = {};
  const classesByStudent = {};
  const studentsByClass = {};
  const classCounts = {};

  classes.forEach(function(classInfo) {
    const classId = normalizeId_(classInfo.classId);
    if (classId) classesById[classId] = Object.assign({}, classInfo, { classId: classId });
  });

  memberships.forEach(function(membership) {
    if (String(membership.status || 'active') === 'removed') return;
    const classId = normalizeId_(membership.classId);
    const studentId = normalizeId_(membership.studentId);
    if (!classId || !studentId) return;
    const classInfo = classesById[classId] || { classId: classId, status: 'missing' };
    if (!classesByStudent[studentId]) classesByStudent[studentId] = [];
    if (!studentsByClass[classId]) studentsByClass[classId] = [];
    classesByStudent[studentId].push(classInfo);
    studentsByClass[classId].push(studentId);
    classCounts[classId] = (classCounts[classId] || 0) + 1;
  });

  const lookup = { classes: classes, classesById: classesById, classesByStudent: classesByStudent, studentsByClass: studentsByClass, classCounts: classCounts };
  cache.put(CLASS_LOOKUP_CACHE_KEY, JSON.stringify(lookup), 1800);
  return lookup;
}

function invalidateClassLookupCache_() {
  CacheService.getScriptCache().remove(CLASS_LOOKUP_CACHE_KEY);
}

function normalizeId_(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeEvolutionStyle_(value) {
  const style = String(value || '').trim();
  return style === 'cute' || style === 'heroic' ? style : '';
}

function parseJsonField_(value, fallback) {
  if (value == null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function stringifyJsonField_(value, fallback) {
  const candidate = value == null || value === '' ? fallback : value;
  return JSON.stringify(candidate == null ? fallback : candidate);
}

function appendPurchaseLedger_(ss, studentId, event, now) {
  const type = String(event && event.type || '');
  if (['purchasePet', 'purchaseItem'].indexOf(type) === -1) return;
  const itemId = String(event.itemId || event.petId || '').trim();
  if (!itemId) return;
  ss.getSheetByName(SHEET_NAMES.ledger).appendRow([Utilities.getUuid(), studentId, itemId, Number(event.price || 0), now]);
}

function normalizeDateKey_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const text = String(value).trim();
  const match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (!match) return text;
  return match[1] + '-' + String(match[2]).padStart(2, '0') + '-' + String(match[3]).padStart(2, '0');
}

function getPreviousDateKey_(dateKey) {
  const parts = normalizeDateKey_(dateKey).split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return '';
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() - 1);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function getSheetObjects_(sheet, headers) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues().map(function(values) {
    return rowToObject_(headers, values);
  });
}

function findRowByValue_(sheet, column, value) {
  if (!sheet || sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getDisplayValues();
  for (let i = 0; i < values.length; i += 1) {
    if (String(values[i][0]).trim() === String(value).trim()) return i + 2;
  }
  return 0;
}

function rowToObject_(headers, values) {
  return headers.reduce(function(result, header, index) {
    result[header] = values[index];
    return result;
  }, {});
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value, null, 2)).setMimeType(ContentService.MimeType.JSON);
}
