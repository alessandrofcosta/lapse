create table if not exists public.profiles (
  id bigint primary key,
  slug text not null unique,
  entity_type text not null check (entity_type in ('player', 'npc')),
  name text not null,
  inspiration text,
  level integer,
  xp integer,
  age text,
  height_cm text,
  weight_kg text,
  class_name text,
  archetype text,
  discord_id text
);

create table if not exists public.status (
  profile_slug text primary key references public.profiles(slug) on delete cascade,
  pv text,
  ps text
);

create table if not exists public.attributes (
  id bigint generated always as identity primary key,
  profile_slug text not null references public.profiles(slug) on delete cascade,
  attribute_code text not null,
  attribute_name text not null,
  base_value integer,
  bonus integer default 0,
  prestige integer default 0
);

create table if not exists public.skills (
  id bigint generated always as identity primary key,
  profile_slug text not null references public.profiles(slug) on delete cascade,
  attribute_code text not null,
  skill_name text not null,
  base_value integer,
  bonus integer default 0
);

create table if not exists public.abilities (
  id bigint generated always as identity primary key,
  profile_slug text not null references public.profiles(slug) on delete cascade,
  ability_order integer not null,
  ability_name text not null,
  grimoire text,
  ability_level text,
  description text,
  damage_label text,
  damage_formula text,
  effects text,
  subattacks_json jsonb
);

create index if not exists idx_attributes_profile_slug on public.attributes(profile_slug);
create index if not exists idx_skills_profile_slug on public.skills(profile_slug);
create index if not exists idx_abilities_profile_slug on public.abilities(profile_slug);
