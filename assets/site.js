"use strict";
const $ = sel => document.querySelector(sel);
const fallbackProjects = [
  {id:'siivec',slug:'siivec',title:'SIIVEC-Álamos: Sistema Integral de Vigilancia y Control de Enfermedades Vectoriales',card_label:'SIIVEC',card_title:'Vigilancia y prevención de enfermedades vectoriales',card_tag_1:'Salud pública',card_tag_2:'Gestión municipal',category:'Prevención de enfermedades vectoriales · Álamos, Sonora',summary:'Sistema municipal propuesto para identificar riesgos, recibir reportes y coordinar acciones preventivas frente al dengue y la rickettsiosis.',image_url:'assets/project-siivec.webp',author_name:'',show_author:false,problem:'En Álamos se requiere integrar mejor los reportes ciudadanos, la identificación de riesgos y el seguimiento de acciones municipales de prevención de enfermedades transmitidas por vectores.',solution:'SIIVEC-Álamos propone un sistema municipal para registrar reportes, priorizar riesgos territoriales, asignar responsables, coordinar acciones y evaluar resultados, sin sustituir la vigilancia epidemiológica oficial.',features:'Visualización conceptual del registro y seguimiento de reportes, priorización territorial, coordinación de dependencias y tablero de indicadores. Su ruta de implementación institucional se plantea por separado.',prototype_url:'',is_published:true,sort_order:10},
  {id:'salud',slug:'salud-oportuna',title:'Sistema Salud Oportuna: rediseño institucional, teletriaje digital y agendamiento dinámico para consultas de especialidad',card_label:'Salud Oportuna',card_title:'Gestión inteligente de consultas de especialidad',card_tag_1:'Teletriaje',card_tag_2:'Agendamiento',category:'Salud pública · Consultas de especialidad',summary:'Propuesta para reducir y hacer predecibles los tiempos de espera de la primera consulta con especialistas en instituciones públicas de salud.',image_url:'assets/project-salud.webp',author_name:'',show_author:false,problem:'Los pacientes pueden enfrentar esperas prolongadas e inciertas para una primera consulta de especialidad por referencias sin priorización uniforme, agendas fragmentadas y dificultad para reasignar espacios disponibles.',solution:'Salud Oportuna combina rediseño institucional, teletriaje para orientar referencias y agendamiento dinámico según prioridad clínica y disponibilidad.',features:'Representación de un proceso de clasificación de referencias, priorización de citas, agenda regional, recordatorios y seguimiento de tiempos de espera. No es un sistema de atención médica en operación.',prototype_url:'',is_published:true,sort_order:20},
  {id:'siref',slug:'siref-festividades',title:'Sistema Estatal de Registro y Seguimiento de Festividades Municipales de Sonora',card_label:'SIREF',card_title:'Registro y seguimiento de festividades',card_tag_1:'Economía y turismo',card_tag_2:'Gestión municipal',category:'Innovación de procesos · Economía y Turismo',summary:'Propuesta para recopilar, validar y concentrar información sobre festividades municipales apoyadas o acompañadas por la Secretaría de Economía y Turismo de Sonora.',image_url:'assets/project-siref.webp',author_name:'',show_author:false,problem:'Los reportes posteriores a las festividades municipales llegan en formatos distintos, incompletos o fuera de plazo, lo que dificulta integrar evidencias, indicadores e informes institucionales.',solution:'SIREF propone formularios estandarizados para enlaces municipales, comprobación de datos, revisión estatal con observaciones y seguimiento del estado de cada reporte.',features:'Registro de visitantes, personas beneficiadas, inversión y derrama económica; validación de campos; observaciones; estados de seguimiento y concentrados exportables. Son funcionalidades propuestas para un prototipo académico.',prototype_url:'',is_published:true,sort_order:30}
];
let projects = [...fallbackProjects];
let client = null;
let lastFocus = null;
async function api(){try{return await window.LIPA_getClient()}catch(e){console.warn('No se pudo inicializar Supabase:',e.message);return null}}
function toast(message){const el=$('#toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3200)}
function validHttps(value){try{const u=new URL(value);return u.protocol==='https:'}catch{return false}}
function textNode(tag,cls,value){const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=value??'';return el}
function draw(){
  const grid=$('#projectGrid');grid.replaceChildren();
  if(!projects.length){grid.append(textNode('p','empty-projects','Aún no hay proyectos publicados.'));return}
  for(const p of projects){
    const btn=document.createElement('button');btn.type='button';btn.className='project-card';
    btn.setAttribute('aria-label','Ver ficha técnica de '+p.title);
    const image=document.createElement('img');image.loading='lazy';
    image.alt='Vista conceptual del prototipo '+p.title;
    image.src=validHttps(p.image_url)?p.image_url:(p.image_url?.startsWith('assets/')?p.image_url:'assets/project-siivec.webp');
    image.onerror=()=>{image.onerror=null;image.src='assets/project-siivec.webp'};
    const card=textNode('div','project-content','');
    const label=textNode('span','project-label',p.card_label||p.title);
    const heading=textNode('strong','project-title',p.card_title||p.title);
    const tags=textNode('div','project-tags','');
    if(p.card_tag_1)tags.append(textNode('span','',p.card_tag_1));
    if(p.card_tag_2)tags.append(textNode('span','',p.card_tag_2));
    const arrow=document.createElement('span');arrow.className='project-arrow';arrow.setAttribute('aria-hidden','true');
    arrow.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
    card.append(label,heading,tags);
    btn.append(image,card,arrow,textNode('span','open-hint','Ver ficha ↗'));
    btn.addEventListener('click',()=>openProject(p.slug));grid.append(btn);
  }
}
function openProject(slug){
  const p=projects.find(item=>item.slug===slug);if(!p)return;
  const dialog=$('#projectDialog');lastFocus=document.activeElement;
  $('#dialogTitle').textContent=p.title;
  $('#dialogImage').src=validHttps(p.image_url)?p.image_url:(p.image_url?.startsWith('assets/')?p.image_url:'assets/project-siivec.webp');
  $('#dialogImage').alt='Vista conceptual de '+p.title;
  const fields=$('#dialogFields');fields.replaceChildren();
  const rows=[['Área temática',p.category],['Descripción',p.summary],['Problema público',p.problem],['Solución propuesta',p.solution],['Alcance del prototipo',p.features]];
  if(p.show_author&&p.author_name)rows.splice(1,0,['Autoría estudiantil',p.author_name]);
  rows.push(['Estado','Prototipo académico demostrativo · No es un servicio gubernamental en operación']);
  for(const [k,v] of rows){if(!v)continue;const row=textNode('div','field','');row.append(textNode('b','',k),textNode('p','',v));fields.append(row)}
  const link=$('#prototypeLink');const valid=validHttps(p.prototype_url);link.hidden=!valid;$('#missingLink').hidden=valid;
  if(valid){link.href=p.prototype_url}else{link.removeAttribute('href')}
  dialog.showModal();document.body.classList.add('dialog-open');$('#dialogClose').focus();
}
async function loadProjects(){
  draw();
  client=await api();
  if(!client)return;
  const {data,error}=await client.from('lipa_projects')
    .select('id,slug,title,card_label,card_title,card_tag_1,card_tag_2,category,summary,image_url,author_name,show_author,problem,solution,features,prototype_url,is_published,sort_order')
    .eq('is_published',true).order('sort_order',{ascending:true}).order('created_at',{ascending:true});
  if(error){
    // Conservar portadas de respaldo sin mostrar errores técnicos a los visitantes.
    // Este cambio NO repara Supabase: registrar los detalles para diagnóstico.
    console.warn('No se pudo consultar el catálogo de LIPA:',error);
    return;
  }
  projects=data||[];draw();
}
function applyEditorialPolish(){
  const link=$('.editor-access');
  if(link){link.textContent='Acceso';link.title='Acceso al panel de administración';link.setAttribute('aria-label','Acceso al panel de administración')}
  const how=$('#proceso .extra-copy');
  if(how)how.textContent='Partimos de problemas públicos reales y de las propuestas que se desarrollan en el aula. A través del análisis, el acompañamiento docente y el prototipado digital, exploramos cómo podrían funcionar estas soluciones y qué necesitarían para llevarse a la práctica. Cada prototipo es una herramienta académica para mostrar, discutir y mejorar una idea; no representa un sistema gubernamental en operación.';
  const about=$('#sobre-lipa .extra-copy');
  if(about)about.textContent='LIPA nació del trabajo con estudiantes de la Maestría en Administración Pública, en la asignatura Calidad y Modernización en el Servicio Público. Desde ahí, buscamos que el conocimiento generado en el aula se traduzca en propuestas que puedan verse, explorarse y mejorarse. Ese es nuestro punto de partida, no nuestro límite: el laboratorio tiene vocación de abrirse a nuevas disciplinas y problemas públicos. La difusión de trabajos y autorías estará sujeta a la autorización de sus autores.';
  const style=document.createElement('style');
  style.textContent='/* Ajustes editoriales LIPA */\n.extra-copy,.hero-description,.method-card p,.about-card p,.detail-step p,.dialog-sub,.field p{text-align:justify;text-align-last:left;hyphens:auto;overflow-wrap:break-word}\n/* Fade azul editorial uniforme para TODAS las tarjetas: las imágenes se cargan sin texto ni efecto integrado. */\n.project-card::after{inset:0;z-index:1;background:linear-gradient(90deg,rgba(18,42,76,.72) 0%,rgba(22,48,85,.52) 32%,rgba(22,48,85,.19) 70%,rgba(22,48,85,.02) 100%),linear-gradient(0deg,rgba(9,24,50,.31) 0%,transparent 48%)}\n.project-title{text-shadow:0 2px 9px rgba(3,9,23,.52)}\n';
  document.head.append(style);
  const status=$('#catalogStatus');if(status)status.replaceChildren();
}
$('#dialogClose').addEventListener('click',()=>$('#projectDialog').close());
$('#projectDialog').addEventListener('close',()=>{document.body.classList.remove('dialog-open');lastFocus?.focus?.()});
$('#projectDialog').addEventListener('click',e=>{if(e.target===$('#projectDialog'))$('#projectDialog').close()});
$('#missingLink').addEventListener('click',()=>toast('El enlace del prototipo aún no se ha incorporado a la ficha.'));
const menuToggle=$('#menuToggle');const mobileNav=$('#mobileNav');
menuToggle.addEventListener('click',()=>{const on=mobileNav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(on));menuToggle.setAttribute('aria-label',on?'Cerrar menú':'Abrir menú')});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}));
const navLinks=[...document.querySelectorAll('.desktop-nav a')];
const targets=['inicio','proyectos','metodologia','acerca'].map(id=>document.getElementById(id));
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{const selected=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(selected)navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+selected.target.id))},{rootMargin:'-15% 0px -66% 0px',threshold:[0,.1,.4]});
  targets.forEach(el=>el&&observer.observe(el));
}
applyEditorialPolish();
loadProjects();
