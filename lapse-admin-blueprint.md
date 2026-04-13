# Lapse RPG — Admin Panel MVP Blueprint

> Full-stack architecture for a Supabase-powered admin panel plugged into the existing Lapse repository.
> Stack: Next.js 14 (App Router) + TypeScript + Supabase + Tailwind + shadcn/ui

---

## 1. System Overview

The admin panel is a **separate Next.js application** (`/admin`) that coexists with the existing static Lapse site. It uses Supabase as the single source of truth for all RPG data, replacing the current `data.js` / `npcData.js` flat-file system with a proper relational database — while keeping the existing static pages fully functional via a generated `data.js` build step.

**MVP scope:**
- Role-based access: `super_admin` (global) and `rpg_admin` (scoped to one RPG)
- Full CRUD: RPGs, players, NPCs, skills, attributes
- Inline and modal editing, search/filter/sort, pagination
- Bulk actions, safe delete confirmations
- Realtime list updates via Supabase Realtime
- JSONB extensible stats for future-proof attribute modeling

---

## 2. Architecture

### 2.1 Frontend Modules

```
admin/
├── app/                         # Next.js App Router
│   ├── (auth)/
│   │   └── login/page.tsx       # Supabase Auth UI
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Sidebar + auth guard
│   │   ├── page.tsx             # Super admin overview
│   │   ├── rpgs/
│   │   │   ├── page.tsx         # RPG list
│   │   │   └── [id]/page.tsx    # RPG detail + admin panel
│   │   ├── players/
│   │   │   ├── page.tsx         # Player table (scoped)
│   │   │   └── [id]/page.tsx    # Player editor
│   │   ├── npcs/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── skills/
│   │       └── page.tsx
│   └── api/
│       └── export/route.ts      # Generate data.js for static site
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── EntityTable.tsx          # Reusable data table
│   ├── EntityEditor.tsx         # Modal/side-panel editor
│   ├── BulkActionBar.tsx
│   ├── ConfirmDialog.tsx
│   └── RealtimeBadge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser client (anon key only)
│   │   ├── server.ts            # Server client (service role, server-only)
│   │   └── middleware.ts        # Auth session refresh
│   ├── validations/
│   │   ├── player.schema.ts     # Zod schemas
│   │   ├── npc.schema.ts
│   │   └── skill.schema.ts
│   └── actions/
│       ├── player.actions.ts    # Server Actions
│       ├── npc.actions.ts
│       └── skill.actions.ts
├── hooks/
│   ├── useEntityList.ts         # Fetch + realtime + pagination
│   └── useBulkSelect.ts
├── middleware.ts                # Route-level auth guard
└── env.ts                      # Validated env via @t3-oss/env-nextjs
```

### 2.2 Supabase Schema & RLS Strategy

**Tenant model:** every entity row carries `rpg_id`. RLS policies check that the authenticated user is either `super_admin` or an `rpg_admin` for that specific `rpg_id`. No row is ever visible across tenant boundaries unless the caller is `super_admin`.

**Auth model:** Supabase Auth handles identity. A `profiles` table maps `auth.users.id` → role/rpg assignments. Role elevation (granting `super_admin`) can only be done at the database level — never via the API.

### 2.3 Integration with Existing Lapse Static Site

The existing `js/characters/data.js` and `js/npcs/data.js` are **not deleted**. Instead:
1. Supabase becomes the master source.
2. A CI job (GitHub Actions) calls `GET /api/export` on each push to `main` and writes the generated JS files back to the repo.
3. GitHub Pages continues to serve the existing static pages unchanged.

This allows a zero-downtime migration: players can access the static site during the transition, and the admin panel can be enabled gradually.

### 2.4 GitHub Pages Constraints

GitHub Pages hosts only static files. The Next.js admin panel **cannot** be hosted there. Options:
- **Recommended:** Deploy admin to Vercel (free tier is sufficient) as a separate subdomain (`admin.yourdomain.com`). GitHub Pages continues to serve the player-facing static site.
- **Alternative:** Use Supabase Edge Functions for all server-side logic and deploy the admin as a pure SPA (Next.js `output: 'export'`), though this limits Server Actions and server-only secrets.

---

## 3. Database SQL

```sql
-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────
create type user_role as enum ('super_admin', 'rpg_admin', 'viewer');
create type archetype as enum ('tanque', 'lutador', 'cacador', 'feiticeiro', 'genio');
create type entity_type as enum ('player', 'npc');

-- ─────────────────────────────────────────────
-- HELPER: updated_at trigger
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────
-- PROFILES (maps auth.users → roles)
-- ─────────────────────────────────────────────
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  role          user_role not null default 'viewer',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- RPGs
-- ─────────────────────────────────────────────
create table rpgs (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  is_active   boolean not null default true,
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz  -- soft delete
);

create trigger trg_rpgs_updated_at
  before update on rpgs
  for each row execute function set_updated_at();

create index idx_rpgs_slug on rpgs(slug) where deleted_at is null;

-- ─────────────────────────────────────────────
-- RPG_ADMINS (many-to-many: profiles ↔ rpgs)
-- ─────────────────────────────────────────────
create table rpg_admins (
  profile_id  uuid not null references profiles(id) on delete cascade,
  rpg_id      uuid not null references rpgs(id) on delete cascade,
  granted_by  uuid references profiles(id),
  granted_at  timestamptz not null default now(),
  primary key (profile_id, rpg_id)
);

create index idx_rpg_admins_rpg_id on rpg_admins(rpg_id);

-- ─────────────────────────────────────────────
-- CHARACTERS (players and NPCs unified)
-- ─────────────────────────────────────────────
create table characters (
  id            uuid primary key default uuid_generate_v4(),
  rpg_id        uuid not null references rpgs(id) on delete cascade,
  entity_type   entity_type not null,
  slug          text not null,               -- password map key (e.g. 'caim', 'saori')
  nome          text not null,
  nivel         int not null default 1 check (nivel between 1 and 100),
  xp            int not null default 0 check (xp between 0 and 100),
  arquetipo     archetype not null,
  idade         text,
  altura        int,                         -- cm
  peso          int,                         -- kg
  classe_social text,
  inspiracao    int not null default 0,
  discord_id    text,
  -- computed PV/PS stored as cache, recalculated on attribute change
  pv_max        int generated always as (0) stored, -- overridden by trigger
  ps_max        int not null default 10,
  -- extensible stats
  extra_info    jsonb not null default '{}',
  is_active     boolean not null default true,
  created_by    uuid references profiles(id),
  updated_by    uuid references profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  unique (rpg_id, entity_type, slug)
);

create trigger trg_characters_updated_at
  before update on characters
  for each row execute function set_updated_at();

create index idx_characters_rpg_id on characters(rpg_id) where deleted_at is null;
create index idx_characters_entity_type on characters(rpg_id, entity_type) where deleted_at is null;

-- ─────────────────────────────────────────────
-- ATTRIBUTES
-- ─────────────────────────────────────────────
create table attributes (
  id            uuid primary key default uuid_generate_v4(),
  character_id  uuid not null references characters(id) on delete cascade,
  rpg_id        uuid not null references rpgs(id),  -- denormalized for RLS
  sigla         text not null,    -- 'FOR', 'VIG', 'AGL', 'INT', 'ESP', 'MAG'
  nome          text not null,
  valor         int not null default 0,
  bonus         int not null default 0,
  prestigio     int not null default 1 check (prestigio between 1 and 5),
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (character_id, sigla)
);

create trigger trg_attributes_updated_at
  before update on attributes
  for each row execute function set_updated_at();

create index idx_attributes_character_id on attributes(character_id);
create index idx_attributes_rpg_id on attributes(rpg_id);

-- ─────────────────────────────────────────────
-- SKILLS (pericias)
-- ─────────────────────────────────────────────
create table skills (
  id            uuid primary key default uuid_generate_v4(),
  character_id  uuid not null references characters(id) on delete cascade,
  rpg_id        uuid not null references rpgs(id),
  atributo_sigla text not null,   -- groups pericias under an attribute
  nome          text not null,
  valor         int not null default 0 check (valor between 0 and 15),
  bonus         int not null default 0,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger trg_skills_updated_at
  before update on skills
  for each row execute function set_updated_at();

create index idx_skills_character_id on skills(character_id);
create index idx_skills_rpg_id on skills(rpg_id);

-- ─────────────────────────────────────────────
-- ABILITIES (habilidades)
-- ─────────────────────────────────────────────
create table abilities (
  id            uuid primary key default uuid_generate_v4(),
  character_id  uuid not null references characters(id) on delete cascade,
  rpg_id        uuid not null references rpgs(id),
  nome          text not null,
  grimorio      text,
  nivel         text not null default '1',  -- can be '1','2','3','Suprema','Zona de Mana'
  descricao     text,
  dano          text,
  calculo_dano  jsonb not null default '{}',  -- { atributo, pericia/pericias }
  efeitos       text[] not null default '{}',
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create trigger trg_abilities_updated_at
  before update on abilities
  for each row execute function set_updated_at();

create index idx_abilities_character_id on abilities(character_id);
create index idx_abilities_rpg_id on abilities(rpg_id);

-- ─────────────────────────────────────────────
-- SUB-ATTACKS (subataques)
-- ─────────────────────────────────────────────
create table sub_attacks (
  id          uuid primary key default uuid_generate_v4(),
  ability_id  uuid not null references abilities(id) on delete cascade,
  rpg_id      uuid not null references rpgs(id),
  nome        text not null,
  descricao   text,
  dano        text,
  calculo_dano jsonb not null default '{}',
  efeitos     text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_sub_attacks_updated_at
  before update on sub_attacks
  for each row execute function set_updated_at();

create index idx_sub_attacks_ability_id on sub_attacks(ability_id);
create index idx_sub_attacks_rpg_id on sub_attacks(rpg_id);

-- ─────────────────────────────────────────────
-- STORIES
-- ─────────────────────────────────────────────
create table stories (
  id            uuid primary key default uuid_generate_v4(),
  character_id  uuid not null unique references characters(id) on delete cascade,
  rpg_id        uuid not null references rpgs(id),
  content_html  text not null default '',
  created_by    uuid references profiles(id),
  updated_by    uuid references profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger trg_stories_updated_at
  before update on stories
  for each row execute function set_updated_at();

create index idx_stories_rpg_id on stories(rpg_id);

-- ─────────────────────────────────────────────
-- AUDIT LOG
-- ─────────────────────────────────────────────
create table audit_log (
  id          bigserial primary key,
  actor_id    uuid references profiles(id),
  rpg_id      uuid,
  action      text not null,   -- 'create', 'update', 'delete', 'bulk_delete'
  entity_type text not null,   -- 'character', 'skill', 'ability', etc.
  entity_id   uuid,
  old_data    jsonb,
  new_data    jsonb,
  ip_address  inet,
  created_at  timestamptz not null default now()
);

create index idx_audit_log_rpg_id on audit_log(rpg_id);
create index idx_audit_log_actor_id on audit_log(actor_id);
create index idx_audit_log_created_at on audit_log(created_at desc);

-- ─────────────────────────────────────────────
-- SEED: default RPG
-- ─────────────────────────────────────────────
insert into rpgs (name, slug, description) values
  ('Lapse', 'lapse', 'Campanha principal do mundo de Lapse');
```

---

## 4. RLS Policies

```sql
-- ─────────────────────────────────────────────
-- HELPER FUNCTIONS
-- ─────────────────────────────────────────────

-- Returns true if the caller is a super_admin
create or replace function is_super_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

-- Returns true if the caller has rpg_admin access to the given rpg_id
create or replace function has_rpg_access(p_rpg_id uuid)
returns boolean language sql security definer stable as $$
  select is_super_admin() or exists (
    select 1 from rpg_admins
    where profile_id = auth.uid() and rpg_id = p_rpg_id
  );
$$;

-- ─────────────────────────────────────────────
-- ANTI PRIVILEGE ESCALATION
-- Cannot self-grant super_admin via UPDATE
-- ─────────────────────────────────────────────
create or replace function prevent_role_escalation()
returns trigger language plpgsql as $$
begin
  if new.role = 'super_admin' and old.role != 'super_admin' then
    -- only allow if the current user is already super_admin
    if not is_super_admin() then
      raise exception 'Unauthorized: cannot self-grant super_admin role';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_prevent_role_escalation
  before update on profiles
  for each row execute function prevent_role_escalation();

-- ─────────────────────────────────────────────
-- RLS: PROFILES
-- ─────────────────────────────────────────────
alter table profiles enable row level security;

create policy "profiles: own row read"
  on profiles for select
  using (id = auth.uid() or is_super_admin());

create policy "profiles: own row update"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles: super_admin full access"
  on profiles for all
  using (is_super_admin());

-- ─────────────────────────────────────────────
-- RLS: RPGS
-- ─────────────────────────────────────────────
alter table rpgs enable row level security;

create policy "rpgs: read if admin"
  on rpgs for select
  using (has_rpg_access(id));

create policy "rpgs: write if super_admin"
  on rpgs for insert with check (is_super_admin());

create policy "rpgs: update if super_admin"
  on rpgs for update using (is_super_admin());

create policy "rpgs: delete if super_admin"
  on rpgs for delete using (is_super_admin());

-- ─────────────────────────────────────────────
-- RLS: RPG_ADMINS
-- ─────────────────────────────────────────────
alter table rpg_admins enable row level security;

create policy "rpg_admins: super_admin full"
  on rpg_admins for all
  using (is_super_admin());

create policy "rpg_admins: read own"
  on rpg_admins for select
  using (profile_id = auth.uid());

-- ─────────────────────────────────────────────
-- RLS: CHARACTERS
-- ─────────────────────────────────────────────
alter table characters enable row level security;

create policy "characters: read"
  on characters for select
  using (has_rpg_access(rpg_id));

create policy "characters: insert"
  on characters for insert
  with check (has_rpg_access(rpg_id));

create policy "characters: update"
  on characters for update
  using (has_rpg_access(rpg_id))
  with check (has_rpg_access(rpg_id));

create policy "characters: delete"
  on characters for delete
  using (has_rpg_access(rpg_id));

-- Same pattern repeated for: attributes, skills, abilities, sub_attacks, stories
-- (abbreviated here — apply identical policies referencing rpg_id)

alter table attributes enable row level security;
create policy "attributes: scoped" on attributes for all using (has_rpg_access(rpg_id));

alter table skills enable row level security;
create policy "skills: scoped" on skills for all using (has_rpg_access(rpg_id));

alter table abilities enable row level security;
create policy "abilities: scoped" on abilities for all using (has_rpg_access(rpg_id));

alter table sub_attacks enable row level security;
create policy "sub_attacks: scoped" on sub_attacks for all using (has_rpg_access(rpg_id));

alter table stories enable row level security;
create policy "stories: scoped" on stories for all using (has_rpg_access(rpg_id));

-- Audit log: super_admin read, insert via server only (service role)
alter table audit_log enable row level security;
create policy "audit_log: super_admin read" on audit_log for select using (is_super_admin());
create policy "audit_log: rpg_admin read own" on audit_log for select
  using (rpg_id is not null and has_rpg_access(rpg_id));
-- inserts happen via service role in Server Actions only — no client insert policy needed
```

**Anti-privilege-escalation safeguards:**
1. The `prevent_role_escalation` DB trigger blocks any `UPDATE` that would set `role = 'super_admin'` unless the caller already is one.
2. The anon/client key has no `service_role` — it cannot bypass RLS.
3. `rpg_admins` rows can only be created by `super_admin` (RLS enforces this).
4. Server Actions that touch `audit_log` use the **server-side Supabase client** (initialized with `service_role` in `.env.local`, never shipped to the browser).

---

## 5. Frontend Folder Structure

```
admin/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Overview stats
│   │   ├── rpgs/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── admins/page.tsx
│   │   ├── players/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── attributes/page.tsx
│   │   │       ├── skills/page.tsx
│   │   │       ├── abilities/page.tsx
│   │   │       └── story/page.tsx
│   │   └── npcs/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   └── api/
│       ├── export/route.ts           # Generate data.js
│       └── webhooks/discord/route.ts # (Phase 2)
├── components/
│   ├── ui/                           # shadcn/ui re-exports
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── RpgSwitcher.tsx
│   ├── tables/
│   │   ├── EntityTable.tsx           # Generic table with sort/filter/page
│   │   ├── CharacterRow.tsx
│   │   └── BulkActionBar.tsx
│   ├── editors/
│   │   ├── CharacterEditor.tsx       # Side panel editor
│   │   ├── AttributeEditor.tsx
│   │   ├── SkillEditor.tsx
│   │   └── AbilityEditor.tsx
│   ├── shared/
│   │   ├── ConfirmDialog.tsx
│   │   ├── RealtimeBadge.tsx
│   │   └── JsonbEditor.tsx           # JSONB field editor
│   └── providers/
│       ├── SupabaseProvider.tsx
│       └── RpgContextProvider.tsx
├── hooks/
│   ├── useCharacters.ts
│   ├── useRealtimeList.ts
│   └── useBulkSelect.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── validations/
│   │   ├── character.schema.ts
│   │   ├── skill.schema.ts
│   │   └── ability.schema.ts
│   └── actions/
│       ├── character.actions.ts
│       ├── skill.actions.ts
│       ├── ability.actions.ts
│       └── audit.actions.ts
├── middleware.ts
├── env.ts
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 6. Core Pages / Components

### Super Admin Dashboard (`app/(dashboard)/page.tsx`)
- Stats cards: total RPGs, total players, total NPCs, active sessions
- Recent activity feed from `audit_log`
- Quick links to each RPG panel

### RPG Admin Panel (`app/(dashboard)/rpgs/[id]/page.tsx`)
- RPG info header (name, slug, status toggle)
- Tab nav: Players | NPCs | Skills | Admins
- Each tab renders `EntityTable` with scoped data

### Entity Table (`components/tables/EntityTable.tsx`)
- Column sort (via Supabase `.order()`)
- Search (debounced, via Supabase `.ilike()`)
- Pagination (limit/offset)
- Row checkbox selection → `BulkActionBar`
- Row click → `CharacterEditor` side panel

---

## 7. Code Examples

### 7.1 Supabase Client Setup

```typescript
// lib/supabase/client.ts — Browser only, uses ANON key
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts — Server only, uses SERVICE ROLE
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export function createServerActionClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,  // anon for user-scoped ops
    { cookies: { get: (n) => cookieStore.get(n)?.value } }
  )
}

// Only use this for audit log writes and admin bootstrap — never expose to client
export function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // SECRET — server only
    { cookies: { get: () => undefined } }
  )
}
```

### 7.2 Character CRUD Actions

```typescript
// lib/actions/character.actions.ts
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerActionClient, createServiceClient } from '@/lib/supabase/server'
import { characterSchema } from '@/lib/validations/character.schema'

export async function createCharacter(formData: z.infer<typeof characterSchema>) {
  const parsed = characterSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('characters')
    .insert({ ...parsed.data, created_by: user.id, updated_by: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  // Write audit log via service client (bypasses RLS insert restriction)
  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: parsed.data.rpg_id,
    action: 'create',
    entity_type: 'character',
    entity_id: data.id,
    new_data: data,
  })

  revalidatePath('/players')
  return { data }
}

export async function updateCharacter(
  id: string,
  formData: z.infer<typeof characterSchema>
) {
  const parsed = characterSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Fetch old data for audit
  const { data: old } = await supabase
    .from('characters').select().eq('id', id).single()

  const { data, error } = await supabase
    .from('characters')
    .update({ ...parsed.data, updated_by: user.id })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id, rpg_id: parsed.data.rpg_id,
    action: 'update', entity_type: 'character',
    entity_id: id, old_data: old, new_data: data,
  })

  revalidatePath('/players')
  return { data }
}

export async function softDeleteCharacter(id: string, rpgId: string) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('characters')
    .update({ deleted_at: new Date().toISOString(), updated_by: user.id })
    .eq('id', id)

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id, rpg_id: rpgId,
    action: 'delete', entity_type: 'character', entity_id: id,
  })

  revalidatePath('/players')
  return { success: true }
}
```

### 7.3 Bulk Delete

```typescript
// lib/actions/character.actions.ts (continued)
export async function bulkSoftDeleteCharacters(ids: string[], rpgId: string) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('characters')
    .update({ deleted_at: new Date().toISOString(), updated_by: user.id })
    .in('id', ids)
    .eq('rpg_id', rpgId)  // tenant-scoped even in bulk

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert(
    ids.map(id => ({
      actor_id: user.id, rpg_id: rpgId,
      action: 'bulk_delete', entity_type: 'character', entity_id: id,
    }))
  )

  revalidatePath('/players')
  return { success: true, count: ids.length }
}
```

### 7.4 Realtime Subscription

```typescript
// hooks/useRealtimeList.ts
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function useRealtimeCharacters(rpgId: string) {
  const supabase = createClient()
  const [characters, setCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial load
    supabase
      .from('characters')
      .select('*')
      .eq('rpg_id', rpgId)
      .is('deleted_at', null)
      .order('nome')
      .then(({ data }) => {
        setCharacters(data ?? [])
        setLoading(false)
      })

    // Subscribe to changes
    const channel = supabase
      .channel(`characters:rpg_id=eq.${rpgId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'characters', filter: `rpg_id=eq.${rpgId}` },
        (payload: RealtimePostgresChangesPayload<any>) => {
          setCharacters(prev => {
            if (payload.eventType === 'INSERT') return [...prev, payload.new]
            if (payload.eventType === 'DELETE') return prev.filter(c => c.id !== payload.old.id)
            if (payload.eventType === 'UPDATE') {
              return prev.map(c => c.id === payload.new.id ? payload.new : c)
            }
            return prev
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [rpgId])

  return { characters, loading }
}
```

### 7.5 Env Validation

```typescript
// env.ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
})
```

### 7.6 Zod Validation Schema

```typescript
// lib/validations/character.schema.ts
import { z } from 'zod'

export const characterSchema = z.object({
  rpg_id: z.string().uuid(),
  entity_type: z.enum(['player', 'npc']),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9_-]+$/),
  nome: z.string().min(1).max(100),
  nivel: z.number().int().min(1).max(100),
  xp: z.number().int().min(0).max(100),
  arquetipo: z.enum(['tanque', 'lutador', 'cacador', 'feiticeiro', 'genio']),
  idade: z.string().max(20).optional(),
  altura: z.number().int().positive().optional(),
  peso: z.number().int().positive().optional(),
  classe_social: z.string().max(50).optional(),
  inspiracao: z.number().int().min(0).default(0),
  discord_id: z.string().max(30).optional(),
  extra_info: z.record(z.unknown()).default({}),
})

export type CharacterInput = z.infer<typeof characterSchema>
```

---

## 8. GitHub Pages Deployment

### Deployment Architecture

```
GitHub Repo (main branch)
  ├── / (root)              → GitHub Pages (existing static site)
  └── /admin               → Vercel (Next.js admin panel)
```

### CI/CD: GitHub Actions

```yaml
# .github/workflows/deploy-admin.yml
name: Deploy Admin Panel
on:
  push:
    branches: [main]
    paths: ['admin/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd admin && npm ci
      - run: cd admin && npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
      # Vercel deployment via CLI or GitHub integration
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

# .github/workflows/export-data.yml — regenerates data.js for static site
name: Export data.js
on:
  workflow_run:
    workflows: ["Deploy Admin Panel"]
    types: [completed]

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger data export
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.EXPORT_SECRET }}" \
            https://your-admin.vercel.app/api/export
      # Commit updated data.js files back to repo
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: auto-update data.js from Supabase"
```

---

## 9. Integration Guide (Zero-Regression Migration)

### Phase 1: Supabase Setup (week 1) — no changes to existing site

1. Create Supabase project
2. Run the SQL from section 3
3. Apply RLS policies from section 4
4. Create admin user manually in Supabase Auth dashboard
5. Set `super_admin` role: `update profiles set role = 'super_admin' where id = '<your-user-id>';`

### Phase 2: Data Migration (week 2)

Write a one-off migration script that reads `js/characters/data.js` and `js/npcs/data.js` and inserts into Supabase:

```typescript
// scripts/migrate.ts
import { data } from '../js/characters/data.js'
import { npcData } from '../js/npcs/data.js'
// Insert each character, attributes, skills, abilities into Supabase
// using the service role client
```

The existing static pages continue to read from the flat JS files — no regression.

### Phase 3: Deploy Admin Panel (week 3)

1. Create `/admin` Next.js app
2. Deploy to Vercel
3. Test all CRUD flows against Supabase
4. Set up audit logging

### Phase 4: Enable Export Pipeline (week 4)

1. Implement `/api/export` route that serializes Supabase data back to `data.js` format
2. Enable CI export job
3. From this point, edits in Supabase propagate automatically to the static site

### Phase 5: Migrate Auth (optional, week 5+)

Replace the existing SHA-256 password system with Supabase Auth, updating `js/passwords/config.js` to call Supabase instead of comparing local hashes.

---

## 10. Security Hardening

### `.env.example`

```bash
# Public — safe to expose to browser
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...

# SECRET — never commit, never expose to browser, never log
SUPABASE_SERVICE_ROLE_KEY=eyJhb...

# Admin export endpoint authentication
EXPORT_SECRET=generate-with-openssl-rand-hex-32

NODE_ENV=development
```

### `.gitignore` (additions)

```
# Environment files — NEVER commit these
.env
.env.local
.env.production
.env.production.local
.env.*.local

# Supabase secrets
supabase/.env
supabase/config.toml

# Next.js
.next/
out/
```

### Secrets Hygiene Checklist

**NEVER commit:**
- `SUPABASE_SERVICE_ROLE_KEY` (can bypass all RLS — equivalent to root DB access)
- Any webhook URLs (they accept unauthenticated POST requests)
- Discord webhook URLs (already present in repo — rotate these immediately)
- `EXPORT_SECRET`

**If a key is leaked:**
1. Go to Supabase Dashboard → Settings → API → Rotate the leaked key immediately
2. Update the key in all deployment environments (Vercel env vars, GitHub Secrets)
3. Audit `git log` and `git log --all -p` for the leaked value
4. Use `git-filter-repo` or BFG Repo Cleaner to purge from history
5. Force-push cleaned history (coordinate with all contributors)
6. Rotate any services that may have used the key

**Note:** The existing repo has Discord webhook URLs in `js/roll/roll-dice.js` and `js/roll/roll-dice-npc.js`. These should be rotated and moved to environment variables immediately.

### Go-Live Security Review Checklist

- [ ] All `.env*` files in `.gitignore`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` only in server-side code, never bundled
- [ ] RLS enabled on every table (verify with Supabase dashboard)
- [ ] `prevent_role_escalation` trigger tested
- [ ] Auth middleware protecting all `/dashboard` routes
- [ ] Input validated with Zod before any DB write
- [ ] Error responses never expose DB error details (use generic messages)
- [ ] Rate limiting enabled on Supabase (dashboard → Auth → Rate Limits)
- [ ] Discord webhooks rotated and removed from source code
- [ ] Audit log verified to capture all writes
- [ ] Supabase RLS policies tested with different role users

---

## 11. Testing and Validation

### Test Checklist

```typescript
// Role access tests
describe('RLS: super_admin', () => {
  it('can read all RPGs', ...)
  it('can create RPGs', ...)
  it('can assign rpg_admin', ...)
})

describe('RLS: rpg_admin', () => {
  it('can only read characters in assigned RPG', ...)
  it('cannot read characters in other RPGs', ...)
  it('cannot create new RPG', ...)
  it('cannot grant super_admin to self', ...)
})

describe('RLS: unauthenticated', () => {
  it('cannot read any row', ...)
})

// CRUD smoke tests
describe('Character CRUD', () => {
  it('creates a character with valid data', ...)
  it('rejects invalid arquetipo', ...)
  it('soft-deletes (sets deleted_at)', ...)
  it('bulk-deletes only within own rpg_id', ...)
})

// Cross-tenant isolation
describe('Tenant isolation', () => {
  it('rpg_admin for RPG-A cannot see RPG-B characters', ...)
  it('cannot insert a character with a foreign rpg_id', ...)
})
```

**Run with:**
```bash
cd admin && npx vitest run
npx tsc --noEmit   # type check
npx eslint .       # lint
npx next build     # build check
```

### Regression Checklist (existing static site)

- [ ] Login page accepts correct passwords
- [ ] Login page rejects wrong passwords and redirects to espertinho.html
- [ ] Player ficha page loads all attributes
- [ ] Player história page loads story content
- [ ] NPC login and ficha work independently
- [ ] Dice roll buttons send Discord webhook messages
- [ ] PV/PS editable fields persist in localStorage
- [ ] XP bar renders correctly
- [ ] Back button navigates correctly

---

## 12. Phase 2 Roadmap

### Inventory System
```sql
create table inventory_items (
  id            uuid primary key default uuid_generate_v4(),
  character_id  uuid not null references characters(id),
  rpg_id        uuid not null references rpgs(id),
  nome          text not null,
  descricao     text,
  quantidade    int not null default 1,
  peso          numeric,
  valor         numeric,
  categoria     text,
  extra         jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
```

### Quests
```sql
create table quests (
  id          uuid primary key default uuid_generate_v4(),
  rpg_id      uuid not null references rpgs(id),
  titulo      text not null,
  descricao   text,
  status      text not null default 'ativa',  -- 'ativa', 'concluida', 'falhou'
  rewards     jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table quest_participants (
  quest_id     uuid references quests(id),
  character_id uuid references characters(id),
  primary key (quest_id, character_id)
);
```

### Combat Logs
```sql
create table combat_sessions (
  id          uuid primary key default uuid_generate_v4(),
  rpg_id      uuid not null references rpgs(id),
  titulo      text,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  log         jsonb not null default '[]'  -- array of events
);
```

### Discord Integration
Replace the hardcoded webhook URLs in `roll-dice.js` with a Supabase Edge Function that:
1. Validates the request (HMAC signature)
2. Looks up the correct webhook URL from a `discord_webhooks` table
3. Forwards the roll command to Discord

This removes all secrets from client-side JS.
```
