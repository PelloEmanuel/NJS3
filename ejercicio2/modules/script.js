const botonesNav = document.querySelectorAll('.btn-nav');
const secciones = document.querySelectorAll('.seccion');

// Navegación: muestra solo la sección elegida
function mostrarSeccion(id) {
  secciones.forEach((seccion) => {
    seccion.classList.toggle('oculto', seccion.id !== id);
  });
  botonesNav.forEach((boton) => {
    boton.classList.toggle('activo', boton.dataset.seccion === id);
  });
}

botonesNav.forEach((boton) => {
  boton.addEventListener('click', () => mostrarSeccion(boton.dataset.seccion));
});

// 1. Evento click (contador y reseteo)
let cuenta = 0;
const contador = document.getElementById('contador');
document.getElementById('btnContar').addEventListener('click', () => {
  cuenta++;
  contador.textContent = cuenta;
});
document.getElementById('btnReset').addEventListener('click', () => {
  cuenta = 0;
  contador.textContent = cuenta;
});

// 2. Eventos mouseover / mouseout
const caja = document.getElementById('caja');
caja.addEventListener('mouseover', () => {
  caja.textContent = 'Mouse encima';
  caja.style.background = '#f7dc6f';
  caja.style.color = '#222';
});
caja.addEventListener('mouseout', () => {
  caja.textContent = 'Mouse fuera';
  caja.style.background = '';
  caja.style.color = '';
});

// 3. Evento keyup
const entradaTexto = document.getElementById('entradaTexto');
const salidaTexto = document.getElementById('salidaTexto');
entradaTexto.addEventListener('keyup', () => {
  salidaTexto.textContent = entradaTexto.value;
});

// 4. Evento change
const selectorColor = document.getElementById('selectorColor');
const cajaColor = document.getElementById('cajaColor');
selectorColor.addEventListener('change', () => {
  cajaColor.style.background = selectorColor.value;
  cajaColor.style.color = '#222';
});

// 5. Evento dblclick
const textoGrande = document.getElementById('textoGrande');
let agrandado = false;
textoGrande.addEventListener('dblclick', () => {
  agrandado = !agrandado;
  textoGrande.style.fontSize = agrandado ? '2rem' : '1rem';
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
