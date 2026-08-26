# Supabase Feature Setup Guide

This file lists the database-backed features that are still incomplete in the current app, based on:

- [process/context/all-context.md](/D:/Projects/Capire-app/process/context/all-context.md)
- the current screen code under `src/screens/`
- the shared data layer in `src/context/AppContext.tsx`

## Recommended Setup Order

1. Public user mirror
2. Messaging
3. Capstone metadata alignment
4. Originality checking
5. Analytics and dashboard stats
6. Citation saving
7. Real-time subscriptions

## 1. Public User Mirror

### Why this is still incomplete

- Auth works through `auth.users`.
- The live database already has a `public.users` table, but it is currently empty.
- Existing foreign keys in `bookmarks`, `chat_messages`, and `search_logs` already point at `public.users`.
- That means the shortest safe fix is not adding `profiles`, but keeping `public.users` in sync with `auth.users`.

### Current code touchpoints

- `src/context/AppContext.tsx`
- `src/screens/shared/OwnProfileScreen.tsx`
- `src/screens/shared/MessagesScreen.tsx`

### What to set up

Keep `public.users` as the profile mirror keyed by the auth user id.

Suggested columns:

- `id uuid primary key references auth.users(id) on delete cascade`
- `full_name text`
- `role text`
- `department text`
- `student_id text`
- `faculty_id text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### Minimum setup

- Backfill existing `auth.users` rows into `public.users`.
- Add an `auth.users` trigger so future registrations keep `public.users` current.

### After setup

- Messaging and bookmark foreign keys can finally point at real user rows.
- You can still add `avatar_url` later if the UI starts using it.

## 2. Messaging

### Why this is still incomplete

- `MessagesScreen` currently falls back to mock conversations when `chat_messages` is missing.
- `ChatConversationScreen` is fully mock-driven.
- There is no conversation model yet.

### Current code touchpoints

- `src/screens/shared/MessagesScreen.tsx`
- `src/screens/shared/ChatConversationScreen.tsx`
- `process/context/all-context.md`

### What to set up

The live project already has `chat_messages` with:

- `sender_id`
- `receiver_id`
- `message`
- `project_id`
- `is_read`
- `created_at`

So the immediate fix is code alignment, not a full conversation redesign.

### App work still needed after schema setup

- Query `message`, not `content`.
- Replace the mock send flow in `ChatConversationScreen` with inserts into `chat_messages`.
- Join sender names from `public.users`.
- Add a real conversation model later only if the current direct-message shape becomes limiting.

## 3. Capstone Metadata Alignment

### Why this is still incomplete

- The live `capstone_projects` table already has `status`, but the app also expects:
  - `originalityScore`
  - `imageUrl`
  - `pdfUrl`
  - `keywords`
- Review notes are still not stored.

### Current code touchpoints

- `src/screens/student/SearchScreen.tsx`
- `src/hooks/useBookmarks.ts`
- `src/context/AppContext.tsx`
- `src/screens/student/SubmitTopicScreen.tsx`
- `src/screens/faculty/TopicReviewScreen.tsx`
- `src/screens/faculty/FacultyDashboardScreen.tsx`

### Minimum workable option

Keep using `capstone_projects` and add the missing fields:

- `originalityScore integer`
- `imageUrl text`
- `pdfUrl text`
- `keywords text[]`
- `submitted_by uuid references auth.users(id)`
- `review_comment text`
- `reviewed_by uuid references auth.users(id)`
- `reviewed_at timestamptz`

### Better long-term option

Create a dedicated `topic_submissions` table later if student proposals should stay separate from approved archive entries.

## 4. Originality Checker

### Why this is still incomplete

- `OriginalityCheckerScreen` is still simulated.
- Dashboard stats already expect `originality_checks` eventually.

### Current code touchpoints

- `src/screens/student/OriginalityCheckerScreen.tsx`
- `src/context/AppContext.tsx`
- `process/context/all-context.md`

### What to set up

You need both storage and compute:

- `originality_checks` table
- a Supabase Edge Function for the actual check

Suggested table:

```sql
create table if not exists public.originality_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null,
  source_name text,
  submitted_text text,
  originality_score integer,
  result_json jsonb,
  created_at timestamptz not null default now()
);
```

### Edge Function responsibilities

- accept pasted text or uploaded file content
- run similarity/originality logic
- return normalized results
- persist a row in `originality_checks`

### App work still needed after setup

- replace simulated timeout logic with an Edge Function call
- load previous checks if you want history

## 5. Dashboard Analytics And Activity

### Why this is still incomplete

`AppContext.tsx` still hardcodes:

- `originalityChecks: 0`
- `researchHours: 0`

and recent activity is only derived from bookmarks.

### Current code touchpoints

- `src/context/AppContext.tsx`
- `src/screens/student/DashboardScreen.tsx`
- `process/context/all-context.md`

### What to set up

#### `activity_logs`

```sql
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

#### `research_hours`

```sql
create table if not exists public.research_hours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  minutes integer not null default 0,
  source text,
  created_at timestamptz not null default now()
);
```

### App work still needed after setup

- write activity rows for searches, submissions, bookmarks, reviews, and originality checks
- aggregate `originality_checks` and `research_hours` in `AppContext`

## 6. Search Analytics

### Why this is still incomplete

- `all-context.md` calls out `search_logs`.
- `SearchScreen` does not persist searches yet.

### Current code touchpoints

- `src/screens/student/SearchScreen.tsx`
- `process/context/all-context.md`

### Suggested SQL

```sql
create table if not exists public.search_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  query text not null,
  department text,
  year text,
  created_at timestamptz not null default now()
);
```

### App work still needed after setup

- insert one row after a debounced search
- do not log every keystroke

## 7. Citation Saving

### Why this is still incomplete

- `CitationBottomSheet` generates a citation locally.
- copy/share are still placeholders.
- `all-context.md` references `saved_citations`.

### Current code touchpoints

- `src/screens/shared/CitationBottomSheet.tsx`
- `process/context/all-context.md`

### Suggested SQL

```sql
create table if not exists public.saved_citations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  capstone_project_id uuid references public.capstone_projects(id) on delete set null,
  citation_text text not null,
  citation_style text not null default 'APA',
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

### App work still needed after setup

- add a save action in `CitationBottomSheet`
- optionally show saved citations in Profile or Bookmarks

## 8. Real-Time Subscriptions

### Why this is still incomplete

- `src/services/supabase.ts` already exposes `subscribeToChanges`
- no major screen is using it yet for live updates
- `all-context.md` lists real-time as still pending

### Best first targets

- `chat_messages`
- `capstone_projects` review status changes
- `notifications` if you add that table later

### What to set up

- enable realtime on the relevant tables in Supabase
- add RLS policies that still allow subscribed users to receive the rows they are allowed to see

## 9. Features Mentioned In Context But Still Not Fully Wired

These are the main unfinished database-dependent items called out in `all-context.md`:

- Chat messages persistence
- Search analytics
- Faculty feedback storage
- Citation saving
- Originality checker backend
- Dashboard advanced stats
- Recent activity logs
- Real-time updates

## Practical Next Step

If you want the shortest path to a stable backend, build in this order:

1. `public.users` sync from `auth.users`
2. `capstone_projects` metadata alignment
3. `chat_messages` persistence in the existing table
4. `originality_checks`
5. `activity_logs` and `search_logs`
6. `saved_citations`
