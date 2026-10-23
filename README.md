# LIPA — sitio público + estudio editorial (GitHub + Supabase)

Implementación estática para **GitHub Pages** con un panel de administración protegido por **Supabase Auth + PostgreSQL RLS**. La estética conserva el concepto visual aprobado para LIPA: fondo claro, tipografía Inter, acentos violeta, hero de documento a prototipo, tarjetas de proyectos y metodología oscura.

## Lo que ya está hecho

- `index.html`: portafolio de proyectos. No muestra la numeralia, «2 grupos», «Generación 2026» ni el botón promocional del encabezado.
- `admin.html`: panel editorial, con acceso discreto desde el pie del sitio. Permite crear, editar, borrar, ordenar por número, publicar/ocultar proyectos, editar fichas, definir URLs y subir portadas.
- `assets/site.js`: obtiene **solo** las publicaciones públicas desde Supabase. Si aún no hay conexión, muestra tres fichas demostrativas incorporadas, incluyendo SIREF con la temática correcta (festividades municipales).
- `assets/admin.js`: inicio de sesión con correo y contraseña, verificación del usuario autorizado, operaciones CRUD y carga de imágenes.
- `sql/01_schema_y_proyectos.sql`: esquema SQL, políticas RLS y bucket de portadas con escrituras restringidas.
- `config.js`: conexión pública con un proyecto Supabase independiente.

## Conectar (hacer una sola vez)

1. Crear un **nuevo proyecto Supabase exclusivamente para LIPA**. No utilizar las bases de Notia ni sistemas gubernamentales.
2. En Supabase → **SQL Editor**, ejecutar `sql/01_schema_y_proyectos.sql` una sola vez. El SQL crea tablas, políticas, bucket y 3 fichas iniciales. *No lo repitas* si las políticas ya fueron creadas.
3. En **Authentication → Users**, crear/invitar la cuenta de la persona que administrará el sitio. Copiar su **UUID** (no su contraseña).
4. Autorizar esa cuenta ejecutando en SQL Editor:
   ```sql
   insert into public.lipa_admins (user_id)
   values ('UUID_DE_LA_CUENTA_CREADA');
   ```
5. En Supabase → **Project Settings → API Keys**, copiar la **Project URL** y la clave **publishable**. Editar `config.js`:
   ```js
   window.LIPA_CONFIG = {
     supabaseUrl: 'https://TU-PROYECTO.supabase.co',
     supabasePublishableKey: 'sb_publishable_XXXXXXXX'
   };
   ```
   **Nunca añadir `service_role`, `sb_secret_...` ni contraseñas al repositorio.** La publishable key es pública y su seguridad depende de RLS.
6. Crear un repositorio GitHub **independiente** (`lipa` o nombre disponible) en una cuenta personal o institucional autorizada. Subir todo este contenido a la raíz.
7. En GitHub → **Settings → Pages → Deploy from branch**, seleccionar `main` y `/ (root)`. Después, `https://TU-USUARIO.github.io/TU-REPOSITORIO/` será la web y `.../admin.html` el panel.
8. Acceder al panel, iniciar sesión y completar las fichas y enlaces reales. Los cambios aparecerán en la web al recargarla, sin modificar archivos ni hacer nuevos commits.

## Seguridad y responsabilidades

- El panel no aparece en la navegación principal; el acceso está al final del pie. **Esto no sustituye la seguridad**: las políticas RLS bloquean escrituras a personas no autorizadas aunque conozcan la URL.
- Se recomienda deshabilitar **nuevos registros abiertos** en Supabase Auth: crear las cuentas de editores manualmente. No hay formulario de registro en LIPA.
- Los datos de autoría no se hacen públicos sin `show_author=true`, después de contar con autorización. La base de datos impide guardar nombres ocultos en publicaciones públicas.
- Los textos iniciales de SIIVEC y Salud Oportuna son provisionales. SIREF se documentó a partir del proyecto presentado en la materia.
- `assets/project-*.webp` son composiciones de presentación y deberán reemplazarse con capturas de los prototipos cuando se disponga de ellas.
- El contenido no debe presentarse como un servicio gubernamental en operación ni como iniciativa oficial del ISAP sin autorización.
- El SDK de Supabase se carga desde jsDelivr, versión 2.118.0. Si no hay conexión a internet o el CDN es bloqueado, el portafolio muestra sus datos demostrativos y el panel avisa que no puede iniciar sesión.

## Estructura

```
index.html
admin.html
config.js
assets/
  supabase-loader.js
  site.js
  admin.js
  hero-scene.webp
  project-siivec.webp
  project-salud.webp
  project-siref.webp
  about-art.webp
  favicon.svg
sql/
  01_schema_y_proyectos.sql
```

## Verificación rápida

La visita pública sin backend permite abrir las tres fichas y navegar entre secciones. Una vez conectado Supabase, comprueba: cuenta no autorizada rechazada; cuenta autorizada crea borrador; borrador no visible; publicación visible; edición reflejada en la web; carga de portada; eliminar proyecto; salida de sesión. Comprueba asimismo escritorio y móvil.

### Corrección de la portada SIREF

La portada SIREF muestra en texto HTML el título completo: **Sistema Estatal de Registro y Seguimiento de Festividades Municipales de Sonora**, además del ámbito de Economía y Turismo de Sonora. La imagen original contenía el título incompleto incrustado; ahora se tapa visualmente mediante una capa y se imprime la denominación correcta por encima. La ficha y los registros iniciales incluyen el título completo. Si ya se insertaron datos en Supabase, ejecutar `sql/02_corregir_titulo_siref.sql` únicamente en el proyecto LIPA.


## Tarjetas unificadas (actualización)

La galería usa `card_label`, `card_title`, `card_tag_1` y `card_tag_2` para todos los proyectos. El nombre `title` se conserva completo en cada ficha. El panel editorial permite modificar los cuatro campos sin editar HTML.

- **Si crearás Supabase desde cero**, usa el archivo `sql/01_schema_y_proyectos.sql` actualizado.
- **Si ya habías configurado la base LIPA**, ejecuta **solo** `sql/03_unificar_tarjetas_y_fichas.sql` en SQL Editor. Esta actualización modifica los textos de los tres proyectos de muestra, pero conserva enlaces, portadas y autores existentes.
- El catálogo muestra fichas demostrativas. La autoría permanece oculta hasta contar con autorización.

Las portadas originales contienen rótulos incrustados; el sitio utiliza un tratamiento uniforme oscuro sobre las imágenes para que los títulos HTML sean legibles y consistentes. Para máxima fidelidad visual, se recomienda sustituirlas por capturas de prototipos sin texto promocional.
