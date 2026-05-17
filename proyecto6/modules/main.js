// main.js — lógica principal proyecto 6

import {
  leerFormulario,
  validarFormulario,
  marcarErrores,
  renderizarResultado,
  limpiarFormulario
} from './dom.js';

const resultBody = document.getElementById('result-body');
const btnNuevo   = document.getElementById('btnNuevo');

// Enviar formulario
document.getElementById('btnEnviar').addEventListener('click', () => {
  const datos = leerFormulario();
  const { errores, mensajes } = validarFormulario(datos);

  if (errores.length > 0) {
    marcarErrores(errores, mensajes);
    return;
  }

  marcarErrores([], {}); // limpia errores previos
  renderizarResultado(datos, resultBody);
  btnNuevo.classList.remove('hidden');

  // Scroll al resultado en mobile
  document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Limpiar errores en tiempo real
['inputNombre','inputEmail','inputEdad','selectPais'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    // Eliminar mensaje de error del campo en tiempo real
    const msgEl = document.getElementById(id).parentNode.querySelector('.field-error-msg');
    if (msgEl) msgEl.remove();
  });
});

// Nuevo registro
btnNuevo.addEventListener('click', () => {
  limpiarFormulario();
  resultBody.innerHTML = `
    <div class="result-empty">
      <p>Completá el formulario y hacé clic en <strong>Registrarme</strong> para ver los datos aquí.</p>
    </div>
  `;
  btnNuevo.classList.add('hidden');
});
