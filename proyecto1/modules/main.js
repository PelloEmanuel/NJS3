// main.js — eventos y conexión con el DOM

import {
  crearH1,
  cambiarTextoH1,
  cambiarColorH1,
  agregarImagen,
  cambiarImagen,
  cambiarTamanoImagen
} from './dom.js';

const resultado = document.getElementById('resultado');
const colorPicker = document.getElementById('colorPicker');
const sliderTamano = document.getElementById('sliderTamano');
const labelTamano = document.getElementById('labelTamano');

const IMAGENES = [
  'https://picsum.photos/seed/dom1/300/300',
  'https://picsum.photos/seed/dom2/300/300',
  'https://picsum.photos/seed/dom3/300/300'
];
let imgIndex = 0;
let tamano = 150;
let textoAlternado = false; // false = "Hola DOM", true = "Chau DOM"

document.getElementById('btnCrear').addEventListener('click', () => {
  crearH1('Hola DOM', resultado);
  textoAlternado = false; // al crear de nuevo, resetea el estado
  document.getElementById('btnCambiarTexto').textContent = 'Cambiar a "Chau DOM"';
});

document.getElementById('btnCambiarTexto').addEventListener('click', () => {
  const h1 = resultado.querySelector('h1');
  if (!h1) return; // si no existe el h1, no hace nada

  if (textoAlternado) {
    cambiarTextoH1(resultado, 'Hola DOM');
    document.getElementById('btnCambiarTexto').textContent = 'Cambiar a "Chau DOM"';
  } else {
    cambiarTextoH1(resultado, 'Chau DOM');
    document.getElementById('btnCambiarTexto').textContent = 'Volver a "Hola DOM"';
  }

  textoAlternado = !textoAlternado; // alterna el estado
});

document.getElementById('btnColor').addEventListener('click', () => {
  cambiarColorH1(resultado, colorPicker.value);
});

document.getElementById('btnAgregarImg').addEventListener('click', () => {
  agregarImagen(resultado, IMAGENES[0], tamano);
});

document.getElementById('btnCambiarImg').addEventListener('click', () => {
  imgIndex = (imgIndex + 1) % IMAGENES.length;
  cambiarImagen(resultado, IMAGENES[imgIndex]);
});

sliderTamano.addEventListener('input', (e) => {
  tamano = parseInt(e.target.value);
  labelTamano.textContent = `${tamano}px`;
  cambiarTamanoImagen(resultado, tamano);
});
