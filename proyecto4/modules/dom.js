/**
 * Funciones DOM del proyecto4.
 * Renderiza, actualiza y elimina nodos <a> en pantalla.
 */

/**
 * Renderiza todos los nodos en el contenedor.
 * Crea cards con enlace, botón editar y eliminar.
 * @param {Array} nodos - lista de { id, etiqueta, href }
 * @param {Function} onEditar
 * @param {Function} onEliminar
 */
export function renderizarNodos(nodos, onEditar, onEliminar) {
  const contenedor = document.getElementById("contenedorNodos");
  document.getElementById("contadorNodos").textContent = nodos.length;
  contenedor.innerHTML = "";

  if (nodos.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12">
        <p class="text-muted text-center">No hay nodos creados todavía.</p>
      </div>
    `;
    return;
  }

  nodos.forEach((nodo) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.id = `col-nodo-${nodo.id}`;

    col.innerHTML = `
      <div class="tarjeta-nodo elemento-nuevo">
        <div class="mb-2">
          <a href="${nodo.href}" target="_blank" class="enlace-nodo" id="enlace-${nodo.id}">
            🔗 ${nodo.etiqueta}
          </a>
        </div>
        <div class="etiqueta-atributo mb-2">
          href: <span id="href-${nodo.id}">${nodo.href}</span>
        </div>
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-sm btn-warning btn-editar" data-id="${nodo.id}">
            ✏️ Editar
          </button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-id="${nodo.id}">
            🗑️ Eliminar
          </button>
        </div>
      </div>
    `;
    contenedor.appendChild(col);

    /* Asigna callbacks a los botones de cada card */
    col.querySelector(".btn-editar").addEventListener("click", () => onEditar(nodo));
    col.querySelector(".btn-eliminar").addEventListener("click", () => onEliminar(nodo.id));
  });
}

/**
 * Agrega entrada al registro de cambios.
 * @param {string} texto
 * @param {string} tipo - Bootstrap color class
 */
export function registrarCambio(texto, tipo = "secondary") {
  const lista = document.getElementById("listaRegistro");
  const ahora = new Date().toLocaleTimeString("es-AR");
  const item = document.createElement("li");
  item.className = `list-group-item list-group-item-${tipo} elemento-nuevo`;
  item.textContent = `[${ahora}] ${texto}`;
  lista.insertBefore(item, lista.firstChild);
}

/**
 * Muestra mensaje de creación debajo del form.
 * @param {string} texto
 * @param {string} tipo
 */
export function mostrarMensajeCrear(texto, tipo) {
  const el = document.getElementById("mensajeCrear");
  el.className = `mt-3 alert alert-${tipo} elemento-nuevo`;
  el.textContent = texto;
  el.classList.remove("d-none");
  setTimeout(() => el.classList.add("d-none"), 3000);
}

/**
 * Aplica el tema al documento.
 * @param {boolean} oscuro
 */
export function aplicarTema(oscuro) {
  document.documentElement.setAttribute("data-tema", oscuro ? "oscuro" : "claro");
}