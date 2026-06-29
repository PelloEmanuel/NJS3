/**
 * Módulo de validaciones del formulario.
 * Retorna true si el campo es válido, false si no.
 */

/**
 * Valida que el nombre no esté vacío y tenga al menos 2 caracteres.
 * @param {string} valor
 * @returns {boolean}
 */
export function validarNombre(valor) {
  return valor.trim().length >= 2;
}

/**
 * Valida formato básico de email con expresión regular.
 * @param {string} valor
 * @returns {boolean}
 */
export function validarEmail(valor) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(valor.trim());
}

/**
 * Valida que la edad sea un número entre 1 y 120.
 * @param {string|number} valor
 * @returns {boolean}
 */
export function validarEdad(valor) {
  const num = parseInt(valor, 10);
  return !isNaN(num) && num >= 1 && num <= 120;
}

/**
 * Valida que se haya seleccionado un género.
 * @param {string} valor
 * @returns {boolean}
 */
export function validarGenero(valor) {
  return valor !== "" && valor !== undefined;
}

/**
 * Valida que se haya seleccionado un país.
 * @param {string} valor
 * @returns {boolean}
 */
export function validarPais(valor) {
  return valor !== "" && valor !== undefined;
}

/**
 * Muestra u oculta el mensaje de error de un campo.
 * Agrega o quita la clase visual de campo inválido.
 * @param {string} inputId - ID del input
 * @param {string} errorId - ID del div de error
 * @param {boolean} valido
 */
export function mostrarErrorCampo(inputId, errorId, valido) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (valido) {
    input?.classList.remove("input-invalido");
    error?.classList.add("d-none");
  } else {
    input?.classList.add("input-invalido");
    error?.classList.remove("d-none");
  }
}