// main.js — eventos + contar hijos

import { mostrarSeccion, mostrarConteoHijos, colorRandom } from './dom.js';

// ---- Navegación ----
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => mostrarSeccion(item.dataset.section));
});

// ---- CLICK: agregar + contar ----
const clickOutput = document.getElementById('click-output');
let clickCount = 0;

document.getElementById('btnClick').addEventListener('click', () => {
  clickCount++;
  const p = document.createElement('p');
  p.style.margin = '2px 0';
  p.textContent = `→ Elemento #${clickCount} — ${new Date().toLocaleTimeString()}`;
  clickOutput.prepend(p);
});

document.getElementById('btnContarHijos').addEventListener('click', () => {
  mostrarConteoHijos(document.getElementById('hijos-badge'), clickOutput);
});

// ---- MOUSEOVER: hover + contar ----
document.querySelectorAll('.hover-card').forEach(card => {
  card.addEventListener('mouseover', () => {
    card.style.backgroundColor = card.dataset.color;
    card.style.color = '#fff';
    card.style.transform = 'scale(1.06)';
    document.getElementById('hover-msg').textContent = `Mouse sobre: ${card.textContent.trim()}`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.backgroundColor = '';
    card.style.color = '';
    card.style.transform = '';
  });
});

document.getElementById('btnContarHijosCards').addEventListener('click', () => {
  mostrarConteoHijos(document.getElementById('hijos-cards-badge'), document.getElementById('cards-container'));
});

// ---- INPUT: agregar items + contar ----
const listaItems = document.getElementById('lista-items');
document.getElementById('inputTexto').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    const li = document.createElement('li');
    li.textContent = e.target.value.trim();
    listaItems.appendChild(li);
    e.target.value = '';
  }
});

document.getElementById('btnContarHijosLista').addEventListener('click', () => {
  mostrarConteoHijos(document.getElementById('hijos-lista-badge'), listaItems);
});

// ---- KEYDOWN: registrar teclas + contar ----
const keyOutput = document.getElementById('key-output');
document.getElementById('key-area').addEventListener('keydown', (e) => {
  const span = document.createElement('span');
  span.style.display = 'block';
  span.textContent = `Tecla: ${e.key} | Código: ${e.code}`;
  keyOutput.prepend(span);
});

document.getElementById('btnContarHijosKeys').addEventListener('click', () => {
  mostrarConteoHijos(document.getElementById('hijos-keys-badge'), keyOutput);
});

// ---- DBLCLICK: agregar cajas + contar ----
const dblContainer = document.getElementById('dbl-container');
document.getElementById('dbl-box').addEventListener('dblclick', () => {
  const box = document.createElement('div');
  box.style.cssText = `background:${colorRandom()};color:#fff;border-radius:8px;padding:16px 22px;font-weight:600;`;
  box.textContent = `Caja ${dblContainer.children.length}`;
  dblContainer.appendChild(box);
});

document.getElementById('btnContarHijosDbl').addEventListener('click', () => {
  mostrarConteoHijos(document.getElementById('hijos-dbl-badge'), dblContainer);
});
