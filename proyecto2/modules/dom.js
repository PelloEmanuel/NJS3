/**
 * Utilidades reutilizables del DOM.
 * Compartidas entre páginas del proyecto.
 */

/**
 * Agrega ítem a lista de registro de eventos.
 * @param {string} listaId - ID del ul
 * @param {string} texto
 * @param {string} tipo - color Bootstrap
 */
export function registrarEvento(listaId, texto, tipo = "secondary") {
  const lista = document.getElementById(listaId);
  if (!lista) return;

  const ahora = new Date().toLocaleTimeString("es-AR");
  const item = document.createElement("li");
  item.className = `list-group-item list-group-item-${tipo} elemento-nuevo`;
  item.textContent = `[${ahora}] ${texto}`;

  /* Inserta al inicio para mostrar el más reciente primero */
  lista.insertBefore(item, lista.firstChild);
}

/**
 * Aplica tema claro u oscuro al documento.
 * @param {boolean} oscuro
 */
export function aplicarTema(oscuro) {
  document.documentElement.setAttribute("data-tema", oscuro ? "oscuro" : "claro");
}

/**
 * Configura el botón de cambio de tema.
 * @param {boolean} modoOscuro - estado inicial
 * @returns {boolean} - nuevo estado
 */
export function configurarBtnTema(modoOscuro) {
  const btn = document.getElementById("btnTema");
  if (!btn) return modoOscuro;

  btn.addEventListener("click", () => {
    modoOscuro = !modoOscuro;
    aplicarTema(modoOscuro);
    btn.textContent = modoOscuro ? "☀️ Claro" : "🌙 Oscuro";
  });

  return modoOscuro;
}