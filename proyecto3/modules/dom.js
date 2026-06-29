/**
 * Utilidades DOM para proyecto3.
 * Expone funciones de conteo, visualización y tema.
 */

/**
 * Mapa de ID selector a elemento real del DOM.
 * Permite seleccionar nodos por nombre legible.
 */
export const mapaElementos = {
  body: () => document.body,
  navbarPrincipal: () => document.querySelector("nav"),
  contenedorPrincipal: () => document.querySelector(".container"),
  listaComponentes: () => document.getElementById("listaComponentes"),
  panelInspeccion: () => document.querySelector(".card"),
};

/**
 * Cuenta hijos directos de un elemento.
 * Retorna array con etiqueta+clase+id de cada hijo.
 * @param {HTMLElement} elemento
 * @returns {{ total: number, hijos: string[] }}
 */
export function contarHijos(elemento) {
  if (!elemento) return { total: 0, hijos: [] };

  const nodosHijos = Array.from(elemento.children);
  const hijos = nodosHijos.map((hijo, i) => {
    const tag = hijo.tagName.toLowerCase();
    const clases = hijo.className ? `.${hijo.className.split(" ").join(".")}` : "";
    const id = hijo.id ? `#${hijo.id}` : "";
    return `${i + 1}. <${tag}${id}${clases}>`;
  });

  return { total: nodosHijos.length, hijos };
}

/**
 * Renderiza los resultados del conteo en el panel.
 * @param {string} nombreElemento
 * @param {{ total: number, hijos: string[] }} resultado
 */
export function mostrarResultadoConteo(nombreElemento, resultado) {
  const panelResultado = document.getElementById("resultadoConteo");
  const textoResultado = document.getElementById("textoResultado");
  const listaHijos = document.getElementById("listaHijosEncontrados");

  panelResultado.classList.remove("d-none");
  textoResultado.textContent =
    `"${nombreElemento}" tiene ${resultado.total} hijo(s) directo(s).`;

  /* Limpia y reconstruye la lista de hijos */
  listaHijos.innerHTML = "";

  if (resultado.hijos.length === 0) {
    const item = document.createElement("li");
    item.className = "list-group-item text-muted";
    item.textContent = "No tiene hijos directos.";
    listaHijos.appendChild(item);
    return;
  }

  resultado.hijos.forEach((hijo) => {
    const item = document.createElement("li");
    item.className = "list-group-item elemento-nuevo";
    item.textContent = hijo;
    listaHijos.appendChild(item);
  });
}

/**
 * Agrega entrada al historial de inspecciones.
 * @param {string} texto
 */
export function agregarHistorial(texto) {
  const lista = document.getElementById("historialInspecciones");
  if (!lista) return;

  const ahora = new Date().toLocaleTimeString("es-AR");
  const item = document.createElement("li");
  item.className = "list-group-item elemento-nuevo";
  item.textContent = `[${ahora}] ${texto}`;
  lista.insertBefore(item, lista.firstChild);
}

/**
 * Aplica el tema claro u oscuro.
 * @param {boolean} oscuro
 */
export function aplicarTema(oscuro) {
  document.documentElement.setAttribute("data-tema", oscuro ? "oscuro" : "claro");
}