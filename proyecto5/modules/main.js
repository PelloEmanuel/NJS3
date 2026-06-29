/**
 * Main proyecto5.
 * Gestiona CRUD de elementos HTML con innerHTML y persistencia.
 */
import {
  generarHtml,
  renderizarElementos,
  mostrarMensaje,
  aplicarTema,
} from "./dom.js";

let modoOscuro = false;

window.addEventListener("DOMContentLoaded", () => {
  cargarElementos();
});

/* === EVENTO: Modo oscuro (click) === */
document.getElementById("btnTema").addEventListener("click", () => {
  modoOscuro = !modoOscuro;
  aplicarTema(modoOscuro);
  document.getElementById("btnTema").textContent = modoOscuro ? "☀️ Claro" : "🌙 Oscuro";
});

/* === EVENTO: Agregar elemento (click) === */
document.getElementById("btnAgregarElemento").addEventListener("click", async () => {
  const tipo = document.getElementById("tipoElemento").value;
  const contenido = document.getElementById("inputContenido").value.trim();

  const htmlGenerado = generarHtml(tipo, contenido);
  const nuevoId = `elem-${Date.now()}`;

  try {
    const resp = await fetch("/api/elementos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: nuevoId, tipo, contenidoHtml: htmlGenerado }),
    });
    const datos = await resp.json();

    if (datos.ok) {
      document.getElementById("statUltimo").textContent = tipo;
      document.getElementById("inputContenido").value = "";
      mostrarMensaje(`Elemento "${tipo}" agregado correctamente.`, "success");
      await cargarElementos();
    }
  } catch (err) {
    mostrarMensaje("Error al agregar el elemento.", "danger");
  }
});

/* === EVENTO: Limpiar todo (click) === */
document.getElementById("btnLimpiarTodo").addEventListener("click", async () => {
  const elementos = await obtenerElementos();

  for (const elem of elementos) {
    await fetch(`/api/elementos/${elem.id}`, { method: "DELETE" });
  }

  mostrarMensaje("Todos los elementos fueron eliminados.", "warning");
  await cargarElementos();
});

/* === EVENTO: Actualiza estadística al cambiar tipo (change) === */
document.getElementById("tipoElemento").addEventListener("change", (e) => {
  document.getElementById("statUltimo").textContent = e.target.value;
});

/**
 * Carga los elementos desde el servidor y los renderiza.
 */
async function cargarElementos() {
  const elementos = await obtenerElementos();
  renderizarElementos(elementos, editarElemento, eliminarElemento);
}

/**
 * Obtiene los elementos desde la API interna del servidor.
 * @returns {Promise<Array>}
 */
async function obtenerElementos() {
  try {
    const resp = await fetch("/api/elementos");
    return await resp.json();
  } catch {
    return [];
  }
}

/**
 * Edita el contenido de un elemento en pantalla y en el servidor.
 * Permite cambiar el contenido via un prompt reemplazado por input.
 * @param {{ id: string, tipo: string, contenidoHtml: string }} elem
 */
function editarElemento(elem) {
  /* Reemplaza el contenido del elemento por un input inline */
  const itemDiv = document.getElementById(`item-${elem.id}`);
  const contenedorContenido = itemDiv.querySelector(".contenido-elemento");

  contenedorContenido.innerHTML = `
    <div class="input-group input-group-sm">
      <input type="text" class="form-control input-edicion"
        placeholder="Nuevo contenido..." value=""/>
      <button class="btn btn-warning btn-confirmar-edicion" data-id="${elem.id}" data-tipo="${elem.tipo}">
        ✔ Confirmar
      </button>
    </div>
  `;

  /* Confirma la edición al hacer click */
  itemDiv.querySelector(".btn-confirmar-edicion").addEventListener("click", async () => {
    const nuevoContenido = itemDiv.querySelector(".input-edicion").value.trim();
    if (!nuevoContenido) return;

    const nuevoHtml = generarHtml(elem.tipo, nuevoContenido);

    try {
      const resp = await fetch(`/api/elementos/${elem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: elem.tipo, contenidoHtml: nuevoHtml }),
      });
      const datos = await resp.json();
      if (datos.ok) {
        mostrarMensaje("Elemento editado correctamente.", "success");
        await cargarElementos();
      }
    } catch (err) {
      mostrarMensaje("Error al editar el elemento.", "danger");
    }
  });
}

/**
 * Elimina un elemento por ID del servidor y actualiza el DOM.
 * @param {string} id
 */
async function eliminarElemento(id) {
  try {
    const resp = await fetch(`/api/elementos/${id}`, { method: "DELETE" });
    const datos = await resp.json();
    if (datos.ok) {
      mostrarMensaje("Elemento eliminado.", "info");
      await cargarElementos();
    }
  } catch (err) {
    mostrarMensaje("Error al eliminar.", "danger");
  }
}