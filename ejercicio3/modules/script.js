const botonesNav = document.querySelectorAll('.btn-nav');
const secciones = document.querySelectorAll('.seccion-content');
const visor = document.getElementById('resultado-conteo');
const toast = document.getElementById('toast');

const textoInicial = '<span class="vacio-conteo">Presioná «Contar elementos hijos» para ver cuántos elementos tiene el componente actual.</span>';
const nombresElementos = { H3: 'Título', P: 'Párrafo', DIV: 'Caja', FIGURE: 'Foto', BUTTON: 'Botón' };
const idsFotos = [40, 42, 43, 44, 45, 47, 48, 49];

let conteoActivo = false;
let temporizador = null;
let contadorParrafos = 0;
let contadorFotos = 0;
let contadorCampos = 0;

// ---------- Utilidades ----------
function avisar(texto) {
  toast.textContent = texto;
  toast.className = 'toast visible';
  clearTimeout(temporizador);
  temporizador = setTimeout(() => toast.classList.remove('visible'), 2500);
}

function seccionActiva() {
  return document.querySelector('.seccion-content:not(.oculto)');
}

// Crea un elemento con clase y nombre (el nombre se usa en el conteo)
function crear(etiqueta, clase, nombre, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.dataset.nombre = nombre;
  if (texto) elemento.textContent = texto;
  return elemento;
}

// ---------- Conteo de hijos ----------
function contarHijos() {
  conteoActivo = true;
  const seccion = seccionActiva();
  const hijos = Array.from(seccion.children); // solo elementos directos

  let lista = '';
  hijos.forEach((hijo, indice) => {
    const nombre = hijo.dataset.nombre || nombresElementos[hijo.tagName] || hijo.tagName;
    lista += '<li>' + (indice + 1) + '. ' + nombre + '</li>';
  });
  const palabra = hijos.length === 1 ? 'elemento' : 'elementos';

  visor.innerHTML =
    '<span class="numero">' + hijos.length + '</span>' +
    '<div><strong>' + palabra + ' dentro de «' + seccion.dataset.nombre + '»</strong>' +
    '<p>Los hijos son los elementos que están directamente adentro del componente.</p>' +
    '<ul class="chips">' + lista + '</ul></div>';

  console.group('Inspección de nodo: ' + seccion.id);
  console.log('Total de hijos: ' + hijos.length);
  console.groupEnd();
}

function limpiarConteo() {
  conteoActivo = false;
  visor.innerHTML = textoInicial;
}

// Si el conteo está a la vista, se actualiza solo cuando algo cambia
function actualizarConteo() {
  if (conteoActivo) contarHijos();
}

// Agrega un hijo antes de los botones de acción y quita el último que coincida
function agregarHijo(seccion, elemento) {
  seccion.insertBefore(elemento, seccion.querySelector('.acciones'));
  actualizarConteo();
}

function quitarHijo(seccion, selector, mensajeVacio) {
  const lista = seccion.querySelectorAll(selector);
  if (lista.length === 0) { avisar(mensajeVacio); return; }
  lista[lista.length - 1].remove();
  actualizarConteo();
}

// ---------- Navegación ----------
function mostrar(id, boton) {
  secciones.forEach((seccion) => seccion.classList.toggle('oculto', seccion.id !== id));
  botonesNav.forEach((b) => b.classList.remove('activo'));
  boton.classList.add('activo');
  limpiarConteo();
}

botonesNav.forEach((boton) => {
  boton.addEventListener('click', () => mostrar(boton.dataset.seccion, boton));
});
document.getElementById('btnHijos').addEventListener('click', contarHijos);

// ---------- Datos de texto ----------
const c1 = document.getElementById('c1');
document.getElementById('btnAgregarParrafo').addEventListener('click', () => {
  contadorParrafos++;
  agregarHijo(c1, crear('p', 'parrafo-nuevo', 'Párrafo', 'Párrafo agregado número ' + contadorParrafos));
});
document.getElementById('btnQuitarParrafo').addEventListener('click', () => {
  quitarHijo(c1, '.parrafo-nuevo', 'No hay párrafos agregados para quitar.');
});

// ---------- Galería ----------
const c2 = document.getElementById('c2');
document.getElementById('btnAgregarFoto').addEventListener('click', () => {
  const foto = crear('figure', 'foto', 'Foto');
  const imagen = document.createElement('img');
  imagen.src = 'https://picsum.photos/id/' + idsFotos[contadorFotos % idsFotos.length] + '/300/200';
  imagen.alt = 'Foto agregada';
  foto.appendChild(imagen);
  contadorFotos++;
  agregarHijo(c2, foto);
});
document.getElementById('btnQuitarFoto').addEventListener('click', () => {
  quitarHijo(c2, '.foto', 'No quedan fotos para quitar.');
});

// ---------- Formulario ----------
const c3 = document.getElementById('c3');

function ingresar() {
  const usuario = document.getElementById('inputUsuario').value.trim();
  const clave = document.getElementById('inputClave').value;
  const anterior = c3.querySelector('.aviso-form');
  if (anterior) anterior.remove();

  const mensaje = crear('div', 'aviso-form', 'Mensaje de resultado');
  if (usuario.length < 3) {
    mensaje.classList.add('error');
    mensaje.textContent = 'El usuario debe tener al menos 3 caracteres.';
  } else if (clave.length < 4) {
    mensaje.classList.add('error');
    mensaje.textContent = 'La clave debe tener al menos 4 caracteres.';
  } else {
    mensaje.classList.add('ok');
    mensaje.textContent = '¡Bienvenido, ' + usuario + '! Formulario completado.';
    document.getElementById('inputUsuario').value = '';
    document.getElementById('inputClave').value = '';
  }
  agregarHijo(c3, mensaje);
}

document.getElementById('btnIngresar').addEventListener('click', ingresar);
document.getElementById('btnAgregarCampo').addEventListener('click', () => {
  contadorCampos++;
  const campo = crear('div', 'campo extra', 'Campo extra');
  campo.innerHTML = '<label>Campo extra ' + contadorCampos + '</label><input type="text" placeholder="Escribí algo">';
  agregarHijo(c3, campo);
});
document.getElementById('btnQuitarCampo').addEventListener('click', () => {
  quitarHijo(c3, '.extra', 'No hay campos extra para quitar.');
});
// Evento de teclado: se registra en la consola del navegador
c3.addEventListener('keydown', (e) => console.log('Tecla presionada en el formulario: ' + e.key));

// ---------- Lista de ítems ----------
const c4 = document.getElementById('c4');
const textoItem = document.getElementById('textoItem');

document.getElementById('btnAgregarItem').addEventListener('click', () => {
  const texto = textoItem.value.trim();
  if (texto === '') { avisar('Escribí el nombre del ítem.'); return; }
  agregarHijo(c4, crear('div', 'item', 'Ítem', texto));
  textoItem.value = '';
});
document.getElementById('btnQuitarItem').addEventListener('click', () => {
  quitarHijo(c4, '.item', 'No quedan ítems para quitar.');
});
// Evento de doble clic: elimina el ítem tocado
c4.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('item')) {
    e.target.remove();
    avisar('Ítem eliminado.');
    actualizarConteo();
  }
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
