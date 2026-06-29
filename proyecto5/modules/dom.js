/**
 * DOM utilities del proyecto5.
 * Genera innerHTML según el tipo de elemento seleccionado.
 */

/**
 * Genera el HTML según el tipo y contenido pedido.
 * @param {string} tipo
 * @param {string} contenido
 * @returns {string} - HTML generado
 */
export function generarHtml(tipo, contenido) {
  const texto = contenido || tiposDefault[tipo] || "Contenido";

  const generadores = {
    parrafo: () => `<p class="mb-0">${texto}</p>`,

    titulo: () => `<h2 class="mb-0">${texto}</h2>`,

    lista: () => {
      const items = texto.split(",").map((i) => `<li>${i.trim()}</li>`).join("");
      return `<ul class="mb-0">${items}</ul>`;
    },

    tabla: () => {
      const cols = texto.split(",").map((c) => c.trim());
      const encabezados = cols.map((c) => `<th>${c}</th>`).join("");
      const celdas = cols.map((_, i) => `<td>Dato ${i + 1}</td>`).join("");
      return `
        <table class="table table-sm table-bordered mb-0">
          <thead><tr>${encabezados}</tr></thead>
          <tbody><tr>${celdas}</tr></tbody>
        </table>`;
    },

    alerta: () =>
      `<div class="alert alert-info mb-0">ℹ️ ${texto}</div>`,

    imagen: () => {
      const seed = Date.now();
      return `<img src="https://picsum.photos/seed/${seed}/300/150"
        alt="${texto}" class="img-fluid rounded" style="max-width:300px"/>`;
    },

    tarjeta: () => `
      <div class="card" style="max-width:260px">
        <div class="card-body">
          <h6 class="card-title">Tarjeta</h6>
          <p class="card-text mb-0">${texto}</p>
        </div>
      </div>`,
  };

  return generadores[tipo] ? generadores[tipo]() : `<p>${texto}</p>`;
}

/**
 * Textos por defecto según el tipo de elemento.
 */
const tiposDefault = {
  parrafo: "Este es un párrafo de ejemplo.",
  titulo: "Título de ejemplo",
  lista: "Item 1, Item 2, Item 3",
  tabla: "Col A, Col B, Col C",
  alerta: "Mensaje de alerta de ejemplo.",
  imagen: "Imagen aleatoria",
  tarjeta: "Contenido de la tarjeta.",
};

/**
 * Renderiza todos los elementos en la zona.
 * Cada elemento tiene botones de editar y eliminar.
 * @param {Array} elementos
 * @param {Function} onEditar
 * @param {Function} onEliminar
 */
export function renderizarElementos(elementos, onEditar, onEliminar) {
  const zona = document.getElementById("zonaElementos");
  const contador = document.getElementById("contadorElementos");
  const statTotal = document.getElementById("statTotal");

  contador.textContent = elementos.length;
  statTotal.textContent = elementos.length;
  zona.innerHTML = "";

  if (elementos.length === 0) {
    zona.innerHTML = `<p class="text-muted text-center mt-4">No hay elementos. Agregá uno usando el panel de arriba.</p>`;
    return;
  }

  elementos.forEach((elem) => {
    const div = document.createElement("div");
    div.className = "item-elemento elemento-nuevo";
    div.id = `item-${elem.id}`;

    div.innerHTML = `
      <div class="tipo-badge">
        <span class="badge bg-info text-dark">${elem.tipo}</span>
        <span class="text-muted ms-2" style="font-size:0.75rem">ID: ${elem.id}</span>
      </div>
      <div class="contenido-elemento">${elem.contenidoHtml}</div>
      <div class="d-flex gap-2 mt-2">
        <button class="btn btn-sm btn-outline-warning btn-editar-elem" data-id="${elem.id}">
          ✏️ Editar
        </button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar-elem" data-id="${elem.id}">
          🗑️ Eliminar
        </button>
      </div>
    `;
    zona.appendChild(div);

    div.querySelector(".btn-editar-elem").addEventListener("click", () => onEditar(elem));
    div.querySelector(".btn-eliminar-elem").addEventListener("click", () => onEliminar(elem.id));
  });
}

/**
 * Muestra un mensaje transitorio debajo del formulario.
 * @param {string} texto
 * @param {string} tipo
 */
export function mostrarMensaje(texto, tipo) {
  const el = document.getElementById("mensajeAgregar");
  el.className = `alert alert-${tipo} elemento-nuevo`;
  el.textContent = texto;
  el.classList.remove("d-none");
  setTimeout(() => el.classList.add("d-none"), 3000);
}

/**
 * Aplica tema al documento.
 * @param {boolean} oscuro
 */
export function aplicarTema(oscuro) {
  document.documentElement.setAttribute("data-tema", oscuro ? "oscuro" : "claro");
}