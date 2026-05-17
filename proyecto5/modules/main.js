// main.js — lógica principal proyecto 5

import { htmlParrafo, htmlImagen, htmlLista, crearBloque, actualizarContador } from './dom.js';

const canvas  = document.getElementById('canvas');
const badge   = document.getElementById('contador-badge');

function limpiarEmpty() {
  const empty = canvas.querySelector('.canvas-empty');
  if (empty) empty.remove();
}

function insertar(tipo, contenidoHtml) {
  limpiarEmpty();
  const bloque = crearBloque(tipo, contenidoHtml);
  canvas.appendChild(bloque);
  actualizarContador(badge, canvas);
}

// ---- Párrafo ----
document.getElementById('btnParrafo').addEventListener('click', () => {
  const texto = document.getElementById('inputParrafo').value.trim();
  if (!texto) return;
  insertar('parrafo', htmlParrafo(texto));
  document.getElementById('inputParrafo').value = '';
});

// ---- Imagen ----
document.getElementById('btnImagen').addEventListener('click', () => {
  const url = document.getElementById('inputImgUrl').value.trim();
  const alt = document.getElementById('inputImgAlt').value.trim();
  insertar('imagen', htmlImagen(url, alt));
  document.getElementById('inputImgUrl').value = '';
  document.getElementById('inputImgAlt').value = '';
});

// ---- Lista ----
document.getElementById('btnLista').addEventListener('click', () => {
  const titulo = document.getElementById('inputListaTitulo').value.trim();
  const rawItems = document.getElementById('inputListaItems').value.trim();
  const tipo = document.querySelector('input[name="tipoLista"]:checked').value;
  if (!rawItems) return;
  const items = rawItems.split('\n').map(i => i.trim()).filter(Boolean);
  insertar('lista', htmlLista(titulo, items, tipo));
  document.getElementById('inputListaTitulo').value = '';
  document.getElementById('inputListaItems').value = '';
});

// ---- Limpiar ----
document.getElementById('btnLimpiar').addEventListener('click', () => {
  canvas.innerHTML = `
    <div class="canvas-empty">
      <span class="empty-icon">✦</span>
      <p>El contenido aparecerá aquí</p>
    </div>
  `;
  actualizarContador(badge, canvas);
});
