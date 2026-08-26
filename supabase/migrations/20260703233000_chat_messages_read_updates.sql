do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'chat_messages'
      and policyname = 'Allow receivers to mark messages read'
  ) then
    create policy "Allow receivers to mark messages read"
    on public.chat_messages
    for update
    using (auth.uid() = receiver_id)
    with check (auth.uid() = receiver_id);
  end if;
end
$$;
