const zona = document.getElementById('zona');
const registro = document.getElementById('registro');
const editor = document.getElementById('editor');
const selectEnlace = document.getElementById('selectEnlace');
const inputTitulo = document.getElementById('inputTitulo');
const inputUrl = document.getElementById('inputUrl');
const errorEditor = document.getElementById('errorEditor');

const datos = [
  { texto: 'Google', href: 'https://www.google.com' },
  { texto: 'YouTube', href: 'https://www.youtube.com' },
  { texto: 'Wikipedia', href: 'https://www.wikipedia.org' },
  { texto: 'GitHub', href: 'https://github.com' },
  { texto: 'MDN', href: 'https://developer.mozilla.org' }
];

// Agrega una línea al registro de cambios (la más nueva arriba)
function anotar(texto) {
  if (registro.querySelector('.suave')) registro.innerHTML = '';
  const item = document.createElement('li');
  item.textContent = texto;
  registro.prepend(item);
}

function buscarEnlace(indice) {
  return zona.querySelector('[data-indice="' + indice + '"]');
}

function crearEnlace(indice) {
  const info = datos[indice];
  if (buscarEnlace(indice)) {
    anotar('El enlace ' + info.texto + ' ya fue creado.');
    return;
  }
  if (zona.querySelector('.vacio')) zona.innerHTML = '';

  const enlace = document.createElement('a');
  enlace.className = 'enlace-boton';
  enlace.textContent = info.texto;
  enlace.setAttribute('href', info.href);
  enlace.setAttribute('target', '_blank');
  enlace.dataset.indice = indice;
  zona.appendChild(enlace);
  anotar('Nodo <a> creado: ' + info.texto + ' (href = ' + info.href + ')');
}

// Cambia un atributo y muestra el cambio realizado
function cambiarAtributo(enlace, atributo, nuevoValor) {
  const antes = enlace.getAttribute(atributo);
  enlace.setAttribute(atributo, nuevoValor);
  anotar(enlace.textContent + ' → atributo "' + atributo + '": ' +
    (antes === null ? '(sin valor)' : antes) + '  ➜  ' + nuevoValor);
}

// ---- Editor manual de URL y título ----
function cargarCamposDelEnlace() {
  const enlace = buscarEnlace(selectEnlace.value);
  inputTitulo.value = enlace.textContent;
  inputUrl.value = enlace.getAttribute('href');
}

function abrirEditor() {
  const enlaces = zona.querySelectorAll('a');
  if (enlaces.length === 0) {
    anotar('Primero creá al menos un enlace para poder editarlo.');
    return;
  }
  selectEnlace.innerHTML = '';
  enlaces.forEach((enlace) => {
    const opcion = document.createElement('option');
    opcion.value = enlace.dataset.indice;
    opcion.textContent = enlace.textContent + ' (' + enlace.getAttribute('href') + ')';
    selectEnlace.appendChild(opcion);
  });
  errorEditor.textContent = '';
  cargarCamposDelEnlace();
  editor.classList.remove('oculto');
}

function guardarCambios() {
  const enlace = buscarEnlace(selectEnlace.value);
  const nuevoTitulo = inputTitulo.value.trim();
  let nuevaUrl = inputUrl.value.trim();

  if (nuevoTitulo === '') { errorEditor.textContent = 'Escribí un título para el botón.'; return; }
  if (nuevaUrl === '') { errorEditor.textContent = 'Escribí la URL de destino.'; return; }
  if (!nuevaUrl.startsWith('http://') && !nuevaUrl.startsWith('https://')) {
    nuevaUrl = 'https://' + nuevaUrl;
  }
  try {
    new URL(nuevaUrl);
  } catch (error) {
    errorEditor.textContent = 'La URL no es válida.';
    return;
  }

  if (nuevoTitulo !== enlace.textContent) {
    anotar(enlace.textContent + ' → texto del botón: ' + enlace.textContent + '  ➜  ' + nuevoTitulo);
    enlace.textContent = nuevoTitulo;
  }
  if (nuevaUrl !== enlace.getAttribute('href')) {
    cambiarAtributo(enlace, 'href', nuevaUrl);
  }
  editor.classList.add('oculto');
}

// ---- Cambios automáticos de otros atributos ----
function alternarAtributo(atributo, calcularValor) {
  const enlaces = zona.querySelectorAll('a');
  if (enlaces.length === 0) { anotar('No hay enlaces creados para modificar.'); return; }
  enlaces.forEach((enlace) => {
    cambiarAtributo(enlace, atributo, calcularValor(enlace, enlace.getAttribute(atributo)));
  });
}

document.querySelectorAll('.btn-crear').forEach((boton) => {
  boton.addEventListener('click', () => crearEnlace(Number(boton.dataset.indice)));
});
document.getElementById('btnEditar').addEventListener('click', abrirEditor);
document.getElementById('btnGuardar').addEventListener('click', guardarCambios);
document.getElementById('btnCancelar').addEventListener('click', () => editor.classList.add('oculto'));
selectEnlace.addEventListener('change', cargarCamposDelEnlace);
document.getElementById('btnTarget').addEventListener('click', () => {
  alternarAtributo('target', (enlace, antes) => antes === '_blank' ? '_self' : '_blank');
});

// ---- Modo claro / oscuro ----
const btnTema = document.getElementById('btnTema');

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  btnTema.textContent = tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro';
}

aplicarTema(localStorage.getItem('tema') || 'claro');

btnTema.addEventListener('click', () => {
  const actual = document.documentElement.getAttribute('data-tema');
  const nuevo = actual === 'oscuro' ? 'claro' : 'oscuro';
  localStorage.setItem('tema', nuevo);
  aplicarTema(nuevo);
});
