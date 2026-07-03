alter table public.capstone_projects
  add column if not exists "originalityScore" integer,
  add column if not exists "imageUrl" text,
  add column if not exists "pdfUrl" text,
  add column if not exists keywords text[] not null default '{}',
  add column if not exists submitted_by uuid references auth.users(id),
  add column if not exists review_comment text,
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists reviewed_at timestamptz;

update public.capstone_projects
set keywords = coalesce(tags, '{}')
where cardinality(keywords) = 0
  and tags is not null;

insert into public.users (id, email, full_name, role, department, student_id, faculty_id, created_at, updated_at)
select
  au.id,
  au.email,
  nullif(au.raw_user_meta_data ->> 'full_name', ''),
  case
    when coalesce(au.raw_user_meta_data ->> 'role', au.raw_app_meta_data ->> 'role') in ('student', 'faculty', 'administrator', 'researcher')
      then coalesce(au.raw_user_meta_data ->> 'role', au.raw_app_meta_data ->> 'role')
    when coalesce(au.raw_user_meta_data ->> 'role', au.raw_app_meta_data ->> 'role') = 'admin'
      then 'administrator'
    else 'student'
  end,
  nullif(au.raw_user_meta_data ->> 'department', ''),
  nullif(au.raw_user_meta_data ->> 'student_id', ''),
  nullif(au.raw_user_meta_data ->> 'faculty_id', ''),
  coalesce(au.created_at, now()),
  now()
from auth.users au
left join public.users pu on pu.id = au.id
where pu.id is null;

create or replace function public.sync_user_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role, department, student_id, faculty_id, created_at, updated_at)
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
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_user_from_auth on auth.users;

create trigger sync_user_from_auth
after insert or update on auth.users
for each row
execute function public.sync_user_from_auth();
