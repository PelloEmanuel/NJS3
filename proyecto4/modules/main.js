// main.js — lógica principal proyecto 4

import { crearTarjetaEnlace, actualizarTarjeta, crearEntradaLog, poblarSelect } from './dom.js';

// Datos iniciales de los enlaces
const enlaces = [
  { id: 'link1', nombre: 'Google',    href: 'https://www.google.com' },
  { id: 'link2', nombre: 'GitHub',    href: 'https://www.github.com' },
  { id: 'link3', nombre: 'MDN Docs',  href: 'https://developer.mozilla.org' },
  { id: 'link4', nombre: 'Wikipedia', href: 'https://www.wikipedia.org' },
  { id: 'link5', nombre: 'YouTube',   href: 'https://www.youtube.com' },
];

const linksContainer = document.getElementById('links-container');
const logContainer   = document.getElementById('log-container');
const selectEnlace   = document.getElementById('selectEnlace');
const inputHref      = document.getElementById('inputHref');

// Renderizar tarjetas iniciales
enlaces.forEach((link, i) => {
  const card = crearTarjetaEnlace(link, i);
  linksContainer.appendChild(card);
});

// Poblar select
poblarSelect(selectEnlace, enlaces);

// Modificar href al hacer clic
document.getElementById('btnModificar').addEventListener('click', () => {
  const selectedId = selectEnlace.value;
  const nuevoHref  = inputHref.value.trim();

  if (!nuevoHref) {
    inputHref.style.borderColor = '#c0392b';
    inputHref.placeholder = '⚠️ Ingresá una URL válida';
    setTimeout(() => {
      inputHref.style.borderColor = '';
      inputHref.placeholder = 'https://nuevo-sitio.com';
    }, 1800);
    return;
  }

  // Buscar el enlace en el array
  const link = enlaces.find(l => l.id === selectedId);
  const valorAnterior = link.href;

  // Actualizar el dato
  link.href = nuevoHref;

  // Actualizar la tarjeta visual
  const card = linksContainer.querySelector(`[data-id="${selectedId}"]`);
  actualizarTarjeta(card, nuevoHref);

  // Agregar al log
  const emptyMsg = logContainer.querySelector('.empty-msg');
  if (emptyMsg) emptyMsg.remove();

  const entrada = crearEntradaLog(link.nombre, valorAnterior, nuevoHref);
  logContainer.prepend(entrada);

  // Limpiar input
  inputHref.value = '';
});

// Limpiar log
document.getElementById('btnLimpiarLog').addEventListener('click', () => {
  logContainer.innerHTML = '<span class="empty-msg">Aún no hay cambios registrados...</span>';
});
