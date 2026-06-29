/**
 * Módulo principal - conecta eventos con funciones DOM.
 * Gestiona interacciones del usuario.
 */
import {
  mostrarMensaje,
  obtenerOCrearH1,
  cambiarTextoH1,
  cambiarColorH1,
  agregarImagen,
  cambiarImagen,
  cambiarTamanoImagen,
  aplicarTema,
} from "./dom.js";

/* URLs de imágenes de ejemplo */
const IMAGEN_INICIAL = "https://picsum.photos/seed/dom1/400/250";
const IMAGEN_ALTERNATIVA = "https://picsum.photos/seed/dom2/400/250";

let modoOscuro = false;
let imagenActual = IMAGEN_INICIAL;

/* === EVENTO: Agregar H1 (click) === */
document.getElementById("btnAgregarH1").addEventListener("click", () => {
  obtenerOCrearH1();
  mostrarMensaje("H1 'Hola DOM' agregado correctamente.", "success");
});

/* === EVENTO: Cambiar texto H1 (click) === */
document.getElementById("btnCambiarTexto").addEventListener("click", () => {
  cambiarTextoH1("Chau DOM");
  mostrarMensaje("Texto del H1 cambiado a 'Chau DOM'.", "info");
});

/* === EVENTO: Cambiar color H1 (input en tiempo real) === */
document.getElementById("inputColor").addEventListener("input", (evento) => {
  const color = evento.target.value;
  cambiarColorH1(color);
  mostrarMensaje(`Color del H1 cambiado a ${color}.`, "info");
});

/* === EVENTO: Cambiar color H1 por botón (click) === */
document.getElementById("btnCambiarColor").addEventListener("click", () => {
  const color = document.getElementById("inputColor").value;
  cambiarColorH1(color);
  mostrarMensaje(`Color aplicado: ${color}`, "success");
});

/* === EVENTO: Agregar imagen (click) === */
document.getElementById("btnAgregarImagen").addEventListener("click", () => {
  agregarImagen(imagenActual, 300);
  mostrarMensaje("Imagen agregada a la zona de contenido.", "success");
});

/* === EVENTO: Cambiar imagen (click) === */
document.getElementById("btnCambiarImagen").addEventListener("click", () => {
  /* Alterna entre las dos URLs de ejemplo */
  imagenActual =
    imagenActual === IMAGEN_INICIAL ? IMAGEN_ALTERNATIVA : IMAGEN_INICIAL;

  const resultado = cambiarImagen(imagenActual);

  if (resultado) {
    mostrarMensaje("Imagen cambiada correctamente.", "success");
  } else {
    mostrarMensaje("Primero debes agregar una imagen.", "warning");
  }
});

/* === EVENTO: Cambiar tamaño (keydown + click) === */
document.getElementById("inputTamano").addEventListener("keydown", (evento) => {
  /* Permite aplicar con Enter además del botón */
  if (evento.key === "Enter") {
    aplicarCambioTamano();
  }
});

document.getElementById("btnCambiarTamano").addEventListener("click", () => {
  aplicarCambioTamano();
});

/**
 * Lee el valor de tamaño y aplica el cambio a la imagen.
 * Valida rango mínimo y máximo.
 */
function aplicarCambioTamano() {
  const valor = parseInt(document.getElementById("inputTamano").value, 10);

  if (isNaN(valor) || valor < 50 || valor > 800) {
    mostrarMensaje("Ingresá un tamaño válido entre 50 y 800 px.", "danger");
    return;
  }

  const resultado = cambiarTamanoImagen(valor);

  if (resultado) {
    mostrarMensaje(`Tamaño de imagen cambiado a ${valor}px.`, "success");
  } else {
    mostrarMensaje("Primero debes agregar una imagen.", "warning");
  }
}

/* === EVENTO: Modo claro/oscuro (click) === */
document.getElementById("btnTema").addEventListener("click", () => {
  modoOscuro = !modoOscuro;
  aplicarTema(modoOscuro);

  const btn = document.getElementById("btnTema");
  btn.textContent = modoOscuro ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
});