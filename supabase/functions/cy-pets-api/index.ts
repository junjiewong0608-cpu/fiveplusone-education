const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const CY_PETS_PUBLIC_FUNCTION_KEY = 'YOUR_PUBLIC_FUNCTION_KEY';
const TEACHER_ADMIN_IDS = new Set(['CY0000']);
const TEACHER_REWARD_ADMIN_IDS = new Set(['CY0000', 'CY0001']);
const TEACHER_DAILY_REWARD_LIMIT = 999999;
const TEACHER_MANAGED_DAILY_REWARD_LIMIT = 999999;
const BULK_IMPORT_MAX_ROWS = 500;
const ROOM_MEMBER_LIMIT = 10;
const ROOM_MEMBERSHIP_LIMIT = 3;
const INTERACTION_ROOM_DEFAULT_MEMBER_LIMIT = 10;
const INTERACTION_ROOM_MAX_MEMBER_LIMIT = 30;
const WALL_POST_RETENTION_DAYS = 30;
const INTERACTION_ROOM_STALE_SECONDS = 180;
const INTERACTION_MESSAGE_DURATION_MS = 10000;
const INTERACTION_ROOM_MAP_SET_IDS = new Set(['cy-town', 'cy-bay', 'tokyo-night', 'kl-pavilion-night', 'sunset-farm', 'movie-park', 'cy-school', 'paris-trip', 'xian-trip', 'beijing-trip', 'usa-trip', 'uk-trip']);
const PERMANENT_INTERACTION_ROOMS = [
  {
    roomId: 'MKPRIMARY',
    roomName: '5+1 智慧总院',
    ownerStudentId: '510000',
    ownerName: '5+1教育补习中心',
    mapSetId: 'paris-trip',
    memberLimit: 30
  },
  {
    roomId: 'STPPRIMARY',
    roomName: '5+1 旗舰校区',
    ownerStudentId: '510000',
    ownerName: '5+1教育补习中心',
    mapSetId: 'xian-trip',
    memberLimit: 30
  },
  {
    roomId: 'CYMEET2026',
    roomName: '5+1 教师研讨室',
    ownerStudentId: '510000',
    ownerName: '5+1教育补习中心',
    mapSetId: 'cy-school',
    memberLimit: 30
  },
  {
    roomId: 'WSPRIMARY',
    roomName: '5+1 菁英校区',
    ownerStudentId: '510000',
    ownerName: '5+1教育补习中心',
    mapSetId: 'uk-trip',
    memberLimit: 30
  },
  {
    roomId: 'LEARNERS2026',
    roomName: "5+1 荣耀研习社",
    ownerStudentId: '510000',
    ownerName: '5+1教育补习中心',
    mapSetId: 'beijing-trip',
    memberLimit: 30
  }
];
const MUSIC_BOX_TRACK_PRICE = 280;
const MUSIC_BOX_GIFT_TRACK_IDS = new Set([
  'popmart-song',
  'labubu-summer-pop',
  'marvel-the-avengers',
  'marvel-sunflower-spider-verse',
  'the-avengers',
  'sunflower-spider-verse',
  'aot-akuma-no-ko',
  'aot-call-of-silence',
  'aot-shinzou-wo-sasageyo',
  'demon-slayer-gurenge',
  'demon-slayer-homura',
  'demon-slayer-infinity-castle-theme',
  'demon-slayer-kamado-tanjiro-no-uta',
  'one-piece-we-are',
  'one-piece-very-very-very-strongest',
  'overlord-hollow-hunger',
  'overlord-clattanoia',
  'pokemon-gym-leader',
  'pokemon-zinnia',
  'sanrio-chu-chu',
  'cinnamoroll-kawaii',
  'kuromi-greedy',
  'minecraft-sweden',
  'minecraft-aria-math',
  'minecraft-subwoofer-lullaby',
  'blackpink-how-you-like-that',
  'blackpink-kill-this-love',
  'blackpink-ddu-du-ddu-du',
  'bigbang-fantastic-baby',
  'bigbang-blue',
  'bigbang-lets-not-fall-in-love',
  'bigbang-bang-bang-bang',
  'bigbang-haru-haru',
  'bts-butter',
  'bts-dynamite',
  'bts-boy-with-luv',
  'cortis-fashion',
  'cortis-go',
  'cortis-redred',
  'cortis-what-you-want',
  'ive-love-dive',
  'ive-after-like',
  'seventeen-super',
  'seventeen-hot',
  'seventeen-very-nice',
  'stray-kids-maniac',
  'stray-kids-s-class',
  'stray-kids-gods-menu',
  'treasure-boy',
  'treasure-going-crazy',
  'treasure-i-love-you',
  'treasure-jikjin',
  'twice-cheer-up',
  'twice-fancy',
  'twice-tt',
  'hachimi-beauty-and-hachimi',
  'hachimi-call-of-silence',
  'hachimi-wake-up',
  'hachimi-da-huo-ji',
  'hachimi-daily-hachimi'
]);

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

const BAD_PUBLIC_TEXT_WORDS = [
  '粗口', '坏话', '笨蛋', '白痴', '神经病', '垃圾', '去死', '色情', '裸', '毒品', 'sex',
  '傻逼', '傻b', '伞兵', '鲨比', '萨比', '虾哔', 'shabi', 'sb',
  '操你妈', '草泥马', '曹尼玛', '查理马', '吵泥马', '艹', 'cnm', 'caonima',
  '卧槽', '我操', '我草', '握草', '哇擦', '挖槽', 'woc', 'wocao', 'cao',
  '他妈的', '你妈的', '特么的', '踏马的', '尼玛', '泥马', 'tmd', 'nmd', 'tamade',
  '你妈死了', 'nmsl', '妈的智障', '玛德智障', 'mdzz',
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

const MODERATION_REPLACEMENTS: Record<string, string> = {
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

type JsonRecord = Record<string, unknown>;
type InteractionProfileResult =
  | {
      ok: true;
      studentId: string;
      studentName: string;
      petId: string;
      petName: string;
      petStage: string;
      petStyle: string;
    }
  | {
      ok: false;
      error: string;
      errorCode?: string;
      fallbackAllowed?: boolean;
    };

function json(payload: JsonRecord, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json;charset=utf-8' }
  });
}

const CANONICAL_STUDENT_ID_MAP: Record<string, string> = Object.freeze({
  CY2223: 'CY0002',
  CY5305: 'CY0012',
  CY9657: 'CY0005',
  CY1006: 'CY0006',
  CY1003: 'CY0003',
  CY1004: 'CY0004',
  CY1007: 'CY0017',
  CY1008: 'CY0011',
  CY1009: 'CY0012',
  CY1010: 'CY0014',
  CY1019: 'CY0004',
  CY5678: 'CY0016',
  CY8868: 'CY0015',
  ET2322: 'CY0000',
  CY4257: 'FPO4257'
});

const CANONICAL_STUDENT_NAME_MAP: Record<string, string> = Object.freeze({
  CY0005: 'Student A',
  CY0006: 'Student B',
  CY0003: 'Teacher C',
  CY0004: 'Teacher D',
  CY0017: 'Student C',
  CY0011: 'Teacher E',
  CY0012: 'Teacher J',
  CY0002: 'Teacher B',
  CY0013: 'Teacher F',
  CY0014: 'Teacher G'
});

function normalizeId(value: unknown) {
  const id = String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return CANONICAL_STUDENT_ID_MAP[id] || id;
}

function getCanonicalStudentName(studentId: unknown, fallback: unknown = '', options: { allowCustom?: boolean } = {}) {
  const id = normalizeId(studentId);
  const customName = String(fallback || '').trim();
  if (options.allowCustom && customName && customName !== id) return customName;
  return CANONICAL_STUDENT_NAME_MAP[id] || String(fallback || '').trim() || id;
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeModerationText(value: unknown) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[01345789@$!|]/g, char => MODERATION_REPLACEMENTS[char] || char)
    .replace(/[\u200b-\u200f\ufeff]/g, '')
    .replace(/[\s._\-*~`@#%^&()+=[\]{}\\:;"'<>,.?/，。？！、；：（）【】《》「」『』]/g, '');
}

function validatePublicText(text: unknown, maxLength: number) {
  const trimmed = String(text || '').trim().replace(/\s+/g, ' ');
  if (!trimmed) return { ok: false, text: '', error: '内容不能为空。' };
  if (trimmed.length > maxLength) return { ok: false, text: trimmed, error: `内容最多 ${maxLength} 个字。` };
  const normalized = normalizeModerationText(trimmed);
  const hasBadWord = BAD_PUBLIC_TEXT_WORDS.some(word => normalized.includes(normalizeModerationText(word)));
  if (hasBadWord) return { ok: false, text: trimmed, error: '内容里有不适合公开展示的词，请换一句积极一点的话。' };
  return { ok: true, text: trimmed, error: '' };
}

function getWallRetentionCutoffIso() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - WALL_POST_RETENTION_DAYS);
  return cutoff.toISOString();
}

function getSupabaseConfig() {
  const url = Deno.env.get('SUPABASE_URL') || '';
  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS');
  const secretKey = (() => {
    if (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    if (!secretKeys) return '';
    try {
      return JSON.parse(secretKeys).default || '';
    } catch (error) {
      return '';
    }
  })();
  if (!url || !secretKey) {
    throw Object.assign(new Error('Supabase 环境变量还没有设置。'), { errorCode: 'SUPABASE_NOT_CONFIGURED', fallbackAllowed: true });
  }
  return { url, secretKey };
}

function getAllowedPublicKeys() {
  const keys = new Set<string>([CY_PETS_PUBLIC_FUNCTION_KEY]);
  const legacyAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (legacyAnonKey) keys.add(legacyAnonKey);
  const publishableKeys = Deno.env.get('SUPABASE_PUBLISHABLE_KEYS');
  if (publishableKeys) {
    try {
      Object.values(JSON.parse(publishableKeys)).forEach(value => {
        if (typeof value === 'string' && value) keys.add(value);
      });
    } catch (error) {
      // Hosted Supabase always provides valid JSON; ignore malformed local env.
    }
  }
  return keys;
}

function authorizeRequest(request: Request) {
  const allowedKeys = getAllowedPublicKeys();
  if (!allowedKeys.size) return true;
  const apiKey = request.headers.get('apikey') || '';
  const bearer = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  return allowedKeys.has(apiKey) || allowedKeys.has(bearer);
}

function isSupabaseRestRetryableError(status: number, text = '') {
  return status >= 500 || status === 429 || /PGRST303|JWT issued at future/i.test(text);
}

async function supabaseRequest(path: string, options: { method?: string; body?: unknown; prefer?: string } = {}) {
  const { url, secretKey } = getSupabaseConfig();
  const headers: Record<string, string> = {
    apikey: secretKey,
    'Content-Type': 'application/json',
    ...(options.prefer ? { Prefer: options.prefer } : {})
  };
  if (!secretKey.startsWith('sb_secret_')) headers.Authorization = `Bearer ${secretKey}`;
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body == null ? undefined : JSON.stringify(options.body)
  });
  const text = await response.text();
  if (!response.ok) {
    throw Object.assign(new Error(text || `Supabase REST ${response.status}`), { status: response.status, retryable: isSupabaseRestRetryableError(response.status, text) });
  }
  return text ? JSON.parse(text) : null;
}

function toStudentRow(student: JsonRecord, studentId: string) {
  return {
    student_id: studentId,
    student_name: getCanonicalStudentName(studentId, student.studentName || student.name || studentId, {
      allowCustom: Boolean(String(student.profileNameUpdatedAt || '').trim())
    }),
    branch: String(student.branch || ''),
    class_name: String(student.className || student.classNameLegacy || ''),
    teacher_id: normalizeId(student.teacherId || student.teacher_id || ''),
    avatar: String(student.avatar || '🌟'),
    status: String(student.status || 'active')
  };
}

function toGameStateRow(student: JsonRecord, studentId: string) {
  const miniGameHighScores = mergeMiniGameHighScores({}, student.miniGameHighScores || student.mini_game_scores);
  return {
    student_id: studentId,
    state: { ...student, studentId, miniGameHighScores },
    coins: Math.max(0, Math.floor(toNumber(student.coins, 0))),
    total_stars: Math.max(0, Math.floor(toNumber(student.totalStars, 0)))
  };
}

const EQUIPMENT_REPLACEMENT_EVENTS = new Set(['equipItem', 'unequipItem', 'purchaseAndEquipItem', 'switchPet']);
const EVOLUTION_STAGE_RANK: Record<string, number> = { base: 0, mini: 1, final: 2 };
const DEFAULT_MUSIC_TRACK_ID = 'cy-pets-theme';
const PET_EVOLUTION_FORM_ORIGINAL = 'original';
const PET_EVOLUTION_FORM_MINI = 'mini';
const EVOLUTION_STYLE_CUTE = 'cute';
const EVOLUTION_STYLE_HEROIC = 'heroic';
const PET_EVOLUTION_FORM_OPTIONS = [PET_EVOLUTION_FORM_ORIGINAL, PET_EVOLUTION_FORM_MINI, EVOLUTION_STYLE_CUTE, EVOLUTION_STYLE_HEROIC];
const CUTE_ONLY_FINAL_EVOLUTION_PET_IDS = new Set([
  'crybaby',
  'hacipupu',
  'labubu',
  'skullpanda',
  'twinkle-twinkle',
  'kuromi',
  'my-melody',
  'cinnamoroll',
  'pochacco',
  'hello-kitty'
]);

function isPlainRecord(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizePetEvolutionForm(value: unknown) {
  const form = String(value || '').trim();
  return PET_EVOLUTION_FORM_OPTIONS.includes(form) ? form : '';
}

function petSupportsHeroicEvolution(petType: unknown) {
  const petId = String(petType || '').trim().toLowerCase();
  return Boolean(!petId || !CUTE_ONLY_FINAL_EVOLUTION_PET_IDS.has(petId));
}

function getFinalPetEvolutionForms(petType: unknown) {
  return petSupportsHeroicEvolution(petType)
    ? [EVOLUTION_STYLE_CUTE, EVOLUTION_STYLE_HEROIC]
    : [EVOLUTION_STYLE_CUTE];
}

function getAvailablePetEvolutionForms(petType: unknown) {
  return [
    PET_EVOLUTION_FORM_ORIGINAL,
    PET_EVOLUTION_FORM_MINI,
    ...getFinalPetEvolutionForms(petType)
  ];
}

function normalizePetEvolutionFormForPet(value: unknown, petType: unknown) {
  const form = normalizePetEvolutionForm(value);
  if (form === EVOLUTION_STYLE_HEROIC && !petSupportsHeroicEvolution(petType)) return EVOLUTION_STYLE_CUTE;
  return form;
}

function isFinalPetEvolutionForm(form: unknown) {
  return form === EVOLUTION_STYLE_CUTE || form === EVOLUTION_STYLE_HEROIC;
}

function mergeUnlockedPetEvolutionForms(existingValue: unknown, incomingValue: unknown, mergedRecord: JsonRecord = {}, petId: unknown = '') {
  const forms = new Set<string>([PET_EVOLUTION_FORM_ORIGINAL]);
  [existingValue, incomingValue, mergedRecord.unlockedForms].forEach(value => {
    if (!Array.isArray(value)) return;
    value.map(form => normalizePetEvolutionFormForPet(form, petId)).filter(Boolean).forEach(form => forms.add(form));
  });
  if (mergedRecord.miniEvolved) forms.add(PET_EVOLUTION_FORM_MINI);
  const style = normalizePetEvolutionFormForPet(mergedRecord.evolutionStyle, petId);
  if (mergedRecord.evolved && isFinalPetEvolutionForm(style)) forms.add(style);
  return getAvailablePetEvolutionForms(petId).filter(form => forms.has(form));
}

function getFallbackPetEvolutionForm(unlockedForms: unknown, mergedRecord: JsonRecord = {}, petId: unknown = '') {
  const forms = Array.isArray(unlockedForms)
    ? unlockedForms.map(form => normalizePetEvolutionFormForPet(form, petId)).filter(Boolean)
    : [PET_EVOLUTION_FORM_ORIGINAL];
  const activeCandidates = [
    normalizePetEvolutionFormForPet(mergedRecord.activeEvolutionForm, petId),
    normalizePetEvolutionFormForPet(mergedRecord.selectedEvolutionForm, petId),
    normalizePetEvolutionFormForPet(mergedRecord.evolutionStyle, petId)
  ];
  const active = activeCandidates.find(form => form && forms.includes(form));
  if (active) return active;
  const finalForm = getFinalPetEvolutionForms(petId).find(form => forms.includes(form));
  if (finalForm) return finalForm;
  if (forms.includes(PET_EVOLUTION_FORM_MINI)) return PET_EVOLUTION_FORM_MINI;
  return PET_EVOLUTION_FORM_ORIGINAL;
}

function uniqueStringList(...lists: unknown[]) {
  const values = new Set<string>();
  lists.forEach(list => {
    if (!Array.isArray(list)) return;
    list.map(item => String(item || '').trim()).filter(Boolean).forEach(item => values.add(item));
  });
  return Array.from(values);
}

function hasAnyRecordValue(value: unknown) {
  return Boolean(isPlainRecord(value) && Object.keys(value).length);
}

function mergeEquippedItems(existingValue: unknown, incomingValue: unknown, eventType: string) {
  const existing = isPlainRecord(existingValue) ? existingValue : {};
  const incoming = isPlainRecord(incomingValue) ? incomingValue : {};
  if (EQUIPMENT_REPLACEMENT_EVENTS.has(eventType)) return { ...incoming };
  if (hasAnyRecordValue(existing) && !hasAnyRecordValue(incoming)) return { ...existing };
  return { ...existing, ...incoming };
}

function strongerEvolutionStage(first: unknown, second: unknown) {
  const firstStage = String(first || '');
  const secondStage = String(second || '');
  return (EVOLUTION_STAGE_RANK[secondStage] || 0) > (EVOLUTION_STAGE_RANK[firstStage] || 0) ? secondStage : firstStage;
}

function mergePetRecord(existingValue: unknown, incomingValue: unknown, eventType: string, petId: string) {
  const existing = isPlainRecord(existingValue) ? existingValue : {};
  const incoming = isPlainRecord(incomingValue) ? incomingValue : {};
  const merged: JsonRecord = {
    ...existing,
    ...incoming,
    petId: String(incoming.petId || existing.petId || petId),
    ownedItems: uniqueStringList(existing.ownedItems, incoming.ownedItems),
    equippedItems: mergeEquippedItems(existing.equippedItems, incoming.equippedItems, eventType),
    miniEvolved: Boolean(existing.miniEvolved || incoming.miniEvolved),
    evolved: Boolean(existing.evolved || incoming.evolved),
    evolutionStage: strongerEvolutionStage(existing.evolutionStage, incoming.evolutionStage)
  };
  merged.needsNaming = eventType === 'renameGiftedPet'
    ? Boolean(incoming.needsNaming)
    : Boolean(existing.needsNaming || incoming.needsNaming);
  if (merged.evolved) merged.evolutionStage = 'final';
  if (merged.miniEvolved && !merged.evolutionStage) merged.evolutionStage = 'mini';
  if (String(existing.evolutionStyle || '') && !String(incoming.evolutionStyle || '')) merged.evolutionStyle = existing.evolutionStyle;
  const unlockedForms = mergeUnlockedPetEvolutionForms(existing.unlockedEvolutionForms, incoming.unlockedEvolutionForms, merged, petId);
  merged.unlockedEvolutionForms = unlockedForms;
  merged.unlockedForms = unlockedForms;
  merged.activeEvolutionForm = getFallbackPetEvolutionForm(unlockedForms, {
    ...merged,
    activeEvolutionForm: incoming.activeEvolutionForm || incoming.selectedEvolutionForm || existing.activeEvolutionForm || existing.selectedEvolutionForm
  }, petId);
  if (unlockedForms.includes(PET_EVOLUTION_FORM_MINI)) merged.miniEvolved = true;
  if (unlockedForms.some(isFinalPetEvolutionForm)) {
    merged.evolved = true;
    merged.evolutionStage = 'final';
  }
  if (isFinalPetEvolutionForm(merged.activeEvolutionForm)) merged.evolutionStyle = normalizePetEvolutionFormForPet(merged.activeEvolutionForm, petId);
  if (toNumber(existing.petLevel, 0) > toNumber(incoming.petLevel, 0)) merged.petLevel = existing.petLevel;
  if (toNumber(existing.experience, 0) > toNumber(incoming.experience, 0)) merged.experience = existing.experience;
  return merged;
}

function mergePetCollection(existingValue: unknown, incomingValue: unknown, eventType: string) {
  const existing = isPlainRecord(existingValue) ? existingValue : {};
  const incoming = isPlainRecord(incomingValue) ? incomingValue : {};
  const merged: JsonRecord = {};
  Array.from(new Set([...Object.keys(existing), ...Object.keys(incoming)])).forEach(petId => {
    merged[petId] = mergePetRecord(existing[petId], incoming[petId], eventType, petId);
  });
  return merged;
}

function mergeEvolvedPets(existingValue: unknown, incomingValue: unknown) {
  const existing = isPlainRecord(existingValue) ? existingValue : {};
  const incoming = isPlainRecord(incomingValue) ? incomingValue : {};
  const merged: JsonRecord = { ...incoming };
  Object.keys(existing).forEach(petId => {
    if (existing[petId]) merged[petId] = true;
  });
  return merged;
}

function mergePetRoomDecorations(existingValue: unknown, incomingValue: unknown, eventType: string) {
  const existing = Array.isArray(existingValue) ? existingValue : [];
  const incoming = Array.isArray(incomingValue) ? incomingValue : [];
  if (eventType === 'placePetFurniture' || eventType === 'removePetFurniture') return incoming.slice(0, 30);
  return incoming.length ? incoming.slice(0, 30) : existing.slice(0, 30);
}

function mergeMiniGameHighScores(existingValue: unknown, incomingValue: unknown) {
  const existing = isPlainRecord(existingValue) ? existingValue : {};
  const incoming = isPlainRecord(incomingValue) ? incomingValue : {};
  const readScore = (source: JsonRecord, key: string, alias: string) => Math.max(
    0,
    Math.floor(toNumber(source[key], toNumber(source[alias], 0)))
  );
  return {
    reaction: Math.max(readScore(existing, 'reaction', 'wheel'), readScore(incoming, 'reaction', 'wheel')),
    flappy: Math.max(readScore(existing, 'flappy', 'jump'), readScore(incoming, 'flappy', 'jump')),
    runner: Math.max(readScore(existing, 'runner', 'run'), readScore(incoming, 'runner', 'run')),
    jumpCharge: Math.max(readScore(existing, 'jumpCharge', 'jump_charge'), readScore(incoming, 'jumpCharge', 'jump_charge'))
  };
}

function getAccountResetMarker(student: JsonRecord | null | undefined) {
  return String(student?.accountResetAt || student?.account_reset_at || '').trim();
}

function isIncomingBeforeAccountReset(existingStudent: JsonRecord, incomingStudent: JsonRecord) {
  const existingResetAt = getAccountResetMarker(existingStudent);
  if (!existingResetAt) return false;
  return getAccountResetMarker(incomingStudent) !== existingResetAt;
}

function isResetPetRestoreAttempt(existingStudent: JsonRecord, incomingStudent: JsonRecord, eventType: string) {
  if (!getAccountResetMarker(existingStudent)) return false;
  if (String(existingStudent.petType || '').trim()) return false;
  if (!String(incomingStudent.petType || '').trim()) return false;
  return eventType !== 'adoptInitialPet';
}

function mergeDurableStudentState(existingStudent: JsonRecord | null, incomingStudent: JsonRecord, event: JsonRecord = {}) {
  if (!existingStudent) {
    return {
      ...incomingStudent,
      miniGameHighScores: mergeMiniGameHighScores({}, incomingStudent.miniGameHighScores || incomingStudent.mini_game_scores)
    };
  }
  const eventType = String(event.type || '');
  if (isIncomingBeforeAccountReset(existingStudent, incomingStudent) || isResetPetRestoreAttempt(existingStudent, incomingStudent, eventType)) {
    return {
      ...existingStudent,
      studentId: normalizeId(existingStudent.studentId || incomingStudent.studentId),
      miniGameHighScores: mergeMiniGameHighScores(existingStudent.miniGameHighScores || existingStudent.mini_game_scores, {})
    };
  }
  const rosterOnlySync = eventType === 'manualSheetSync' || eventType === 'hydrateSupabaseFromSheet';
  const petType = String(incomingStudent.petType || existingStudent.petType || '');
  const petCollection = mergePetCollection(existingStudent.petCollection, incomingStudent.petCollection, eventType);
  const evolvedPets = mergeEvolvedPets(existingStudent.evolvedPets, incomingStudent.evolvedPets);
  const activeRecord = petType && isPlainRecord(petCollection[petType]) ? petCollection[petType] as JsonRecord : null;
  const merged: JsonRecord = {
    ...existingStudent,
    ...incomingStudent,
    ownedPets: uniqueStringList(existingStudent.ownedPets, incomingStudent.ownedPets, petType ? [petType] : []),
    ownedItems: uniqueStringList(existingStudent.ownedItems, incomingStudent.ownedItems, activeRecord?.ownedItems),
    equippedItems: mergeEquippedItems(existingStudent.equippedItems, incomingStudent.equippedItems, eventType),
    petCollection,
    evolvedPets,
    petRoomDecorations: mergePetRoomDecorations(existingStudent.petRoomDecorations, incomingStudent.petRoomDecorations, eventType),
    miniGameHighScores: mergeMiniGameHighScores(existingStudent.miniGameHighScores || existingStudent.mini_game_scores, incomingStudent.miniGameHighScores || incomingStudent.mini_game_scores),
    ownedMusicTracks: uniqueStringList(
      [DEFAULT_MUSIC_TRACK_ID],
      existingStudent.ownedMusicTracks,
      existingStudent.ownedMusicTrackIds,
      existingStudent.owned_music_tracks,
      incomingStudent.ownedMusicTracks,
      incomingStudent.ownedMusicTrackIds,
      incomingStudent.owned_music_tracks
    )
  };
  const incomingActiveMusic = String(incomingStudent.activeMusicTrack || incomingStudent.activeMusicTrackId || incomingStudent.active_music_track || '').trim();
  const existingActiveMusic = String(existingStudent.activeMusicTrack || existingStudent.activeMusicTrackId || existingStudent.active_music_track || '').trim();
  const mergedMusicTracks = Array.isArray(merged.ownedMusicTracks) ? merged.ownedMusicTracks as string[] : [DEFAULT_MUSIC_TRACK_ID];
  merged.activeMusicTrack = incomingActiveMusic && mergedMusicTracks.includes(incomingActiveMusic)
    ? incomingActiveMusic
    : (existingActiveMusic && mergedMusicTracks.includes(existingActiveMusic) ? existingActiveMusic : DEFAULT_MUSIC_TRACK_ID);
  if (activeRecord) {
    merged.ownedItems = uniqueStringList(merged.ownedItems, activeRecord.ownedItems);
    merged.equippedItems = mergeEquippedItems(merged.equippedItems, activeRecord.equippedItems, eventType);
    merged.activeEvolutionForm = getFallbackPetEvolutionForm(activeRecord.unlockedEvolutionForms, {
      activeEvolutionForm: activeRecord.activeEvolutionForm || incomingStudent.activeEvolutionForm || existingStudent.activeEvolutionForm,
      selectedEvolutionForm: activeRecord.selectedEvolutionForm,
      evolutionStyle: activeRecord.evolutionStyle,
      miniEvolved: activeRecord.miniEvolved,
      evolved: activeRecord.evolved
    }, petType);
    if (isFinalPetEvolutionForm(merged.activeEvolutionForm)) {
      activeRecord.evolutionStyle = normalizePetEvolutionFormForPet(merged.activeEvolutionForm, petType);
      merged.evolutionStylePreference = activeRecord.evolutionStyle;
    }
    if (activeRecord.miniEvolved) merged.miniPetEvolved = true;
    if (activeRecord.evolved) merged.petEvolved = true;
  } else {
    merged.activeEvolutionForm = normalizePetEvolutionFormForPet(incomingStudent.activeEvolutionForm || existingStudent.activeEvolutionForm, petType) || PET_EVOLUTION_FORM_ORIGINAL;
  }
  if (rosterOnlySync) {
    if (existingStudent.profileNameUpdatedAt) merged.studentName = existingStudent.studentName;
    if (existingStudent.profileNameUpdatedAt) merged.name = existingStudent.name || existingStudent.studentName;
    if (existingStudent.profileNameUpdatedAt) merged.profileNameUpdatedAt = existingStudent.profileNameUpdatedAt;
    [
      'coins',
      'totalStars',
      'streak',
      'lastCheckinDate',
      'petName',
      'petBirthday',
      'petType',
      'petRarity',
      'petLevel',
      'experience',
      'ownedPets',
      'ownedItems',
      'equippedItems',
      'petCollection',
      'evolvedPets',
      'petRoomDecorations',
      'miniPetEvolved',
      'petEvolved',
      'evolutionStylePreference',
      'activeEvolutionForm',
      'blindBoxes',
      'collectionTitles',
      'drawnCollectionTitle',
      'titleDrawAvailable',
      'titleDrawCompleted',
      'pendingBlindBoxDuplicates'
    ].forEach(key => {
      if (Object.prototype.hasOwnProperty.call(existingStudent, key)) merged[key] = existingStudent[key];
    });
  }
  if (petType && evolvedPets[petType]) merged.petEvolved = true;
  if (existingStudent.petEvolved && String(existingStudent.petType || '') === petType) merged.petEvolved = true;
  if (existingStudent.miniPetEvolved && String(existingStudent.petType || '') === petType) merged.miniPetEvolved = true;
  if (eventType === 'completeNewPlayerGuide') {
    merged.forceNewPlayerGuide = false;
    merged.forceOnboardingTour = false;
    merged.newPlayerGuideEligible = false;
  }
  if (!String(incomingStudent.evolutionStylePreference || '') && String(existingStudent.evolutionStylePreference || '')) {
    merged.evolutionStylePreference = existingStudent.evolutionStylePreference;
  }
  merged.evolutionStylePreference = normalizePetEvolutionFormForPet(merged.evolutionStylePreference, petType) || '';
  merged.activeEvolutionForm = normalizePetEvolutionFormForPet(merged.activeEvolutionForm, petType) || PET_EVOLUTION_FORM_ORIGINAL;
  if (activeRecord && isFinalPetEvolutionForm(activeRecord.evolutionStyle)) {
    activeRecord.evolutionStyle = normalizePetEvolutionFormForPet(activeRecord.evolutionStyle, petType);
  }
  return merged;
}

async function upsertStudentAndState(student: JsonRecord) {
  const studentId = normalizeId(student.studentId);
  if (!studentId) throw new Error('Missing studentId');
  await supabaseRequest('students?on_conflict=student_id', {
    method: 'POST',
    body: toStudentRow(student, studentId),
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  await supabaseRequest('student_game_states?on_conflict=student_id', {
    method: 'POST',
    body: toGameStateRow(student, studentId),
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  return getStudent({ studentId });
}

function fromStudentRows(studentRows: JsonRecord[], stateRows: JsonRecord[]) {
  const roster = studentRows[0];
  const game = stateRows[0];
  if (!roster || !game) return null;
  const state = (game.state && typeof game.state === 'object' && !Array.isArray(game.state)) ? game.state as JsonRecord : {};
  const studentId = normalizeId(roster.student_id);
  const hasCustomProfileName = Boolean(String(state.profileNameUpdatedAt || '').trim());
  const studentNameSource = hasCustomProfileName
    ? (state.studentName || state.name || roster.student_name || studentId)
    : (roster.student_name || state.studentName || state.name || studentId);
  const studentName = getCanonicalStudentName(studentId, studentNameSource, { allowCustom: hasCustomProfileName });
  return {
    ...state,
    studentId,
    studentName,
    name: studentName,
    branch: String(roster.branch || state.branch || ''),
    className: String(roster.class_name || state.className || state.classNameLegacy || ''),
    classNameLegacy: String(roster.class_name || state.classNameLegacy || state.className || ''),
    teacherId: normalizeId(roster.teacher_id || state.teacherId || state.teacher_id || ''),
    avatar: String(roster.avatar || state.avatar || '🌟'),
    status: String(roster.status || state.status || 'active'),
    coins: Math.max(0, Math.floor(toNumber(state.coins, toNumber(game.coins, 0)))),
    totalStars: Math.max(0, Math.floor(toNumber(state.totalStars, toNumber(game.total_stars, 0))))
  };
}

async function listTeacherRewardsForStudent(studentId: string) {
  const normalizedStudentId = normalizeId(studentId);
  if (!normalizedStudentId) return [];
  const rows = await supabaseRequest(`teacher_rewards?student_id=eq.${encodeURIComponent(normalizedStudentId)}&select=reward_id,teacher_id,amount,reason,created_at&order=created_at.desc&limit=20`) || [];
  const teacherIds = Array.from(new Set((rows as JsonRecord[]).map(row => normalizeId(row.teacher_id)).filter(Boolean)));
  const teacherRows = teacherIds.length
    ? await supabaseRequest(`students?student_id=in.(${teacherIds.map(encodeURIComponent).join(',')})&select=student_id,student_name&limit=${teacherIds.length}`) || []
    : [];
  const teacherNames = new Map((teacherRows as JsonRecord[]).map(row => {
    const teacherId = normalizeId(row.student_id);
    return [teacherId, getCanonicalStudentName(teacherId, row.student_name || teacherId, { allowCustom: true })];
  }));
  return (rows as JsonRecord[]).map(row => {
    const teacherId = normalizeId(row.teacher_id);
    return {
      rewardId: String(row.reward_id || `${normalizedStudentId}-${teacherId}-${row.created_at || ''}`),
      teacherId,
      teacherName: teacherNames.get(teacherId) || getCanonicalStudentName(teacherId, teacherId),
      amount: Math.max(0, Math.floor(toNumber(row.amount, 0))),
      reason: String(row.reason || '课堂表现'),
      createdAt: String(row.created_at || '')
    };
  }).filter(reward => reward.amount > 0);
}

async function getStudent(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  if (!studentId) return { ok: false, error: 'Missing studentId' };
  const [studentRows, stateRows] = await Promise.all([
    supabaseRequest(`students?student_id=eq.${encodeURIComponent(studentId)}&limit=1`),
    supabaseRequest(`student_game_states?student_id=eq.${encodeURIComponent(studentId)}&limit=1`)
  ]);
  const student = fromStudentRows(studentRows || [], stateRows || []);
  if (!student) return { ok: false, errorCode: 'STUDENT_NOT_FOUND', fallbackAllowed: true, error: '暂时找不到这个学生 ID。' };
  student.teacherRewards = await listTeacherRewardsForStudent(studentId);
  return { ok: true, source: 'supabase', student, classes: [] };
}

async function studentIdExists(studentId: string) {
  const id = normalizeId(studentId);
  if (!id) return false;
  const rows = await supabaseRequest(`students?student_id=eq.${encodeURIComponent(id)}&select=student_id&limit=1`) || [];
  return Boolean((rows as JsonRecord[]).length);
}

function createRegisteredStudentIdCandidate() {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  const number = 1000 + (buffer[0] % 9000);
  return `CY${number}`;
}

async function generateRegisteredStudentId() {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = createRegisteredStudentIdCandidate();
    if (!(await studentIdExists(candidate))) return candidate;
  }
  const fallback = `CY${Date.now().toString().slice(-6)}`;
  if (!(await studentIdExists(fallback))) return fallback;
  throw new Error('暂时无法产生新的学生 ID，请稍后再试。');
}

function createRegisteredStudentState(studentId: string, studentName: string, sincereFriendId = '') {
  const now = new Date().toISOString();
  return {
    studentId,
    studentName,
    name: studentName,
    branch: '外来生',
    className: '外来生',
    classNameLegacy: '外来生',
    teacherId: '',
    avatar: '🌟',
    status: 'active',
    petName: '',
    petBirthday: '',
    petType: '',
    petRarity: 'A',
    petLevel: 1,
    experience: 0,
    coins: 0,
    totalStars: 0,
    streak: 0,
    lastCheckinDate: '',
    ownedItems: [],
    equippedItems: {},
    petItemsMigrated: false,
    ownedPets: [],
    petCollection: {},
    evolvedPets: {},
    petRoomDecorations: [],
    blindBoxes: 0,
    ownedMusicTracks: [DEFAULT_MUSIC_TRACK_ID],
    activeMusicTrack: DEFAULT_MUSIC_TRACK_ID,
    musicPlaybackMode: 'single',
    miniGameHighScores: { reaction: 0, flappy: 0, runner: 0, jumpCharge: 0 },
    collectionTitles: {},
    drawnCollectionTitle: '',
    titleDrawAvailable: false,
    titleDrawCompleted: false,
    pendingBlindBoxDuplicates: [],
    evolutionStylePreference: '',
    activeEvolutionForm: PET_EVOLUTION_FORM_ORIGINAL,
    petEvolved: false,
    miniPetEvolved: false,
    evolutionReady: false,
    miniEvolutionReady: false,
    exclusiveEvolutionReady: false,
    equipmentExperienceMigrated: false,
    teacherRewards: [],
    checkins: [],
    dailyCheckinGuideLastSeenDate: '',
    dailyCheckinGuideLastSeenAt: '',
    sincereFriendId,
    registeredAt: now,
    registrationSource: 'self-register'
  };
}

async function registerStudent(payload: JsonRecord) {
  const requestedId = normalizeId(payload.studentId);
  const nameValidation = validatePublicText(payload.studentName || payload.name, 18);
  if (!nameValidation.ok) {
    const error = String(nameValidation.error || '请输入玩家名字。')
      .replace(/^内容/, '名字')
      .replace('内容里', '名字里');
    return { ok: false, error };
  }
  if (requestedId && await studentIdExists(requestedId)) {
    return { ok: false, errorCode: 'STUDENT_ID_EXISTS', error: '这个学生 ID 已经存在，请换一个或留空自动生成。' };
  }
  const sincereFriendId = normalizeId(payload.sincereFriendId || payload.referrerId || payload.friendId);
  if (!sincereFriendId) {
    return { ok: false, errorCode: 'SINCERE_FRIEND_ID_REQUIRED', error: '请输入诚意朋友 ID。' };
  }
  if (!(await studentIdExists(sincereFriendId))) {
    return { ok: false, errorCode: 'SINCERE_FRIEND_ID_NOT_FOUND', error: '找不到这个诚意朋友 ID，请检查后再注册。' };
  }
  const studentId = requestedId || await generateRegisteredStudentId();
  const studentState = createRegisteredStudentState(studentId, getCanonicalStudentName(studentId, nameValidation.text), sincereFriendId);
  const result = await upsertStudentAndState(studentState);
  return { ...result, registered: true };
}

function isTeacherRosterRow(row: JsonRecord | null | undefined) {
  if (!row || typeof row !== 'object') return false;
  const branch = String(row.branch || '').trim();
  const className = String(row.class_name || row.className || '').trim();
  const studentName = String(row.student_name || row.studentName || row.name || '').trim();
  return branch === 'CY大家庭'
    || studentName.includes('老师')
    || /^(TEST|INTERNAL TEST)$/i.test(className)
    || className.includes('内测老师');
}

function makeVirtualClassId(branch: string, className: string) {
  return `virtual:${encodeURIComponent(branch)}:${encodeURIComponent(className)}`;
}

function parseVirtualClassId(classId: unknown) {
  const raw = String(classId || '').trim();
  if (raw.startsWith('virtual:')) {
    const parts = raw.split(':');
    return {
      branch: decodeURIComponent(parts[1] || ''),
      className: decodeURIComponent(parts.slice(2).join(':') || '')
    };
  }
  const separator = raw.includes(' · ') ? ' · ' : ' | ';
  const parts = raw.split(separator);
  return { branch: parts[0] || '', className: parts.slice(1).join(separator) || '' };
}

function isStudentRewardTarget(row: JsonRecord | null | undefined) {
  return Boolean(row && !isTeacherRosterRow(row));
}

function isAssignedToTeacher(row: JsonRecord | null | undefined, teacherId: string) {
  const assignedTeacherId = normalizeId(row?.teacher_id || row?.teacherId);
  return assignedTeacherId === normalizeId(teacherId);
}

function canRewardTeacherTargets(teacherId: string) {
  return TEACHER_REWARD_ADMIN_IDS.has(normalizeId(teacherId));
}

function canViewAllTeacherClasses(teacherId: string) {
  return TEACHER_ADMIN_IDS.has(normalizeId(teacherId));
}

function canUseBulkStudentImport(teacherId: string) {
  return canViewAllTeacherClasses(teacherId);
}

function canViewTeacherRosterRow(
  row: JsonRecord,
  teacherId: string,
  includeTeacherTargets = canRewardTeacherTargets(teacherId)
) {
  if (canViewAllTeacherClasses(teacherId)) return true;
  if (isTeacherRosterRow(row)) return includeTeacherTargets;
  return isStudentRewardTarget(row) && isAssignedToTeacher(row, teacherId);
}

function getMalaysiaDayRange(date = new Date()) {
  const malaysiaOffsetMs = 8 * 60 * 60 * 1000;
  const localDate = new Date(date.getTime() + malaysiaOffsetMs);
  const start = new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate()) - malaysiaOffsetMs);
  const end = new Date(start.getTime() + 86400000);
  return { start: start.toISOString(), end: end.toISOString() };
}

function studentFromRosterAndState(roster: JsonRecord, game: JsonRecord | null | undefined) {
  const studentId = normalizeId(roster.student_id);
  const studentName = getCanonicalStudentName(studentId, roster.student_name || studentId);
  return fromStudentRows([roster], [game || { state: {}, coins: 0, total_stars: 0 }]) || {
    studentId,
    studentName,
    name: studentName,
    branch: String(roster.branch || ''),
    className: String(roster.class_name || ''),
    classNameLegacy: String(roster.class_name || ''),
    teacherId: normalizeId(roster.teacher_id || ''),
    avatar: String(roster.avatar || '🌟'),
    status: String(roster.status || 'active'),
    coins: 0,
    totalStars: 0
  };
}

async function requireTeacherAccount(teacherId: string) {
  if (!teacherId) return { ok: false, error: 'Missing teacher ID' };
  const rows = await supabaseRequest(`students?student_id=eq.${encodeURIComponent(teacherId)}&select=student_id,student_name,branch,class_name,teacher_id,status&limit=1`) || [];
  const teacher = rows[0] as JsonRecord | undefined;
  if (!teacher || String(teacher.status || 'active') !== 'active' || !isTeacherRosterRow(teacher)) {
    return { ok: false, error: '这个账号还没有老师加分权限。' };
  }
  return { ok: true, teacher };
}

async function listTeacherClasses(payload: JsonRecord) {
  const teacherId = normalizeId(payload.teacherId);
  const teacher = await requireTeacherAccount(teacherId);
  if (!teacher.ok) return teacher;
  const canViewAllClasses = canViewAllTeacherClasses(teacherId);
  const includeTeacherTargets = canRewardTeacherTargets(teacherId);
  const rows = await supabaseRequest('students?select=student_id,student_name,branch,class_name,teacher_id,status&status=eq.active&order=branch.asc&order=class_name.asc&order=student_name.asc&limit=5000') || [];
  const groups = new Map<string, { branch: string; className: string; studentCount: number }>();
  rows.forEach((row: JsonRecord) => {
    if (!canViewAllClasses && !canViewTeacherRosterRow(row, teacherId, includeTeacherTargets)) return;
    const branch = String(row.branch || '未分院').trim() || '未分院';
    const className = String(row.class_name || '未分班').trim() || '未分班';
    const key = `${branch}\u0000${className}`;
    const current = groups.get(key) || { branch, className, studentCount: 0 };
    current.studentCount += 1;
    groups.set(key, current);
  });
  const classes = Array.from(groups.values())
    .sort((a, b) => `${a.branch} ${a.className}`.localeCompare(`${b.branch} ${b.className}`, 'zh-Hans-CN'))
    .map(group => ({
      classId: makeVirtualClassId(group.branch, group.className),
      className: `${group.branch} · ${group.className}`,
      branch: group.branch,
      teacherId,
      status: 'active',
      studentCount: group.studentCount
    }));
  return { ok: true, source: 'supabase', classes };
}

async function getClassStudents(payload: JsonRecord) {
  const teacherId = normalizeId(payload.teacherId);
  const teacher = await requireTeacherAccount(teacherId);
  if (!teacher.ok) return teacher;
  const canViewAllClasses = canViewAllTeacherClasses(teacherId);
  const includeTeacherTargets = canRewardTeacherTargets(teacherId);
  const { branch, className } = parseVirtualClassId(payload.classId);
  if (!branch || !className) return { ok: false, error: '请选择一个班级。', students: [] };
  const rows = await supabaseRequest(`students?select=student_id,student_name,branch,class_name,teacher_id,avatar,status&status=eq.active&branch=eq.${encodeURIComponent(branch)}&class_name=eq.${encodeURIComponent(className)}&order=student_name.asc&limit=5000`) || [];
  const studentRows = rows.filter((row: JsonRecord) => canViewAllClasses || canViewTeacherRosterRow(row, teacherId, includeTeacherTargets));
  const ids = studentRows.map((row: JsonRecord) => normalizeId(row.student_id)).filter(Boolean);
  const stateRows = ids.length
    ? await supabaseRequest(`student_game_states?student_id=in.(${ids.map(encodeURIComponent).join(',')})&select=student_id,state,coins,total_stars`) || []
    : [];
  const statesById = new Map((stateRows as JsonRecord[]).map(row => [normalizeId(row.student_id), row]));
  const students = studentRows.map((row: JsonRecord) => studentFromRosterAndState(row, statesById.get(normalizeId(row.student_id))));
  return { ok: true, source: 'supabase', classId: makeVirtualClassId(branch, className), className: `${branch} · ${className}`, students };
}

async function rewardStudents(payload: JsonRecord) {
  const teacherId = normalizeId(payload.teacherId);
  const teacher = await requireTeacherAccount(teacherId);
  if (!teacher.ok) return teacher;
  const canViewAllClasses = canViewAllTeacherClasses(teacherId);
  const includeTeacherTargets = canRewardTeacherTargets(teacherId);
  const { branch, className } = parseVirtualClassId(payload.classId);
  const studentIds = Array.isArray(payload.studentIds) ? payload.studentIds.map(normalizeId).filter(Boolean) : [];
  const amount = Math.max(0, Math.floor(toNumber(payload.amount, 0)));
  const reason = String(payload.reason || '课堂表现').trim() || '课堂表现';
  if (!branch || !className) return { ok: false, error: '请选择一个班级。' };
  if (!studentIds.length) return { ok: false, error: '请先选择至少一位学生。' };
  if (amount <= 0) return { ok: false, error: '奖励金币必须大于 0。' };

  const rows = await supabaseRequest(`students?select=student_id,student_name,branch,class_name,teacher_id,avatar,status&status=eq.active&branch=eq.${encodeURIComponent(branch)}&class_name=eq.${encodeURIComponent(className)}&student_id=in.(${studentIds.map(encodeURIComponent).join(',')})&limit=5000`) || [];
  const targets = rows.filter((row: JsonRecord) => canViewAllClasses || canViewTeacherRosterRow(row, teacherId, includeTeacherTargets));
  const targetIds = targets.map((row: JsonRecord) => normalizeId(row.student_id)).filter(Boolean);
  const { start, end } = getMalaysiaDayRange();
  const rewardRows = targetIds.length
    ? await supabaseRequest(`teacher_rewards?student_id=in.(${targetIds.map(encodeURIComponent).join(',')})&created_at=gte.${encodeURIComponent(start)}&created_at=lt.${encodeURIComponent(end)}&select=student_id,amount&limit=5000`) || []
    : [];
  const rewardTotals = new Map<string, number>();
  (rewardRows as JsonRecord[]).forEach(row => {
    const studentId = normalizeId(row.student_id);
    rewardTotals.set(studentId, (rewardTotals.get(studentId) || 0) + Math.max(0, Math.floor(toNumber(row.amount, 0))));
  });
  const accepted: string[] = [];
  const balances: { studentId: string; coins: number }[] = [];
  const limited: string[] = [];
  const rewardsToLog: { studentId: string; amount: number }[] = [];
  for (const target of targets) {
    const studentId = normalizeId(target.student_id);
    const current = await getStudent({ studentId });
    const currentStudent = current.ok ? current.student as JsonRecord : studentFromRosterAndState(target, null);
    const teacherTarget = isTeacherRosterRow(target);
    const remainingDailyReward = teacherTarget
      ? amount
      : Math.max(0, TEACHER_DAILY_REWARD_LIMIT - (rewardTotals.get(studentId) || 0));
    const appliedAmount = teacherTarget ? amount : Math.min(amount, remainingDailyReward);
    if (appliedAmount <= 0) {
      limited.push(studentId);
      continue;
    }
    if (!teacherTarget && appliedAmount < amount) limited.push(studentId);
    const coins = Math.max(0, Math.floor(toNumber(currentStudent?.coins, 0))) + appliedAmount;
    await upsertStudentAndState({ ...currentStudent, studentId, coins });
    accepted.push(studentId);
    balances.push({ studentId, coins });
    rewardsToLog.push({ studentId, amount: appliedAmount });
  }
  if (rewardsToLog.length) {
    await supabaseRequest('teacher_rewards', {
      method: 'POST',
      body: rewardsToLog.map(reward => ({
        teacher_id: teacherId,
        class_id: `${branch} · ${className}`,
        student_id: reward.studentId,
        amount: reward.amount,
        reason
      })),
      prefer: 'return=minimal'
    });
  }
  return { ok: true, source: 'supabase', accepted, balances, limited, dailyLimit: TEACHER_DAILY_REWARD_LIMIT };
}

type BulkImportStudentRow = {
  rowNumber: number;
  studentId: string;
  studentName: string;
  branch: string;
  className: string;
  teacherId: string;
  status: string;
};

type BulkImportDefaults = {
  branch: string;
  className: string;
  teacherId: string;
};

function normalizeBulkImportStudentId(value: unknown) {
  const compact = String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (/^\d{4}$/.test(compact)) return `CY${compact}`;
  if (/^CY\d{4}$/.test(compact)) return normalizeId(compact);
  return '';
}

function normalizeBulkImportText(value: unknown, fallback: string, maxLength = 40) {
  const text = String(value || '').trim().replace(/\s+/g, ' ');
  return (text || fallback).slice(0, maxLength);
}

function getBulkImportValue(row: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value != null && String(value).trim()) return value;
  }
  return '';
}

function normalizeBulkImportRow(rawRow: unknown, index: number, defaults: BulkImportDefaults): { row?: BulkImportStudentRow; error?: string } {
  if (!rawRow || typeof rawRow !== 'object' || Array.isArray(rawRow)) {
    return { error: `第 ${index + 1} 行：名单格式不正确。` };
  }
  const source = rawRow as JsonRecord;
  const rowNumber = Math.max(1, Math.floor(toNumber(source.rowNumber, index + 1)));
  const studentId = normalizeBulkImportStudentId(getBulkImportValue(source, ['studentId', 'id', 'student_id', 'studentIdDigits']));
  if (!studentId) return { error: `第 ${rowNumber} 行：学生 ID 请填写 4 位数字或 CY+4 位数字。` };
  const nameValidation = validatePublicText(getBulkImportValue(source, ['studentName', 'name', 'student_name']), 18);
  if (!nameValidation.ok) {
    const error = String(nameValidation.error || '名字不适合公开展示。')
      .replace(/^内容/, '名字')
      .replace('内容里', '名字里');
    return { error: `第 ${rowNumber} 行：${error}` };
  }
  return {
    row: {
      rowNumber,
      studentId,
      studentName: getCanonicalStudentName(studentId, nameValidation.text, { allowCustom: true }),
      branch: normalizeBulkImportText(getBulkImportValue(source, ['branch', 'school', 'campus']), defaults.branch),
      className: normalizeBulkImportText(getBulkImportValue(source, ['className', 'class_name', 'class']), defaults.className, 40),
      teacherId: normalizeId(getBulkImportValue(source, ['teacherId', 'teacher_id', 'assignedTeacherId', 'underTeacherId', 'teacher']) || defaults.teacherId),
      status: 'active'
    }
  };
}

async function bulkImportStudents(payload: JsonRecord) {
  const teacherId = normalizeId(payload.teacherId);
  const teacher = await requireTeacherAccount(teacherId);
  if (!teacher.ok) return teacher;
  if (!canUseBulkStudentImport(teacherId)) {
    return { ok: false, error: '这个账号没有批量导入权限。' };
  }
  const rawRows = Array.isArray(payload.rows) ? payload.rows : [];
  if (!rawRows.length) return { ok: false, error: '请先贴上或上传学生名单。', errors: [] };
  if (rawRows.length > BULK_IMPORT_MAX_ROWS) {
    return { ok: false, error: `一次最多导入 ${BULK_IMPORT_MAX_ROWS} 位学生，请分批处理。`, errors: [] };
  }
  const defaults = {
    branch: normalizeBulkImportText(payload.defaultBranch || payload.branch, ''),
    className: normalizeBulkImportText(payload.defaultClassName || payload.className || payload.class_name, '', 40),
    teacherId: normalizeId(payload.defaultTeacherId || payload.assignedTeacherId || payload.underTeacherId || payload.teacherUnderId || teacherId)
  };

  const errors: string[] = [];
  const seen = new Set<string>();
  const validRows: BulkImportStudentRow[] = [];
  rawRows.forEach((rawRow, index) => {
    const normalized = normalizeBulkImportRow(rawRow, index, defaults);
    if (normalized.error || !normalized.row) {
      errors.push(normalized.error || `第 ${index + 1} 行：名单格式不正确。`);
      return;
    }
    if (!normalized.row.className) {
      errors.push(`第 ${normalized.row.rowNumber} 行：请先设定班级名字，或在这一行填写 className。`);
      return;
    }
    if (!normalized.row.branch) {
      errors.push(`第 ${normalized.row.rowNumber} 行：请先设定学校 / 分院，或在这一行填写 branch。`);
      return;
    }
    if (!normalized.row.teacherId) {
      errors.push(`第 ${normalized.row.rowNumber} 行：请先设定负责老师 ID，或在这一行填写 teacherId。`);
      return;
    }
    if (seen.has(normalized.row.studentId)) {
      errors.push(`第 ${normalized.row.rowNumber} 行：${normalized.row.studentId} 在这次名单里重复了。`);
      return;
    }
    seen.add(normalized.row.studentId);
    validRows.push(normalized.row);
  });
  if (!validRows.length) {
    return { ok: false, error: '没有可导入的有效学生。', errors: errors.slice(0, 50) };
  }
  if (errors.length) {
    return { ok: false, error: '名单里还有错误，请先修正后再导入。', errors: errors.slice(0, 50) };
  }

  const ids = validRows.map(row => row.studentId);
  const existingRows = await supabaseRequest(`students?student_id=in.(${ids.map(encodeURIComponent).join(',')})&select=student_id`) || [];
  const existingIds = new Set((existingRows as JsonRecord[]).map(row => normalizeId(row.student_id)));

  await supabaseRequest('students?on_conflict=student_id', {
    method: 'POST',
    body: validRows.map(row => ({
      student_id: row.studentId,
      student_name: row.studentName,
      branch: row.branch,
      class_name: row.className,
      teacher_id: row.teacherId,
      avatar: '🌟',
      status: 'active'
    })),
    prefer: 'resolution=merge-duplicates,return=minimal'
  });

  const stateRows = await supabaseRequest(`student_game_states?student_id=in.(${ids.map(encodeURIComponent).join(',')})&select=student_id`) || [];
  const existingStateIds = new Set((stateRows as JsonRecord[]).map(row => normalizeId(row.student_id)));
  const missingStateIds = new Set(ids.filter(studentId => !existingStateIds.has(studentId)));
  const missingStateRows = validRows
    .filter(row => missingStateIds.has(row.studentId))
    .map(row => {
      const state = createRegisteredStudentState(row.studentId, row.studentName, '');
      state.branch = row.branch;
      state.className = row.className;
      state.classNameLegacy = row.className;
      state.teacherId = row.teacherId;
      state.status = 'active';
      state.sincereFriendId = '';
      state.registrationSource = 'bulk-import';
      return toGameStateRow(state, row.studentId);
    });
  if (missingStateRows.length) {
    await supabaseRequest('student_game_states?on_conflict=student_id', {
      method: 'POST',
      body: missingStateRows,
      prefer: 'resolution=ignore-duplicates,return=minimal'
    });
  }

  const created = validRows.filter(row => !existingIds.has(row.studentId)).length;
  return {
    ok: true,
    source: 'supabase',
    imported: validRows.length,
    created,
    updated: validRows.length - created,
    stateCreated: missingStateRows.length,
    skipped: 0,
    errors: []
  };
}

async function saveStudentState(payload: JsonRecord) {
  const student = payload.student as JsonRecord;
  if (!student || typeof student !== 'object') return { ok: false, error: 'Missing student state' };
  const event = (payload.event && typeof payload.event === 'object') ? payload.event as JsonRecord : {};
  const studentId = normalizeId(payload.studentId || student.studentId);
  const existingResult = studentId ? await getStudent({ studentId }) : null;
  const safeStudent = mergeDurableStudentState(existingResult?.ok ? existingResult.student as JsonRecord : null, { ...student, studentId }, event);
  const result = await upsertStudentAndState(safeStudent);
  if (['purchasePet', 'purchaseAndEquipItem', 'miniEvolvePet', 'evolvePet'].includes(String(event.type || ''))) {
    await supabaseRequest('purchase_ledger', {
      method: 'POST',
      body: {
        student_id: normalizeId(safeStudent.studentId),
        event_type: String(event.type || ''),
        item_id: String(event.itemId || ''),
        pet_id: String(event.petId || ''),
        price: Math.max(0, Math.floor(toNumber(event.price, 0))),
        payload: event
      },
      prefer: 'return=minimal'
    });
  }
  return { ...result, saved: true, eventType: String(event.type || '') };
}

function normalizeMiniGameScoreKey(value: unknown) {
  const key = String(value || '').trim();
  if (key === 'reaction' || key === 'wheel') return 'reaction';
  if (key === 'flappy' || key === 'jump') return 'flappy';
  if (key === 'runner' || key === 'run') return 'runner';
  if (key === 'jumpCharge' || key === 'jump_charge' || key === 'wechatJump' || key === 'wechat_jump') return 'jumpCharge';
  return '';
}

async function recordMiniGameScore(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const miniGame = normalizeMiniGameScoreKey(payload.miniGame || payload.type);
  const score = Math.max(0, Math.floor(toNumber(payload.score, 0)));
  if (!studentId || !miniGame || score <= 0) return { ok: false, error: 'Missing mini game score fields' };

  const existingResult = await getStudent({ studentId });
  if (!existingResult.ok || !existingResult.student) return existingResult;

  const existingStudent = existingResult.student as JsonRecord;
  const currentScores = mergeMiniGameHighScores({}, existingStudent.miniGameHighScores || existingStudent.mini_game_scores);
  const nextScores = mergeMiniGameHighScores(currentScores, { [miniGame]: score });
  const safeStudent = mergeDurableStudentState(existingStudent, {
    ...existingStudent,
    studentId,
    miniGameHighScores: nextScores
  }, {
    type: 'miniGameHighScore',
    miniGame,
    score
  });
  const result = await upsertStudentAndState(safeStudent);
  return { ...result, saved: true, eventType: 'miniGameHighScore', miniGame, score: nextScores[miniGame] };
}

async function submitCheckin(payload: JsonRecord) {
  const student = payload.student as JsonRecord;
  const record = payload.record as JsonRecord;
  const studentId = normalizeId(payload.studentId || student?.studentId || record?.studentId);
  if (!studentId || !record || typeof record !== 'object') return { ok: false, error: 'Missing check-in fields' };
  const result = student && typeof student === 'object'
    ? await upsertStudentAndState({ ...student, studentId })
    : await getStudent({ studentId });
  await supabaseRequest('daily_checkins?on_conflict=record_id', {
    method: 'POST',
    body: {
      record_id: String(record.recordId || `checkin-${studentId}-${record.date}-${record.subject}`),
      student_id: studentId,
      checkin_date: String(record.date || new Date().toISOString().slice(0, 10)),
      subject: String(record.subject || ''),
      score: Math.floor(toNumber(record.score, 0)),
      total: Math.floor(toNumber(record.total, 0)),
      total_stars: Math.floor(toNumber(record.totalStars, 0)),
      coins_earned: Math.floor(toNumber(record.coinsEarned, 0)),
      experience_earned: Math.floor(toNumber(record.experienceEarned, 0)),
      payload: record
    },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  return { ...result, saved: true };
}

function toWallPostPayload(post: JsonRecord) {
  const studentId = normalizeId(post.studentId);
  const rawMessage = String(post.message || '').trim();
  const message = rawMessage ? rawMessage.slice(0, 80) : WALL_POST_PRESETS[0];
  return {
    student_id: studentId,
    post_id: String(post.postId || `wall-post-${studentId}`),
    student_name: getCanonicalStudentName(studentId, post.studentName || post.name || studentId),
    message,
    pet_type: String(post.petType || ''),
    pet_name: String(post.petName || ''),
    pet_title: String(post.petTitle || post.pet_title || ''),
    pet_rarity: String(post.petRarity || ''),
    pet_level: String(post.petLevel || ''),
    combat_power: Math.max(0, Math.floor(toNumber(post.combatPower, 0))),
    pet_image: String(post.petImage || ''),
    pet_stats: (post.petStats && typeof post.petStats === 'object') ? post.petStats : {},
    equipment: Array.isArray(post.equipment) ? post.equipment : [],
    created_at: String(post.createdAt || new Date().toISOString())
  };
}

function fromWallRows(posts: JsonRecord[], likes: JsonRecord[] = [], comments: JsonRecord[] = []) {
  const likesByPost = new Map<string, string[]>();
  likes.forEach(like => {
    const key = normalizeId(like.post_student_id);
    likesByPost.set(key, [...(likesByPost.get(key) || []), normalizeId(like.liker_student_id)]);
  });
  const commentsByPost = new Map<string, JsonRecord[]>();
  comments.forEach(comment => {
    const key = normalizeId(comment.post_student_id);
    const commenterId = normalizeId(comment.student_id);
    commentsByPost.set(key, [...(commentsByPost.get(key) || []), {
      commentId: String(comment.comment_id || ''),
      studentId: commenterId,
      studentName: getCanonicalStudentName(commenterId, comment.student_name || comment.student_id || '同学'),
      petName: String(comment.pet_name || comment.student_name || comment.student_id || '同学'),
      text: String(comment.text || ''),
      createdAt: String(comment.created_at || new Date().toISOString())
    }]);
  });
  return posts.map(row => {
    const ownerId = normalizeId(row.student_id);
    return {
      postId: String(row.post_id || `wall-post-${ownerId}`),
      studentId: ownerId,
      studentName: getCanonicalStudentName(ownerId, row.student_name || ownerId),
      message: String(row.message || WALL_POST_PRESETS[0]),
      petType: String(row.pet_type || ''),
      petName: String(row.pet_name || ''),
      petTitle: String(row.pet_title || ''),
      petRarity: String(row.pet_rarity || ''),
      petLevel: String(row.pet_level || ''),
      combatPower: Math.max(0, Math.floor(toNumber(row.combat_power, 0))),
      petImage: String(row.pet_image || ''),
      petStats: row.pet_stats || {},
      equipment: Array.isArray(row.equipment) ? row.equipment : [],
      likedBy: likesByPost.get(ownerId) || [],
      comments: commentsByPost.get(ownerId) || [],
      createdAt: String(row.created_at || new Date().toISOString()),
      updatedAt: String(row.updated_at || row.created_at || new Date().toISOString())
    };
  });
}

async function listWallPosts() {
  const posts = await supabaseRequest('wall_posts?select=*&order=created_at.desc&limit=120') || [];
  const ownerIds = posts.map((post: JsonRecord) => normalizeId(post.student_id)).filter(Boolean);
  if (!ownerIds.length) return { ok: true, source: 'supabase', posts: [] };
  const ownerFilter = ownerIds.map(encodeURIComponent).join(',');
  const [likes, comments] = await Promise.all([
    supabaseRequest(`wall_likes?post_student_id=in.(${ownerFilter})&select=*`),
    supabaseRequest(`wall_comments?post_student_id=in.(${ownerFilter})&select=*&order=created_at.asc`)
  ]);
  return { ok: true, source: 'supabase', posts: fromWallRows(posts, likes || [], comments || []) };
}

function getOwnedPetCountFromStateBody(stateBody: JsonRecord = {}) {
  const ownedPets = Array.isArray(stateBody.ownedPets) ? stateBody.ownedPets.length : 0;
  const collection = stateBody.petCollection && typeof stateBody.petCollection === 'object' && !Array.isArray(stateBody.petCollection)
    ? Object.keys(stateBody.petCollection as JsonRecord).length
    : 0;
  return Math.max(ownedPets, collection);
}

function getStateRowRichness(row: JsonRecord = {}) {
  const stateBody = (row?.state && typeof row.state === 'object' && !Array.isArray(row.state)) ? row.state as JsonRecord : {};
  return getOwnedPetCountFromStateBody(stateBody) * 1e6
    + Math.max(0, Math.floor(toNumber(stateBody.coins ?? row?.coins, 0)))
    + Math.max(0, Math.floor(toNumber(stateBody.totalStars ?? row?.total_stars, 0)));
}

async function listLeaderboardStudents() {
  const [studentRows, stateRows] = await Promise.all([
    supabaseRequest('students?select=student_id,student_name,branch,class_name,teacher_id,avatar,status&status=eq.active&limit=5000') || [],
    supabaseRequest('student_game_states?select=student_id,state,coins,total_stars&limit=5000') || []
  ]);
  const rosterById = new Map<string, JsonRecord>();
  ((studentRows || []) as JsonRecord[]).forEach(row => {
    const studentId = normalizeId(row.student_id);
    if (!studentId) return;
    const nextRow = {
      ...row,
      student_id: studentId,
      student_name: getCanonicalStudentName(studentId, row.student_name || studentId)
    };
    const existing = rosterById.get(studentId);
    if (!existing || String(nextRow.student_name || '').length >= String(existing.student_name || '').length) {
      rosterById.set(studentId, nextRow);
    }
  });
  const stateById = new Map<string, JsonRecord>();
  ((stateRows || []) as JsonRecord[]).forEach(row => {
    const studentId = normalizeId(row.student_id);
    if (!studentId) return;
    const stateBody = (row?.state && typeof row.state === 'object' && !Array.isArray(row.state)) ? row.state as JsonRecord : {};
    const hasCustomProfileName = Boolean(String(stateBody.profileNameUpdatedAt || '').trim());
    const canonicalName = getCanonicalStudentName(studentId, stateBody.studentName || stateBody.name || studentId, { allowCustom: hasCustomProfileName });
    const nextRow = {
      ...row,
      student_id: studentId,
      state: {
        ...stateBody,
        studentId,
        studentName: canonicalName,
        name: canonicalName
      }
    };
    const existing = stateById.get(studentId);
    if (!existing || getStateRowRichness(nextRow) >= getStateRowRichness(existing)) stateById.set(studentId, nextRow);
  });
  const ids = Array.from(new Set([...rosterById.keys(), ...stateById.keys()]));
  const students = ids.map(studentId => {
    const stateRow = stateById.get(studentId);
    const stateBody = (stateRow?.state && typeof stateRow.state === 'object' && !Array.isArray(stateRow.state)) ? stateRow.state as JsonRecord : {};
    const roster = rosterById.get(studentId) || {
      student_id: studentId,
      student_name: getCanonicalStudentName(studentId, stateBody.studentName || stateBody.name || studentId, {
        allowCustom: Boolean(String(stateBody.profileNameUpdatedAt || '').trim())
      }),
      branch: String(stateBody.branch || ''),
      class_name: String(stateBody.className || stateBody.classNameLegacy || ''),
      teacher_id: normalizeId(stateBody.teacherId || stateBody.teacher_id || ''),
      avatar: String(stateBody.avatar || '🌟'),
      status: 'active'
    };
    return studentFromRosterAndState(roster, stateRow || {
      student_id: studentId,
      state: stateBody,
      coins: stateBody.coins || 0,
      total_stars: stateBody.totalStars || 0
    });
  }).filter(Boolean);
  return { ok: true, source: 'supabase', students };
}

async function getWallPostByPostId(postId: string) {
  const rows = await supabaseRequest(`wall_posts?post_id=eq.${encodeURIComponent(postId)}&select=*&limit=1`) || [];
  return rows[0] || null;
}

async function getFullWallPostByOwner(studentId: string) {
  const posts = await supabaseRequest(`wall_posts?student_id=eq.${encodeURIComponent(studentId)}&select=*&limit=1`) || [];
  if (!posts.length) return null;
  const [likes, comments] = await Promise.all([
    supabaseRequest(`wall_likes?post_student_id=eq.${encodeURIComponent(studentId)}&select=*`),
    supabaseRequest(`wall_comments?post_student_id=eq.${encodeURIComponent(studentId)}&select=*&order=created_at.asc`)
  ]);
  return fromWallRows(posts, likes || [], comments || [])[0];
}

async function createWallPost(payload: JsonRecord) {
  const post = payload.post as JsonRecord;
  const studentId = normalizeId(post?.studentId);
  if (!studentId) return { ok: false, error: 'Missing studentId' };
  await supabaseRequest('students?on_conflict=student_id', {
    method: 'POST',
    body: {
      student_id: studentId,
      student_name: getCanonicalStudentName(studentId, post.studentName || studentId, {
        allowCustom: Boolean(String(post.profileNameUpdatedAt || '').trim())
      }),
      status: 'active'
    },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  await Promise.all([
    supabaseRequest(`wall_likes?post_student_id=eq.${encodeURIComponent(studentId)}`, {
      method: 'DELETE',
      prefer: 'return=minimal'
    }),
    supabaseRequest(`wall_comments?post_student_id=eq.${encodeURIComponent(studentId)}`, {
      method: 'DELETE',
      prefer: 'return=minimal'
    })
  ]);
  await supabaseRequest('wall_posts?on_conflict=student_id', {
    method: 'POST',
    body: toWallPostPayload(post),
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  const saved = await getFullWallPostByOwner(studentId);
  return { ok: true, source: 'supabase', post: saved };
}

async function likeWallPost(payload: JsonRecord) {
  const postId = String(payload.postId || '');
  const studentId = normalizeId(payload.studentId);
  if (!postId || !studentId) return { ok: false, error: 'Missing like fields' };
  const post = await getWallPostByPostId(postId);
  if (!post) return { ok: false, error: '找不到这篇留言。' };
  const ownerId = normalizeId(post.student_id);
  await supabaseRequest('students?on_conflict=student_id', {
    method: 'POST',
    body: { student_id: studentId, student_name: getCanonicalStudentName(studentId, studentId), status: 'active' },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  const existing = await supabaseRequest(`wall_likes?post_student_id=eq.${encodeURIComponent(ownerId)}&liker_student_id=eq.${encodeURIComponent(studentId)}&select=*`) || [];
  if (existing.length) {
    await supabaseRequest(`wall_likes?post_student_id=eq.${encodeURIComponent(ownerId)}&liker_student_id=eq.${encodeURIComponent(studentId)}`, {
      method: 'DELETE',
      prefer: 'return=minimal'
    });
  } else {
    await supabaseRequest('wall_likes', {
      method: 'POST',
      body: { post_student_id: ownerId, liker_student_id: studentId },
      prefer: 'return=minimal'
    });
  }
  if (!existing.length && ownerId !== studentId) {
    const liker = await getStudent({ studentId });
    const likerName = liker.ok ? getPetSocialName(liker.student as JsonRecord) : studentId;
    await createNotification(ownerId, studentId, 'wall-like', '留言墙收到点赞', `${likerName} 给你的角色卡点赞了。`, { postId, likerStudentId: studentId });
  }
  const saved = await getFullWallPostByOwner(ownerId);
  return { ok: true, source: 'supabase', post: saved };
}

async function commentWallPost(payload: JsonRecord) {
  const postId = String(payload.postId || '');
  const rawComment = (payload.comment && typeof payload.comment === 'object') ? payload.comment as JsonRecord : {};
  const studentId = normalizeId(rawComment.studentId);
  const textValidation = validatePublicText(rawComment.text, WALL_COMMENT_PRESETS.includes(String(rawComment.text || '')) ? 18 : 18);
  if (!postId || !studentId) return { ok: false, error: 'Missing comment fields' };
  if (!textValidation.ok) return { ok: false, error: textValidation.error };
  const post = await getWallPostByPostId(postId);
  if (!post) return { ok: false, error: '找不到这篇留言。' };
  const ownerId = normalizeId(post.student_id);
  const commenterResult = await getStudent({ studentId });
  const commenter = commenterResult.ok ? commenterResult.student as JsonRecord : { studentId, studentName: rawComment.studentName || studentId, petName: rawComment.petName || '' };
  const commenterPetName = String(rawComment.petName || getPetSocialName(commenter) || studentId);
  await supabaseRequest('students?on_conflict=student_id', {
    method: 'POST',
    body: {
      student_id: studentId,
      student_name: getCanonicalStudentName(studentId, commenter.studentName || commenter.name || rawComment.studentName || studentId, {
        allowCustom: Boolean(String(commenter.profileNameUpdatedAt || rawComment.profileNameUpdatedAt || '').trim())
      }),
      status: 'active'
    },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  await supabaseRequest('wall_comments', {
    method: 'POST',
    body: {
      comment_id: String(rawComment.commentId || crypto.randomUUID()),
      post_student_id: ownerId,
      student_id: studentId,
      student_name: getCanonicalStudentName(studentId, commenter.studentName || commenter.name || rawComment.studentName || studentId),
      pet_name: commenterPetName,
      text: textValidation.text,
      created_at: String(rawComment.createdAt || new Date().toISOString())
    },
    prefer: 'return=minimal'
  });
  const saved = await getFullWallPostByOwner(ownerId);
  return { ok: true, source: 'supabase', post: saved };
}

function makeFriendPair(firstId: string, secondId: string) {
  const first = normalizeId(firstId);
  const second = normalizeId(secondId);
  return first < second ? { a: first, b: second } : { a: second, b: first };
}

async function isAcceptedFriend(studentId: string, friendId: string) {
  const pair = makeFriendPair(studentId, friendId);
  const rows = await supabaseRequest(`friendships?student_a_id=eq.${encodeURIComponent(pair.a)}&student_b_id=eq.${encodeURIComponent(pair.b)}&status=eq.accepted&select=friendship_id&limit=1`) || [];
  return rows.length > 0;
}

function getPetSocialName(student: JsonRecord | null | undefined) {
  const petName = String(student?.petName || '').trim();
  const studentName = String(student?.studentName || student?.name || student?.studentId || '').trim();
  return studentName || petName || '学习伙伴';
}

function sameInteractionPublicName(first: unknown, second: unknown) {
  const left = String(first || '').trim().toLocaleLowerCase();
  const right = String(second || '').trim().toLocaleLowerCase();
  return Boolean(left && right && left === right);
}

function getActiveInteractionPetName(student: JsonRecord | null | undefined, petId = '') {
  const directName = String(student?.petName || '').trim();
  if (directName) return directName;
  const collection = student?.petCollection;
  if (petId && collection && typeof collection === 'object' && !Array.isArray(collection)) {
    const record = (collection as JsonRecord)[petId] as JsonRecord | undefined;
    const collectionName = String(record?.petName || '').trim();
    if (collectionName) return collectionName;
  }
  return '';
}

function getInteractionPetStageFromStudent(student: JsonRecord | null | undefined, petId = '') {
  const safePetId = String(petId || student?.petType || '').trim();
  if (!student || !safePetId) return 'base';
  const collection = student.petCollection;
  const record = collection && typeof collection === 'object' && !Array.isArray(collection)
    ? (collection as JsonRecord)[safePetId] as JsonRecord | undefined
    : null;
  const activeForm = normalizePetEvolutionFormForPet(record?.activeEvolutionForm || record?.selectedEvolutionForm || (safePetId === String(student.petType || '') ? student.activeEvolutionForm : ''), safePetId);
  if (activeForm === PET_EVOLUTION_FORM_ORIGINAL) return 'base';
  if (activeForm === PET_EVOLUTION_FORM_MINI) return 'mini';
  if (isFinalPetEvolutionForm(activeForm)) return 'final';
  const recordStage = normalizeInteractionPetStage(record?.evolutionStage);
  const evolvedPets = student.evolvedPets && typeof student.evolvedPets === 'object' && !Array.isArray(student.evolvedPets)
    ? student.evolvedPets as JsonRecord
    : {};
  if (recordStage === 'final' || Boolean(record?.evolved) || Boolean(evolvedPets[safePetId]) || (safePetId === String(student.petType || '') && Boolean(student.petEvolved))) {
    return 'final';
  }
  if (recordStage === 'mini' || Boolean(record?.miniEvolved) || (safePetId === String(student.petType || '') && Boolean(student.miniPetEvolved))) {
    return 'mini';
  }
  return 'base';
}

function getInteractionPetStyleFromStudent(student: JsonRecord | null | undefined, petId = '') {
  const safePetId = String(petId || student?.petType || '').trim();
  const collection = student?.petCollection;
  const record = safePetId && collection && typeof collection === 'object' && !Array.isArray(collection)
    ? (collection as JsonRecord)[safePetId] as JsonRecord | undefined
    : null;
  const activeForm = normalizePetEvolutionFormForPet(record?.activeEvolutionForm || record?.selectedEvolutionForm || (safePetId === String(student?.petType || '') ? student?.activeEvolutionForm : ''), safePetId);
  if (isFinalPetEvolutionForm(activeForm)) return normalizeInteractionPetStyle(activeForm);
  return normalizeInteractionPetStyle(normalizePetEvolutionFormForPet(record?.evolutionStyle || student?.evolutionStylePreference, safePetId));
}

function normalizeInteractionPetName(value: unknown, studentId = '', studentName = '') {
  const petName = String(value || '').trim();
  if (!petName) return '';
  if (sameInteractionPublicName(petName, studentId) || sameInteractionPublicName(petName, studentName)) return '';
  return petName;
}

function normalizeInteractionPetSize(value: unknown) {
  const size = String(value || '').trim().toLowerCase();
  return ['small', 'big', 'super'].includes(size) ? size : 'small';
}

function normalizeInteractionPetStage(value: unknown) {
  const stage = String(value || '').trim().toLowerCase();
  return ['base', 'mini', 'final'].includes(stage) ? stage : 'base';
}

function normalizeInteractionPetStyle(value: unknown) {
  const style = String(value || '').trim().toLowerCase();
  return style === 'cute' ? 'cute' : 'heroic';
}

function toPublicStudentSummary(student: JsonRecord, state: JsonRecord = {}) {
  const studentId = normalizeId(student.student_id || state.studentId);
  const stateBody = (state.state && typeof state.state === 'object' && !Array.isArray(state.state)) ? state.state as JsonRecord : state;
  const studentName = getCanonicalStudentName(studentId, student.student_name || stateBody.studentName || stateBody.name || state.studentName || state.name || studentId);
  const ownedPets = Array.isArray(stateBody.ownedPets) ? stateBody.ownedPets : [];
  return {
    studentId,
    studentName,
    avatar: String(student.avatar || stateBody.avatar || '🌟'),
    petName: String(stateBody.petName || ''),
    petType: String(stateBody.petType || ''),
    ownedPetCount: ownedPets.length
  };
}

async function createNotification(recipientStudentId: string, actorStudentId: string, type: string, title: string, body: string, payload: JsonRecord = {}) {
  await supabaseRequest('friend_notifications', {
    method: 'POST',
    body: {
      recipient_student_id: normalizeId(recipientStudentId),
      actor_student_id: actorStudentId ? normalizeId(actorStudentId) : null,
      type,
      title,
      body,
      payload
    },
    prefer: 'return=minimal'
  });
}

function getNotificationPayload(payload: unknown): JsonRecord {
  if (!payload) return {};
  if (typeof payload === 'string') {
    try {
      const parsed = JSON.parse(payload);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as JsonRecord : {};
    } catch (_error) {
      return {};
    }
  }
  return typeof payload === 'object' && !Array.isArray(payload) ? payload as JsonRecord : {};
}

function isPendingGiftNotificationRow(row: JsonRecord) {
  const type = String(row.type || '');
  if (!type.startsWith('gift-')) return false;
  if (String(row.claimed_at || row.claimedAt || '').trim()) return false;
  const payload = getNotificationPayload(row.payload);
  return Boolean(String(payload.giftId || payload.gift_id || '').trim());
}

async function deleteFriendRelationshipNotifications(recipientStudentId: string, actorStudentId = '') {
  const recipientId = normalizeId(recipientStudentId);
  const actorId = normalizeId(actorStudentId);
  if (!recipientId) return;
  const actorFilter = actorId ? `&actor_student_id=eq.${encodeURIComponent(actorId)}` : '';
  await Promise.all(['friend-request', 'friend-accepted'].map(type => supabaseRequest(
    `friend_notifications?recipient_student_id=eq.${encodeURIComponent(recipientId)}&type=eq.${encodeURIComponent(type)}${actorFilter}`,
    { method: 'DELETE', prefer: 'return=minimal' }
  )));
}

async function searchFriends(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const query = String(payload.query || '').trim();
  if (!studentId || query.length < 2) return { ok: false, error: '请输入至少 2 个字或 ID。' };
  const safeQuery = encodeURIComponent(`*${query}*`);
  const rows = await supabaseRequest(`students?or=(student_id.ilike.${safeQuery},student_name.ilike.${safeQuery})&select=student_id,student_name,avatar&limit=8`) || [];
  const ids = rows.map((row: JsonRecord) => normalizeId(row.student_id)).filter(Boolean);
  const stateRows = ids.length
    ? await supabaseRequest(`student_game_states?student_id=in.(${ids.map(encodeURIComponent).join(',')})&select=student_id,state`) || []
    : [];
  const statesById = new Map(stateRows.map((row: JsonRecord) => [normalizeId(row.student_id), row]));
  const results = rows
    .filter((row: JsonRecord) => normalizeId(row.student_id) !== studentId)
    .map((row: JsonRecord) => toPublicStudentSummary(row, (statesById.get(normalizeId(row.student_id)) || {}) as JsonRecord));
  return { ok: true, source: 'supabase', results };
}

async function sendFriendRequest(payload: JsonRecord) {
  const requesterId = normalizeId(payload.requesterStudentId);
  const receiverId = normalizeId(payload.receiverStudentId);
  if (!requesterId || !receiverId || requesterId === receiverId) return { ok: false, error: '不能添加自己。' };
  if (await isAcceptedFriend(requesterId, receiverId)) return { ok: false, error: '你们已经是好友了。' };
  const reversePending = await supabaseRequest(`friend_requests?requester_student_id=eq.${encodeURIComponent(receiverId)}&receiver_student_id=eq.${encodeURIComponent(requesterId)}&status=eq.pending&select=request_id&limit=1`) || [];
  if (reversePending.length) {
    return respondFriendRequest({ studentId: requesterId, requestId: String((reversePending as JsonRecord[])[0].request_id || ''), response: 'accepted' });
  }
  const existing = await supabaseRequest(`friend_requests?requester_student_id=eq.${encodeURIComponent(requesterId)}&receiver_student_id=eq.${encodeURIComponent(receiverId)}&status=eq.pending&select=request_id&limit=1`) || [];
  if (!existing.length) {
    await supabaseRequest('friend_requests', {
      method: 'POST',
      body: { requester_student_id: requesterId, receiver_student_id: receiverId, status: 'pending' },
      prefer: 'return=minimal'
    });
  }
  return { ok: true, source: 'supabase', requested: true };
}

async function respondFriendRequest(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const requestId = String(payload.requestId || '');
  const response = String(payload.response || '');
  if (!studentId || !requestId || !['accepted', 'rejected'].includes(response)) return { ok: false, error: '好友申请操作无效。' };
  const rows = await supabaseRequest(`friend_requests?request_id=eq.${encodeURIComponent(requestId)}&receiver_student_id=eq.${encodeURIComponent(studentId)}&status=eq.pending&select=*&limit=1`) || [];
  const request = rows[0];
  if (!request) return { ok: false, error: '找不到这则好友申请。' };
  const requesterId = normalizeId(request.requester_student_id);
  const receiverId = normalizeId(request.receiver_student_id);
  await supabaseRequest(`friend_requests?request_id=eq.${encodeURIComponent(requestId)}`, {
    method: 'PATCH',
    body: { status: response, responded_at: new Date().toISOString() },
    prefer: 'return=minimal'
  });
  await deleteFriendRelationshipNotifications(receiverId, requesterId);
  if (response === 'accepted') {
    const pair = makeFriendPair(requesterId, receiverId);
    await supabaseRequest('friendships?on_conflict=student_a_id,student_b_id', {
      method: 'POST',
      body: { student_a_id: pair.a, student_b_id: pair.b, status: 'accepted' },
      prefer: 'resolution=merge-duplicates,return=minimal'
    });
  }
  return { ok: true, source: 'supabase', status: response };
}

async function listFriends(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  if (!studentId) return { ok: false, error: 'Missing studentId' };
  const rows = await supabaseRequest(`friendships?or=(student_a_id.eq.${encodeURIComponent(studentId)},student_b_id.eq.${encodeURIComponent(studentId)})&status=eq.accepted&select=*&limit=80`) || [];
  const friendIds = Array.from(new Set((rows as JsonRecord[])
    .map((row: JsonRecord) => normalizeId(row.student_a_id) === studentId ? normalizeId(row.student_b_id) : normalizeId(row.student_a_id))
    .filter(Boolean)));
  if (!friendIds.length) return { ok: true, source: 'supabase', friends: [] };
  const idFilter = friendIds.map(encodeURIComponent).join(',');
  const [students, stateRows] = await Promise.all([
    supabaseRequest(`students?student_id=in.(${idFilter})&select=student_id,student_name,avatar`),
    supabaseRequest(`student_game_states?student_id=in.(${idFilter})&select=student_id,state`)
  ]);
  const studentsById = new Map((students || []).map((row: JsonRecord) => [normalizeId(row.student_id), row]));
  const statesById = new Map((stateRows || []).map((row: JsonRecord) => [normalizeId(row.student_id), row]));
  const friends = friendIds.map(friendId => toPublicStudentSummary(
    (studentsById.get(friendId) || { student_id: friendId, student_name: friendId, avatar: '🌟' }) as JsonRecord,
    (statesById.get(friendId) || {}) as JsonRecord
  ));
  return { ok: true, source: 'supabase', friends };
}

async function listFriendInteractionRooms(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  if (!studentId) return { ok: false, error: '学生 ID 无效。' };
  const requestedFriendIds = new Set((Array.isArray(payload.friendIds) ? payload.friendIds : [])
    .map(normalizeId)
    .filter(Boolean));
  const rows = await supabaseRequest(`friendships?or=(student_a_id.eq.${encodeURIComponent(studentId)},student_b_id.eq.${encodeURIComponent(studentId)})&status=eq.accepted&select=*&limit=80`) || [];
  const friendIds = Array.from(new Set((rows as JsonRecord[])
    .map((row: JsonRecord) => normalizeId(row.student_a_id) === studentId ? normalizeId(row.student_b_id) : normalizeId(row.student_a_id))
    .filter(friendId => friendId && (!requestedFriendIds.size || requestedFriendIds.has(friendId)))));
  if (!friendIds.length) return { ok: true, source: 'supabase', friendRooms: [] };

  const friendFilter = friendIds.map(encodeURIComponent).join(',');
  const friendPlayerRows = await supabaseRequest(`interaction_room_players?student_id=in.(${friendFilter})&select=*&limit=100`) || [];
  const friendPlayers = fromInteractionPlayerRows(friendPlayerRows as JsonRecord[]);
  const roomIds = Array.from(new Set(friendPlayers.map(player => String(player.roomId || '')).filter(Boolean)));
  if (!roomIds.length) return { ok: true, source: 'supabase', friendRooms: [] };

  const roomFilter = roomIds.map(encodeURIComponent).join(',');
  const [roomRows, roomPlayerRows] = await Promise.all([
    supabaseRequest(`interaction_rooms?room_id=in.(${roomFilter})&select=*`) || [],
    supabaseRequest(`interaction_room_players?room_id=in.(${roomFilter})&select=room_id,student_id&limit=1000`) || []
  ]);
  const roomsById = new Map((roomRows as JsonRecord[]).map(row => [String(row.room_id || ''), row]));
  const memberCounts = new Map<string, number>();
  (roomPlayerRows as JsonRecord[]).forEach(row => {
    const roomId = String(row.room_id || '');
    if (!roomId) return;
    memberCounts.set(roomId, (memberCounts.get(roomId) || 0) + 1);
  });
  const friendRooms = friendPlayers
    .map(player => {
      const roomId = String(player.roomId || '');
      const row = roomsById.get(roomId);
      if (!row) return null;
      return {
        friendStudentId: normalizeId(player.studentId),
        player,
        room: fromInteractionRoomRow(row, memberCounts.get(roomId) || 0)
      };
    })
    .filter(Boolean);
  return { ok: true, source: 'supabase', friendRooms };
}

async function getFriendProfile(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const friendId = normalizeId(payload.friendId);
  if (!studentId || !friendId) return { ok: false, error: 'Missing friend profile fields' };
  if (!(await isAcceptedFriend(studentId, friendId))) return { ok: false, error: '还不是好友，不能查看完整主页。' };
  const result = await getStudent({ studentId: friendId });
  if (!result.ok) return result;
  return { ok: true, source: 'supabase', friend: result.student };
}

async function listNotifications(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  if (!studentId) return { ok: false, error: 'Missing studentId' };
  await deleteFriendRelationshipNotifications(studentId);
  const notificationRows = await supabaseRequest(`friend_notifications?recipient_student_id=eq.${encodeURIComponent(studentId)}&select=*&order=created_at.desc&limit=40`) || [];
  const notifications = (notificationRows as JsonRecord[]).filter(row => {
    const type = String(row.type || '');
    return type !== 'friend-request' && type !== 'friend-accepted';
  });
  const requests = await supabaseRequest(`friend_requests?receiver_student_id=eq.${encodeURIComponent(studentId)}&status=eq.pending&select=*&order=created_at.desc&limit=20`) || [];
  const requesterIds = Array.from(new Set((requests as JsonRecord[]).map(row => normalizeId(row.requester_student_id)).filter(Boolean)));
  const requesterRows = requesterIds.length
    ? await supabaseRequest(`students?student_id=in.(${requesterIds.map(encodeURIComponent).join(',')})&select=student_id,student_name`) || []
    : [];
  const requesterById = new Map<string, JsonRecord>((requesterRows as JsonRecord[]).map(row => [normalizeId(row.student_id), row]));
  const enrichedRequests = (requests as JsonRecord[]).map(row => {
    const requesterId = normalizeId(row.requester_student_id);
    const requester = requesterById.get(requesterId);
    return { ...row, requester_student_name: String(requester?.student_name || requesterId || '') };
  });
  return { ok: true, source: 'supabase', notifications, requests: enrichedRequests };
}

function cloneJsonRecord(value: unknown): JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return JSON.parse(JSON.stringify(value));
}

function ensureStudentPetCollection(student: JsonRecord) {
  if (!student.petCollection || typeof student.petCollection !== 'object' || Array.isArray(student.petCollection)) student.petCollection = {};
  return student.petCollection as Record<string, JsonRecord>;
}

function removeOwnedItemFromStudent(student: JsonRecord, itemId: string, preferredPetId: string) {
  const collection = ensureStudentPetCollection(student);
  const candidatePetIds = [...new Set([preferredPetId, String(student.petType || ''), ...Object.keys(collection)].filter(Boolean))];
  for (const petId of candidatePetIds) {
    const record = (collection[petId] && typeof collection[petId] === 'object' && !Array.isArray(collection[petId])) ? collection[petId] : {};
    const ownedItems = Array.isArray(record.ownedItems) ? record.ownedItems.map(String) : [];
    if (!ownedItems.includes(itemId)) continue;
    record.ownedItems = ownedItems.filter(id => id !== itemId);
    if (record.equippedItems && typeof record.equippedItems === 'object' && !Array.isArray(record.equippedItems)) {
      Object.keys(record.equippedItems as JsonRecord).forEach(slot => {
        if (String((record.equippedItems as JsonRecord)[slot] || '') === itemId) delete (record.equippedItems as JsonRecord)[slot];
      });
    }
    collection[petId] = record;
    if (String(student.petType || '') === petId) {
      student.ownedItems = Array.isArray(record.ownedItems) ? [...record.ownedItems] : [];
      student.equippedItems = record.equippedItems || {};
    }
    return { ok: true, petId };
  }
  const ownedItems = Array.isArray(student.ownedItems) ? student.ownedItems.map(String) : [];
  if (!ownedItems.includes(itemId)) return { ok: false, petId: preferredPetId };
  student.ownedItems = ownedItems.filter(id => id !== itemId);
  return { ok: true, petId: preferredPetId || String(student.petType || '') };
}

function addOwnedItemToStudent(student: JsonRecord, itemId: string, petId: string) {
  const collection = ensureStudentPetCollection(student);
  const targetPetId = petId || String(student.petType || '') || 'gifted-items';
  const record = (collection[targetPetId] && typeof collection[targetPetId] === 'object' && !Array.isArray(collection[targetPetId])) ? collection[targetPetId] : { petId: targetPetId, ownedItems: [] };
  const ownedItems = Array.isArray(record.ownedItems) ? record.ownedItems.map(String) : [];
  if (!ownedItems.includes(itemId)) ownedItems.push(itemId);
  record.ownedItems = ownedItems;
  collection[targetPetId] = record;
  if (String(student.petType || '') === targetPetId) student.ownedItems = ownedItems;
}

function removeOwnedPetFromStudent(student: JsonRecord, petId: string) {
  const ownedPets = Array.isArray(student.ownedPets) ? student.ownedPets.map(String) : [];
  if (!ownedPets.includes(petId)) return { ok: false, payload: {} };
  if (String(student.petType || '') === petId) return { ok: false, payload: {}, active: true };
  const collection = ensureStudentPetCollection(student);
  const payload = cloneJsonRecord(collection[petId] || { petId });
  delete collection[petId];
  student.ownedPets = ownedPets.filter(id => id !== petId);
  return { ok: true, payload };
}

function addOwnedPetToStudent(student: JsonRecord, petId: string, petPayload: JsonRecord) {
  const ownedPets = Array.isArray(student.ownedPets) ? student.ownedPets.map(String) : [];
  if (!ownedPets.includes(petId)) ownedPets.push(petId);
  student.ownedPets = ownedPets;
  const collection = ensureStudentPetCollection(student);
  if (!collection[petId]) {
    collection[petId] = {
      ...petPayload,
      petId,
      petName: '',
      birthday: '',
      needsNaming: true
    };
  } else if (collection[petId] && typeof collection[petId] === 'object') {
    (collection[petId] as JsonRecord).needsNaming = Boolean((collection[petId] as JsonRecord).needsNaming);
  }
  if (!student.petType) {
    student.petType = petId;
    student.petName = '';
    student.ownedItems = Array.isArray(petPayload.ownedItems) ? petPayload.ownedItems : [];
    student.equippedItems = petPayload.equippedItems || {};
  }
}

async function sendGift(payload: JsonRecord) {
  const senderId = normalizeId(payload.senderStudentId);
  const receiverId = normalizeId(payload.receiverStudentId);
  const giftType = String(payload.giftType || 'coins');
  const amount = Math.max(0, Math.floor(toNumber(payload.amount, 0)));
  if (!senderId || !receiverId || senderId === receiverId || !['coins', 'item', 'pet', 'blind-box', 'music'].includes(giftType)) return { ok: false, error: '礼物资料无效。' };
  if (!(await isAcceptedFriend(senderId, receiverId))) return { ok: false, error: '只有好友之间可以赠送礼物。' };
  const senderResult = await getStudent({ studentId: senderId });
  if (!senderResult.ok) return senderResult;
  const sender = cloneJsonRecord(senderResult.student);
  const senderCoins = Math.max(0, Math.floor(toNumber(sender.coins, 0)));
  // Coin transfers still persist as gift_type: 'coins' in gift_ledger.
  const ledgerBody: JsonRecord = { sender_student_id: senderId, receiver_student_id: receiverId, gift_type: giftType, amount: 0, item_id: '', pet_id: '', pet_payload: {}, status: 'sent' };
  if (giftType === 'coins') {
    if (amount <= 0) return { ok: false, error: '请选择要赠送的金币数量。' };
    if (senderCoins < amount) return { ok: false, error: '金币不足，无法赠送。' };
    sender.coins = senderCoins - amount;
    ledgerBody.amount = amount;
  }
  if (giftType === 'item') {
    const itemId = String(payload.itemId || '');
    const itemPetId = String(payload.petId || '');
    if (!itemId) return { ok: false, error: '请选择要赠送的道具。' };
    if (!itemPetId) return { ok: false, error: '这件装备缺少对应宠物资料。' };
    if (amount <= 0) return { ok: false, error: '装备价格无效，无法赠送。' };
    if (senderCoins < amount) return { ok: false, error: '金币不足，无法帮好友购买这件装备。' };
    sender.coins = senderCoins - amount;
    ledgerBody.amount = amount;
    ledgerBody.item_id = itemId;
    ledgerBody.pet_id = itemPetId;
  }
  if (giftType === 'pet') {
    const petId = String(payload.petId || '');
    if (!petId) return { ok: false, error: '请选择要赠送的宠物。' };
    if (amount <= 0) return { ok: false, error: '宠物价格无效，无法赠送。' };
    if (senderCoins < amount) return { ok: false, error: '金币不足，无法帮好友购买这只宠物。' };
    sender.coins = senderCoins - amount;
    ledgerBody.amount = amount;
    ledgerBody.pet_id = petId;
    ledgerBody.pet_payload = cloneJsonRecord(payload.petPayload || { petId });
  }
  if (giftType === 'blind-box') {
    if (amount <= 0) return { ok: false, error: '盲盒价格无效，无法赠送。' };
    if (senderCoins < amount) return { ok: false, error: '金币不足，无法赠送盲盒。' };
    sender.coins = senderCoins - amount;
    ledgerBody.amount = amount;
  }
  if (giftType === 'music') {
    const trackId = String(payload.trackId || payload.itemId || '').trim();
    if (!MUSIC_BOX_GIFT_TRACK_IDS.has(trackId)) return { ok: false, error: '请选择要赠送的音乐。' };
    if (senderCoins < MUSIC_BOX_TRACK_PRICE) return { ok: false, error: '金币不足，无法赠送这首音乐。' };
    sender.coins = senderCoins - MUSIC_BOX_TRACK_PRICE;
    ledgerBody.amount = MUSIC_BOX_TRACK_PRICE;
    ledgerBody.item_id = trackId;
  }
  const nextSender = sender;
  await upsertStudentAndState(nextSender);
  const giftRows = await supabaseRequest('gift_ledger', {
    method: 'POST',
    body: ledgerBody,
    prefer: 'return=representation'
  }) || [];
  const gift = giftRows[0] || {};
  const giftCopy = giftType === 'coins'
    ? `${getPetSocialName(sender)} 送了 ${amount} 金币给你。`
    : giftType === 'item'
      ? `${getPetSocialName(sender)} 帮你买了一件装备。`
      : giftType === 'pet'
        ? `${getPetSocialName(sender)} 帮你买了一只宠物。`
        : giftType === 'music'
          ? `${getPetSocialName(sender)} 送了一首音乐给你。`
          : `${getPetSocialName(sender)} 送了一个神秘宠物盲盒给你。`;
  await createNotification(receiverId, senderId, `gift-${giftType}`, '收到礼物', giftCopy, { giftId: gift.gift_id, amount: ledgerBody.amount || amount, itemId: ledgerBody.item_id, petId: ledgerBody.pet_id, musicTrackId: giftType === 'music' ? ledgerBody.item_id : '' });
  return { ok: true, source: 'supabase', gift, student: nextSender };
}

async function sendBlindBoxDuplicateGift(payload: JsonRecord) {
  const senderId = normalizeId(payload.senderStudentId);
  const receiverId = normalizeId(payload.receiverStudentId);
  const duplicateId = String(payload.duplicateId || '');
  if (!senderId || !receiverId || senderId === receiverId || !duplicateId) return { ok: false, error: '重复奖励资料无效。' };
  if (!(await isAcceptedFriend(senderId, receiverId))) return { ok: false, error: '只有好友之间可以赠送奖励。' };
  const senderResult = await getStudent({ studentId: senderId });
  if (!senderResult.ok) return senderResult;
  const sender = cloneJsonRecord(senderResult.student);
  const duplicates = Array.isArray(sender.pendingBlindBoxDuplicates) ? sender.pendingBlindBoxDuplicates as JsonRecord[] : [];
  const duplicate = duplicates.find(entry => String(entry.duplicateId || '') === duplicateId);
  if (!duplicate) return { ok: false, error: '这个重复奖励已经处理过了。' };
  const duplicateType = String(duplicate.type || '');
  if (!['item', 'pet', 'music'].includes(duplicateType)) return { ok: false, error: '重复奖励类型无效。' };
  const duplicateTrackId = duplicateType === 'music' ? String(duplicate.trackId || duplicate.itemId || '').trim() : '';
  if (duplicateType === 'music' && !MUSIC_BOX_GIFT_TRACK_IDS.has(duplicateTrackId)) return { ok: false, error: '这首音乐奖励资料无效。' };
  sender.pendingBlindBoxDuplicates = duplicates.filter(entry => String(entry.duplicateId || '') !== duplicateId);
  const ledgerBody: JsonRecord = {
    sender_student_id: senderId,
    receiver_student_id: receiverId,
    gift_type: duplicateType,
    amount: 0,
    item_id: duplicateType === 'music' ? duplicateTrackId : (duplicateType === 'item' ? String(duplicate.itemId || '') : ''),
    pet_id: duplicateType === 'music' ? '' : String(duplicate.petId || ''),
    pet_payload: {},
    status: 'sent'
  };
  if (duplicateType === 'pet') {
    ledgerBody.pet_payload = {
      petId: String(duplicate.petId || ''),
      petName: '',
      rarity: String(duplicate.rarity || 'A'),
      petLevel: 1,
      experience: 0,
      equippedItems: {},
      ownedItems: [],
      birthday: '',
      evolved: false,
      miniEvolved: false,
      needsNaming: true
    };
  }
  await upsertStudentAndState(sender);
  const giftRows = await supabaseRequest('gift_ledger', {
    method: 'POST',
    body: ledgerBody,
    prefer: 'return=representation'
  }) || [];
  const gift = giftRows[0] || {};
  await createNotification(
    receiverId,
    senderId,
    `gift-${duplicateType}`,
    '收到礼物',
    `${getPetSocialName(sender)} 把盲盒抽到的 ${String(duplicate.name || '重复奖励')} 送给你。`,
    { giftId: gift.gift_id, itemId: ledgerBody.item_id, petId: ledgerBody.pet_id, musicTrackId: duplicateType === 'music' ? ledgerBody.item_id : '' }
  );
  return { ok: true, source: 'supabase', gift, student: sender };
}

async function claimGift(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const giftId = String(payload.giftId || '');
  if (!studentId || !giftId) return { ok: false, error: '领取资料无效。' };
  const claimedRows = await supabaseRequest(`gift_ledger?gift_id=eq.${encodeURIComponent(giftId)}&receiver_student_id=eq.${encodeURIComponent(studentId)}&status=eq.sent`, {
    method: 'PATCH',
    body: { status: 'claimed', claimed_at: new Date().toISOString() },
    prefer: 'return=representation'
  }) || [];
  const gift = claimedRows[0];
  if (!gift) return { ok: false, error: '这份礼物已经领取或不存在。' };
  const receiverResult = await getStudent({ studentId });
  if (!receiverResult.ok) return receiverResult;
  const receiver = receiverResult.student as JsonRecord;
  const amount = Math.max(0, Math.floor(toNumber(gift.amount, 0)));
  const nextReceiver = cloneJsonRecord(receiver);
  const giftType = String(gift.gift_type || gift.giftType || '');
  if (giftType === 'coins') nextReceiver.coins = Math.max(0, Math.floor(toNumber(receiver.coins, 0))) + amount;
  if (giftType === 'item') addOwnedItemToStudent(nextReceiver, String(gift.item_id || ''), String(gift.pet_id || ''));
  if (giftType === 'pet') addOwnedPetToStudent(nextReceiver, String(gift.pet_id || ''), cloneJsonRecord(gift.pet_payload));
  if (giftType === 'blind-box') nextReceiver.blindBoxes = Math.max(0, Math.floor(toNumber(receiver.blindBoxes, 0))) + 1;
  if (giftType === 'music') {
    const trackId = String(gift.item_id || '').trim();
    if (MUSIC_BOX_GIFT_TRACK_IDS.has(trackId)) {
      nextReceiver.ownedMusicTracks = uniqueStringList(
        [DEFAULT_MUSIC_TRACK_ID],
        nextReceiver.ownedMusicTracks,
        nextReceiver.ownedMusicTrackIds,
        nextReceiver.owned_music_tracks,
        [trackId]
      );
    }
  }
  await upsertStudentAndState(nextReceiver);
  const notificationRows = await supabaseRequest(`friend_notifications?recipient_student_id=eq.${encodeURIComponent(studentId)}&type=eq.gift-${encodeURIComponent(giftType)}&select=notification_id,payload`) || [];
  await Promise.all(notificationRows
    .filter((row: JsonRecord) => String(((row.payload || {}) as JsonRecord).giftId || '') === giftId)
    .map((row: JsonRecord) => supabaseRequest(`friend_notifications?notification_id=eq.${encodeURIComponent(String(row.notification_id || ''))}`, {
      method: 'PATCH',
      body: { claimed_at: new Date().toISOString(), read_at: new Date().toISOString() },
      prefer: 'return=minimal'
    })));
  return { ok: true, source: 'supabase', gift: { ...gift, status: 'claimed' }, student: nextReceiver };
}

async function markNotificationRead(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const notificationId = String(payload.notificationId || '');
  if (!studentId || !notificationId) return { ok: false, error: '通知资料无效。' };
  const rows = await supabaseRequest(`friend_notifications?notification_id=eq.${encodeURIComponent(notificationId)}&recipient_student_id=eq.${encodeURIComponent(studentId)}&select=notification_id,type,claimed_at,payload&limit=1`) || [];
  const notification = (rows as JsonRecord[])[0];
  if (!notification) return { ok: true, source: 'supabase' };
  if (isPendingGiftNotificationRow(notification)) return { ok: false, error: '请先领取这份礼物。' };
  await supabaseRequest(`friend_notifications?notification_id=eq.${encodeURIComponent(notificationId)}&recipient_student_id=eq.${encodeURIComponent(studentId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  return { ok: true, source: 'supabase' };
}

async function clearReadNotifications(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  if (!studentId) return { ok: false, error: '通知资料无效。' };
  const rows = await supabaseRequest(`friend_notifications?recipient_student_id=eq.${encodeURIComponent(studentId)}&select=notification_id,type,claimed_at,payload&limit=80`) || [];
  await Promise.all((rows as JsonRecord[])
    .filter(row => !isPendingGiftNotificationRow(row))
    .map(row => supabaseRequest(`friend_notifications?notification_id=eq.${encodeURIComponent(String(row.notification_id || ''))}&recipient_student_id=eq.${encodeURIComponent(studentId)}`, {
      method: 'DELETE',
      prefer: 'return=minimal'
    })));
  return listNotifications({ studentId });
}

async function ensureRoom(roomOwnerStudentId: string) {
  const ownerId = normalizeId(roomOwnerStudentId);
  const roomId = generateRoomCode(ownerId);
  await supabaseRequest('student_rooms?on_conflict=room_owner_student_id', {
    method: 'POST',
    body: { room_owner_student_id: ownerId, room_id: roomId, scene_id: 'open-grassland' },
    prefer: 'resolution=ignore-duplicates,return=minimal'
  });
  const rows = await supabaseRequest(`student_rooms?room_owner_student_id=eq.${encodeURIComponent(ownerId)}&select=room_id&limit=1`) || [];
  if (!String((rows as JsonRecord[])[0]?.room_id || '').trim()) {
    await supabaseRequest(`student_rooms?room_owner_student_id=eq.${encodeURIComponent(ownerId)}`, {
      method: 'PATCH',
      body: { room_id: roomId },
      prefer: 'return=minimal'
    });
  }
  await supabaseRequest('student_room_memberships?on_conflict=student_id,room_owner_student_id', {
    method: 'POST',
    body: { student_id: ownerId, room_owner_student_id: ownerId, status: 'accepted', responded_at: new Date().toISOString() },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
}

function generateRoomCode(seed: string) {
  const normalized = normalizeId(seed);
  let hash = 2166136261;
  for (let index = 0; index < normalized.length; index += 1) {
    hash ^= normalized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `ROOM${String(Math.abs(hash) % 100000).padStart(5, '0')}`;
}

async function canEditRoom(actorStudentId: string, roomOwnerStudentId: string) {
  const actorId = normalizeId(actorStudentId);
  const ownerId = normalizeId(roomOwnerStudentId);
  if (actorId === ownerId) return true;
  return isAcceptedFriend(actorId, ownerId);
}

async function ensureRoomMembership(studentId: string, roomOwnerStudentId: string) {
  const actorId = normalizeId(studentId);
  const ownerId = normalizeId(roomOwnerStudentId);
  if (!actorId || !ownerId) return { ok: false, error: '房间资料无效。' };
  await ensureRoom(ownerId);
  const roomRows = await supabaseRequest(`student_rooms?room_owner_student_id=eq.${encodeURIComponent(ownerId)}&select=is_closed&limit=1`) || [];
  if (actorId !== ownerId && Boolean((roomRows as JsonRecord[])[0]?.is_closed)) {
    return { ok: false, error: '这个宠物墙已经关闭，暂时不能进入。' };
  }
  const existing = await supabaseRequest(`student_room_memberships?student_id=eq.${encodeURIComponent(actorId)}&room_owner_student_id=eq.${encodeURIComponent(ownerId)}&select=membership_id,status&limit=1`) || [];
  const existingStatus = String((existing as JsonRecord[])[0]?.status || '');
  if (existingStatus === 'accepted') return { ok: true };
  if (existingStatus === 'pending') return { ok: false, pendingApproval: true, error: '房主还没有批准你的加入申请。' };
  return { ok: false, error: '需要先申请加入，并等待房主批准。' };
}

async function requestRoomJoin(studentId: string, roomOwnerStudentId: string) {
  const actorId = normalizeId(studentId);
  const ownerId = normalizeId(roomOwnerStudentId);
  if (!actorId || !ownerId) return { ok: false, error: '房间资料无效。' };
  await ensureRoom(ownerId);
  if (actorId === ownerId) return { ok: true, accepted: true };
  const roomRows = await supabaseRequest(`student_rooms?room_owner_student_id=eq.${encodeURIComponent(ownerId)}&select=is_closed&limit=1`) || [];
  if (Boolean((roomRows as JsonRecord[])[0]?.is_closed)) return { ok: false, error: '这个宠物墙已经关闭，暂时不能申请加入。' };
  const existing = await supabaseRequest(`student_room_memberships?student_id=eq.${encodeURIComponent(actorId)}&room_owner_student_id=eq.${encodeURIComponent(ownerId)}&select=membership_id,status&limit=1`) || [];
  const existingRow = (existing as JsonRecord[])[0];
  const existingStatus = String(existingRow?.status || '');
  if (existingStatus === 'accepted') return { ok: true, accepted: true };
  if (existingStatus === 'pending') return { ok: true, pendingApproval: true, error: '申请已经送出，等待房主批准。' };
  const memberships = await supabaseRequest(`student_room_memberships?student_id=eq.${encodeURIComponent(actorId)}&status=eq.accepted&select=room_owner_student_id&limit=${ROOM_MEMBERSHIP_LIMIT + 1}`) || [];
  const joinedRoomIds = new Set((memberships as JsonRecord[]).map(row => normalizeId(row.room_owner_student_id)).filter(ownerId => ownerId && ownerId !== actorId));
  if (joinedRoomIds.size >= ROOM_MEMBERSHIP_LIMIT - 1) return { ok: false, error: '最多只能加入 3 间宠物墙房间，包括自己的房间。' };
  const roomMemberships = await supabaseRequest(`student_room_memberships?room_owner_student_id=eq.${encodeURIComponent(ownerId)}&status=eq.accepted&select=student_id&limit=${ROOM_MEMBER_LIMIT + 1}`) || [];
  const currentMemberIds = new Set((roomMemberships as JsonRecord[]).map(row => normalizeId(row.student_id)).filter(memberId => memberId && memberId !== ownerId));
  if (currentMemberIds.size >= ROOM_MEMBER_LIMIT - 1) return { ok: false, error: `这个宠物墙已经有 ${ROOM_MEMBER_LIMIT} 位同学，暂时不能申请加入。` };
  await supabaseRequest('student_room_memberships?on_conflict=student_id,room_owner_student_id', {
    method: 'POST',
    body: { student_id: actorId, room_owner_student_id: ownerId, status: 'pending', requested_at: new Date().toISOString(), responded_at: null },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  return { ok: true, pendingApproval: true, error: '申请已经送出，等待房主批准。' };
}

function fromRoomMessageRows(rows: JsonRecord[] = []) {
  return rows.map(row => ({
    messageId: String(row.message_id || ''),
    roomOwnerStudentId: normalizeId(row.room_owner_student_id),
    studentId: normalizeId(row.student_id),
    studentName: String(row.student_name || row.student_id || ''),
    petName: String(row.pet_name || row.student_name || row.student_id || ''),
    text: String(row.text || ''),
    createdAt: String(row.created_at || new Date().toISOString())
  }));
}

async function listRooms(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  if (!studentId) return { ok: false, error: '学生 ID 无效。' };
  await ensureRoom(studentId);
  const membershipRows = await supabaseRequest(`student_room_memberships?student_id=eq.${encodeURIComponent(studentId)}&status=in.(accepted,pending)&select=room_owner_student_id,status,created_at&order=created_at.asc`) || [];
  const acceptedMembershipRows = (membershipRows as JsonRecord[]).filter(row => String(row.status || '') === 'accepted');
  const pendingMembershipRows = (membershipRows as JsonRecord[]).filter(row => String(row.status || '') === 'pending');
  const acceptedRoomIds = acceptedMembershipRows.map(row => normalizeId(row.room_owner_student_id)).filter(ownerId => ownerId && ownerId !== studentId);
  const candidateIds = Array.from(new Set([studentId, ...acceptedRoomIds]));
  const idFilter = candidateIds.map(encodeURIComponent).join(',');
  const [roomRows, ownerRows, ownerStateRows, candidateMembershipRows] = await Promise.all([
    supabaseRequest(`student_rooms?room_owner_student_id=in.(${idFilter})&select=*`) || [],
    supabaseRequest(`students?student_id=in.(${idFilter})&select=student_id,student_name,avatar`) || [],
    supabaseRequest(`student_game_states?student_id=in.(${idFilter})&select=student_id,state`) || [],
    supabaseRequest(`student_room_memberships?room_owner_student_id=in.(${idFilter})&status=eq.accepted&select=room_owner_student_id,student_id`) || []
  ]);
  const roomsByOwner = new Map<string, JsonRecord>((roomRows as JsonRecord[]).map(row => [normalizeId(row.room_owner_student_id), row]));
  const joinedIds = new Set(acceptedMembershipRows.map(row => normalizeId(row.room_owner_student_id)).filter(ownerId => ownerId && ownerId !== studentId));
  const pendingIds = new Set(pendingMembershipRows.map(row => normalizeId(row.room_owner_student_id)).filter(ownerId => ownerId && ownerId !== studentId));
  const memberIdsByOwner = new Map<string, Set<string>>();
  (candidateMembershipRows as JsonRecord[]).forEach(row => {
    const ownerId = normalizeId(row.room_owner_student_id);
    const memberId = normalizeId(row.student_id);
    if (!ownerId || !memberId || memberId === ownerId) return;
    if (!memberIdsByOwner.has(ownerId)) memberIdsByOwner.set(ownerId, new Set());
    memberIdsByOwner.get(ownerId)?.add(memberId);
  });
  const ownerById = new Map<string, JsonRecord>((ownerRows as JsonRecord[]).map(row => [normalizeId(row.student_id), row]));
  const ownerStateById = new Map<string, JsonRecord>((ownerStateRows as JsonRecord[]).map(row => [normalizeId(row.student_id), row]));
  const rooms = candidateIds.map(ownerId => {
    const owner = (ownerById.get(ownerId) || { student_id: ownerId, student_name: ownerId, avatar: '🌟' }) as JsonRecord;
    const ownerSummary = toPublicStudentSummary(owner, (ownerStateById.get(ownerId) || {}) as JsonRecord);
    const room = roomsByOwner.get(ownerId) || { room_owner_student_id: ownerId, scene_id: 'open-grassland' };
    return {
      roomOwnerStudentId: ownerId,
      roomId: String(room.room_id || generateRoomCode(ownerId)),
      ownerName: ownerId === studentId ? '我的房间' : String(ownerSummary.petName || ownerSummary.studentName || ownerId),
      ownerStudentName: ownerId === studentId ? '我' : String(ownerSummary.studentName || ownerId),
      ownerPetName: ownerId === studentId ? '' : String(ownerSummary.petName || ''),
      ownerPetType: ownerId === studentId ? '' : String(ownerSummary.petType || ''),
      roomName: String(room.room_name || ''),
      sceneId: String(room.scene_id || 'open-grassland'),
      isClosed: Boolean(room.is_closed),
      joined: ownerId === studentId || joinedIds.has(ownerId),
      pendingApproval: pendingIds.has(ownerId),
      memberCount: Math.max(1, 1 + (memberIdsByOwner.get(ownerId)?.size || 0)),
      memberLimit: ROOM_MEMBER_LIMIT,
      isOwnRoom: ownerId === studentId
    };
  });
  return { ok: true, source: 'supabase', rooms, membershipCount: Math.max(1, 1 + joinedIds.size), membershipLimit: ROOM_MEMBERSHIP_LIMIT };
}

async function getRoomMembers(roomOwnerStudentId: string) {
  const ownerId = normalizeId(roomOwnerStudentId);
  const membershipRows = await supabaseRequest(`student_room_memberships?room_owner_student_id=eq.${encodeURIComponent(ownerId)}&status=eq.accepted&select=student_id,created_at&order=created_at.asc&limit=20`) || [];
  const memberIds = Array.from(new Set([ownerId, ...(membershipRows as JsonRecord[]).map(row => normalizeId(row.student_id)).filter(Boolean)])).slice(0, ROOM_MEMBER_LIMIT);
  if (!memberIds.length) return [];
  const idFilter = memberIds.map(encodeURIComponent).join(',');
  const [studentRows, stateRows] = await Promise.all([
    supabaseRequest(`students?student_id=in.(${idFilter})&select=student_id,student_name,avatar`),
    supabaseRequest(`student_game_states?student_id=in.(${idFilter})&select=student_id,state`)
  ]);
  const studentsById = new Map((studentRows || []).map((row: JsonRecord) => [normalizeId(row.student_id), row]));
  const statesById = new Map((stateRows || []).map((row: JsonRecord) => [normalizeId(row.student_id), row]));
  return memberIds.map(studentId => {
    const studentRow = (studentsById.get(studentId) || { student_id: studentId, student_name: studentId, avatar: '🌟' }) as JsonRecord;
    const summary = toPublicStudentSummary(studentRow, (statesById.get(studentId) || {}) as JsonRecord);
    return { ...summary, isOwner: studentId === ownerId };
  }).filter(member => String(member.petType || ''));
}

async function getRoomJoinRequests(roomOwnerStudentId: string) {
  const ownerId = normalizeId(roomOwnerStudentId);
  const requestRows = await supabaseRequest(`student_room_memberships?room_owner_student_id=eq.${encodeURIComponent(ownerId)}&status=eq.pending&select=membership_id,student_id,requested_at&order=requested_at.asc&limit=20`) || [];
  const requesterIds = Array.from(new Set((requestRows as JsonRecord[]).map(row => normalizeId(row.student_id)).filter(Boolean)));
  if (!requesterIds.length) return [];
  const idFilter = requesterIds.map(encodeURIComponent).join(',');
  const [studentRows, stateRows] = await Promise.all([
    supabaseRequest(`students?student_id=in.(${idFilter})&select=student_id,student_name,avatar`),
    supabaseRequest(`student_game_states?student_id=in.(${idFilter})&select=student_id,state`)
  ]);
  const studentsById = new Map((studentRows || []).map((row: JsonRecord) => [normalizeId(row.student_id), row]));
  const statesById = new Map((stateRows || []).map((row: JsonRecord) => [normalizeId(row.student_id), row]));
  return (requestRows as JsonRecord[]).map(row => {
    const requesterId = normalizeId(row.student_id);
    const requesterRow = (studentsById.get(requesterId) || { student_id: requesterId, student_name: requesterId, avatar: '🌟' }) as JsonRecord;
    const summary = toPublicStudentSummary(
      requesterRow,
      (statesById.get(requesterId) || {}) as JsonRecord
    );
    return {
      requestId: String(row.membership_id || ''),
      requestedAt: String(row.requested_at || new Date().toISOString()),
      ...summary
    };
  });
}

async function listRoom(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  if (!studentId || !roomOwnerStudentId) return { ok: false, error: '房间资料无效。' };
  const membership = await ensureRoomMembership(studentId, roomOwnerStudentId);
  if (!membership.ok) return membership;
  const messageSince = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const [roomRows, slotRows, decorations, messages, members, pendingRequests] = await Promise.all([
    supabaseRequest(`student_rooms?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&select=*&limit=1`),
    supabaseRequest(`room_pet_slots?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&select=*&order=slot_index.asc`),
    supabaseRequest(`room_decorations?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&select=*&order=created_at.asc&limit=30`),
    supabaseRequest(`room_messages?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&created_at=gte.${encodeURIComponent(messageSince)}&select=*&order=created_at.asc&limit=80`),
    getRoomMembers(roomOwnerStudentId),
    studentId === roomOwnerStudentId ? getRoomJoinRequests(roomOwnerStudentId) : Promise.resolve([])
  ]);
  return { ok: true, source: 'supabase', room: roomRows?.[0] || { room_owner_student_id: roomOwnerStudentId, scene_id: 'open-grassland' }, slots: slotRows || [], members: members || [], pendingRequests: pendingRequests || [], decorations: decorations || [], messages: fromRoomMessageRows(messages || []) };
}

async function joinRoomByCode(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomCode = String(payload.roomCode || payload.roomId || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!studentId || !roomCode) return { ok: false, error: '请输入房间 ID。' };
  const rows = await supabaseRequest(`student_rooms?room_id=eq.${encodeURIComponent(roomCode)}&select=room_owner_student_id,is_closed&limit=1`) || [];
  const room = (rows as JsonRecord[])[0];
  if (!room) return { ok: false, error: '找不到这个房间 ID。' };
  const roomOwnerStudentId = normalizeId(room.room_owner_student_id);
  const membership = await requestRoomJoin(studentId, roomOwnerStudentId);
  if (!membership.ok) return membership;
  if (membership.pendingApproval) return { ok: true, source: 'supabase', pendingApproval: true, roomOwnerStudentId, message: '申请已经送出，等待房主批准。' };
  return listRoom({ studentId, roomOwnerStudentId });
}

async function requestRoomJoinByOwner(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId);
  if (!studentId || !roomOwnerStudentId) return { ok: false, error: '房间资料无效。' };
  const membership = await requestRoomJoin(studentId, roomOwnerStudentId);
  if (!membership.ok) return membership;
  if (membership.pendingApproval) return { ok: true, source: 'supabase', pendingApproval: true, roomOwnerStudentId, message: '申请已经送出，等待房主批准。' };
  return { ok: true, source: 'supabase', accepted: true, roomOwnerStudentId, message: '你已经加入这个宠物墙。' };
}

async function respondRoomJoinRequest(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  const requesterStudentId = normalizeId(payload.requesterStudentId);
  const decision = String(payload.decision || '').trim().toLowerCase();
  if (!studentId || studentId !== roomOwnerStudentId) return { ok: false, error: '只有房主可以处理加入申请。' };
  if (!requesterStudentId || requesterStudentId === roomOwnerStudentId || !['accept', 'reject'].includes(decision)) {
    return { ok: false, error: '申请资料无效。' };
  }
  await ensureRoom(roomOwnerStudentId);
  if (decision === 'accept') {
    const memberships = await supabaseRequest(`student_room_memberships?student_id=eq.${encodeURIComponent(requesterStudentId)}&status=eq.accepted&select=room_owner_student_id&limit=${ROOM_MEMBERSHIP_LIMIT + 1}`) || [];
    const joinedRoomIds = new Set((memberships as JsonRecord[]).map(row => normalizeId(row.room_owner_student_id)).filter(ownerId => ownerId && ownerId !== requesterStudentId));
    if (joinedRoomIds.size >= ROOM_MEMBERSHIP_LIMIT - 1) return { ok: false, error: '这位同学已经加入 3 间宠物墙，暂时不能批准。' };
    const roomMemberships = await supabaseRequest(`student_room_memberships?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&status=eq.accepted&select=student_id&limit=${ROOM_MEMBER_LIMIT + 1}`) || [];
    const currentMemberIds = new Set((roomMemberships as JsonRecord[]).map(row => normalizeId(row.student_id)).filter(memberId => memberId && memberId !== roomOwnerStudentId));
    if (!currentMemberIds.has(requesterStudentId) && currentMemberIds.size >= ROOM_MEMBER_LIMIT - 1) return { ok: false, error: `这个宠物墙已经有 ${ROOM_MEMBER_LIMIT} 位同学，暂时不能批准更多人。` };
  }
  await supabaseRequest(`student_room_memberships?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&student_id=eq.${encodeURIComponent(requesterStudentId)}`, {
    method: 'PATCH',
    body: { status: decision === 'accept' ? 'accepted' : 'rejected', responded_at: new Date().toISOString() },
    prefer: 'return=minimal'
  });
  return listRoom({ studentId, roomOwnerStudentId });
}

async function updateRoomScene(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  const sceneId = String(payload.sceneId || 'open-grassland');
  const membership = await ensureRoomMembership(studentId, roomOwnerStudentId);
  if (!membership.ok) return membership;
  await supabaseRequest(`student_rooms?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}`, {
    method: 'PATCH',
    body: { scene_id: sceneId },
    prefer: 'return=minimal'
  });
  return listRoom({ studentId, roomOwnerStudentId });
}

async function updateRoomSettings(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  if (!studentId || studentId !== roomOwnerStudentId) return { ok: false, error: '只能设置自己的宠物墙。' };
  await ensureRoom(roomOwnerStudentId);
  const patchBody: JsonRecord = {};
  if (Object.prototype.hasOwnProperty.call(payload, 'roomName')) {
    const rawName = String(payload.roomName || '').trim();
    if (rawName) {
      const validation = validatePublicText(rawName, 18);
      if (!validation.ok) return { ok: false, error: validation.error };
      patchBody.room_name = validation.text;
    } else {
      patchBody.room_name = '';
    }
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'isClosed')) {
    patchBody.is_closed = Boolean(payload.isClosed);
  }
  if (!Object.keys(patchBody).length) return listRoom({ studentId, roomOwnerStudentId });
  await supabaseRequest(`student_rooms?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}`, {
    method: 'PATCH',
    body: patchBody,
    prefer: 'return=minimal'
  });
  return listRoom({ studentId, roomOwnerStudentId });
}

async function closeRoom(payload: JsonRecord) {
  return updateRoomSettings({ ...payload, isClosed: true });
}

async function addRoomPet(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  const guestStudentId = normalizeId(payload.guestStudentId || studentId);
  const petId = String(payload.petId || '');
  // The database check also enforces the same 0-based member slot range.
  const slotIndex = Math.max(0, Math.min(ROOM_MEMBER_LIMIT - 1, Math.floor(toNumber(payload.slotIndex, 0))));
  if (!(await canEditRoom(studentId, roomOwnerStudentId)) || !(await canEditRoom(guestStudentId, roomOwnerStudentId))) return { ok: false, error: '只有房主和好友宠物可以加入房间。' };
  const membership = await ensureRoomMembership(studentId, roomOwnerStudentId);
  if (!membership.ok) return membership;
  await supabaseRequest('room_pet_slots?on_conflict=room_owner_student_id,slot_index', {
    method: 'POST',
    body: { room_owner_student_id: roomOwnerStudentId, slot_index: slotIndex, guest_student_id: guestStudentId, pet_id: petId },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  return listRoom({ studentId, roomOwnerStudentId });
}

async function removeRoomPet(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  const slotIndex = Math.max(0, Math.min(ROOM_MEMBER_LIMIT - 1, Math.floor(toNumber(payload.slotIndex, 0))));
  if (!(await canEditRoom(studentId, roomOwnerStudentId))) return { ok: false, error: '没有权限调整这个房间。' };
  await supabaseRequest(`room_pet_slots?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&slot_index=eq.${slotIndex}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  return listRoom({ studentId, roomOwnerStudentId });
}

async function removeRoomMember(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  const memberStudentId = normalizeId(payload.memberStudentId);
  if (!studentId || !memberStudentId) return { ok: false, error: '成员资料无效。' };
  if (studentId !== roomOwnerStudentId) return { ok: false, error: '只有房主可以移除房间成员。' };
  if (memberStudentId === roomOwnerStudentId) return { ok: false, error: '不能把自己移出自己的宠物墙。' };
  await supabaseRequest(`student_room_memberships?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&student_id=eq.${encodeURIComponent(memberStudentId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  await supabaseRequest(`room_pet_slots?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&guest_student_id=eq.${encodeURIComponent(memberStudentId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  return listRoom({ studentId, roomOwnerStudentId });
}

async function resetRoom(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  if (!studentId || studentId !== roomOwnerStudentId) return { ok: false, error: '只有房主可以重置自己的房间。' };
  await ensureRoom(roomOwnerStudentId);
  await supabaseRequest(`room_messages?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  await supabaseRequest(`room_decorations?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  await supabaseRequest(`room_pet_slots?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  await supabaseRequest(`student_room_memberships?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&student_id=neq.${encodeURIComponent(roomOwnerStudentId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  await supabaseRequest(`student_rooms?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}`, {
    method: 'PATCH',
    body: { room_name: '', scene_id: 'open-grassland', is_closed: false, updated_at: new Date().toISOString() },
    prefer: 'return=minimal'
  });
  return listRoom({ studentId, roomOwnerStudentId });
}

async function placeRoomDecoration(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  const decorationItemId = String(payload.decorationItemId || '');
  const price = Math.max(0, Math.floor(toNumber(payload.price, 0)));
  if (!decorationItemId) return { ok: false, error: '请选择装饰。' };
  const membership = await ensureRoomMembership(studentId, roomOwnerStudentId);
  if (!membership.ok) return membership;
  const payerResult = await getStudent({ studentId });
  if (!payerResult.ok) return payerResult;
  const payer = payerResult.student as JsonRecord;
  const nextCoins = Math.floor(toNumber(payer.coins, 0)) - price;
  if (nextCoins < 0) return { ok: false, error: '金币不足，无法布置。' };
  await upsertStudentAndState({ ...payer, coins: nextCoins });
  await ensureRoom(roomOwnerStudentId);
  await supabaseRequest('room_decorations', {
    method: 'POST',
    body: {
      room_owner_student_id: roomOwnerStudentId,
      decoration_item_id: decorationItemId,
      x_percent: Math.max(0, Math.min(100, toNumber(payload.xPercent, 50))),
      y_percent: Math.max(0, Math.min(100, toNumber(payload.yPercent, 70))),
      grid_row: Math.max(0, Math.floor(toNumber(payload.gridRow, 0))),
      grid_col: Math.max(0, Math.floor(toNumber(payload.gridCol, 0))),
      scale: Math.max(0.5, Math.min(1.8, toNumber(payload.scale, 1))),
      layer_index: Math.floor(toNumber(payload.layerIndex, 0)),
      placed_by_student_id: studentId
    },
    prefer: 'return=minimal'
  });
  const room = await listRoom({ studentId, roomOwnerStudentId });
  return { ...room, student: { ...payer, coins: nextCoins } };
}

async function removeRoomDecoration(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  const decorationId = String(payload.decorationId || '');
  if (!decorationId) return { ok: false, error: '装饰资料无效。' };
  const membership = await ensureRoomMembership(studentId, roomOwnerStudentId);
  if (!membership.ok) return membership;
  await supabaseRequest(`room_decorations?room_owner_student_id=eq.${encodeURIComponent(roomOwnerStudentId)}&decoration_id=eq.${encodeURIComponent(decorationId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  return listRoom({ studentId, roomOwnerStudentId });
}

async function sendRoomMessage(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomOwnerStudentId = normalizeId(payload.roomOwnerStudentId || studentId);
  const textValidation = validatePublicText(payload.text, 60);
  if (!textValidation.ok) return { ok: false, error: textValidation.error };
  const membership = await ensureRoomMembership(studentId, roomOwnerStudentId);
  if (!membership.ok) return membership;
  const senderResult = await getStudent({ studentId });
  const sender = senderResult.ok ? senderResult.student as JsonRecord : { studentId };
  await supabaseRequest('room_messages', {
    method: 'POST',
    body: {
      room_owner_student_id: roomOwnerStudentId,
      student_id: studentId,
      student_name: String(sender.studentName || sender.name || studentId),
      pet_name: getPetSocialName(sender),
      text: textValidation.text
    },
    prefer: 'return=minimal'
  });
  return listRoom({ studentId, roomOwnerStudentId });
}

function normalizeInteractionRoomId(value: unknown) {
  return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
}

function normalizeInteractionRoomMapSetId(value: unknown) {
  const mapSetId = String(value || '').trim().toLowerCase();
  return INTERACTION_ROOM_MAP_SET_IDS.has(mapSetId) ? mapSetId : 'cy-town';
}

function getInteractionRoomStartMapId(mapSetId: string) {
  const normalizedMapSetId = normalizeInteractionRoomMapSetId(mapSetId);
  if (normalizedMapSetId === 'cy-bay') return 'bay-amusement';
  if (normalizedMapSetId === 'tokyo-night') return 'tokyo-tower';
  if (normalizedMapSetId === 'kl-pavilion-night') return 'kl-pavilion-fountain';
  if (normalizedMapSetId === 'sunset-farm') return 'farm-sheep-meadow';
  if (normalizedMapSetId === 'movie-park') return 'studio-globe-entrance';
  if (normalizedMapSetId === 'cy-school') return 'school-gate';
  if (normalizedMapSetId === 'paris-trip') return 'paris-eiffel-riverside';
  if (normalizedMapSetId === 'xian-trip') return 'xian-city-wall-gate';
  if (normalizedMapSetId === 'beijing-trip') return 'beijing-forbidden-city-gate';
  if (normalizedMapSetId === 'usa-trip') return 'usa-new-york-harbor';
  if (normalizedMapSetId === 'uk-trip') return 'uk-london-thames';
  return 'home';
}

function getInteractionRoomStartY(mapSetId: string) {
  const normalizedMapSetId = normalizeInteractionRoomMapSetId(mapSetId);
  if (normalizedMapSetId === 'cy-bay') return 340;
  if (normalizedMapSetId === 'tokyo-night') return 336;
  if (normalizedMapSetId === 'kl-pavilion-night') return 360;
  if (normalizedMapSetId === 'sunset-farm') return 356;
  if (normalizedMapSetId === 'movie-park') return 354;
  if (normalizedMapSetId === 'cy-school') return 360;
  if (normalizedMapSetId === 'paris-trip') return 360;
  if (normalizedMapSetId === 'xian-trip') return 360;
  if (normalizedMapSetId === 'beijing-trip') return 362;
  if (normalizedMapSetId === 'usa-trip') return 358;
  if (normalizedMapSetId === 'uk-trip') return 358;
  return 328;
}

function normalizeInteractionRoomMemberLimit(value: unknown) {
  const limit = Math.trunc(toNumber(value, INTERACTION_ROOM_DEFAULT_MEMBER_LIMIT));
  return Math.max(1, Math.min(INTERACTION_ROOM_MAX_MEMBER_LIMIT, limit));
}

function normalizeInteractionPassword(value: unknown) {
  return String(value || '').replace(/\D/g, '').slice(0, 4);
}

function generateInteractionRoomId() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return `ROOM${String(values[0] % 1000000).padStart(6, '0')}`;
}

async function getInteractionProfile(studentId: string): Promise<InteractionProfileResult> {
  const result = await getStudent({ studentId });
  if (!result.ok) {
    const errorResult = result as JsonRecord;
    return {
      ok: false,
      error: String(errorResult.error || '暂时找不到这个学生 ID。'),
      errorCode: String(errorResult.errorCode || ''),
      fallbackAllowed: Boolean(errorResult.fallbackAllowed)
    };
  }
  const student = result.student as JsonRecord;
  const ownedPets = Array.isArray(student.ownedPets) ? student.ownedPets.map(value => String(value || '')).filter(Boolean) : [];
  const petId = String(student.petType || ownedPets[0] || 'kuromi');
  return {
    ok: true,
    studentId: normalizeId(student.studentId),
    studentName: String(student.studentName || student.name || student.studentId || ''),
    petId,
    petStage: getInteractionPetStageFromStudent(student, petId),
    petStyle: getInteractionPetStyleFromStudent(student, petId),
    petName: normalizeInteractionPetName(
      getActiveInteractionPetName(student, petId),
      normalizeId(student.studentId),
      String(student.studentName || student.name || student.studentId || '')
    )
  };
}

function fromInteractionRoomRow(row: JsonRecord, memberCount = 0, players: JsonRecord[] = []) {
  const memberLimit = normalizeInteractionRoomMemberLimit(row.member_limit);
  const ownerStudentId = normalizeId(row.owner_student_id);
  return {
    roomId: String(row.room_id || ''),
    roomName: String(row.room_name || '小小房间'),
    ownerStudentId,
    ownerName: getCanonicalStudentName(ownerStudentId, String(row.owner_name || ownerStudentId || '')),
    isLocked: Boolean(row.is_locked),
    isPermanent: Boolean(row.is_permanent),
    mapSetId: normalizeInteractionRoomMapSetId(row.map_set_id),
    memberCount: Math.max(0, Math.min(memberLimit, memberCount)),
    memberLimit,
    players,
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || '')
  };
}

function fromInteractionPlayerRows(rows: JsonRecord[] = []) {
  return rows.map(row => {
    const studentId = normalizeId(row.student_id);
    const studentName = getCanonicalStudentName(studentId, String(row.student_name || studentId || ''));
    return {
      roomId: String(row.room_id || ''),
      studentId,
      studentName,
      petId: String(row.pet_id || 'kuromi'),
      petName: normalizeInteractionPetName(row.pet_name, studentId, studentName),
      petSize: normalizeInteractionPetSize(row.pet_size),
      petStage: normalizeInteractionPetStage(row.pet_stage),
      petStyle: normalizeInteractionPetStyle(row.pet_style),
      mapId: String(row.map_id || 'home'),
      x: toNumber(row.x, 128),
      y: toNumber(row.y, 0),
      facing: toNumber(row.facing, 1) < 0 ? -1 : 1,
      action: String(row.action || 'idle'),
      message: String(row.message || ''),
      messageUntil: String(row.message_until || ''),
      joinedAt: String(row.joined_at || ''),
      lastSeenAt: String(row.last_seen_at || '')
    };
  });
}

async function cleanupInteractionRooms() {
  const cutoff = new Date(Date.now() - INTERACTION_ROOM_STALE_SECONDS * 1000).toISOString();
  await supabaseRequest(`interaction_room_players?last_seen_at=lt.${encodeURIComponent(cutoff)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  const [rooms, players] = await Promise.all([
    supabaseRequest('interaction_rooms?select=room_id,is_permanent&limit=200') || [],
    supabaseRequest('interaction_room_players?select=room_id&limit=1000') || []
  ]);
  const occupied = new Set((players as JsonRecord[]).map(row => String(row.room_id || '')).filter(Boolean));
  const emptyRoomIds = (rooms as JsonRecord[])
    .filter(row => !Boolean(row.is_permanent))
    .map(row => String(row.room_id || ''))
    .filter(roomId => roomId && !occupied.has(roomId));
  if (emptyRoomIds.length) {
    await supabaseRequest(`interaction_rooms?room_id=in.(${emptyRoomIds.map(encodeURIComponent).join(',')})`, {
      method: 'DELETE',
      prefer: 'return=minimal'
    });
  }
}

async function getPermanentRoomOwner(preferredStudentId: string, fallbackStudentId: string) {
  const candidates = [normalizeId(preferredStudentId), normalizeId(fallbackStudentId)].filter(Boolean);
  for (const candidate of candidates) {
    const rows = await supabaseRequest(`students?student_id=eq.${encodeURIComponent(candidate)}&select=student_id,student_name&limit=1`) || [];
    const row = (rows as JsonRecord[])[0];
    if (row) {
      return {
        studentId: normalizeId(row.student_id),
        studentName: String(row.student_name || row.student_id || 'CY PETS STORY')
      };
    }
  }
  return null;
}

async function ensurePermanentInteractionRooms(requestStudentId: string) {
  const desiredRooms = (await Promise.all(PERMANENT_INTERACTION_ROOMS.map(async config => {
    const owner = await getPermanentRoomOwner(config.ownerStudentId, requestStudentId);
    if (!owner) return null;
    const ownerStudentId = owner.studentId;
    return {
      room_id: normalizeInteractionRoomId(config.roomId),
      room_name: config.roomName,
      owner_student_id: ownerStudentId,
      owner_name: config.ownerName || owner.studentName,
      map_set_id: normalizeInteractionRoomMapSetId(config.mapSetId),
      member_limit: normalizeInteractionRoomMemberLimit(config.memberLimit),
      is_locked: false,
      password_code: '',
      is_permanent: true
    };
  }))).filter((room): room is JsonRecord => Boolean(room?.room_id && room.owner_student_id));
  if (!desiredRooms.length) return;

  const roomIds = desiredRooms.map(room => room.room_id);
  const existingRows = await supabaseRequest(`interaction_rooms?room_id=in.(${roomIds.map(encodeURIComponent).join(',')})&select=*`) || [];
  const existingById = new Map((existingRows as JsonRecord[]).map(row => [String(row.room_id || ''), row]));
  const needsUpsert = desiredRooms.some(room => {
    const existing = existingById.get(room.room_id);
    return !existing
      || String(existing.room_name || '') !== room.room_name
      || normalizeId(existing.owner_student_id) !== room.owner_student_id
      || String(existing.owner_name || '') !== room.owner_name
      || normalizeInteractionRoomMapSetId(existing.map_set_id) !== room.map_set_id
      || normalizeInteractionRoomMemberLimit(existing.member_limit) !== room.member_limit
      || Boolean(existing.is_locked)
      || String(existing.password_code || '')
      || !Boolean(existing.is_permanent);
  });
  if (!needsUpsert) return;
  await supabaseRequest('interaction_rooms?on_conflict=room_id', {
    method: 'POST',
    body: desiredRooms.map(room => ({ ...room, updated_at: new Date().toISOString() })),
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
}

async function listInteractionRooms(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  if (!studentId) return { ok: false, error: '学生 ID 无效。' };
  await cleanupInteractionRooms();
  await ensurePermanentInteractionRooms(studentId);
  const [roomRows, playerRows] = await Promise.all([
    supabaseRequest('interaction_rooms?select=*&order=updated_at.desc&limit=80') || [],
    supabaseRequest('interaction_room_players?select=*&limit=1000') || []
  ]);
  const playersByRoom = new Map<string, JsonRecord[]>();
  fromInteractionPlayerRows(playerRows as JsonRecord[]).forEach(player => {
    const roomId = String(player.roomId || '');
    if (!roomId) return;
    if (!playersByRoom.has(roomId)) playersByRoom.set(roomId, []);
    playersByRoom.get(roomId)?.push(player);
  });
  const memberCounts = new Map<string, number>();
  playersByRoom.forEach((players, roomId) => {
    if (!roomId) return;
    memberCounts.set(roomId, players.length);
  });
  const rooms = (roomRows as JsonRecord[])
    .map(row => {
      const roomId = String(row.room_id || '');
      const players = playersByRoom.get(roomId) || [];
      return fromInteractionRoomRow(row, memberCounts.get(roomId) || 0, players);
    })
    .filter(room => room.memberCount > 0 || room.isPermanent)
    .sort((a, b) => Number(b.isPermanent) - Number(a.isPermanent) || Number(b.memberCount > 0) - Number(a.memberCount > 0));
  return { ok: true, source: 'supabase', rooms };
}

async function createInteractionRoom(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  if (!studentId) return { ok: false, error: '学生 ID 无效。' };
  const nameValidation = validatePublicText(payload.roomName, 18);
  if (!nameValidation.ok) return { ok: false, error: nameValidation.error || '房间名字不适合公开展示。' };
  const isLocked = Boolean(payload.isLocked || payload.hasPassword);
  const password = normalizeInteractionPassword(payload.password);
  const mapSetId = normalizeInteractionRoomMapSetId(payload.mapSetId || payload.map_set_id);
  const petSize = normalizeInteractionPetSize(payload.petSize || payload.pet_size);
  if (isLocked && password.length !== 4) return { ok: false, error: '密码要写4个数字。' };
  const profile = await getInteractionProfile(studentId);
  if (!profile.ok) return profile;
  await cleanupInteractionRooms();
  let roomId = '';
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = generateInteractionRoomId();
    const existing = await supabaseRequest(`interaction_rooms?room_id=eq.${encodeURIComponent(candidate)}&select=room_id&limit=1`) || [];
    if (!(existing as JsonRecord[]).length) {
      roomId = candidate;
      break;
    }
  }
  if (!roomId) return { ok: false, error: '房间号码生成失败，请再试一次。' };
  const startMapId = getInteractionRoomStartMapId(mapSetId);
  const startY = getInteractionRoomStartY(mapSetId);
  await supabaseRequest('interaction_rooms', {
    method: 'POST',
    body: {
      room_id: roomId,
      room_name: nameValidation.text,
      owner_student_id: profile.studentId,
      owner_name: profile.studentName,
      map_set_id: mapSetId,
      member_limit: INTERACTION_ROOM_DEFAULT_MEMBER_LIMIT,
      is_permanent: false,
      is_locked: isLocked,
      password_code: isLocked ? password : ''
    },
    prefer: 'return=minimal'
  });
  await supabaseRequest('interaction_room_players?on_conflict=room_id,student_id', {
    method: 'POST',
    body: {
      room_id: roomId,
      student_id: profile.studentId,
      student_name: profile.studentName,
      pet_id: profile.petId,
      pet_name: profile.petName,
      pet_size: petSize,
      pet_stage: normalizeInteractionPetStage(payload.petStage || payload.pet_stage || profile.petStage),
      pet_style: normalizeInteractionPetStyle(payload.petStyle || payload.pet_style || payload.evolutionStyle || payload.evolution_style || profile.petStyle),
      map_id: startMapId,
      x: 128,
      y: startY,
      facing: 1,
      action: 'idle',
      last_seen_at: new Date().toISOString()
    },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  return getInteractionRoom({ studentId, roomId });
}

async function joinInteractionRoom(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomId = normalizeInteractionRoomId(payload.roomId);
  if (!studentId || !roomId) return { ok: false, error: '房间资料无效。' };
  await cleanupInteractionRooms();
  const roomRows = await supabaseRequest(`interaction_rooms?room_id=eq.${encodeURIComponent(roomId)}&select=*&limit=1`) || [];
  const room = (roomRows as JsonRecord[])[0];
  if (!room) return { ok: false, error: '找不到这个房间，可能已经没人了。' };
  const roomMapSetId = normalizeInteractionRoomMapSetId(room.map_set_id);
  const memberLimit = normalizeInteractionRoomMemberLimit(room.member_limit);
  const startMapId = getInteractionRoomStartMapId(roomMapSetId);
  const startY = getInteractionRoomStartY(roomMapSetId);
  if (Boolean(room.is_locked)) {
    const password = normalizeInteractionPassword(payload.password);
    if (password.length !== 4 || password !== String(room.password_code || '')) {
      return { ok: false, error: '密码不对，请再问朋友一次。' };
    }
  }
  const playerRows = await supabaseRequest(`interaction_room_players?room_id=eq.${encodeURIComponent(roomId)}&select=student_id&limit=${memberLimit + 1}`) || [];
  const alreadyInside = (playerRows as JsonRecord[]).some(row => normalizeId(row.student_id) === studentId);
  if (!alreadyInside && (playerRows as JsonRecord[]).length >= memberLimit) return { ok: false, error: `这个房间已经满 ${memberLimit} 人了。` };
  const profile = await getInteractionProfile(studentId);
  if (!profile.ok) return profile;
  const petSize = normalizeInteractionPetSize(payload.petSize || payload.pet_size);
  await supabaseRequest('interaction_room_players?on_conflict=room_id,student_id', {
    method: 'POST',
    body: {
      room_id: roomId,
      student_id: profile.studentId,
      student_name: profile.studentName,
      pet_id: profile.petId,
      pet_name: profile.petName,
      pet_size: petSize,
      pet_stage: normalizeInteractionPetStage(payload.petStage || payload.pet_stage || profile.petStage),
      pet_style: normalizeInteractionPetStyle(payload.petStyle || payload.pet_style || payload.evolutionStyle || payload.evolution_style || profile.petStyle),
      map_id: startMapId,
      x: 128,
      y: startY,
      facing: 1,
      action: 'idle',
      last_seen_at: new Date().toISOString()
    },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });
  await supabaseRequest(`interaction_rooms?room_id=eq.${encodeURIComponent(roomId)}`, {
    method: 'PATCH',
    body: { updated_at: new Date().toISOString() },
    prefer: 'return=minimal'
  });
  return getInteractionRoom({ studentId, roomId });
}

async function getInteractionRoom(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomId = normalizeInteractionRoomId(payload.roomId);
  if (!studentId || !roomId) return { ok: false, error: '房间资料无效。' };
  await cleanupInteractionRooms();
  const [roomRows, playerRows] = await Promise.all([
    supabaseRequest(`interaction_rooms?room_id=eq.${encodeURIComponent(roomId)}&select=*&limit=1`) || [],
    supabaseRequest(`interaction_room_players?room_id=eq.${encodeURIComponent(roomId)}&select=*&order=joined_at.asc&limit=${INTERACTION_ROOM_MAX_MEMBER_LIMIT}`) || []
  ]);
  const room = (roomRows as JsonRecord[])[0];
  if (!room) return { ok: false, error: '这个房间已经关闭了。' };
  const players = fromInteractionPlayerRows(playerRows as JsonRecord[]);
  if (!players.some(player => player.studentId === studentId)) return { ok: false, error: '你已经离开这个房间。' };
  return { ok: true, source: 'supabase', room: fromInteractionRoomRow(room, players.length), players };
}

async function heartbeatInteractionRoom(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomId = normalizeInteractionRoomId(payload.roomId);
  if (!studentId || !roomId) return { ok: false, error: '房间资料无效。' };
  const now = new Date();
  const studentName = getCanonicalStudentName(studentId, String(payload.studentName || payload.student_name || studentId), { allowCustom: true });
  const patchBody: JsonRecord = {
    student_name: studentName,
    pet_id: String(payload.petId || payload.pet_id || 'kuromi').slice(0, 48),
    pet_name: normalizeInteractionPetName(payload.petName || payload.pet_name, studentId, studentName),
    pet_size: normalizeInteractionPetSize(payload.petSize || payload.pet_size),
    pet_stage: normalizeInteractionPetStage(payload.petStage || payload.pet_stage),
    pet_style: normalizeInteractionPetStyle(payload.petStyle || payload.pet_style || payload.evolutionStyle || payload.evolution_style),
    map_id: String(payload.mapId || 'home').slice(0, 32),
    x: Math.max(0, Math.min(3000, toNumber(payload.x, 128))),
    y: Math.max(-500, Math.min(1200, toNumber(payload.y, 0))),
    facing: toNumber(payload.facing, 1) < 0 ? -1 : 1,
    action: String(payload.playerAction || payload.action || 'idle').slice(0, 18),
    last_seen_at: now.toISOString()
  };
  if (Object.prototype.hasOwnProperty.call(payload, 'message')) {
    const message = String(payload.message || '').trim();
    if (message) {
      const validation = validatePublicText(message, 40);
      if (!validation.ok) return { ok: false, error: validation.error };
      patchBody.message = validation.text;
      patchBody.message_until = new Date(now.getTime() + INTERACTION_MESSAGE_DURATION_MS).toISOString();
    } else {
      patchBody.message = '';
      patchBody.message_until = null;
    }
  }
  const rows = await supabaseRequest(`interaction_room_players?room_id=eq.${encodeURIComponent(roomId)}&student_id=eq.${encodeURIComponent(studentId)}`, {
    method: 'PATCH',
    body: patchBody,
    prefer: 'return=representation'
  }) || [];
  if (!(rows as JsonRecord[]).length) return { ok: false, error: '你已经离开这个房间。' };
  await supabaseRequest(`interaction_rooms?room_id=eq.${encodeURIComponent(roomId)}`, {
    method: 'PATCH',
    body: { updated_at: now.toISOString() },
    prefer: 'return=minimal'
  });
  return getInteractionRoom({ studentId, roomId });
}

async function leaveInteractionRoom(payload: JsonRecord) {
  const studentId = normalizeId(payload.studentId);
  const roomId = normalizeInteractionRoomId(payload.roomId);
  if (!studentId || !roomId) return { ok: false, error: '房间资料无效。' };
  await supabaseRequest(`interaction_room_players?room_id=eq.${encodeURIComponent(roomId)}&student_id=eq.${encodeURIComponent(studentId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  await cleanupInteractionRooms();
  return { ok: true, source: 'supabase' };
}

// =========================================================
// EDUVERSE BACKEND LOGIC & DATA SEEDS (Deno / TypeScript)
// =========================================================

function hashPasswordSync(password: string, salt = 'eduverse_2026') {
  const str = String(password || '') + ':' + salt;
  let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch: number; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'ev_' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}

const INITIAL_TEACHER_PASSWORD = '5+1tuition';
const DEFAULT_INITIAL_HASH = hashPasswordSync(INITIAL_TEACHER_PASSWORD);

const PRESET_TEACHERS = [
  { teacherId: 'TCH01_JIE', name: '杰老师', avatar: '🧑‍🏫', role: 'teacher' },
  { teacherId: 'TCH02_RACHEL', name: 'Rachel老师', avatar: '👩‍🏫', role: 'teacher' },
  { teacherId: 'TCH03_HUANG', name: '黄老师', avatar: '🧑‍🏫', role: 'teacher' },
  { teacherId: 'TCH04_TIAN', name: '天老师', avatar: '👨‍🏫', role: 'teacher' },
  { teacherId: 'TCH05_EN', name: '恩老师', avatar: '👩‍🏫', role: 'teacher' },
  { teacherId: 'TCH06_DU', name: '杜老师', avatar: '🧑‍🏫', role: 'teacher' },
  { teacherId: 'TCH07_HUI', name: '橞老师', avatar: '👩‍🏫', role: 'teacher' },
  { teacherId: 'TCH08_YI', name: '宜老师', avatar: '👩‍🏫', role: 'teacher' },
  { teacherId: 'TCH09_QI', name: '淇老师', avatar: '👩‍🏫', role: 'teacher' },
  { teacherId: 'TCH10_YI2', name: '奕老师', avatar: '👨‍🏫', role: 'teacher' },
  { teacherId: 'TCH11_HU', name: '胡老师', avatar: '🧑‍🏫', role: 'teacher' },
  { teacherId: 'TCH12_WEN', name: '汶老师', avatar: '👩‍🏫', role: 'teacher' }
];

const TEACHER_SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function bytesToBase64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Uint8Array.from(atob(base64), char => char.charCodeAt(0));
}

async function getTeacherSessionKey() {
  const { secretKey } = getSupabaseConfig();
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function createTeacherSessionToken(teacherId: string) {
  const expiresAt = Date.now() + TEACHER_SESSION_TTL_MS;
  const payload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify({ teacherId, expiresAt })));
  const signature = await crypto.subtle.sign('HMAC', await getTeacherSessionKey(), new TextEncoder().encode(payload));
  return `${payload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

async function requireTeacherSession(payload: JsonRecord = {}) {
  const token = String(payload.teacherSessionToken || '');
  const [encodedPayload, encodedSignature] = token.split('.');
  if (!encodedPayload || !encodedSignature) throw new Error('教师登录已失效，请重新登录。');
  const valid = await crypto.subtle.verify(
    'HMAC',
    await getTeacherSessionKey(),
    base64UrlToBytes(encodedSignature),
    new TextEncoder().encode(encodedPayload)
  );
  if (!valid) throw new Error('教师登录已失效，请重新登录。');
  let session: JsonRecord;
  try {
    session = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload)));
  } catch (_error) {
    throw new Error('教师登录已失效，请重新登录。');
  }
  const teacher = PRESET_TEACHERS.find(item => item.teacherId === session.teacherId);
  if (!teacher || toNumber(session.expiresAt, 0) <= Date.now()) throw new Error('教师登录已失效，请重新登录。');
  return teacher;
}

function normalizeStudentLoginName(value: unknown) {
  return String(value || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en');
}

function normalizePhoneNumber(rawPhone: unknown) {
  if (!rawPhone) return '';
  let phone = String(rawPhone).trim().replace(/[^0-9+]/g, '');
  if (phone.startsWith('+')) phone = phone.slice(1);
  if (phone.startsWith('01')) {
    phone = '60' + phone.slice(1);
  } else if (phone.startsWith('1')) {
    phone = '60' + phone;
  }
  return phone;
}

function isValidMalaysianPhone(phone: unknown) {
  const normalized = normalizePhoneNumber(phone);
  return /^601[0-9]{7,9}$/.test(normalized);
}

const EDUVERSE_SUBJECTS = [
  {
    subjectId: 'bc',
    nameZh: '华文',
    nameEn: 'Bahasa Cina',
    themeId: 'oriental-fantasy',
    badgeIcon: '📜',
    badgeTitle: '卷轴毛笔 · 水墨东方',
    colorPrimary: '#d32f2f',
    colorSecondary: '#ffb300',
    colorGlow: 'rgba(255, 179, 0, 0.4)',
    description: '东方幻想书卷，墨韵生辉。领略古风与现代二次元的文字力量。',
    kssmBadges: ['🔥 高频考点', '⭐ 必会', '🧠 KBAT', '⚠️ 易错题'],
    orderIndex: 1
  },
  {
    subjectId: 'bm',
    nameZh: '国文',
    nameEn: 'Bahasa Melayu',
    themeId: 'tropical-adventure',
    badgeIcon: '📖',
    badgeTitle: '语言勋章 · 热带冒险',
    colorPrimary: '#e65100',
    colorSecondary: '#2e7d32',
    colorGlow: 'rgba(230, 81, 0, 0.4)',
    description: '探索马来西亚热带文学秘境，掌握Tatabahasa与Komsas精髓。',
    kssmBadges: ['🔥 Tatabahasa', '⭐ Peribahasa', '🧠 KBAT', '📚 Komsas'],
    orderIndex: 2
  },
  {
    subjectId: 'bi',
    nameZh: '英文',
    nameEn: 'English',
    themeId: 'magic-academy',
    badgeIcon: '🧙‍♂️',
    badgeTitle: '魔法书 · Fantasy Academy',
    colorPrimary: '#1565c0',
    colorSecondary: '#7b1fa2',
    colorGlow: 'rgba(123, 31, 162, 0.4)',
    description: 'Unlock the Magic Library! Expand vocabulary, master grammar, and conquer reading trials.',
    kssmBadges: ['🔥 Grammar Wizard', '⭐ Vocab Pro', '🧠 Critical Reading', '✍️ Essay Magic'],
    orderIndex: 3
  },
  {
    subjectId: 'math',
    nameZh: '数学',
    nameEn: 'Matematik',
    themeId: 'cyber-matrix',
    badgeIcon: '💠',
    badgeTitle: '几何水晶 · Cyber Grid',
    colorPrimary: '#00838f',
    colorSecondary: '#00e5ff',
    colorGlow: 'rgba(0, 229, 255, 0.4)',
    description: '穿梭霓虹数字矩阵，破解代数几何算法，成为赛博数理大师。',
    kssmBadges: ['🔥 代数解题', '⭐ 几何公式', '🧠 KBAT 逻辑', '⚠️ 易错陷阱'],
    orderIndex: 4
  },
  {
    subjectId: 'science',
    nameZh: '科学',
    nameEn: 'Sains',
    themeId: 'future-lab',
    badgeIcon: '⚛️',
    badgeTitle: '原子核心 · Future Lab',
    colorPrimary: '#4527a0',
    colorSecondary: '#00b0ff',
    colorGlow: 'rgba(0, 176, 255, 0.4)',
    description: '踏入未来高能实验室，探索物质、生命细胞与能量转化的奥秘。',
    kssmBadges: ['🔥 实验探究', '⭐ 科学原理', '🧠 KBAT 假设', '🧬 生命物理'],
    orderIndex: 5
  },
  {
    subjectId: 'sejarah',
    nameZh: '历史',
    nameEn: 'Sejarah',
    themeId: 'ancient-empire',
    badgeIcon: '🛡️',
    badgeTitle: '古代战盾 · Ancient Empire',
    colorPrimary: '#8d6e63',
    colorSecondary: '#c62828',
    colorGlow: 'rgba(198, 40, 40, 0.4)',
    description: '展开古老帝国战图，重返马六甲王朝与早期文明传奇风云。',
    kssmBadges: ['🔥 重点年表', '⭐ 王朝体制', '🧠 历史启示', '📜 史料考证'],
    orderIndex: 6
  },
  {
    subjectId: 'geografi',
    nameZh: '地理',
    nameEn: 'Geografi',
    themeId: 'earth-explorer',
    badgeIcon: '🧭',
    badgeTitle: '地球罗盘 · Earth Explorer',
    colorPrimary: '#2e7d32',
    colorSecondary: '#8d6e63',
    colorGlow: 'rgba(46, 125, 50, 0.4)',
    description: '手持罗盘跋涉山川河海，观察板块运动、气候变迁与全球经纬。',
    kssmBadges: ['🔥 读图技能', '⭐ 地形气候', '🧠 环境永续', '🗺️ 经纬等高线'],
    orderIndex: 7
  },
  {
    subjectId: 'moral',
    nameZh: '道德',
    nameEn: 'Pendidikan Moral',
    themeId: 'guardian-academy',
    badgeIcon: '✨',
    badgeTitle: '守护之星 · Guardian Light',
    colorPrimary: '#ad1457',
    colorSecondary: '#ffd54f',
    colorGlow: 'rgba(255, 213, 79, 0.4)',
    description: '凝聚正义与友爱之光，培养崇高品格、公民意识与关怀社会的价值观。',
    kssmBadges: ['🔥 核心价值', '⭐ 伦理情境', '🧠 道德思辨', '🤝 社区互助'],
    orderIndex: 8
  }
];

const SEED_CHAPTERS: JsonRecord[] = [];

const SEED_QUESTIONS: JsonRecord[] = [];

const SEED_ACHIEVEMENTS = [
  { achievementId: 'ach-first-quest', category: 'Study', title: 'FIRST QUEST', description: '完成你的第一场学科试炼。', rarity: 'Common', badgeIcon: '🌱', requirementType: 'quest_count', targetValue: 1, expReward: 100 },
  { achievementId: 'ach-streak-3', category: 'Streak', title: '3 DAY WARRIOR', description: '连续有效学习打卡 3 天。', rarity: 'Common', badgeIcon: '🔥', requirementType: 'streak', targetValue: 3, expReward: 150 },
  { achievementId: 'ach-streak-7', category: 'Streak', title: '7 DAY WARRIOR', description: '连续有效学习打卡 7 天。', rarity: 'Rare', badgeIcon: '⚡', requirementType: 'streak', targetValue: 7, expReward: 300 },
  { achievementId: 'ach-perfect-scholar', category: 'Perfect', title: 'PERFECT SCHOLAR', description: '在任何一场 Quest 中获得 100% 满分。', rarity: 'Rare', badgeIcon: '👑', requirementType: 'perfect_count', targetValue: 1, expReward: 250 },
  { achievementId: 'ach-combo-master', category: 'Quest', title: 'COMBO MASTER', description: '在答题中达成 5 连击或以上。', rarity: 'Rare', badgeIcon: '💥', requirementType: 'max_combo', targetValue: 5, expReward: 200 },
  { achievementId: 'ach-math-master', category: 'Subject', title: 'MATH MASTER', description: '数学累计答对 10 题以上。', rarity: 'Epic', badgeIcon: '💠', requirementType: 'subject_math_correct', targetValue: 10, expReward: 400 },
  { achievementId: 'ach-all-rounder', category: 'Subject', title: 'ALL ROUNDER', description: '完成全部 8 个学科的试炼挑战。', rarity: 'Legendary', badgeIcon: '🌟', requirementType: 'unique_subjects', targetValue: 8, expReward: 800 }
];

let syncLogHistory: JsonRecord[] = [];

const LOCAL_STORAGE_DB = {
  questions: [...SEED_QUESTIONS],
  chapters: [...SEED_CHAPTERS],
  questRecords: [] as JsonRecord[],
  studentAchievements: new Map<string, Set<string>>(),
  dailyChallenges: [] as JsonRecord[]
};

async function listTeachers() {
  return {
    ok: true,
    teachers: PRESET_TEACHERS.map(t => ({
      teacherId: t.teacherId,
      name: t.name,
      avatar: t.avatar,
      role: t.role
    }))
  };
}

async function teacherLogin(payload: JsonRecord = {}) {
  const teacherId = String(payload.teacherId || '').trim();
  const password = String(payload.password || '');
  const teacher = PRESET_TEACHERS.find(t => t.teacherId === teacherId);
  if (!teacher) return { ok: false, error: '未找到该教师账号。' };

  let authRecord = TEACHER_PASSWORDS.get(teacherId);
  if (!authRecord) {
    authRecord = { passwordHash: DEFAULT_INITIAL_HASH, initialChanged: false, lastLogin: null };
    TEACHER_PASSWORDS.set(teacherId, authRecord);
  }

  const inputHash = hashPasswordSync(password);
  if (inputHash !== authRecord.passwordHash) {
    return { ok: false, error: '密码错误，请输入正确的教师密码。' };
  }

  authRecord.lastLogin = new Date().toISOString();

  return {
    ok: true,
    teacher: {
      teacherId: teacher.teacherId,
      name: teacher.name,
      avatar: teacher.avatar,
      role: 'teacher',
      initialPasswordChanged: authRecord.initialChanged,
      lastLogin: authRecord.lastLogin,
      status: 'active'
    }
  };
}

async function changeTeacherPassword(payload: JsonRecord = {}) {
  const teacherId = String(payload.teacherId || '').trim();
  const currentPassword = String(payload.currentPassword || '');
  const newPassword = String(payload.newPassword || '').trim();

  if (!newPassword || newPassword.length < 6) {
    return { ok: false, error: '新密码长度不能少于 6 位。' };
  }

  const teacher = PRESET_TEACHERS.find(t => t.teacherId === teacherId);
  if (!teacher) return { ok: false, error: '教师账号不存在。' };

  const authRecord = TEACHER_PASSWORDS.get(teacherId) || { passwordHash: DEFAULT_INITIAL_HASH, initialChanged: false, lastLogin: null };
  const currentHash = hashPasswordSync(currentPassword);
  if (currentHash !== authRecord.passwordHash) {
    return { ok: false, error: '原密码不正确。' };
  }

  authRecord.passwordHash = hashPasswordSync(newPassword);
  authRecord.initialChanged = true;
  TEACHER_PASSWORDS.set(teacherId, authRecord);

  return { ok: true, message: '密码修改成功！' };
}

async function getTeacherProfile(payload: JsonRecord = {}) {
  const teacherId = String(payload.teacherId || '').trim();
  const teacher = PRESET_TEACHERS.find(t => t.teacherId === teacherId);
  if (!teacher) return { ok: false, error: '教师不存在。' };
  const authRecord = TEACHER_PASSWORDS.get(teacherId) || { passwordHash: DEFAULT_INITIAL_HASH, initialChanged: false, lastLogin: null };
  return {
    ok: true,
    teacher: {
      teacherId: teacher.teacherId,
      name: teacher.name,
      avatar: teacher.avatar,
      role: 'teacher',
      initialPasswordChanged: Boolean(authRecord.initialChanged),
      lastLogin: authRecord.lastLogin || null,
      status: 'active'
    }
  };
}

async function registerStudentPhone(payload: JsonRecord = {}) {
  const name = String(payload.name || payload.studentName || '').trim();
  const rawPhone = String(payload.phone || payload.phoneNumber || '').trim();
  const form = String(payload.form || 'Form 1').trim();
  const pin = String(payload.pin || payload.password || '').trim();

  if (!name) return { ok: false, error: '请填写学生姓名。' };
  if (!rawPhone) return { ok: false, error: '电话号码为必填项。' };
  if (!isValidMalaysianPhone(rawPhone)) {
    return { ok: false, error: '请输入有效的马来西亚手机号码（例如 0123456789 或 60123456789）。' };
  }
  if (!['Form 1', 'Form 2', 'Form 3'].includes(form)) {
    return { ok: false, error: '年级只允许选择 Form 1, Form 2 或 Form 3。' };
  }
  if (!pin || pin.length < 4) {
    return { ok: false, error: '请设置至少 4 位的 PIN 码或密码。' };
  }

  const normalizedPhone = normalizePhoneNumber(rawPhone);

  const existing = await supabaseRequest(`students?phone=eq.${encodeURIComponent(normalizedPhone)}&select=student_id`, {
    method: 'GET'
  });
  if (existing && (existing as JsonRecord[]).length > 0) {
    return { ok: false, error: '该电话号码已被注册，请直接使用手机号登录。' };
  }

  // Check for duplicate name (same name cannot register twice)
  const existingName = await supabaseRequest(
    `students?student_name=ilike.${encodeURIComponent(name)}&status=eq.active&select=student_id&limit=1`,
    { method: 'GET' }
  );
  if (existingName && (existingName as JsonRecord[]).length > 0) {
    return { ok: false, error: `"${name}" 这个名字已被其他同学使用，请换一个名字注册。` };
  }

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const studentId = `CY${randomDigits}`;
  const passwordHash = hashPasswordSync(pin);

  const studentRow = {
    student_id: studentId,
    student_name: name,
    phone: normalizedPhone,
    password_hash: passwordHash,
    form: form,
    branch: String(payload.branch || '5+1教育补习中心'),
    class_name: String(payload.className || form),
    teacher_id: String(payload.teacherId || 'TCH01_JIE'),
    avatar: '🌟',
    level: 1,
    experience: 0,
    current_streak: 1,
    best_streak: 1,
    last_learning_date: new Date().toISOString().slice(0, 10),
    status: 'active'
  };

  const initialGameState = {
    studentId,
    studentName: name,
    phone: normalizedPhone,
    form,
    branch: studentRow.branch,
    className: studentRow.class_name,
    petName: '',
    petType: '',
    petRarity: '',
    petLevel: 1,
    experience: 0,
    coins: 50,
    totalStars: 0,
    streak: 1,
    lastCheckinDate: studentRow.last_learning_date,
    ownedItems: [],
    equippedItems: {},
    ownedPets: [],
    petCollection: {},
    status: 'active'
  };

  await supabaseRequest('students', {
    method: 'POST',
    body: studentRow,
    prefer: 'resolution=merge-duplicates,return=representation'
  });
  await supabaseRequest('student_game_states', {
    method: 'POST',
    body: {
      student_id: studentId,
      state: initialGameState,
      coins: 50,
      total_stars: 0
    },
    prefer: 'resolution=merge-duplicates,return=minimal'
  });

  return { ok: true, studentId, student: initialGameState };
}

async function loginStudentPhone(payload: JsonRecord = {}) {
  const rawPhone = String(payload.phone || payload.phoneNumber || '').trim();
  const rawName = String(payload.name || payload.studentName || '').trim();
  const pin = String(payload.pin || payload.password || '').trim();

  if (!rawPhone) return { ok: false, error: '请输入手机号码。' };
  if (!rawName) return { ok: false, error: '请输入学生姓名。' };
  if (!pin) return { ok: false, error: '请输入密码。' };

  const normalizedPhone = normalizePhoneNumber(rawPhone);
  const inputHash = pin ? hashPasswordSync(pin) : null;

  const rows = (await supabaseRequest(`students?phone=eq.${encodeURIComponent(normalizedPhone)}&select=student_id,student_name,password_hash,status&limit=1`, {
    method: 'GET'
  })) as JsonRecord[];
  if (!rows || rows.length === 0) {
    return { ok: false, error: '学生姓名、电话号码或密码不正确。' };
  }
  const studentData = rows[0];
  if (studentData.status !== 'active') {
    return { ok: false, error: '学生账号已被停用，请联系负责老师。' };
  }
  if (normalizeStudentLoginName(rawName) !== normalizeStudentLoginName(studentData.student_name)) {
    return { ok: false, error: '学生姓名、电话号码或密码不正确。' };
  }
  if (studentData.password_hash && studentData.password_hash !== inputHash) {
    return { ok: false, error: '学生姓名、电话号码或密码不正确。' };
  }
  return getStudent({ studentId: studentData.student_id });
}

async function listTeachers() {
  return {
    ok: true,
    teachers: PRESET_TEACHERS.map(t => ({
      teacherId: t.teacherId,
      name: t.name,
      avatar: t.avatar,
      role: t.role
    }))
  };
}

async function teacherLogin(payload: JsonRecord = {}) {
  const teacherId = String(payload.teacherId || '').trim();
  const password = String(payload.password || '');
  const teacher = PRESET_TEACHERS.find(t => t.teacherId === teacherId);
  if (!teacher) return { ok: false, error: '未找到该教师账号。' };

  const rows = (await supabaseRequest(`teachers?teacher_id=eq.${encodeURIComponent(teacherId)}&select=teacher_id,name,avatar,password_hash,initial_password_changed,role,status&limit=1`) || []) as JsonRecord[];
  const authRecord = rows[0];
  if (!authRecord || authRecord.status !== 'active') return { ok: false, error: '未找到该教师账号。' };

  const inputHash = hashPasswordSync(password);
  if (inputHash !== authRecord.password_hash) {
    return { ok: false, error: '密码错误，请输入正确的教师密码。' };
  }

  const lastLogin = new Date().toISOString();
  await supabaseRequest(`teachers?teacher_id=eq.${encodeURIComponent(teacherId)}`, {
    method: 'PATCH',
    body: { last_login_at: lastLogin, updated_at: lastLogin },
    prefer: 'return=minimal'
  });
  const sessionToken = await createTeacherSessionToken(teacher.teacherId);

  return {
    ok: true,
    sessionToken,
    teacher: {
      teacherId: teacher.teacherId,
      name: teacher.name,
      avatar: teacher.avatar,
      role: 'teacher',
      initialPasswordChanged: Boolean(authRecord.initial_password_changed),
      lastLogin,
      status: 'active'
    }
  };
}

async function changeTeacherPassword(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  const currentPassword = String(payload.currentPassword || '');
  const newPassword = String(payload.newPassword || '').trim();
  if (newPassword.length < 6) return { ok: false, error: '新密码长度至少需要 6 位。' };

  const rows = (await supabaseRequest(`teachers?teacher_id=eq.${encodeURIComponent(teacher.teacherId)}&select=teacher_id,password_hash,status&limit=1`) || []) as JsonRecord[];
  const authRecord = rows[0];
  if (!authRecord || authRecord.password_hash !== hashPasswordSync(currentPassword)) {
    return { ok: false, error: '原密码不正确。' };
  }

  await supabaseRequest(`teachers?teacher_id=eq.${encodeURIComponent(teacher.teacherId)}`, {
    method: 'PATCH',
    body: { password_hash: hashPasswordSync(newPassword), initial_password_changed: true, updated_at: new Date().toISOString() },
    prefer: 'return=minimal'
  });
  return { ok: true, message: '密码修改成功！' };
}

async function getTeacherProfile(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  const rows = (await supabaseRequest(`teachers?teacher_id=eq.${encodeURIComponent(teacher.teacherId)}&select=initial_password_changed,last_login_at,status&limit=1`) || []) as JsonRecord[];
  const authRecord = rows[0];
  return {
    ok: true,
    teacher: {
      teacherId: teacher.teacherId,
      name: teacher.name,
      avatar: teacher.avatar,
      role: 'teacher',
      initialPasswordChanged: Boolean(authRecord?.initial_password_changed),
      lastLogin: authRecord?.last_login_at || null,
      status: 'active'
    }
  };
}

async function listStudentAccounts(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  const rows = (await supabaseRequest(`students?select=student_id,student_name,phone,form,class_name,teacher_id,coins,level,experience,current_streak,status,created_at&order=student_name.asc&limit=5000`) || []) as JsonRecord[];
  return {
    ok: true,
    students: rows.map(row => ({
      studentId: row.student_id,
      studentName: row.student_name,
      phone: row.phone || '',
      form: row.form || '',
      className: row.class_name || '',
      teacherId: row.teacher_id || '',
      coins: toNumber(row.coins, 0),
      level: toNumber(row.level, 1),
      experience: toNumber(row.experience, 0),
      currentStreak: toNumber(row.current_streak, 0),
      status: row.status || 'active',
      createdAt: row.created_at || null
    }))
  };
}

async function listManagedClasses(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  const classRows = (await supabaseRequest(`classes?select=class_id,class_name,form,teacher_id,branch,status,created_at&order=class_name.asc&limit=500`) || []) as JsonRecord[];
  const studentRows = (await supabaseRequest('students?select=student_id,class_name,teacher_id,status&limit=5000') || []) as JsonRecord[];
  return {
    ok: true,
    classes: classRows.map(row => ({
      classId: row.class_id,
      className: row.class_name,
      form: row.form,
      teacherId: row.teacher_id,
      branch: row.branch,
      status: row.status,
      studentCount: studentRows.filter(student =>
        String(student.class_name || '') === String(row.class_name || '')
        && String(student.status || 'active') === 'active'
      ).length,
      createdAt: row.created_at
    }))
  };
}

async function createManagedClass(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  const className = String(payload.className || '').trim().slice(0, 60);
  const form = String(payload.form || 'Form 1').trim();
  const branch = String(payload.branch || '5+1教育补习中心').trim().slice(0, 60);
  if (!className) return { ok: false, error: '请填写班级名称。' };
  if (!['Form 1', 'Form 2', 'Form 3'].includes(form)) return { ok: false, error: '请选择正确年级。' };
  const existing = (await supabaseRequest(`classes?class_name=eq.${encodeURIComponent(className)}&select=class_id&limit=1`) || []) as JsonRecord[];
  if (existing.length) return { ok: false, error: '已经存在同名班级。' };
  const classId = `CLS-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
  const rows = await supabaseRequest('classes', {
    method: 'POST',
    body: {
      class_id: classId,
      class_name: className,
      form,
      teacher_id: teacher.teacherId,
      branch,
      status: 'active'
    },
    prefer: 'return=representation'
  }) as JsonRecord[];
  return { ok: true, class: rows?.[0] || { class_id: classId, class_name: className, form, teacher_id: teacher.teacherId, branch, status: 'active' } };
}

async function rewardManagedStudents(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  const studentIds = Array.isArray(payload.studentIds)
    ? [...new Set(payload.studentIds.map(normalizeId).filter(Boolean))]
    : [];
  const amount = Math.max(0, Math.floor(toNumber(payload.amount, 0)));
  const reason = String(payload.reason || '课堂表现').trim().slice(0, 80) || '课堂表现';
  if (!studentIds.length) return { ok: false, error: '请先选择至少一位学生。' };
  if (amount <= 0) return { ok: false, error: '奖励金币必须大于 0。' };
  const rows = (await supabaseRequest(`students?student_id=in.(${studentIds.map(encodeURIComponent).join(',')})&select=student_id,student_name,teacher_id,status,coins&limit=500`) || []) as JsonRecord[];
  const targets = rows.filter(row => String(row.status || 'active') === 'active');
  const logs: JsonRecord[] = [];
  const accepted: string[] = [];
  const balances: Record<string, number> = {};
  for (const student of targets) {
    const studentId = normalizeId(student.student_id);
    const existingCoins = toNumber(student.coins, 0);
    const nextCoins = Math.min(99999999, existingCoins + amount);
    await supabaseRequest(`students?student_id=eq.${encodeURIComponent(studentId)}`, {
      method: 'PATCH',
      body: { coins: nextCoins, updated_at: new Date().toISOString() },
      prefer: 'return=minimal'
    });
    balances[studentId] = nextCoins;
    accepted.push(studentId);
    logs.push({ teacher_id: teacher.teacherId, class_id: String(student.className || ''), student_id: studentId, amount, reason });
  }
  if (logs.length) {
    await supabaseRequest('teacher_rewards', { method: 'POST', body: logs, prefer: 'return=minimal' }).catch(() => null);
  }
  return { ok: true, accepted, balances, dailyLimit: TEACHER_MANAGED_DAILY_REWARD_LIMIT };
}

async function setStudentAccountStatus(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  const studentId = String(payload.studentId || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const status = String(payload.status || '');
  if (!studentId || !['active', 'disabled'].includes(status)) return { ok: false, error: '学生账号状态无效。' };

  const rows = (await supabaseRequest(`students?student_id=eq.${encodeURIComponent(studentId)}&select=student_id,student_name,teacher_id,status&limit=1`) || []) as JsonRecord[];
  const student = rows[0];
  if (!student) return { ok: false, errorCode: 'STUDENT_NOT_FOUND', error: '找不到这个学生账号。' };
  const canManage = teacher.teacherId === 'TCH01_JIE'
    || PRESET_TEACHERS.some(t => t.teacherId === teacher.teacherId)
    || normalizeId(student.teacher_id) === teacher.teacherId;
  if (!canManage && (teacher.teacherId !== 'TCH01_JIE' && normalizeId(student.teacher_id) !== teacher.teacherId)) {
    return { ok: false, error: '您没有权限管理这个学生账号。' };
  }

  await supabaseRequest(`students?student_id=eq.${encodeURIComponent(studentId)}`, {
    method: 'PATCH',
    body: { status, updated_at: new Date().toISOString() },
    prefer: 'return=minimal'
  });
  await syncGoogleSheetsAfterWrite(teacher.teacherId);
  return { ok: true, studentId, status };
}

async function deleteStudentAccount(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  const studentId = String(payload.studentId || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!studentId) return { ok: false, error: '学生账号无效。' };

  const rows = (await supabaseRequest(`students?student_id=eq.${encodeURIComponent(studentId)}&select=student_id,student_name,teacher_id,status&limit=1`) || []) as JsonRecord[];
  const student = rows[0];
  if (!student) return { ok: false, errorCode: 'STUDENT_NOT_FOUND', error: '找不到这个学生账号。' };
  const canDelete = teacher.teacherId === 'TCH01_JIE'
    || PRESET_TEACHERS.some(t => t.teacherId === teacher.teacherId)
    || normalizeId(student.teacher_id) === teacher.teacherId;
  if (!canDelete && (teacher.teacherId !== 'TCH01_JIE' && normalizeId(student.teacher_id) !== teacher.teacherId)) {
    return { ok: false, error: '您没有权限删除这个学生账号。' };
  }
  if (student.status !== 'disabled') {
    return { ok: false, errorCode: 'STUDENT_MUST_BE_DISABLED', error: '请先移除学生，再进行永久删除。' };
  }

  await supabaseRequest(`students?student_id=eq.${encodeURIComponent(studentId)}`, {
    method: 'DELETE',
    prefer: 'return=minimal'
  });
  const remaining = await supabaseRequest(`students?student_id=eq.${encodeURIComponent(studentId)}&select=student_id&limit=1`) || [];
  if ((remaining as JsonRecord[]).length) return { ok: false, error: '学生账号未能完全删除，请稍后再试。' };
  await syncGoogleSheetsAfterWrite(teacher.teacherId);
  return { ok: true, studentId, deleted: true };
}

// ─── Admin: delete ALL students (TCH01_JIE only) ────────────────────────────
async function deleteAllStudents(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  if (teacher.teacherId !== 'TCH01_JIE') {
    return { ok: false, error: '只有主管理员可以执行全部删除操作。' };
  }

  // Delete student_game_states first to avoid FK issues
  await supabaseRequest('student_game_states?student_id=neq.____NONE____', {
    method: 'DELETE',
    prefer: 'return=minimal'
  });

  // Delete all student rows
  await supabaseRequest('students?student_id=neq.____NONE____', {
    method: 'DELETE',
    prefer: 'return=minimal'
  });

  const remaining = (await supabaseRequest('students?select=student_id&limit=5') || []) as JsonRecord[];
  return {
    ok: true,
    deleted: true,
    remainingCount: remaining.length,
    message: remaining.length === 0
      ? '所有学生账号已成功清空。'
      : `删除后仍剩余 ${remaining.length} 条记录，请稍后重试。`
  };
}

async function resetStudentPassword(payload: JsonRecord = {}) {
  const teacher = await requireTeacherSession(payload);
  const studentId = String(payload.studentId || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const newPin = String(payload.newPin || payload.newPassword || '').trim();
  if (!studentId) return { ok: false, error: '学生账号无效。' };
  if (newPin.length < 4) return { ok: false, error: '学生临时 PIN 至少需要 4 位。' };

  const rows = (await supabaseRequest(`students?student_id=eq.${encodeURIComponent(studentId)}&select=student_id,teacher_id,status&limit=1`) || []) as JsonRecord[];
  const student = rows[0];
  if (!student) return { ok: false, errorCode: 'STUDENT_NOT_FOUND', error: '找不到这个学生账号。' };
  const canReset = teacher.teacherId === 'TCH01_JIE'
    || PRESET_TEACHERS.some(t => t.teacherId === teacher.teacherId)
    || normalizeId(student.teacher_id) === teacher.teacherId;
  if (!canReset && (teacher.teacherId !== 'TCH01_JIE' && normalizeId(student.teacher_id) !== teacher.teacherId)) {
    return { ok: false, error: '您没有权限重设这个学生密码。' };
  }

  await supabaseRequest(`students?student_id=eq.${encodeURIComponent(studentId)}`, {
    method: 'PATCH',
    body: { password_hash: hashPasswordSync(newPin), updated_at: new Date().toISOString() },
    prefer: 'return=minimal'
  });
  return { ok: true, studentId };
}


async function listSubjects() {
  return { ok: true, subjects: EDUVERSE_SUBJECTS };
}

async function listChapters(payload: JsonRecord = {}) {
  const subjectId = String(payload.subjectId || '').trim();
  const form = String(payload.form || '').trim();
  let chapters = LOCAL_STORAGE_DB.chapters;
  if (subjectId) chapters = chapters.filter(c => c.subjectId === subjectId);
  if (form) chapters = chapters.filter(c => c.form === form);
  return { ok: true, chapters };
}

async function listQuestions(payload: JsonRecord = {}) {
  const subjectId = String(payload.subjectId || '').trim();
  const form = String(payload.form || '').trim();
  const chapterId = String(payload.chapterId || '').trim();
  const status = String(payload.status || '').trim();

  let questions = LOCAL_STORAGE_DB.questions;
  if (subjectId) questions = questions.filter(q => q.subjectId === subjectId);
  if (form) questions = questions.filter(q => q.form === form);
  if (chapterId) questions = questions.filter(q => q.chapterId === chapterId);
  if (status) questions = questions.filter(q => q.status === status);

  return { ok: true, questions };
}

async function saveQuestion(payload: JsonRecord = {}) {
  const questionId = String(payload.questionId || `q-${Date.now()}`);
  const question = {
    questionId,
    subjectId: String(payload.subjectId || 'bc'),
    form: String(payload.form || 'Form 1'),
    chapterId: String(payload.chapterId || ''),
    subtopic: String(payload.subtopic || ''),
    questionType: String(payload.questionType || 'single_choice'),
    questionText: String(payload.questionText || ''),
    options: Array.isArray(payload.options) ? payload.options : [],
    correctAnswer: String(payload.correctAnswer || ''),
    explanation: String(payload.explanation || ''),
    kssmFocus: String(payload.kssmFocus || '⭐ 必会'),
    difficulty: String(payload.difficulty || 'Normal'),
    expReward: toNumber(payload.expReward, 30),
    coinReward: toNumber(payload.coinReward, 10),
    status: String(payload.status || 'published'),
    createdBy: String(payload.createdBy || 'teacher')
  };

  const idx = LOCAL_STORAGE_DB.questions.findIndex(q => q.questionId === questionId);
  if (idx >= 0) {
    LOCAL_STORAGE_DB.questions[idx] = question;
  } else {
    LOCAL_STORAGE_DB.questions.push(question);
  }

  return { ok: true, question };
}

async function publishQuestion(payload: JsonRecord = {}) {
  const questionId = String(payload.questionId || '');
  const status = String(payload.status || 'published');
  const q = LOCAL_STORAGE_DB.questions.find(item => item.questionId === questionId);
  if (!q) return { ok: false, error: '题目未找到。' };
  q.status = status;
  return { ok: true, question: q };
}

async function getDailyChallenge(payload: JsonRecord = {}) {
  const form = String(payload.form || 'All');
  const challenge = LOCAL_STORAGE_DB.dailyChallenges.find(c => c.form === 'All' || c.form === form) || LOCAL_STORAGE_DB.dailyChallenges[0];
  if (!challenge) return { ok: true, challenge: null };
  const questions = LOCAL_STORAGE_DB.questions.filter(q => (challenge.questionIds || []).includes(q.questionId));

  return {
    ok: true,
    challenge: {
      ...challenge,
      questions: questions.length ? questions : LOCAL_STORAGE_DB.questions.slice(0, 3)
    }
  };
}

async function createDailyChallenge(payload: JsonRecord = {}) {
  const challenge = {
    challengeId: `dc-${Date.now()}`,
    title: String(payload.title || '今日学科竞速挑战'),
    subjectId: String(payload.subjectId || 'math'),
    form: String(payload.form || 'All'),
    classId: String(payload.classId || ''),
    description: String(payload.description || ''),
    questionIds: Array.isArray(payload.questionIds) ? payload.questionIds : [],
    startTime: payload.startTime || new Date().toISOString(),
    endTime: payload.endTime || new Date(Date.now() + 86400000).toISOString(),
    expBounty: toNumber(payload.expBounty, 500),
    coinReward: toNumber(payload.coinReward, 100),
    difficulty: String(payload.difficulty || 'Medium'),
    status: 'active'
  };

  LOCAL_STORAGE_DB.dailyChallenges.unshift(challenge);
  return { ok: true, challenge };
}

const COMBO_EXP_MULTIPLIERS: Record<number, number> = {
  1: 1.0, 2: 1.1, 3: 1.2, 4: 1.3, 5: 1.5,
  6: 1.6, 7: 1.7, 8: 1.8, 9: 1.9, 10: 2.0
};

async function submitQuestResult(payload: JsonRecord = {}) {
  const studentId = normalizeId(payload.studentId);
  const subjectId = String(payload.subjectId || '');
  const form = String(payload.form || 'Form 1');
  const chapterId = String(payload.chapterId || '');
  const challengeId = String(payload.challengeId || '');
  const questType = String(payload.questType || 'chapter');
  const answers = Array.isArray(payload.answers) ? payload.answers : [];
  const maxCombo = toNumber(payload.maxCombo, 0);
  const isRetry = Boolean(payload.isRetry);

  let correctCount = 0;
  let baseExp = 0;
  let coinsEarned = 0;
  const mistakes: JsonRecord[] = [];

  answers.forEach(ans => {
    const q = LOCAL_STORAGE_DB.questions.find(item => item.questionId === ans.questionId) || {};
    const isCorrect = String(ans.userAnswer || '').trim() === String(q.correctAnswer || ans.correctAnswer || '').trim();
    if (isCorrect) {
      correctCount++;
      baseExp += toNumber(q.expReward, 30);
      coinsEarned += toNumber(q.coinReward, 10);
    } else {
      mistakes.push({
        questionId: ans.questionId,
        questionText: q.questionText || ans.questionText || '',
        userAnswer: ans.userAnswer,
        correctAnswer: q.correctAnswer || ans.correctAnswer || '',
        explanation: q.explanation || ans.explanation || '',
        chapterId: q.chapterId || chapterId
      });
    }
  });

  const totalQuestions = Math.max(1, answers.length);
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const isPerfect = correctCount === totalQuestions;

  const multiplier = COMBO_EXP_MULTIPLIERS[Math.min(10, Math.max(1, maxCombo))] || 1.0;
  const comboExp = Math.round(baseExp * (multiplier - 1.0));
  const perfectExp = isPerfect ? 150 : 0;
  const totalExp = baseExp + comboExp + perfectExp;

  const record = {
    recordId: `qr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    studentId,
    subjectId,
    form,
    chapterId,
    challengeId,
    questType,
    totalQuestions,
    correctCount,
    accuracyPercent: accuracy,
    isFirstAttempt: !isRetry,
    maxCombo,
    baseExp,
    comboExp,
    perfectExp,
    totalExp,
    coinsEarned,
    mistakeDetails: mistakes,
    createdAt: new Date().toISOString()
  };

  LOCAL_STORAGE_DB.questRecords.push(record);

  let studentProfile: JsonRecord | null = null;
  try {
    const res = await getStudent({ studentId });
    if (res && res.ok && res.student) {
      studentProfile = res.student;
      studentProfile.experience = (studentProfile.experience || 0) + totalExp;
      studentProfile.coins = (studentProfile.coins || 0) + coinsEarned;
      studentProfile.totalStars = (studentProfile.totalStars || 0) + correctCount;
      studentProfile.petLevel = Math.max(1, Math.floor(studentProfile.experience / 100) + 1);

      const todayStr = new Date().toISOString().slice(0, 10);
      if (studentProfile.lastCheckinDate !== todayStr) {
        studentProfile.streak = (studentProfile.streak || 0) + 1;
        studentProfile.lastCheckinDate = todayStr;
      }
      await saveStudentState({ studentId, student: studentProfile });
    }
  } catch (_err) {}

  return {
    ok: true,
    settlement: {
      totalQuestions,
      correctCount,
      accuracy,
      isPerfect,
      maxCombo,
      multiplier,
      baseExp,
      comboExp,
      perfectExp,
      totalExp,
      coinsEarned,
      mistakes,
      recordId: record.recordId
    },
    student: studentProfile
  };
}

async function getGloryLeaderboard(payload: JsonRecord = {}) {
  const filter = String(payload.filter || 'all').toLowerCase();

  // Fetch real students from Supabase
  const allStudents = await listLeaderboardStudents();
  let baseList = (allStudents.students || []) as JsonRecord[];

  // Remove teacher roster rows from the leaderboard
  baseList = baseList.filter(student => !isTeacherRosterRow(student));

  // Apply form filter
  if (filter === 'form1') baseList = baseList.filter(s => String(s.form || s.class_name || '').toLowerCase().includes('form 1') || String(s.class_name || '').toLowerCase().includes('1'));
  if (filter === 'form2') baseList = baseList.filter(s => String(s.form || s.class_name || '').toLowerCase().includes('form 2') || String(s.class_name || '').toLowerCase().includes('2'));
  if (filter === 'form3') baseList = baseList.filter(s => String(s.form || s.class_name || '').toLowerCase().includes('form 3') || String(s.class_name || '').toLowerCase().includes('3'));

  // Sort by score/coins descending, assign ranks
  baseList.sort((a, b) => (Number(b.score || b.coins || 0)) - (Number(a.score || a.coins || 0)));
  const ranked = baseList.map((s, i) => ({ ...s, rank: i + 1 }));

  return {
    ok: true,
    filter,
    top3: ranked.slice(0, 3),
    rankings: ranked
  };
}

async function listAchievements(payload: JsonRecord = {}) {
  const studentId = normalizeId(payload.studentId);
  const unlockedMap = LOCAL_STORAGE_DB.studentAchievements.get(studentId) || new Set(['ach-first-quest']);

  const achievements = SEED_ACHIEVEMENTS.map(ach => ({
    ...ach,
    isUnlocked: unlockedMap.has(ach.achievementId),
    unlockedAt: unlockedMap.has(ach.achievementId) ? '2026-08-28' : null
  }));

  return { ok: true, achievements };
}

async function getTeacherAnalytics(_payload: JsonRecord = {}) {
  const records = LOCAL_STORAGE_DB.questRecords;
  const totalQuestionsAnswered = records.reduce((sum, r) => sum + (Number(r.totalQuestions) || 0), 0);
  const totalCorrect = records.reduce((sum, r) => sum + (Number(r.correctCount) || 0), 0);
  const avgAccuracy = Math.round((totalCorrect / Math.max(1, totalQuestionsAnswered)) * 100);

  return {
    ok: true,
    summary: {
      totalStudents: 0,
      activeToday: 0,
      questionsAnsweredToday: totalQuestionsAnswered,
      averageAccuracy: avgAccuracy,
      dailyChallengeCompletionRate: 0,
      firstAttemptAccuracy: avgAccuracy,
      retryAccuracy: 0
    },
    subjectStats: {},
    formStats: {},
    weakestChapters: [],
    mostWrongQuestions: []
  };
}

async function bulkImportQuestions(payload: JsonRecord = {}) {
  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  let imported = 0;
  const errors: string[] = [];

  rows.forEach((row, i) => {
    if (!row.questionText || !row.correctAnswer) {
      errors.push(`第 ${i + 1} 行：缺少题目内容或正确答案。`);
      return;
    }
    const q = {
      questionId: String(row.questionId || `q-import-${Date.now()}-${i}`),
      subjectId: String(row.subjectId || 'math').toLowerCase(),
      form: String(row.form || 'Form 1'),
      chapterId: String(row.chapterId || ''),
      questionType: String(row.questionType || 'single_choice'),
      questionText: String(row.questionText),
      options: Array.isArray(row.options) ? row.options : (typeof row.options === 'string' ? row.options.split('|') : []),
      correctAnswer: String(row.correctAnswer),
      explanation: String(row.explanation || ''),
      kssmFocus: String(row.kssmFocus || '⭐ 必会'),
      difficulty: String(row.difficulty || 'Normal'),
      expReward: toNumber(row.expReward, 30),
      coinReward: toNumber(row.coinReward, 10),
      status: 'published',
      createdBy: String(payload.teacherId || 'teacher')
    };
    LOCAL_STORAGE_DB.questions.push(q);
    imported++;
  });

  return {
    ok: errors.length === 0,
    importedCount: imported,
    errors
  };
}

async function syncGoogleSheetsData(payload: JsonRecord = {}) {
  const webAppUrl = Deno.env.get('GOOGLE_SHEETS_WEB_APP_URL') || '';
  if (!webAppUrl) {
    // GOOGLE_SHEET_NOT_CONFIGURED — env var absent, cannot sync
    return {
      ok: false,
      status: 'not_configured',
      error: 'GOOGLE_SHEET_NOT_CONFIGURED',
      message: 'Google Sheets Web App URL 未配置，无法同步。请在 Supabase 函数环境变量中设置 GOOGLE_SHEETS_WEB_APP_URL。'
    };
  }

  const teacherId = String(payload.teacherId || 'TCH01_JIE');
  const jobId = `sync-${Date.now()}`;
  const nowStr = new Date().toISOString();

  // Tabs that this connector will push to Google Sheet
  const tabs = [
    { name: '学生资料', sheet: 'Students' },
    { name: '学习记录', sheet: 'Performance' },
    { name: '任务结果', sheet: 'Quest Results' },
    { name: '排行榜',   sheet: 'Leaderboard' },
    { name: '每日挑战', sheet: 'Daily Challenge' }
  ];

  let totalRows = 0;
  const errors: string[] = [];

  for (const tab of tabs) {
    try {
      const res = await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', sheet: tab.sheet, teacherId })
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        totalRows += Number(data.rowsWritten || 0);
      } else {
        errors.push(`${tab.name}: HTTP ${res.status}`);
      }
    } catch (e) {
      errors.push(`${tab.name}: ${(e as Error).message}`);
    }
  }

  const syncJob = {
    jobId,
    triggeredBy: teacherId,
    status: errors.length === 0 ? 'synced' : 'partial',
    syncedTabs: tabs.map(t => t.name),
    rowsSynced: totalRows,
    startedAt: nowStr,
    finishedAt: new Date().toISOString(),
    errorMessage: errors.join('; ')
  };

  // Persist to google_sheet_sync_jobs table (best-effort)
  try {
    await supabaseAdmin.from('google_sheet_sync_jobs').insert([{
      job_id: jobId,
      triggered_by: teacherId,
      status: syncJob.status,
      synced_tabs: syncJob.syncedTabs,
      rows_synced: syncJob.rowsSynced,
      started_at: nowStr,
      finished_at: syncJob.finishedAt,
      error_message: syncJob.errorMessage
    }]);
  } catch (_e) { /* non-fatal — table may not exist yet */ }

  syncLogHistory.unshift(syncJob);
  if (syncLogHistory.length > 20) syncLogHistory = syncLogHistory.slice(0, 20);

  return {
    ok: errors.length === 0,
    job: syncJob,
    message: errors.length === 0
      ? `Google Sheet 同步完成！已成功更新 ${tabs.length} 个工作表。`
      : `同步部分完成，${errors.length} 个工作表失败：${errors.join(', ')}`
  };
}

async function getGoogleSheetSyncStatus() {
  const webAppUrl = Deno.env.get('GOOGLE_SHEETS_WEB_APP_URL') || '';
  if (!webAppUrl) {
    return {
      ok: false,
      status: 'not_configured',
      error: 'GOOGLE_SHEET_NOT_CONFIGURED'
    };
  }
  const latest = syncLogHistory[0] || null;
  return {
    ok: true,
    status: latest?.status ?? 'never_synced',
    lastSyncedAt: latest?.finishedAt ?? null,
    latestJob: latest,
    logs: syncLogHistory
  };
}

async function handleAction(payload: JsonRecord) {
  const action = String(payload.action || '');
  // EduVerse Teacher & Student Phone Auth
  if (action === 'listTeachers') return listTeachers();
  if (action === 'teacherLogin') return teacherLogin(payload);
  if (action === 'changeTeacherPassword') return changeTeacherPassword(payload);
  if (action === 'getTeacherProfile') return getTeacherProfile(payload);
  if (action === 'listStudentAccounts' || action === 'listStudents') return listStudentAccounts(payload);
  if (action === 'listManagedClasses') return listManagedClasses(payload);
  if (action === 'createManagedClass') return createManagedClass(payload);
  if (action === 'rewardManagedStudents') return rewardManagedStudents(payload);
  if (action === 'setStudentAccountStatus') return setStudentAccountStatus(payload);
  if (action === 'deleteStudentAccount') return deleteStudentAccount(payload);
  if (action === 'deleteAllStudents') return deleteAllStudents(payload);
  if (action === 'resetStudentPassword') return resetStudentPassword(payload);
  if (action === 'registerStudentPhone') return registerStudentPhone(payload);
  if (action === 'loginStudentPhone') return loginStudentPhone(payload);

  // EduVerse 8 Subjects & Quests
  if (action === 'listSubjects') return listSubjects();
  if (action === 'listChapters') return listChapters(payload);
  if (action === 'listQuestions') return listQuestions(payload);
  if (action === 'saveQuestion') return saveQuestion(payload);
  if (action === 'publishQuestion') return publishQuestion(payload);
  if (action === 'getDailyChallenge') return getDailyChallenge(payload);
  if (action === 'createDailyChallenge') return createDailyChallenge(payload);
  if (action === 'submitQuestResult') return submitQuestResult(payload);
  if (action === 'getGloryLeaderboard') return getGloryLeaderboard(payload);
  if (action === 'listAchievements') return listAchievements(payload);

  // EduVerse Teacher Analytics & Sync
  if (action === 'getTeacherAnalytics') return getTeacherAnalytics(payload);
  if (action === 'bulkImportQuestions') return bulkImportQuestions(payload);
  if (action === 'syncGoogleSheetsData') return syncGoogleSheetsData(payload);
  if (action === 'getGoogleSheetSyncStatus') return getGoogleSheetSyncStatus();

  // Existing Core Handlers
  if (action === 'getStudent') return getStudent(payload);
  if (action === 'registerStudent') return registerStudent(payload);
  if (action === 'recordMiniGameScore') return recordMiniGameScore(payload);
  if (action === 'saveStudentState') return saveStudentState(payload);
  if (action === 'submitCheckin') return submitCheckin(payload);
  if (action === 'listTeacherClasses') return listTeacherClasses(payload);
  if (action === 'getClassStudents') return getClassStudents(payload);
  if (action === 'rewardStudents') return rewardStudents(payload);
  if (action === 'bulkImportStudents') return bulkImportStudents(payload);
  if (action === 'listWallPosts') return listWallPosts();
  if (action === 'listLeaderboardStudents') return listLeaderboardStudents();
  if (action === 'createWallPost') return createWallPost(payload);
  if (action === 'likeWallPost') return likeWallPost(payload);
  if (action === 'commentWallPost') return commentWallPost(payload);
  if (action === 'searchFriends') return searchFriends(payload);
  if (action === 'sendFriendRequest') return sendFriendRequest(payload);
  if (action === 'respondFriendRequest') return respondFriendRequest(payload);
  if (action === 'listFriends') return listFriends(payload);
  if (action === 'listFriendInteractionRooms') return listFriendInteractionRooms(payload);
  if (action === 'getFriendProfile') return getFriendProfile(payload);
  if (action === 'listNotifications') return listNotifications(payload);
  if (action === 'sendGift') return sendGift(payload);
  if (action === 'sendBlindBoxDuplicateGift') return sendBlindBoxDuplicateGift(payload);
  if (action === 'claimGift') return claimGift(payload);
  if (action === 'markNotificationRead') return markNotificationRead(payload);
  if (action === 'clearReadNotifications') return clearReadNotifications(payload);
  if (action === 'listRooms') return listRooms(payload);
  if (action === 'listRoom') return listRoom(payload);
  if (action === 'joinRoomByCode') return joinRoomByCode(payload);
  if (action === 'requestRoomJoin') return requestRoomJoinByOwner(payload);
  if (action === 'respondRoomJoinRequest') return respondRoomJoinRequest(payload);
  if (action === 'updateRoomScene') return updateRoomScene(payload);
  if (action === 'updateRoomSettings') return updateRoomSettings(payload);
  if (action === 'closeRoom') return closeRoom(payload);
  if (action === 'addRoomPet') return addRoomPet(payload);
  if (action === 'removeRoomPet') return removeRoomPet(payload);
  if (action === 'removeRoomMember') return removeRoomMember(payload);
  if (action === 'placeRoomDecoration') return placeRoomDecoration(payload);
  if (action === 'removeRoomDecoration') return removeRoomDecoration(payload);
  if (action === 'resetRoom') return resetRoom(payload);
  if (action === 'sendRoomMessage') return sendRoomMessage(payload);
  if (action === 'listInteractionRooms') return listInteractionRooms(payload);
  if (action === 'createInteractionRoom') return createInteractionRoom(payload);
  if (action === 'joinInteractionRoom') return joinInteractionRoom(payload);
  if (action === 'getInteractionRoom') return getInteractionRoom(payload);
  if (action === 'heartbeatInteractionRoom') return heartbeatInteractionRoom(payload);
  if (action === 'leaveInteractionRoom') return leaveInteractionRoom(payload);
  return { ok: false, fallbackAllowed: true, errorCode: 'UNSUPPORTED_ACTION', error: `Unsupported Supabase action: ${action}` };
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);
  if (!authorizeRequest(request)) return json({ ok: false, error: 'Unauthorized Supabase request' }, 401);
  try {
    const payload = await request.json();
    return json(await handleAction(payload || {}));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({
      ok: false,
      retryable: Boolean((error as { retryable?: boolean }).retryable),
      fallbackAllowed: Boolean((error as { fallbackAllowed?: boolean }).fallbackAllowed || (error as { retryable?: boolean }).retryable),
      errorCode: String((error as { errorCode?: string }).errorCode || 'SUPABASE_FUNCTION_ERROR'),
      error: message
    }, 200);
  }
});
