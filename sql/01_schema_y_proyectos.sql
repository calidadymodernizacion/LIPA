-- LIPA · Laboratorio de Innovación Pública Aplicada
-- Para ejecutar SOLO en un proyecto Supabase independiente de LIPA.
-- No ejecutar en las bases de datos de Notia ni de otra institución.

create table if not exists public.lipa_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.lipa_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,90}$'),
  title text not null check (char_length(title) between 2 and 130),
  category text not null default '',
  card_label text not null default '' check (char_length(card_label) <= 35),
  card_title text not null default '' check (char_length(card_title) <= 100),
  card_tag_1 text not null default '' check (char_length(card_tag_1) <= 30),
  card_tag_2 text not null default '' check (char_length(card_tag_2) <= 30),
  summary text not null default '',
  problem text not null default '',
  solution text not null default '',
  features text not null default '',
  image_url text not null default '',
  prototype_url text not null default '',
  author_name text not null default '',
  show_author boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lipa_image_safe check (image_url = '' or image_url ~ '^https://' or image_url ~ '^assets/[A-Za-z0-9._/-]+$'),
  constraint lipa_prototype_safe check (prototype_url = '' or prototype_url ~ '^https://'),
  constraint lipa_author_consent check (not is_published or show_author or author_name = '')
);

create index if not exists lipa_projects_public_order on public.lipa_projects (is_published, sort_order, created_at);

-- RLS: anónimos únicamente pueden LEER proyectos publicados.
-- Administradores: definidos por su auth.users.id en lipa_admins.
alter table public.lipa_admins enable row level security;
alter table public.lipa_projects enable row level security;

create policy "Ver mi permiso editorial" on public.lipa_admins
  for select to authenticated using (user_id = (select auth.uid()));

create policy "Publicar solo contenido publico o propio" on public.lipa_projects
  for select to anon, authenticated
  using (is_published or exists (select 1 from public.lipa_admins where user_id = (select auth.uid())));

create policy "Insertar solo editores" on public.lipa_projects
  for insert to authenticated
  with check (exists (select 1 from public.lipa_admins where user_id = (select auth.uid())));

create policy "Actualizar solo editores" on public.lipa_projects
  for update to authenticated
  using (exists (select 1 from public.lipa_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.lipa_admins where user_id = (select auth.uid())));

create policy "Eliminar solo editores" on public.lipa_projects
  for delete to authenticated
  using (exists (select 1 from public.lipa_admins where user_id = (select auth.uid())));

-- Si el Data API requiere permisos explícitos (no basta RLS):
grant usage on schema public to anon, authenticated;
grant select on public.lipa_projects to anon, authenticated;
grant insert, update, delete on public.lipa_projects to authenticated;
grant select on public.lipa_admins to authenticated;
revoke all on public.lipa_admins from anon;

-- Portadas visibles públicamente; escrituras SOLO por administradores autorizados.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('lipa-projects','lipa-projects',true,5242880, ARRAY['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "LIPA subir portadas" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'lipa-projects' and exists(select 1 from public.lipa_admins where user_id = (select auth.uid())));
create policy "LIPA reemplazar portadas" on storage.objects
  for update to authenticated
  using (bucket_id = 'lipa-projects' and exists(select 1 from public.lipa_admins where user_id = (select auth.uid())))
  with check (bucket_id = 'lipa-projects' and exists(select 1 from public.lipa_admins where user_id = (select auth.uid())));
create policy "LIPA eliminar portadas" on storage.objects
  for delete to authenticated
  using (bucket_id = 'lipa-projects' and exists(select 1 from public.lipa_admins where user_id = (select auth.uid())));

-- Datos iniciales de DEMOSTRACIÓN: no se inventan enlaces, autores ni resultados.
-- Una vez configurada Supabase, el panel permite ampliar, revisar u ocultar las fichas.
insert into public.lipa_projects(slug,title,card_label,card_title,card_tag_1,card_tag_2,category,summary,problem,solution,features,image_url,prototype_url,author_name,show_author,is_published,sort_order)
values
('siivec','SIIVEC-Álamos: Sistema Integral de Vigilancia y Control de Enfermedades Vectoriales','SIIVEC','Vigilancia y prevención de enfermedades vectoriales','Salud pública','Gestión municipal','Prevención de enfermedades vectoriales · Álamos, Sonora',
 'Sistema municipal propuesto para identificar riesgos, recibir reportes y coordinar acciones preventivas frente al dengue y la rickettsiosis.',
 'En Álamos se requiere integrar mejor los reportes ciudadanos, la identificación de riesgos y el seguimiento de acciones municipales de prevención de enfermedades transmitidas por vectores.',
 'SIIVEC-Álamos propone registrar reportes, priorizar riesgos territoriales, asignar responsables, coordinar acciones y evaluar resultados, sin sustituir la vigilancia epidemiológica oficial.',
 'Visualización conceptual del registro y seguimiento de reportes, priorización territorial, coordinación de dependencias y tablero de indicadores. La ruta de implementación se plantea por separado.',
 'assets/project-siivec.webp','','',false,true,10),
('salud-oportuna','Sistema Salud Oportuna: rediseño institucional, teletriaje digital y agendamiento dinámico para consultas de especialidad','Salud Oportuna','Gestión inteligente de consultas de especialidad','Teletriaje','Agendamiento','Salud pública · Consultas de especialidad',
 'Propuesta para reducir y hacer predecibles los tiempos de espera de la primera consulta con especialistas en instituciones públicas de salud.',
 'Los pacientes pueden enfrentar esperas prolongadas e inciertas para una primera consulta de especialidad por referencias sin priorización uniforme, agendas fragmentadas y dificultad para reasignar espacios disponibles.',
 'Salud Oportuna combina rediseño institucional, teletriaje para orientar referencias y agendamiento dinámico según prioridad clínica y disponibilidad.',
 'Representación de un proceso de clasificación de referencias, priorización de citas, agenda regional, recordatorios y seguimiento de tiempos de espera. No es un sistema de atención médica en operación.',
 'assets/project-salud.webp','','',false,true,20),
('siref-festividades','Sistema Estatal de Registro y Seguimiento de Festividades Municipales de Sonora','SIREF','Registro y seguimiento de festividades','Economía y turismo','Gestión municipal','Innovación de procesos · Economía y Turismo',
 'Propuesta para recopilar, validar y concentrar información sobre festividades municipales apoyadas o acompañadas por la Secretaría de Economía y Turismo de Sonora.',
 'Los reportes posteriores a las festividades municipales llegan en formatos distintos, incompletos o fuera de plazo, lo que dificulta integrar evidencias, indicadores e informes institucionales.',
 'SIREF propone formularios estandarizados para enlaces municipales, comprobación de datos, revisión estatal con observaciones y seguimiento del estado de cada reporte.',
 'Registro de visitantes, personas beneficiadas, inversión y derrama económica; validación de campos; observaciones; estados de seguimiento y concentrados exportables. Son funcionalidades propuestas para un prototipo académico.',
 'assets/project-siref.webp','','',false,true,30)
on conflict(slug) do nothing;

-- PASO MANUAL: luego de crear un usuario en Authentication > Users,
-- copiar su UUID y ejecutar esta instrucción por separado:
-- insert into public.lipa_admins (user_id) values ('PEGA_AQUI_EL_UUID_DE_AUTH_USERS');
