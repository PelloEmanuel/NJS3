// dom.js — funciones reutilizables para el proyecto 2

export function mostrarSeccion(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`section-${id}`).classList.add('active');
  document.querySelector(`[data-section="${id}"]`).classList.add('active');
}

export function agregarLogItem(contenedor, texto) {
  const p = document.createElement('p');
  p.textContent = `→ ${texto}`;
  p.style.margin = '2px 0';
  contenedor.prepend(p);
}

export function coloraleatorio() {
  const colores = ['#e63946','#4cc9f0','#2ec4b6','#ff9f1c','#a78bfa','#22c55e','#f72585'];
  return colores[Math.floor(Math.random() * colores.length)];
}
