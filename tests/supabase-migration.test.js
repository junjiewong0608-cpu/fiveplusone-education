const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const schemaSource = fs.readFileSync(path.join(projectRoot, 'supabase', 'schema.sql'), 'utf8');
const functionSource = fs.readFileSync(path.join(projectRoot, 'supabase', 'functions', 'cy-pets-api', 'index.ts'), 'utf8');
const setupGuide = fs.readFileSync(path.join(projectRoot, 'docs', 'supabase-free-plan-setup.md'), 'utf8');

test('Supabase schema stores game state, wall posts, likes and comments without image blobs', () => {
  [
    'create table if not exists public.students',
    'create table if not exists public.student_game_states',
    'create table if not exists public.daily_checkins',
    'create table if not exists public.purchase_ledger',
    'create table if not exists public.teacher_rewards',
    'create table if not exists public.wall_posts',
    'create table if not exists public.wall_likes',
    'create table if not exists public.wall_comments'
  ].forEach(snippet => assert.match(schemaSource, new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));

  assert.match(schemaSource, /state jsonb not null default '\{\}'::jsonb/);
  assert.match(schemaSource, /pet_image text not null default ''/);
  assert.match(schemaSource, /pet_name text not null default ''/);
  assert.match(schemaSource, /alter table public\.wall_comments add column if not exists pet_name/);
  assert.doesNotMatch(schemaSource, /bytea/);
  assert.doesNotMatch(schemaSource, /storage\.objects/);
});

test('Supabase Edge Function covers student state and message wall actions', () => {
  [
    "action === 'getStudent'",
    "action === 'saveStudentState'",
    "action === 'submitCheckin'",
    "action === 'listTeacherClasses'",
    "action === 'getClassStudents'",
    "action === 'rewardStudents'",
    "action === 'listWallPosts'",
    "action === 'createWallPost'",
    "action === 'likeWallPost'",
    "action === 'commentWallPost'"
  ].forEach(snippet => assert.ok(functionSource.includes(snippet), `missing ${snippet}`));

  assert.match(functionSource, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(functionSource, /SUPABASE_SECRET_KEYS/);
  assert.match(functionSource, /SUPABASE_PUBLISHABLE_KEYS/);
  assert.match(functionSource, /function authorizeRequest/);
  assert.match(functionSource, /fallbackAllowed/);
  assert.match(functionSource, /on_conflict=student_id/);
  assert.match(functionSource, /const rosterOnlySync = eventType === 'manualSheetSync' \|\| eventType === 'hydrateSupabaseFromSheet'/);
  assert.match(functionSource, /if \(rosterOnlySync\)/);
  assert.match(functionSource, /const hasCustomProfileName = Boolean\(String\(state\.profileNameUpdatedAt \|\| ''\)\.trim\(\)\)/);
  assert.match(functionSource, /getCanonicalStudentName\(studentId, studentNameSource, \{ allowCustom: hasCustomProfileName \}\)/);
  assert.match(functionSource, /if \(existingStudent\.profileNameUpdatedAt\) merged\.studentName = existingStudent\.studentName/);
  assert.match(functionSource, /eventType === 'completeNewPlayerGuide'/);
  assert.match(functionSource, /merged\.forceNewPlayerGuide = false/);
  assert.match(functionSource, /merged\.forceOnboardingTour = false/);
  assert.match(functionSource, /merged\.newPlayerGuideEligible = false/);
  assert.match(functionSource, /musicPlaybackMode:\s*'single'/);
  assert.match(functionSource, /'aot-akuma-no-ko'/);
  assert.match(functionSource, /'demon-slayer-gurenge'/);
  assert.match(functionSource, /'cortis-go'/);
  assert.match(functionSource, /'treasure-boy'/);
  assert.match(functionSource, /'coins'/);
  assert.match(functionSource, /wall_likes/);
  assert.match(functionSource, /wall_comments/);
});

test('Supabase teacher rewards cap student targets while CY0000 and CY0001 can reward teacher targets', () => {
  assert.match(functionSource, /TEACHER_ADMIN_IDS = new Set\(\['CY0000'\]\)/);
  assert.match(functionSource, /TEACHER_REWARD_ADMIN_IDS = new Set\(\['CY0000', 'CY0001'\]\)/);
  assert.doesNotMatch(functionSource, /TEACHER_ADMIN_IDS = new Set\(\[[^\]]*'CY0001'/);
  assert.match(functionSource, /function canRewardTeacherTargets\(teacherId: string\)[\s\S]*?return TEACHER_REWARD_ADMIN_IDS\.has\(normalizeId\(teacherId\)\);[\s\S]*?\n\}/);
  assert.doesNotMatch(functionSource, /canRewardTeacherTargets[\s\S]*isSeniorTeacherRewardAccount/);
  assert.match(functionSource, /const TEACHER_DAILY_REWARD_LIMIT = 250/);
  assert.match(schemaSource, /create or replace function public\.reward_virtual_class_students/);
  assert.match(schemaSource, /grant execute on function public\.reward_virtual_class_students\(text, text, text, text\[\], integer, text\) to service_role/);
  assert.match(functionSource, /async function listTeacherClasses\(payload/);
  assert.match(functionSource, /async function getClassStudents\(payload/);
  assert.match(functionSource, /async function rewardStudents\(payload/);
  assert.match(functionSource, /function canViewAllTeacherClasses\(teacherId: string\)/);
  assert.match(functionSource, /const canViewAllClasses = canViewAllTeacherClasses\(teacherId\)/);
  assert.match(functionSource, /canRewardTeacherTargets\(teacherId\)/);
  assert.match(functionSource, /return assignedTeacherId === normalizeId\(teacherId\)/);
  assert.match(functionSource, /const \{ start, end \} = getMalaysiaDayRange\(\)/);
  assert.match(functionSource, /teacherTarget \? amount : Math\.min\(amount, remainingDailyReward\)/);
  assert.match(functionSource, /dailyLimit: TEACHER_DAILY_REWARD_LIMIT/);
  assert.match(functionSource, /async function listTeacherRewardsForStudent\(studentId: string\)/);
  assert.match(functionSource, /student\.teacherRewards = await listTeacherRewardsForStudent\(studentId\)/);
  assert.match(schemaSource, /returns table\(student_id text, coins integer, applied_amount integer, limited boolean\)/);
  assert.match(schemaSource, /student_daily_reward_limit integer := 250/);
  assert.match(schemaSource, /reward_day_start timestamptz := \(\(now\(\) at time zone 'Asia\/Kuala_Lumpur'\)::date at time zone 'Asia\/Kuala_Lumpur'\)/);
});

test('Supabase bulk student import creates missing states without overwriting progress', () => {
  assert.ok(functionSource.includes("action === 'bulkImportStudents'"), 'bulk import action should be routed');
  assert.match(functionSource, /async function bulkImportStudents\(payload/);
  assert.match(functionSource, /const BULK_IMPORT_MAX_ROWS = 500/);
  assert.match(schemaSource, /alter table public\.students add column if not exists teacher_id text not null default ''/);
  assert.match(schemaSource, /create index if not exists idx_students_teacher_branch_class/);
  assert.match(functionSource, /canUseBulkStudentImport\(teacherId\)/);
  assert.match(functionSource, /defaultTeacherId/);
  assert.match(functionSource, /teacher_id:\s*row\.teacherId/);
  assert.match(functionSource, /state\.teacherId\s*=\s*row\.teacherId/);
  assert.match(functionSource, /state\.sincereFriendId = ''/);
  assert.match(functionSource, /status:\s*'active'/);
  assert.match(functionSource, /students\?on_conflict=student_id/);
  assert.match(functionSource, /student_game_states\?on_conflict=student_id/);
  assert.match(functionSource, /resolution=ignore-duplicates,return=minimal/);
  assert.match(functionSource, /missingStateIds/);
  assert.match(functionSource, /select=student_id,student_name,branch,class_name,teacher_id,status/);
  assert.match(functionSource, /select=student_id,student_name,branch,class_name,teacher_id,avatar,status/);

  const bulkImportSource = functionSource.slice(
    functionSource.indexOf('async function bulkImportStudents'),
    functionSource.indexOf('async function saveStudentState')
  );
  assert.doesNotMatch(bulkImportSource, /upsertStudentAndState/);
  assert.doesNotMatch(bulkImportSource, /sincereFriendId:\s*normalizeId/);
  assert.doesNotMatch(bulkImportSource, /normalizeBulkImportStatus/);
});

test('Supabase state merge treats cute-only heroic saves as cute', () => {
  assert.match(functionSource, /const CUTE_ONLY_FINAL_EVOLUTION_PET_IDS = new Set/);
  assert.match(functionSource, /'my-melody'/);
  assert.match(functionSource, /function petSupportsHeroicEvolution\(petType: unknown\)/);
  assert.match(functionSource, /function normalizePetEvolutionFormForPet\(value: unknown, petType: unknown\)/);
  assert.match(functionSource, /mergeUnlockedPetEvolutionForms\(existing\.unlockedEvolutionForms, incoming\.unlockedEvolutionForms, merged, petId\)/);
  assert.match(functionSource, /getFallbackPetEvolutionForm\(unlockedForms,[\s\S]*?petId\)/);
  assert.match(functionSource, /normalizePetEvolutionFormForPet\(record\?\.activeEvolutionForm[\s\S]*?safePetId\)/);
});

test('Supabase reset marker prevents stale browser state from restoring old pets', () => {
  assert.match(functionSource, /function getAccountResetMarker\(student: JsonRecord \| null \| undefined\)/);
  assert.match(functionSource, /function isIncomingBeforeAccountReset\(existingStudent: JsonRecord, incomingStudent: JsonRecord\)/);
  assert.match(functionSource, /function isResetPetRestoreAttempt\(existingStudent: JsonRecord, incomingStudent: JsonRecord, eventType: string\)/);
  assert.match(functionSource, /eventType !== 'adoptInitialPet'/);
  assert.match(functionSource, /if \(isIncomingBeforeAccountReset\(existingStudent, incomingStudent\) \|\| isResetPetRestoreAttempt\(existingStudent, incomingStudent, eventType\)\) \{/);
  assert.match(functionSource, /return \{\s*\.\.\.existingStudent,[\s\S]*?miniGameHighScores: mergeMiniGameHighScores\(existingStudent\.miniGameHighScores \|\| existingStudent\.mini_game_scores, \{\}\)/);
});

test('Supabase login falls back to Sheet when only a wall roster row exists', () => {
  const fromStudentRowsSource = functionSource.slice(
    functionSource.indexOf('function fromStudentRows'),
    functionSource.indexOf('async function getStudent')
  );
  assert.match(fromStudentRowsSource, /const game = stateRows\[0\];/);
  assert.match(fromStudentRowsSource, /if \(!roster \|\| !game\) return null;/);
});

test('Supabase setup guide keeps the free-plan constraints explicit', () => {
  assert.match(setupGuide, /Pricing plan 选择 Free/);
  assert.match(setupGuide, /图片继续放 Netlify，不放 Supabase/);
  assert.match(setupGuide, /backendMode: 'supabase'/);
  assert.match(setupGuide, /service role key/);
  assert.match(setupGuide, /生产模式/);
  assert.match(setupGuide, /不会再自动读取旧 Google Apps Script \/ Google Sheet/);
});

test('Supabase schema defines social tables and safe constraints', () => {
  assert.match(schemaSource, /create table if not exists public\.friend_requests/);
  assert.match(schemaSource, /requester_student_id text not null references public\.students\(student_id\) on delete cascade/);
  assert.match(schemaSource, /receiver_student_id text not null references public\.students\(student_id\) on delete cascade/);
  assert.match(schemaSource, /status text not null default 'pending'/);
  assert.match(schemaSource, /check \(requester_student_id <> receiver_student_id\)/);
  assert.match(schemaSource, /create unique index if not exists uq_friend_requests_pending_pair/);

  assert.match(schemaSource, /create table if not exists public\.friendships/);
  assert.match(schemaSource, /student_a_id text not null references public\.students\(student_id\) on delete cascade/);
  assert.match(schemaSource, /student_b_id text not null references public\.students\(student_id\) on delete cascade/);
  assert.match(schemaSource, /check \(student_a_id < student_b_id\)/);
  assert.match(schemaSource, /unique \(student_a_id, student_b_id\)/);

  assert.match(schemaSource, /create table if not exists public\.friend_notifications/);
  assert.match(schemaSource, /payload jsonb not null default '\{\}'::jsonb/);
  assert.match(schemaSource, /idx_friend_notifications_recipient_created/);
  assert.match(schemaSource, /alter table public\.wall_posts add column if not exists pet_title/);

  assert.match(schemaSource, /create table if not exists public\.gift_ledger/);
  assert.match(schemaSource, /gift_type text not null check \(gift_type in \('coins', 'item', 'pet', 'blind-box', 'music'\)\)/);
  assert.match(schemaSource, /status text not null default 'sent'/);
  assert.match(schemaSource, /claimed_at timestamptz/);
  assert.match(schemaSource, /gift_ledger_gift_type_check/);

  assert.match(schemaSource, /create table if not exists public\.student_rooms/);
  assert.match(schemaSource, /create table if not exists public\.student_room_memberships/);
  assert.match(schemaSource, /unique \(student_id, room_owner_student_id\)/);
  assert.match(schemaSource, /status text not null default 'accepted'/);
  assert.match(schemaSource, /check \(status in \('pending', 'accepted', 'rejected'\)\)/);
  assert.match(schemaSource, /requested_at timestamptz/);
  assert.match(schemaSource, /responded_at timestamptz/);
  assert.match(schemaSource, /create table if not exists public\.room_pet_slots/);
  assert.match(schemaSource, /check \(slot_index between 0 and 9\)/);
  assert.match(schemaSource, /create table if not exists public\.room_decorations/);
  assert.match(schemaSource, /create table if not exists public\.room_messages/);
  assert.match(schemaSource, /idx_room_messages_owner_created/);

  assert.match(schemaSource, /create table if not exists public\.interaction_rooms/);
  assert.match(schemaSource, /room_id text primary key/);
  assert.match(schemaSource, /map_set_id text not null default 'cy-town'/);
  assert.match(schemaSource, /member_limit integer not null default 10/);
  assert.match(schemaSource, /is_permanent boolean not null default false/);
  assert.match(schemaSource, /is_locked boolean not null default false/);
  assert.match(schemaSource, /password_code text not null default ''/);
  assert.match(schemaSource, /create table if not exists public\.interaction_room_players/);
  assert.match(schemaSource, /primary key \(room_id, student_id\)/);
  assert.match(schemaSource, /pet_size text not null default 'small' check \(pet_size in \('small', 'big', 'super'\)\)/);
  assert.match(schemaSource, /pet_stage text not null default 'base' check \(pet_stage in \('base', 'mini', 'final'\)\)/);
  assert.match(schemaSource, /pet_style text not null default 'heroic' check \(pet_style in \('heroic', 'cute'\)\)/);
  assert.match(schemaSource, /last_seen_at timestamptz not null default now\(\)/);
  assert.match(schemaSource, /idx_interaction_room_players_room_seen/);
  assert.match(schemaSource, /touch_interaction_rooms_updated_at/);
  assert.match(schemaSource, /grant select, insert, update, delete on public\.interaction_rooms to service_role/);
  assert.match(schemaSource, /grant select, insert, update, delete on public\.interaction_room_players to service_role/);
  [
    "action === 'listInteractionRooms'",
    "action === 'createInteractionRoom'",
    "action === 'joinInteractionRoom'",
    "action === 'getInteractionRoom'",
    "action === 'heartbeatInteractionRoom'",
    "action === 'leaveInteractionRoom'"
  ].forEach(snippet => assert.ok(functionSource.includes(snippet), `missing ${snippet}`));
  assert.match(functionSource, /const INTERACTION_ROOM_STALE_SECONDS = 180/);
  assert.match(functionSource, /PERMANENT_INTERACTION_ROOMS/);
  assert.match(functionSource, /CYMEET2026/);
  assert.match(functionSource, /memberLimit: 30/);
  assert.match(functionSource, /normalizeInteractionRoomMemberLimit/);
  assert.match(functionSource, /payload\.playerAction \|\| payload\.action \|\| 'idle'/);
  assert.match(functionSource, /normalizeInteractionPassword/);
});
