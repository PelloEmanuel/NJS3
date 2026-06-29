/**
 * Main proyecto6.
 * Orquesta el formulario con validaciones, CRUD y persistencia.
 */
import {
  renderizarRegistros,
  mostrarMensajeFormulario,
  aplicarTema,
} from "./dom.js";

import {
  validarNombre,
  validarEmail,
  validarEdad,
  validarGenero,
  validarPais,
  mostrarErrorCampo,
} from "./validaciones.js";

let modoOscuro = false;
let modalEdicion = null;

window.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("modalEditarRegistro");
  if (modalEl) modalEdicion = new bootstrap.Modal(modalEl);
  cargarRegistros();
});

/* === EVENTO: Modo oscuro (click) === */
document.getElementById("btnTema").addEventListener("click", () => {
  modoOscuro = !modoOscuro;
  aplicarTema(modoOscuro);
  document.getElementById("btnTema").textContent = modoOscuro ? "☀️ Claro" : "🌙 Oscuro";
});

/* === EVENTO: Validación en tiempo real al salir del campo (blur) === */
document.getElementById("inputNombre").addEventListener("blur", () => {
  const val = document.getElementById("inputNombre").value;
  mostrarErrorCampo("inputNombre", "errorNombre", validarNombre(val));
});

document.getElementById("inputEmail").addEventListener("blur", () => {
  const val = document.getElementById("inputEmail").value;
  mostrarErrorCampo("inputEmail", "errorEmail", validarEmail(val));
});

document.getElementById("inputEdad").addEventListener("blur", () => {
  const val = document.getElementById("inputEdad").value;
  mostrarErrorCampo("inputEdad", "errorEdad", validarEdad(val));
});

/* === EVENTO: Validación del select al cambiar (change) === */
document.getElementById("selectPais").addEventListener("change", () => {
  const val = document.getElementById("selectPais").value;
  mostrarErrorCampo("selectPais", "errorPais", validarPais(val));
});

/* === EVENTO: Registrar persona (click) === */
document.getElementById("btnRegistrar").addEventListener("click", (e) => {
  e.preventDefault();
  registrarPersona();
});

/* === EVENTO: Limpiar formulario (click) === */
document.getElementById("btnLimpiar").addEventListener("click", () => {
  limpiarFormulario();
});

/* === EVENTO: Guardar edición en modal (click) === */
document.getElementById("btnConfirmarEdicion").addEventListener("click", async () => {
  const id = document.getElementById("editRegistroId").value;
  const nombre = document.getElementById("editNombre").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const edad = document.getElementById("editEdad").value;
  const genero = document.getElementById("editGenero").value;
  const pais = document.getElementById("editPais").value;

  if (!nombre || !email || !edad) return;

  try {
    const resp = await fetch(`/api/registros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, edad, genero, pais }),
    });
    const datos = await resp.json();

    if (datos.ok) {
      modalEdicion.hide();
      mostrarMensajeFormulario("Registro actualizado correctamente.", "success");
      await cargarRegistros();
    }
  } catch (err) {
    mostrarMensajeFormulario("Error al actualizar.", "danger");
  }
});

/* === EVENTO: Descargar .txt (click) === */
document.getElementById("btnDescargarTxt").addEventListener("click", async () => {
  try {
    const resp = await fetch("/api/registros");
    const registros = await resp.json();

    if (!registros.length) {
      mostrarMensajeFormulario("No hay registros para descargar.", "warning");
      return;
    }

    /* Construye contenido legible del archivo */
    const contenido = registros.map((r, i) =>
      `=== Registro ${i + 1} ===\n` +
      `Nombre: ${r.nombre}\n` +
      `Email: ${r.email}\n` +
      `Edad: ${r.edad}\n` +
      `Género: ${r.genero}\n` +
      `País: ${r.pais}\n` +
      `Intereses: ${r.intereses?.join(", ") || "Ninguno"}\n`
    ).join("\n");

    /* Descarga automática usando Blob */
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "registros.txt";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);

    mostrarMensajeFormulario("Archivo .txt descargado correctamente.", "success");
  } catch (err) {
    mostrarMensajeFormulario("Error al descargar el archivo.", "danger");
  }
});

/**
 * Lee y valida el formulario, envía el registro al servidor.
 */
async function registrarPersona() {
  const nombre = document.getElementById("inputNombre").value.trim();
  const email = document.getElementById("inputEmail").value.trim();
  const edad = document.getElementById("inputEdad").value;
  const generoEl = document.querySelector('input[name="genero"]:checked');
  const genero = generoEl ? generoEl.value : "";
  const pais = document.getElementById("selectPais").value;

  const intereses = Array.from(
    document.querySelectorAll(".checkbox-interes:checked")
  ).map((cb) => cb.value);

  /* Valida cada campo y muestra errores individuales */
  const nombreOk = validarNombre(nombre);
  const emailOk = validarEmail(email);
  const edadOk = validarEdad(edad);
  const generoOk = validarGenero(genero);
  const paisOk = validarPais(pais);

  mostrarErrorCampo("inputNombre", "errorNombre", nombreOk);
  mostrarErrorCampo("inputEmail", "errorEmail", emailOk);
  mostrarErrorCampo("inputEdad", "errorEdad", edadOk);
  mostrarErrorCampo("selectPais", "errorPais", paisOk);

  /* Muestra error de género si aplica */
  const errorGeneroEl = document.getElementById("errorGenero");
  if (!generoOk) {
    errorGeneroEl.classList.remove("d-none");
  } else {
    errorGeneroEl.classList.add("d-none");
  }

  if (!nombreOk || !emailOk || !edadOk || !generoOk || !paisOk) {
    mostrarMensajeFormulario("Corregí los campos marcados antes de registrar.", "danger");
    return;
  }

  const nuevoRegistro = {
    id: `reg-${Date.now()}`,
    nombre,
    email,
    edad,
    genero,
    pais,
    intereses,
    fecha: new Date().toLocaleDateString("es-AR"),
  };

  try {
    const resp = await fetch("/api/registros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoRegistro),
    });
    const datos = await resp.json();

    if (datos.ok) {
      mostrarMensajeFormulario(`Persona "${nombre}" registrada correctamente.`, "success");
      limpiarFormulario();
      await cargarRegistros();
    }
  } catch (err) {
    mostrarMensajeFormulario("Error al registrar.", "danger");
  }
}

/**
 * Carga todos los registros y los renderiza.
 */
async function cargarRegistros() {
  try {
    const resp = await fetch("/api/registros");
    const registros = await resp.json();
    renderizarRegistros(registros, abrirModalEdicion, eliminarRegistro);
  } catch (err) {
    console.error("Error al cargar registros:", err);
  }
}

/**
 * Abre el modal de edición precargado con los datos del registro.
 * @param {Object} reg
 */
function abrirModalEdicion(reg) {
  document.getElementById("editRegistroId").value = reg.id;
  document.getElementById("editNombre").value = reg.nombre;
  document.getElementById("editEmail").value = reg.email;
  document.getElementById("editEdad").value = reg.edad;
  document.getElementById("editGenero").value = reg.genero;
  document.getElementById("editPais").value = reg.pais;
  modalEdicion.show();
}

/**
 * Elimina un registro por ID y actualiza la lista.
 * @param {string} id
 */
async function eliminarRegistro(id) {
  try {
    const resp = await fetch(`/api/registros/${id}`, { method: "DELETE" });
    const datos = await resp.json();
    if (datos.ok) {
      mostrarMensajeFormulario("Registro eliminado.", "info");
      await cargarRegistros();
    }
  } catch (err) {
    mostrarMensajeFormulario("Error al eliminar.", "danger");
  }
}

/**
 * Limpia todos los campos del formulario y quita errores visuales.
 */
function limpiarFormulario() {
  document.getElementById("inputNombre").value = "";
  document.getElementById("inputEmail").value = "";
  document.getElementById("inputEdad").value = "";
  document.querySelectorAll('input[name="genero"]').forEach((r) => (r.checked = false));
  document.getElementById("selectPais").value = "";
  document.querySelectorAll(".checkbox-interes").forEach((c) => (c.checked = false));

  ["inputNombre", "inputEmail", "inputEdad", "selectPais"].forEach((id) => {
    document.getElementById(id)?.classList.remove("input-invalido");
  });
  ["errorNombre", "errorEmail", "errorEdad", "errorGenero", "errorPais"].forEach((id) => {
    document.getElementById(id)?.classList.add("d-none");
  });

  document.getElementById("mensajeFormulario").classList.add("d-none");
}