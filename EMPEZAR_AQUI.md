# LIPA — siguiente paso: GitHub Pages + Supabase

Este paquete contiene la web, el panel de edición y la configuración pública del proyecto **lipa** de Supabase. No contiene contraseñas ni claves secretas.

## 1. Publicar el código en GitHub

1. Abre https://github.com/calidadymodernizacion/LIPA
2. Si el repositorio está vacío, elige **uploading an existing file**; si ya tiene archivos, **Add file → Upload files**.
3. Arrastra **todos los archivos y carpetas de este paquete descomprimido** a la raíz del repositorio, de modo que `index.html`, `admin.html` y `config.js` queden en la raíz y `assets/` sea una carpeta.
4. Confirma con **Commit changes** en la rama `main`.
5. En el repositorio entra a **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/(root)` y guarda.
6. La dirección prevista cuando GitHub Pages se active será: https://calidadymodernizacion.github.io/LIPA/

## 2. Verificar el sitio público

Visita la dirección anterior. Comprueba que aparecen SIIVEC, Salud Oportuna y SIREF, y que cada ficha técnica abre. Las URL de los prototipos todavía pueden estar vacías y deben incorporarse desde el administrador.

## 3. Verificar acceso editorial

Visita https://calidadymodernizacion.github.io/LIPA/admin.html

Usa la cuenta que creaste en **Supabase → Authentication → Users** y autorizaste en `public.lipa_admins`. Si inicias sesión correctamente, el panel debe mostrar tres publicaciones iniciales. Edita primero una ficha de prueba, guarda y recarga el catálogo público para confirmar que el cambio aparece.

## 4. Si hay errores

- «No tiene permisos editoriales»: verifica en Supabase `public.lipa_admins` que `user_id` coincide exactamente con el UUID de tu usuario de Authentication.
- «No se pudo conectar»: verifica que `config.js` cargue y que la clave sea **publishable**, no secret. Si una red bloquea el CDN de jsDelivr, el SDK no cargará.
- Galería de demostración en lugar de datos reales: revisa consola del navegador y permisos RLS de `public.lipa_projects`.
- Página no encontrada: revisa **Settings → Pages**, la rama seleccionada y que `index.html` esté en la raíz.

## Seguridad

La `sb_publishable_...` es una clave pública de navegador y **no sustituye las políticas RLS**. Nunca subas contraseñas, claves `sb_secret_...` ni `service_role` a GitHub. El administrador existe en `admin.html`, pero ocultar el enlace no constituye protección; Supabase Auth y RLS son los controles de acceso.

No vuelvas a ejecutar `sql/01_schema_y_proyectos.sql`: ya lo ejecutaste. Los archivos 02/03 son para cambios específicos en instalaciones previas; evítalos salvo que necesites corregir un dato ya existente.
