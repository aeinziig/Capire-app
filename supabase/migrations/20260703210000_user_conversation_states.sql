create table if not exists public.user_conversation_states (
  owner_id uuid not null references public.users(id) on delete cascade,
  partner_id uuid not null references public.users(id) on delete cascade,
  state text not null check (state in ('archived', 'deleted')),
  hidden_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_id, partner_id)
);

create or replace function public.touch_user_conversation_state()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_user_conversation_state on public.user_conversation_states;

create trigger touch_user_conversation_state
before update on public.user_conversation_states
for each row
execute function public.touch_user_conversation_state();
