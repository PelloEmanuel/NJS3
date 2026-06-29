/**
 * Main proyecto4.
 * Orquesta CRUD de nodos <a> con persistencia en el servidor.
 */
import {
  renderizarNodos,
  registrarCambio,
  mostrarMensajeCrear,
  aplicarTema,
} from "./dom.js";

let modoOscuro = false;
let modalEdicion = null;

/* Inicializa el modal de Bootstrap */
window.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("modalEdicion");
  if (modalEl) {
    modalEdicion = new bootstrap.Modal(modalEl);
  }
  cargarNodos();
});

/* === EVENTO: Modo oscuro (click) === */
document.getElementById("btnTema").addEventListener("click", () => {
  modoOscuro = !modoOscuro;
  aplicarTema(modoOscuro);
  document.getElementById("btnTema").textContent = modoOscuro ? "☀️ Claro" : "🌙 Oscuro";
});

/* === EVENTO: Crear nodo (click) === */
document.getElementById("btnCrearNodo").addEventListener("click", async () => {
  const etiqueta = document.getElementById("inputEtiqueta").value.trim();
  const href = document.getElementById("inputHref").value.trim();

  if (!etiqueta || !href) {
    mostrarMensajeCrear("Completá la etiqueta y la URL.", "danger");
    return;
  }

  /* Genera ID único con timestamp */
  const nuevoId = `nodo-${Date.now()}`;

  try {
    const resp = await fetch("/api/nodos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: nuevoId, etiqueta, href }),
    });
    const datos = await resp.json();

    if (datos.ok) {
      mostrarMensajeCrear(`Enlace "${etiqueta}" creado.`, "success");
      registrarCambio(`CREAR → etiqueta: "${etiqueta}" | href: "${href}"`, "success");
      document.getElementById("inputEtiqueta").value = "";
      document.getElementById("inputHref").value = "";
      await cargarNodos();
    }
  } catch (err) {
    mostrarMensajeCrear("Error al crear el nodo.", "danger");
  }
});

/* === EVENTO: Guardar edición (click en modal) === */
document.getElementById("btnGuardarEdicion").addEventListener("click", async () => {
  const id = document.getElementById("editId").value;
  const etiqueta = document.getElementById("editEtiqueta").value.trim();
  const href = document.getElementById("editHref").value.trim();

  if (!etiqueta || !href) return;

  try {
    const resp = await fetch(`/api/nodos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etiqueta, href }),
    });
    const datos = await resp.json();

    if (datos.ok) {
      registrarCambio(`EDITAR → id: "${id}" | nueva etiqueta: "${etiqueta}" | nuevo href: "${href}"`, "warning");
      modalEdicion.hide();
      await cargarNodos();
    }
  } catch (err) {
    console.error("Error al editar:", err);
  }
});

/**
 * Carga los nodos del servidor y los renderiza.
 */
async function cargarNodos() {
  try {
    const resp = await fetch("/api/nodos");
    const nodos = await resp.json();
    renderizarNodos(nodos, abrirModalEdicion, eliminarNodo);
  } catch (err) {
    console.error("Error al cargar nodos:", err);
  }
}

/**
 * Abre el modal precargado con los datos del nodo a editar.
 * @param {{ id: string, etiqueta: string, href: string }} nodo
 */
function abrirModalEdicion(nodo) {
  document.getElementById("editId").value = nodo.id;
  document.getElementById("editEtiqueta").value = nodo.etiqueta;
  document.getElementById("editHref").value = nodo.href;

  registrarCambio(`EDITAR (abrió modal) → id: "${nodo.id}"`, "info");
  modalEdicion.show();
}

/**
 * Elimina un nodo por su ID.
 * Actualiza archivo .txt y DOM.
 * @param {string} id
 */
async function eliminarNodo(id) {
  try {
    const resp = await fetch(`/api/nodos/${id}`, { method: "DELETE" });
    const datos = await resp.json();

    if (datos.ok) {
      registrarCambio(`ELIMINAR → id: "${id}"`, "danger");
      await cargarNodos();
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  }
}