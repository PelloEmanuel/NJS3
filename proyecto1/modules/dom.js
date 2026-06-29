/**
 * Módulo de funciones reutilizables del DOM.
 * Expone utilidades para crear, modificar y mostrar elementos.
 */

/**
 * Muestra mensaje de estado en pantalla.
 * @param {string} mensaje
 * @param {string} tipo - "success" | "danger" | "warning" | "info"
 */
export function mostrarMensaje(mensaje, tipo = "info") {
  const caja = document.getElementById("mensajeEstado");
  caja.className = `mt-3 alert alert-${tipo} elemento-nuevo`;
  caja.textContent = mensaje;
  caja.classList.remove("d-none");

  /* Oculta el mensaje luego de 3 segundos */
  setTimeout(() => {
    caja.classList.add("d-none");
  }, 3000);
}

/**
 * Obtiene o crea el H1 dentro de la zona de contenido.
 * Si ya existe lo retorna, si no lo crea.
 * @returns {HTMLElement}
 */
export function obtenerOCrearH1() {
  const zona = document.getElementById("zonaContenido");
  let h1 = document.getElementById("tituloDinamico");

  if (!h1) {
    /* Limpia texto guía y crea el H1 */
    zona.innerHTML = "";
    h1 = document.createElement("h1");
    h1.id = "tituloDinamico";
    h1.textContent = "Hola DOM";
    h1.className = "elemento-nuevo";
    zona.appendChild(h1);
  }

  return h1;
}

/**
 * Cambia el texto del H1 dinámico.
 * @param {string} nuevoTexto
 */
export function cambiarTextoH1(nuevoTexto) {
  const h1 = obtenerOCrearH1();
  h1.textContent = nuevoTexto;
}

/**
 * Cambia el color del H1 dinámico.
 * @param {string} color - valor hex o CSS
 */
export function cambiarColorH1(color) {
  const h1 = obtenerOCrearH1();
  h1.style.color = color;
}

/**
 * Agrega una imagen a la zona de contenido.
 * Si ya existe, no crea otra.
 * @param {string} url
 * @param {number} ancho
 */
export function agregarImagen(url, ancho = 300) {
  const zona = document.getElementById("zonaContenido");
  let img = document.getElementById("imagenDinamica");

  if (!img) {
    img = document.createElement("img");
    img.id = "imagenDinamica";
    img.alt = "Imagen dinámica";
    img.className = "elemento-nuevo";
    zona.appendChild(img);
  }

  img.src = url;
  img.width = ancho;
}

/**
 * Cambia la fuente de la imagen existente.
 * Muestra aviso si no hay imagen aún.
 * @param {string} nuevaUrl
 * @returns {boolean}
 */
export function cambiarImagen(nuevaUrl) {
  const img = document.getElementById("imagenDinamica");
  if (!img) return false;
  img.src = nuevaUrl;
  img.classList.add("elemento-nuevo");
  return true;
}

/**
 * Cambia el tamaño de la imagen dinámica.
 * @param {number} px - ancho en píxeles
 * @returns {boolean}
 */
export function cambiarTamanoImagen(px) {
  const img = document.getElementById("imagenDinamica");
  if (!img) return false;
  img.width = px;
  return true;
}

/**
 * Aplica o quita el modo oscuro al documento.
 * @param {boolean} activo
 */
export function aplicarTema(activo) {
  document.documentElement.setAttribute(
    "data-tema",
    activo ? "oscuro" : "claro"
  );
}