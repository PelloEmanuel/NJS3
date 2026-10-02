const zona = document.getElementById('zona');
const mensaje = document.getElementById('mensaje');
const inputAncho = document.getElementById('inputAncho');
const inputAlto = document.getElementById('inputAlto');

const colores = ['red', 'blue', 'green', 'orange', 'purple'];
const imagenes = [
  'https://picsum.photos/id/10/800/600',
  'https://picsum.photos/id/20/800/600',
  'https://picsum.photos/id/30/800/600'
];

let titulo = null;
let imagen = null;
let indiceColor = 0;
let indiceImagen = 0;

// Muestra un mensaje en la barra de avisos (tipo: '', 'ok' o 'error')
function avisar(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = 'aviso ' + (tipo || '');
}

function agregarTitulo() {
  if (titulo) { avisar('El H1 ya existe.', 'error'); return; }
  titulo = document.createElement('h1');
  titulo.textContent = 'Hola DOM';
  zona.appendChild(titulo);
  avisar('H1 agregado.', 'ok');
}

function cambiarTexto() {
  if (!titulo) { avisar('Primero agregá el H1.', 'error'); return; }
  titulo.textContent = 'Chau DOM';
  avisar('Texto del H1 cambiado a "Chau DOM".', 'ok');
}

function cambiarColor() {
  if (!titulo) { avisar('Primero agregá el H1.', 'error'); return; }
  titulo.style.color = colores[indiceColor];
  avisar('Color del H1: ' + colores[indiceColor], 'ok');
  indiceColor = (indiceColor + 1) % colores.length;
}

function agregarImagen() {
  if (imagen) { avisar('La imagen ya existe.', 'error'); return; }
  imagen = document.createElement('img');
  imagen.src = imagenes[indiceImagen];
  imagen.alt = 'Imagen de ejemplo';
  imagen.style.width = '300px';
  zona.appendChild(imagen);
  avisar('Imagen agregada.', 'ok');
}

function cambiarImagen() {
  if (!imagen) { avisar('Primero agregá la imagen.', 'error'); return; }
  indiceImagen = (indiceImagen + 1) % imagenes.length;
  imagen.src = imagenes[indiceImagen];
  avisar('Imagen cambiada.', 'ok');
}

// Valida que el valor sea un número entre 20 y 2000
function medidaValida(valor) {
  return !isNaN(valor) && valor >= 20 && valor <= 2000;
}

function cambiarTamanio() {
  if (!imagen) { avisar('Primero agregá la imagen.', 'error'); return; }

  const ancho = parseInt(inputAncho.value);
  const alto = parseInt(inputAlto.value);
  const hayAlto = inputAlto.value !== '';

  if (!medidaValida(ancho)) {
    avisar('Ingresá un ancho válido entre 20 y 2000 px.', 'error');
    return;
  }
  if (hayAlto && !medidaValida(alto)) {
    avisar('El alto debe estar entre 20 y 2000 px (o dejalo vacío).', 'error');
    return;
  }

  imagen.style.width = ancho + 'px';
  imagen.style.height = hayAlto ? alto + 'px' : 'auto';
  avisar('Tamaño aplicado: ' + ancho + ' x ' + (hayAlto ? alto : 'automático') + ' px', 'ok');
}

document.getElementById('btnAgregarH1').addEventListener('click', agregarTitulo);
document.getElementById('btnTextoH1').addEventListener('click', cambiarTexto);
document.getElementById('btnColorH1').addEventListener('click', cambiarColor);
document.getElementById('btnAgregarImg').addEventListener('click', agregarImagen);
document.getElementById('btnCambiarImg').addEventListener('click', cambiarImagen);
document.getElementById('btnTamanioImg').addEventListener('click', cambiarTamanio);

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
