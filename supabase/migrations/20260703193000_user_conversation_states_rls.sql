alter table public.user_conversation_states enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_conversation_states'
      and policyname = 'user_conversation_states_select_own'
  ) then
    create policy user_conversation_states_select_own
    on public.user_conversation_states
    for select
    using (auth.uid() = owner_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_conversation_states'
      and policyname = 'user_conversation_states_insert_own'
  ) then
    create policy user_conversation_states_insert_own
    on public.user_conversation_states
    for insert
    with check (auth.uid() = owner_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_conversation_states'
      and policyname = 'user_conversation_states_update_own'
  ) then
    create policy user_conversation_states_update_own
    on public.user_conversation_states
    for update
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_conversation_states'
      and policyname = 'user_conversation_states_delete_own'
  ) then
    create policy user_conversation_states_delete_own
    on public.user_conversation_states
    for delete
    using (auth.uid() = owner_id);
  end if;
end
$$;
