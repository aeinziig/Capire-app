create extension if not exists vector;

alter table public.capstone_projects
  add column if not exists embedding_input text,
  add column if not exists embedding_model text,
  add column if not exists embedding_generated_at timestamptz,
  add column if not exists embedding vector(768);

update public.capstone_projects
set embedding_input = trim(
  concat_ws(
    E'\n\n',
    nullif(title, ''),
    nullif(abstract, ''),
    case
      when cardinality(keywords) > 0 then 'Keywords: ' || array_to_string(keywords, ', ')
      else null
    end
  )
)
where embedding_input is null;

create or replace function public.match_capstone_projects(
  query_embedding vector(768),
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
