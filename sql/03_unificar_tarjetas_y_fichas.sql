-- EJECUTAR SOLO en el proyecto de Supabase exclusivo de LIPA.
-- Amplía los campos administrables y normaliza las tres tarjetas y sus fichas.
alter table public.lipa_projects
  add column if not exists card_label text not null default '',
  add column if not exists card_title text not null default '',
  add column if not exists card_tag_1 text not null default '',
  add column if not exists card_tag_2 text not null default '';

update public.lipa_projects set
  title='SIIVEC-Álamos: Sistema Integral de Vigilancia y Control de Enfermedades Vectoriales',
  card_label='SIIVEC',card_title='Vigilancia y prevención de enfermedades vectoriales',card_tag_1='Salud pública',card_tag_2='Gestión municipal',
  category='Prevención de enfermedades vectoriales · Álamos, Sonora',
  summary='Sistema municipal propuesto para identificar riesgos, recibir reportes y coordinar acciones preventivas frente al dengue y la rickettsiosis.',
  problem='En Álamos se requiere integrar mejor los reportes ciudadanos, la identificación de riesgos y el seguimiento de acciones municipales de prevención de enfermedades transmitidas por vectores.',
  solution='SIIVEC-Álamos propone registrar reportes, priorizar riesgos territoriales, asignar responsables, coordinar acciones y evaluar resultados, sin sustituir la vigilancia epidemiológica oficial.',
  features='Visualización conceptual del registro y seguimiento de reportes, priorización territorial, coordinación de dependencias y tablero de indicadores. La ruta de implementación se plantea por separado.',
  updated_at=now() where slug='siivec';

update public.lipa_projects set
  title='Sistema Salud Oportuna: rediseño institucional, teletriaje digital y agendamiento dinámico para consultas de especialidad',
  card_label='Salud Oportuna',card_title='Gestión inteligente de consultas de especialidad',card_tag_1='Teletriaje',card_tag_2='Agendamiento',
  category='Salud pública · Consultas de especialidad',
  summary='Propuesta para reducir y hacer predecibles los tiempos de espera de la primera consulta con especialistas en instituciones públicas de salud.',
  problem='Los pacientes pueden enfrentar esperas prolongadas e inciertas para una primera consulta de especialidad por referencias sin priorización uniforme, agendas fragmentadas y dificultad para reasignar espacios disponibles.',
  solution='Salud Oportuna combina rediseño institucional, teletriaje para orientar referencias y agendamiento dinámico según prioridad clínica y disponibilidad.',
  features='Representación de un proceso de clasificación de referencias, priorización de citas, agenda regional, recordatorios y seguimiento de tiempos de espera. No es un sistema de atención médica en operación.',
  updated_at=now() where slug='salud-oportuna';

update public.lipa_projects set
  title='Sistema Estatal de Registro y Seguimiento de Festividades Municipales de Sonora',
  card_label='SIREF',card_title='Registro y seguimiento de festividades',card_tag_1='Economía y turismo',card_tag_2='Gestión municipal',
  category='Innovación de procesos · Economía y Turismo',
  summary='Propuesta para recopilar, validar y concentrar información sobre festividades municipales apoyadas o acompañadas por la Secretaría de Economía y Turismo de Sonora.',
  problem='Los reportes posteriores a las festividades municipales llegan en formatos distintos, incompletos o fuera de plazo, lo que dificulta integrar evidencias, indicadores e informes institucionales.',
  solution='SIREF propone formularios estandarizados para enlaces municipales, comprobación de datos, revisión estatal con observaciones y seguimiento del estado de cada reporte.',
  features='Registro de visitantes, personas beneficiadas, inversión y derrama económica; validación de campos; observaciones; estados de seguimiento y concentrados exportables. Son funcionalidades propuestas para un prototipo académico.',
  updated_at=now() where slug='siref-festividades';
