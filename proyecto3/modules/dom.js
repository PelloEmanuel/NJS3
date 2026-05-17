// dom.js — funciones reutilizables

export function mostrarSeccion(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`section-${id}`).classList.add('active');
  document.querySelector(`[data-section="${id}"]`).classList.add('active');
}

export function mostrarConteoHijos(badge, elemento) {
  const hijos = elemento.children.length;
  badge.textContent = `👶 Hijos directos de <${elemento.tagName.toLowerCase()}#${elemento.id}>: ${hijos}`;
  badge.classList.remove('hidden');
}

export function colorRandom() {
  const colores = ['#e63946','#4cc9f0','#2ec4b6','#ff9f1c','#a78bfa','#22c55e','#f72585','#fb8500'];
  return colores[Math.floor(Math.random() * colores.length)];
}
