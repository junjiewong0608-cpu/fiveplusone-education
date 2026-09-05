create table if not exists public.students (
  student_id text primary key,
  student_name text not null default '',
  branch text not null default '',
  class_name text not null default '',
  teacher_id text not null default '',
  avatar text not null default '🌟',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.students add column if not exists teacher_id text not null default '';

create table if not exists public.student_game_states (
  student_id text primary key references public.students(student_id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  coins integer not null default 0 check (coins >= 0),
  total_stars integer not null default 0 check (total_stars >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_checkins (
  record_id text primary key,
  student_id text not null references public.students(student_id) on delete cascade,
  checkin_date date not null,
  subject text not null,
  score integer not null default 0,
  total integer not null default 0,
  total_stars integer not null default 0,
  coins_earned integer not null default 0,
  experience_earned integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (student_id, checkin_date, subject)
);

create table if not exists public.purchase_ledger (
  purchase_id uuid primary key default gen_random_uuid(),
  student_id text not null references public.students(student_id) on delete cascade,
  event_type text not null default '',
  item_id text not null default '',
  pet_id text not null default '',
  price integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.teacher_rewards (
  reward_id uuid primary key default gen_random_uuid(),
  teacher_id text not null,
  class_id text not null default '',
  student_id text not null references public.students(student_id) on delete cascade,
  amount integer not null check (amount > 0),
  reason text not null default '课堂表现',
  created_at timestamptz not null default now()
);

create table if not exists public.wall_posts (
  student_id text primary key references public.students(student_id) on delete cascade,
  post_id text not null,
  student_name text not null default '',
  message text not null default '',
  pet_type text not null default '',
  pet_name text not null default '',
  pet_title text not null default '',
  pet_rarity text not null default '',
  pet_level text not null default '',
  combat_power integer not null default 0,
  pet_image text not null default '',
  pet_stats jsonb not null default '{}'::jsonb,
  equipment jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wall_posts add column if not exists pet_title text not null default '';

create table if not exists public.wall_likes (
  post_student_id text not null references public.wall_posts(student_id) on delete cascade,
  liker_student_id text not null references public.students(student_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_student_id, liker_student_id)
);

create table if not exists public.wall_comments (
  comment_id text primary key,
  post_student_id text not null references public.wall_posts(student_id) on delete cascade,
  student_id text not null references public.students(student_id) on delete cascade,
  student_name text not null default '',
  pet_name text not null default '',
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.wall_comments add column if not exists pet_name text not null default '';

update public.wall_comments c
set pet_name = coalesce(
  nullif(gs.state->>'petName', ''),
  nullif(gs.state->'petCollection'->(gs.state->>'petType')->>'petName', ''),
  nullif(s.student_name, ''),
  c.student_id
)
from public.students s
left join public.student_game_states gs on gs.student_id = s.student_id
where c.student_id = s.student_id
  and coalesce(c.pet_name, '') = '';

create table if not exists public.friend_requests (
  request_id uuid primary key default gen_random_uuid(),
  requester_student_id text not null references public.students(student_id) on delete cascade,
  receiver_student_id text not null references public.students(student_id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester_student_id <> receiver_student_id)
);

create unique index if not exists uq_friend_requests_pending_pair
on public.friend_requests (
  least(requester_student_id, receiver_student_id),
  greatest(requester_student_id, receiver_student_id)
)
where status = 'pending';

create table if not exists public.friendships (
  friendship_id uuid primary key default gen_random_uuid(),
  student_a_id text not null references public.students(student_id) on delete cascade,
  student_b_id text not null references public.students(student_id) on delete cascade,
  status text not null default 'accepted' check (status in ('accepted', 'removed', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (student_a_id < student_b_id),
  unique (student_a_id, student_b_id)
);

create table if not exists public.friend_notifications (
  notification_id uuid primary key default gen_random_uuid(),
  recipient_student_id text not null references public.students(student_id) on delete cascade,
  actor_student_id text references public.students(student_id) on delete set null,
  type text not null,
  title text not null default '',
  body text not null default '',
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.gift_ledger (
  gift_id uuid primary key default gen_random_uuid(),
  sender_student_id text not null references public.students(student_id) on delete cascade,
  receiver_student_id text not null references public.students(student_id) on delete cascade,
  gift_type text not null check (gift_type in ('coins', 'item', 'pet', 'blind-box', 'music')),
  amount integer not null default 0 check (amount >= 0),
  item_id text not null default '',
  pet_id text not null default '',
  pet_payload jsonb not null default '{}'::jsonb,
  status text not null default 'sent' check (status in ('sent', 'claimed', 'cancelled')),
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.gift_ledger'::regclass
      and conname = 'gift_ledger_gift_type_check'
  ) then
    alter table public.gift_ledger
      drop constraint gift_ledger_gift_type_check;
  end if;
  alter table public.gift_ledger
    add constraint gift_ledger_gift_type_check
    check (gift_type in ('coins', 'item', 'pet', 'blind-box', 'music'));
end $$;

create table if not exists public.student_rooms (
  room_owner_student_id text primary key references public.students(student_id) on delete cascade,
  room_id text not null default '',
  room_name text not null default '',
  scene_id text not null default 'open-grassland',
  is_closed boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.student_rooms add column if not exists room_id text not null default '';
alter table public.student_rooms add column if not exists room_name text not null default '';
alter table public.student_rooms add column if not exists is_closed boolean not null default false;
create unique index if not exists uq_student_rooms_room_id
on public.student_rooms(room_id)
where room_id <> '';

create table if not exists public.student_room_memberships (
  membership_id uuid primary key default gen_random_uuid(),
  student_id text not null references public.students(student_id) on delete cascade,
  room_owner_student_id text not null references public.student_rooms(room_owner_student_id) on delete cascade,
  status text not null default 'accepted' check (status in ('pending', 'accepted', 'rejected')),
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (student_id, room_owner_student_id)
);

alter table public.student_room_memberships add column if not exists status text not null default 'accepted';
alter table public.student_room_memberships add column if not exists requested_at timestamptz not null default now();
alter table public.student_room_memberships add column if not exists responded_at timestamptz;
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'student_room_memberships_status_check'
  ) then
    alter table public.student_room_memberships
      add constraint student_room_memberships_status_check
      check (status in ('pending', 'accepted', 'rejected'));
  end if;
end $$;

create table if not exists public.room_pet_slots (
  room_owner_student_id text not null references public.student_rooms(room_owner_student_id) on delete cascade,
  slot_index integer not null check (slot_index between 0 and 9),
  guest_student_id text not null references public.students(student_id) on delete cascade,
  pet_id text not null default '',
  created_at timestamptz not null default now(),
  primary key (room_owner_student_id, slot_index)
);

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.room_pet_slots'::regclass
      and conname = 'room_pet_slots_slot_index_check'
  ) then
    alter table public.room_pet_slots
      drop constraint room_pet_slots_slot_index_check;
  end if;
  alter table public.room_pet_slots
    add constraint room_pet_slots_slot_index_check
    check (slot_index between 0 and 9);
end $$;

create table if not exists public.room_decorations (
  decoration_id uuid primary key default gen_random_uuid(),
  room_owner_student_id text not null references public.student_rooms(room_owner_student_id) on delete cascade,
  decoration_item_id text not null,
  x_percent numeric not null check (x_percent >= 0 and x_percent <= 100),
  y_percent numeric not null check (y_percent >= 0 and y_percent <= 100),
  grid_row integer not null default 0,
  grid_col integer not null default 0,
  scale numeric not null default 1 check (scale >= 0.5 and scale <= 1.8),
  layer_index integer not null default 0,
  placed_by_student_id text not null references public.students(student_id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.room_decorations add column if not exists grid_row integer not null default 0;
alter table public.room_decorations add column if not exists grid_col integer not null default 0;

create table if not exists public.room_messages (
  message_id uuid primary key default gen_random_uuid(),
  room_owner_student_id text not null references public.student_rooms(room_owner_student_id) on delete cascade,
  student_id text not null references public.students(student_id) on delete cascade,
  student_name text not null default '',
  pet_name text not null default '',
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.interaction_rooms (
  room_id text primary key,
  room_name text not null default '',
  owner_student_id text not null references public.students(student_id) on delete cascade,
  owner_name text not null default '',
  map_set_id text not null default 'cy-town',
  member_limit integer not null default 10,
  is_permanent boolean not null default false,
  is_locked boolean not null default false,
  password_code text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.interaction_rooms add column if not exists room_name text not null default '';
alter table public.interaction_rooms add column if not exists owner_name text not null default '';
alter table public.interaction_rooms add column if not exists map_set_id text not null default 'cy-town';
alter table public.interaction_rooms add column if not exists member_limit integer not null default 10;
alter table public.interaction_rooms add column if not exists is_permanent boolean not null default false;
alter table public.interaction_rooms add column if not exists is_locked boolean not null default false;
alter table public.interaction_rooms add column if not exists password_code text not null default '';

create table if not exists public.interaction_room_players (
  room_id text not null references public.interaction_rooms(room_id) on delete cascade,
  student_id text not null references public.students(student_id) on delete cascade,
  student_name text not null default '',
  pet_id text not null default '',
  pet_name text not null default '',
  pet_size text not null default 'small' check (pet_size in ('small', 'big', 'super')),
  pet_stage text not null default 'base' check (pet_stage in ('base', 'mini', 'final')),
  pet_style text not null default 'heroic' check (pet_style in ('heroic', 'cute')),
  map_id text not null default 'home',
  x numeric not null default 128,
  y numeric not null default 0,
  facing integer not null default 1,
  action text not null default 'idle',
  message text not null default '',
  message_until timestamptz,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (room_id, student_id)
);

alter table public.interaction_room_players add column if not exists pet_size text not null default 'small';
alter table public.interaction_room_players add column if not exists pet_stage text not null default 'base';
alter table public.interaction_room_players add column if not exists pet_style text not null default 'heroic';
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.interaction_room_players'::regclass
      and conname = 'interaction_room_players_pet_size_check'
  ) then
    alter table public.interaction_room_players
      add constraint interaction_room_players_pet_size_check
      check (pet_size in ('small', 'big', 'super'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.interaction_room_players'::regclass
      and conname = 'interaction_room_players_pet_stage_check'
  ) then
    alter table public.interaction_room_players
      add constraint interaction_room_players_pet_stage_check
      check (pet_stage in ('base', 'mini', 'final'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.interaction_room_players'::regclass
      and conname = 'interaction_room_players_pet_style_check'
  ) then
    alter table public.interaction_room_players
      add constraint interaction_room_players_pet_style_check
      check (pet_style in ('heroic', 'cute'));
  end if;
end $$;

create index if not exists idx_student_game_states_updated_at on public.student_game_states(updated_at desc);
create index if not exists idx_students_teacher_branch_class on public.students(teacher_id, branch, class_name);
create index if not exists idx_daily_checkins_student_date on public.daily_checkins(student_id, checkin_date desc);
create index if not exists idx_purchase_ledger_student_created on public.purchase_ledger(student_id, created_at desc);
create index if not exists idx_teacher_rewards_student_created on public.teacher_rewards(student_id, created_at desc);
create index if not exists idx_wall_posts_updated_at on public.wall_posts(updated_at desc);
create index if not exists idx_wall_comments_post_created on public.wall_comments(post_student_id, created_at desc);
create index if not exists idx_friend_requests_receiver_status on public.friend_requests(receiver_student_id, status, created_at desc);
create index if not exists idx_friendships_student_a on public.friendships(student_a_id, status);
create index if not exists idx_friendships_student_b on public.friendships(student_b_id, status);
create index if not exists idx_friend_notifications_recipient_created on public.friend_notifications(recipient_student_id, created_at desc);
create index if not exists idx_gift_ledger_receiver_status on public.gift_ledger(receiver_student_id, status, created_at desc);
create index if not exists idx_student_room_memberships_student on public.student_room_memberships(student_id, status, created_at asc);
create index if not exists idx_student_room_memberships_owner on public.student_room_memberships(room_owner_student_id, status);
create index if not exists idx_room_decorations_owner on public.room_decorations(room_owner_student_id, created_at desc);
create index if not exists idx_room_messages_owner_created on public.room_messages(room_owner_student_id, created_at desc);
create index if not exists idx_interaction_rooms_updated_at on public.interaction_rooms(updated_at desc);
create index if not exists idx_interaction_room_players_room_seen on public.interaction_room_players(room_id, last_seen_at desc);
create index if not exists idx_interaction_room_players_seen on public.interaction_room_players(last_seen_at desc);

alter table public.students enable row level security;
alter table public.student_game_states enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.purchase_ledger enable row level security;
alter table public.teacher_rewards enable row level security;
alter table public.wall_posts enable row level security;
alter table public.wall_likes enable row level security;
alter table public.wall_comments enable row level security;
alter table public.friend_requests enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_notifications enable row level security;
alter table public.gift_ledger enable row level security;
alter table public.student_rooms enable row level security;
alter table public.student_room_memberships enable row level security;
alter table public.room_pet_slots enable row level security;
alter table public.room_decorations enable row level security;
alter table public.room_messages enable row level security;
alter table public.interaction_rooms enable row level security;
alter table public.interaction_room_players enable row level security;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop function if exists public.reward_virtual_class_students(text, text, text, text[], integer, text);

create or replace function public.reward_virtual_class_students(
  p_teacher_id text,
  p_branch text,
  p_class_name text,
  p_student_ids text[],
  p_amount integer,
  p_reason text default '课堂表现'
)
returns table(student_id text, coins integer, applied_amount integer, limited boolean)
language plpgsql
as $$
declare
  normalized_teacher_id text := upper(trim(coalesce(p_teacher_id, '')));
  reward_amount integer := coalesce(p_amount, 0);
  student_daily_reward_limit integer := 999999;
  reward_day_start timestamptz := ((now() at time zone 'Asia/Kuala_Lumpur')::date at time zone 'Asia/Kuala_Lumpur');
  reward_day_end timestamptz := reward_day_start + interval '1 day';
begin
  if normalized_teacher_id = '' then
    raise exception 'Missing teacher ID';
  end if;

  if reward_amount <= 0 then
    raise exception 'Reward amount must be positive';
  end if;

  if not exists (
    select 1
    from public.students teacher
    where teacher.student_id = normalized_teacher_id
      and coalesce(teacher.status, 'active') = 'active'
      and (
        coalesce(teacher.branch, '') = 'CY大家庭'
        or coalesce(teacher.student_name, '') like '%老师%'
        or upper(coalesce(teacher.class_name, '')) in ('TEST', 'INTERNAL TEST')
        or coalesce(teacher.class_name, '') like '%内测老师%'
      )
  ) then
    raise exception 'Teacher account is not allowed';
  end if;

  insert into public.student_game_states (student_id, state, coins, total_stars)
  select eligible.student_id, jsonb_build_object('studentId', eligible.student_id, 'coins', 0), 0, 0
  from (
    select distinct upper(trim(raw_id)) as student_id
    from unnest(coalesce(p_student_ids, array[]::text[])) as raw_id
    where trim(coalesce(raw_id, '')) <> ''
  ) requested
  join public.students eligible on eligible.student_id = requested.student_id
      where coalesce(eligible.status, 'active') = 'active'
        and coalesce(eligible.branch, '') = coalesce(p_branch, '')
        and coalesce(eligible.class_name, '') = coalesce(p_class_name, '')
        and (
          coalesce(eligible.teacher_id, '') = ''
          or coalesce(eligible.teacher_id, '') = normalized_teacher_id
        )
        and not (
          coalesce(eligible.branch, '') = 'CY大家庭'
      or coalesce(eligible.student_name, '') like '%老师%'
      or upper(coalesce(eligible.class_name, '')) in ('TEST', 'INTERNAL TEST')
      or coalesce(eligible.class_name, '') like '%内测老师%'
    )
  on conflict (student_id) do nothing;

  return query
  with requested as (
    select distinct upper(trim(raw_id)) as student_id
    from unnest(coalesce(p_student_ids, array[]::text[])) as raw_id
    where trim(coalesce(raw_id, '')) <> ''
  ),
  eligible as (
    select student.student_id
    from public.students student
    join requested on requested.student_id = student.student_id
      where coalesce(student.status, 'active') = 'active'
        and coalesce(student.branch, '') = coalesce(p_branch, '')
        and coalesce(student.class_name, '') = coalesce(p_class_name, '')
        and (
          coalesce(student.teacher_id, '') = ''
          or coalesce(student.teacher_id, '') = normalized_teacher_id
        )
        and not (
          coalesce(student.branch, '') = 'CY大家庭'
        or coalesce(student.student_name, '') like '%老师%'
        or upper(coalesce(student.class_name, '')) in ('TEST', 'INTERNAL TEST')
        or coalesce(student.class_name, '') like '%内测老师%'
      )
  ),
  reward_totals as (
    select reward.student_id,
           coalesce(sum(reward.amount), 0)::integer as rewarded_today
    from public.teacher_rewards reward
    join eligible on eligible.student_id = reward.student_id
    where reward.created_at >= reward_day_start
      and reward.created_at < reward_day_end
    group by reward.student_id
  ),
  capped as (
    select eligible.student_id,
           greatest(0, least(reward_amount, student_daily_reward_limit - coalesce(reward_totals.rewarded_today, 0)))::integer as applied_amount
    from eligible
    left join reward_totals on reward_totals.student_id = eligible.student_id
  ),
  updated as (
    update public.student_game_states game
    set coins = game.coins + capped.applied_amount,
        state = jsonb_set(coalesce(game.state, '{}'::jsonb), '{coins}', to_jsonb(game.coins + capped.applied_amount), true)
    from capped
    where game.student_id = capped.student_id
      and capped.applied_amount > 0
    returning game.student_id, game.coins, capped.applied_amount, capped.applied_amount < reward_amount as limited
  ),
  capped_out as (
    select capped.student_id, game.coins, 0::integer as applied_amount, true as limited
    from capped
    join public.student_game_states game on game.student_id = capped.student_id
    where capped.applied_amount <= 0
  ),
  logged as (
    insert into public.teacher_rewards (teacher_id, class_id, student_id, amount, reason)
    select normalized_teacher_id,
           concat(coalesce(p_branch, ''), ' · ', coalesce(p_class_name, '')),
           updated.student_id,
           updated.applied_amount,
           coalesce(nullif(trim(coalesce(p_reason, '')), ''), '课堂表现')
    from updated
    returning 1
  )
  select updated.student_id, updated.coins, updated.applied_amount, updated.limited
  from updated
  union all
  select capped_out.student_id, capped_out.coins, capped_out.applied_amount, capped_out.limited
  from capped_out
  order by 1;
end;
$$;

drop trigger if exists touch_students_updated_at on public.students;
create trigger touch_students_updated_at
before update on public.students
for each row execute function public.touch_updated_at();

drop trigger if exists touch_student_game_states_updated_at on public.student_game_states;
create trigger touch_student_game_states_updated_at
before update on public.student_game_states
for each row execute function public.touch_updated_at();

drop trigger if exists touch_wall_posts_updated_at on public.wall_posts;
create trigger touch_wall_posts_updated_at
before update on public.wall_posts
for each row execute function public.touch_updated_at();

drop trigger if exists touch_friendships_updated_at on public.friendships;
create trigger touch_friendships_updated_at
before update on public.friendships
for each row execute function public.touch_updated_at();

drop trigger if exists touch_student_rooms_updated_at on public.student_rooms;
create trigger touch_student_rooms_updated_at
before update on public.student_rooms
for each row execute function public.touch_updated_at();

drop trigger if exists touch_interaction_rooms_updated_at on public.interaction_rooms;
create trigger touch_interaction_rooms_updated_at
before update on public.interaction_rooms
for each row execute function public.touch_updated_at();

grant usage on schema public to service_role;
grant select, insert, update, delete on public.students to service_role;
grant select, insert, update, delete on public.student_game_states to service_role;
grant select, insert, update, delete on public.daily_checkins to service_role;
grant select, insert, update, delete on public.purchase_ledger to service_role;
grant select, insert, update, delete on public.teacher_rewards to service_role;
grant select, insert, update, delete on public.wall_posts to service_role;
grant select, insert, update, delete on public.wall_likes to service_role;
grant select, insert, update, delete on public.wall_comments to service_role;
grant select, insert, update, delete on public.friend_requests to service_role;
grant select, insert, update, delete on public.friendships to service_role;
grant select, insert, update, delete on public.friend_notifications to service_role;
grant select, insert, update, delete on public.gift_ledger to service_role;
grant select, insert, update, delete on public.student_rooms to service_role;
grant select, insert, update, delete on public.student_room_memberships to service_role;
grant select, insert, update, delete on public.room_pet_slots to service_role;
grant select, insert, update, delete on public.room_decorations to service_role;
grant select, insert, update, delete on public.room_messages to service_role;
grant select, insert, update, delete on public.interaction_rooms to service_role;
grant select, insert, update, delete on public.interaction_room_players to service_role;
revoke all on function public.reward_virtual_class_students(text, text, text, text[], integer, text) from public, anon, authenticated;
grant execute on function public.reward_virtual_class_students(text, text, text, text[], integer, text) to service_role;

-- =========================================================
-- EDUVERSE EXTENSION SCHEMA
-- =========================================================

-- 1. Teachers Table
create table if not exists public.teachers (
  teacher_id text primary key,
  name text not null default '',
  avatar text not null default '🧑‍🏫',
  password_hash text not null default '',
  initial_password_changed boolean not null default false,
  role text not null default 'teacher',
  status text not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Alter Students with Phone & Form
alter table public.students add column if not exists phone text;
alter table public.students add column if not exists password_hash text not null default '';
alter table public.students add column if not exists form text not null default 'Form 1';
alter table public.students add column if not exists level integer not null default 1;
alter table public.students add column if not exists experience integer not null default 0;
alter table public.students add column if not exists current_streak integer not null default 0;
alter table public.students add column if not exists best_streak integer not null default 0;
alter table public.students add column if not exists last_learning_date date;

create unique index if not exists uq_students_phone
on public.students(phone)
where phone is not null and phone <> '';

-- 3. Classes Table
create table if not exists public.classes (
  class_id text primary key,
  class_name text not null default '',
  form text not null default 'Form 1',
  teacher_id text references public.teachers(teacher_id) on delete set null,
  branch text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Subjects Table
create table if not exists public.subjects (
  subject_id text primary key,
  name_zh text not null,
  name_en text not null,
  theme_id text not null,
  badge_icon text not null,
  badge_title text not null,
  color_primary text not null,
  color_secondary text not null,
  color_glow text not null,
  order_index integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- 5. Chapters Table
create table if not exists public.chapters (
  chapter_id text primary key,
  subject_id text not null references public.subjects(subject_id) on delete cascade,
  form text not null default 'Form 1',
  chapter_number integer not null default 1,
  title text not null,
  description text not null default '',
  kssm_focus text not null default '🔥 高频考点',
  difficulty text not null default 'Normal',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- 6. Questions Table
create table if not exists public.questions (
  question_id text primary key,
  subject_id text not null references public.subjects(subject_id) on delete cascade,
  form text not null default 'Form 1',
  chapter_id text references public.chapters(chapter_id) on delete set null,
  subtopic text not null default '',
  question_type text not null default 'single_choice',
  question_text text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text not null default '',
  kssm_focus text not null default '⭐ 必会',
  difficulty text not null default 'Normal',
  exp_reward integer not null default 20,
  coin_reward integer not null default 5,
  status text not null default 'published',
  created_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Daily Challenges Table
create table if not exists public.daily_challenges (
  challenge_id text primary key,
  title text not null,
  subject_id text not null references public.subjects(subject_id) on delete cascade,
  form text not null default 'All',
  class_id text not null default '',
  description text not null default '',
  question_ids jsonb not null default '[]'::jsonb,
  start_time timestamptz not null,
  end_time timestamptz not null,
  exp_bounty integer not null default 500,
  coin_reward integer not null default 100,
  difficulty text not null default 'Medium',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- 8. Quest Records Table (1st attempt & retries)
create table if not exists public.quest_records (
  record_id text primary key,
  student_id text not null references public.students(student_id) on delete cascade,
  subject_id text not null,
  form text not null default 'Form 1',
  chapter_id text not null default '',
  challenge_id text not null default '',
  quest_type text not null default 'chapter',
  total_questions integer not null default 0,
  correct_count integer not null default 0,
  accuracy_percent numeric not null default 0,
  is_first_attempt boolean not null default true,
  max_combo integer not null default 0,
  base_exp integer not null default 0,
  combo_exp integer not null default 0,
  perfect_exp integer not null default 0,
  total_exp integer not null default 0,
  coins_earned integer not null default 0,
  mistake_details jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 9. Achievements & Student Achievements
create table if not exists public.achievements (
  achievement_id text primary key,
  category text not null default 'Study',
  title text not null,
  description text not null default '',
  rarity text not null default 'Common',
  badge_icon text not null default '🏆',
  requirement_type text not null default 'count',
  target_value integer not null default 1,
  exp_reward integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.student_achievements (
  student_id text not null references public.students(student_id) on delete cascade,
  achievement_id text not null references public.achievements(achievement_id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (student_id, achievement_id)
);

-- 10. Google Sheet Sync Jobs
create table if not exists public.google_sheet_sync_jobs (
  job_id text primary key,
  triggered_by text not null default 'teacher',
  sync_type text not null default 'manual',
  status text not null default 'pending',
  synced_tabs jsonb not null default '[]'::jsonb,
  rows_synced integer not null default 0,
  error_message text not null default '',
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable RLS for all new tables
alter table public.teachers enable row level security;
alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.questions enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.quest_records enable row level security;
alter table public.achievements enable row level security;
alter table public.student_achievements enable row level security;
alter table public.google_sheet_sync_jobs enable row level security;

-- Grants
grant select, insert, update, delete on public.teachers to service_role;
grant select, insert, update, delete on public.classes to service_role;
grant select, insert, update, delete on public.subjects to service_role;
grant select, insert, update, delete on public.chapters to service_role;
grant select, insert, update, delete on public.questions to service_role;
grant select, insert, update, delete on public.daily_challenges to service_role;
grant select, insert, update, delete on public.quest_records to service_role;
grant select, insert, update, delete on public.achievements to service_role;
grant select, insert, update, delete on public.student_achievements to service_role;
grant select, insert, update, delete on public.google_sheet_sync_jobs to service_role;

