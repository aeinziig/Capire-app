create schema if not exists extensions;

do $$
begin
  if exists (
    select 1
    from pg_extension ext
    join pg_namespace ns on ns.oid = ext.extnamespace
    where ext.extname = 'vector'
      and ns.nspname = 'public'
  ) then
    execute 'alter extension vector set schema extensions';
  end if;
end
$$;

create or replace function public.match_capstone_projects(
  query_embedding extensions.vector(768),
  match_count integer default 10
)
returns table (
  id uuid,
  title text,
  author text,
  year integer,
  abstract text,
  similarity double precision
)
language sql
stable
set search_path = public, extensions
as $$
  select
    capstone_projects.id,
    capstone_projects.title,
    capstone_projects.author,
    capstone_projects.year,
    capstone_projects.abstract,
    1 - (capstone_projects.embedding <=> query_embedding) as similarity
  from public.capstone_projects
  where capstone_projects.embedding is not null
  order by capstone_projects.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

create or replace function public.touch_user_conversation_state()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.sync_user_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    id,
    email,
    full_name,
    role,
    department,
    student_id,
    faculty_id,
    do_not_disturb,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    case
      when coalesce(new.raw_user_meta_data ->> 'role', new.raw_app_meta_data ->> 'role') in ('student', 'faculty', 'administrator', 'researcher')
        then coalesce(new.raw_user_meta_data ->> 'role', new.raw_app_meta_data ->> 'role')
      when coalesce(new.raw_user_meta_data ->> 'role', new.raw_app_meta_data ->> 'role') = 'admin'
        then 'administrator'
      else 'student'
    end,
    nullif(new.raw_user_meta_data ->> 'department', ''),
    nullif(new.raw_user_meta_data ->> 'student_id', ''),
    nullif(new.raw_user_meta_data ->> 'faculty_id', ''),
    coalesce((new.raw_user_meta_data ->> 'do_not_disturb')::boolean, false),
    coalesce(new.created_at, now()),
    now()
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      role = excluded.role,
      department = excluded.department,
      student_id = excluded.student_id,
      faculty_id = excluded.faculty_id,
      do_not_disturb = excluded.do_not_disturb,
      updated_at = now();

  return new;
end;
$$;

revoke all on function public.sync_user_from_auth() from public;
revoke all on function public.sync_user_from_auth() from anon;
revoke all on function public.sync_user_from_auth() from authenticated;
