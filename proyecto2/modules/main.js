// main.js — eventos y navegación

import { mostrarSeccion, agregarLogItem, coloraleatorio } from './dom.js';

// ---- Navegación ----
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    mostrarSeccion(item.dataset.section);
  });
});

// ---- Evento: click ----
let clickCount = 0;
document.getElementById('btnClick').addEventListener('click', () => {
  clickCount++;
  const output = document.getElementById('click-output');
  agregarLogItem(output, `Clic #${clickCount} — ${new Date().toLocaleTimeString()}`);
});

// ---- Evento: mouseover ----
document.querySelectorAll('.hover-card').forEach(card => {
  card.addEventListener('mouseover', () => {
    card.style.backgroundColor = card.dataset.color;
    card.style.color = '#fff';
    card.style.transform = 'scale(1.05)';
    document.getElementById('hover-msg').textContent = `Pasaste sobre: ${card.textContent.trim()}`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.backgroundColor = '';
    card.style.color = '';
    card.style.transform = '';
  });
});

// ---- Evento: input ----
document.getElementById('inputTexto').addEventListener('input', (e) => {
  const val = e.target.value;
  const output = document.getElementById('input-output');
  output.textContent = val.length > 0
    ? `Texto: "${val}" | Caracteres: ${val.length}`
    : 'Esperando entrada...';
});

// ---- Evento: keydown ----
document.getElementById('key-area').addEventListener('keydown', (e) => {
  const output = document.getElementById('key-output');
  output.innerHTML = `Tecla: <strong>${e.key}</strong> | Código: <strong>${e.code}</strong> | Shift: ${e.shiftKey} | Ctrl: ${e.ctrlKey}`;
});

// ---- Evento: dblclick ----
const dblBox = document.getElementById('dbl-box');
document.getElementById('dbl-box').addEventListener('dblclick', () => {
  const color = coloraleatorio();
  dblBox.style.background = color;
  dblBox.style.color = '#fff';
  dblBox.style.borderColor = color;
  document.getElementById('dbl-msg').textContent = `Color cambiado a: ${color}`;
});
