-- Usar en el proyecto SUPABASE exclusivo de LIPA.
-- Corrige fichas sembradas previamente sin sobrescribir otros campos personalizados.
update public.lipa_projects
set title = 'Sistema Estatal de Registro y Seguimiento de Festividades Municipales de Sonora',
    category = 'Innovación de procesos · Economía y Turismo',
    summary = 'SIREF: captura, validación y seguimiento de resultados de festividades municipales en Sonora.',
    updated_at = now()
where slug = 'siref-festividades';
