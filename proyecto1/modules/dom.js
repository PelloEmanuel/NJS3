// dom.js — funciones reutilizables de manipulación del DOM

export function crearH1(texto, contenedor) {
  let h1 = contenedor.querySelector('h1');
  if (!h1) {
    h1 = document.createElement('h1');
    contenedor.prepend(h1);
  }
  h1.textContent = texto;
  return h1;
}

export function cambiarTextoH1(contenedor, texto) {
  const h1 = contenedor.querySelector('h1');
  if (h1) h1.textContent = texto;
}

export function cambiarColorH1(contenedor, color) {
  const h1 = contenedor.querySelector('h1');
  if (h1) h1.style.color = color;
}

export function agregarImagen(contenedor, src, size) {
  let img = contenedor.querySelector('img');
  if (!img) {
    img = document.createElement('img');
    contenedor.appendChild(img);
  }
  img.src = src;
  img.alt = 'Imagen DOM';
  img.width = size;
  img.height = size;
  return img;
}

export function cambiarImagen(contenedor, src) {
  const img = contenedor.querySelector('img');
  if (img) img.src = src;
}

export function cambiarTamanoImagen(contenedor, size) {
  const img = contenedor.querySelector('img');
  if (img) {
    img.width = size;
    img.height = size;
  }
}
