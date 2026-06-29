/**
 * DOM utilities proyecto6.
 * Renderiza las tarjetas de personas registradas.
 */

/**
 * Renderiza todos los registros en el contenedor.
 * @param {Array} registros
 * @param {Function} onEditar
 * @param {Function} onEliminar
 */
export function renderizarRegistros(registros, onEditar, onEliminar) {
  const contenedor = document.getElementById("contenedorRegistros");
  document.getElementById("contadorRegistros").textContent = registros.length;
  contenedor.innerHTML = "";

  if (registros.length === 0) {
    contenedor.innerHTML = `
      <div class="text-center text-muted mt-4 p-4">
        <div style="font-size:2.5rem">👤</div>
        <p>No hay personas registradas todavía.</p>
      </div>
    `;
    return;
  }

  registros.forEach((reg) => {
    const div = document.createElement("div");
    div.className = "tarjeta-registro elemento-nuevo";
    div.id = `registro-${reg.id}`;

    const interesesHtml = reg.intereses && reg.intereses.length
      ? reg.intereses.map((i) => `<span class="badge-interes">${i}</span>`).join("")
      : "<span class='text-muted'>Sin intereses</span>";

    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div class="nombre-registro">👤 ${reg.nombre}</div>
          <div class="dato-registro">📧 ${reg.email}</div>
          <div class="dato-registro">🎂 ${reg.edad} años | ⚧ ${reg.genero} | 🌍 ${reg.pais}</div>
          <div class="intereses-lista mt-1">${interesesHtml}</div>
        </div>
        <div class="d-flex flex-column gap-2 ms-3">
          <button class="btn btn-sm btn-outline-warning btn-editar-reg" data-id="${reg.id}">
            ✏️
          </button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar-reg" data-id="${reg.id}">
            🗑️
          </button>
        </div>
      </div>
    `;
    contenedor.appendChild(div);

    div.querySelector(".btn-editar-reg").addEventListener("click", () => onEditar(reg));
    div.querySelector(".btn-eliminar-reg").addEventListener("click", () => onEliminar(reg.id));
  });
}

/**
 * Muestra mensaje global del formulario.
 * @param {string} texto
 * @param {string} tipo
 */
export function mostrarMensajeFormulario(texto, tipo) {
  const el = document.getElementById("mensajeFormulario");
  el.className = `alert alert-${tipo} elemento-nuevo`;
  el.textContent = texto;
  el.classList.remove("d-none");
  setTimeout(() => el.classList.add("d-none"), 4000);
}

/**
 * Aplica tema claro u oscuro.
 * @param {boolean} oscuro
 */
export function aplicarTema(oscuro) {
  document.documentElement.setAttribute("data-tema", oscuro ? "oscuro" : "claro");
}