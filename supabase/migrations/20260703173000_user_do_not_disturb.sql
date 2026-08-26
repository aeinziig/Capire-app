alter table public.users
  add column if not exists do_not_disturb boolean not null default false;

update public.users pu
set do_not_disturb = coalesce((au.raw_user_meta_data ->> 'do_not_disturb')::boolean, false),
    updated_at = now()
from auth.users au
where au.id = pu.id;

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
