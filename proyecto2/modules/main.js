/**
 * Main del proyecto2.
 * Detecta la página activa y carga sus eventos específicos.
 */
import { registrarEvento, configurarBtnTema } from "./dom.js";

let modoOscuro = false;
configurarBtnTema(modoOscuro);

const paginaActual = window.location.pathname;

/* === Eventos según la página activa === */

if (paginaActual.includes("eventos-click")) {
  iniciarEventosClick();
} else if (paginaActual.includes("eventos-teclado")) {
  iniciarEventosTeclado();
} else if (paginaActual.includes("eventos-foco")) {
  iniciarEventosFoco();
} else if (paginaActual.includes("eventos-raton")) {
  iniciarEventosRaton();
} else if (paginaActual.includes("eventos-formulario")) {
  iniciarEventosFormulario();
}

/**
 * Eventos de clic: conteo, cambio de fondo y reinicio.
 */
function iniciarEventosClick() {
  let contadorClics = 0;
  const coloresFondo = ["#ffffff", "#f8d7da", "#d1ecf1", "#d4edda", "#fff3cd"];
  let indiceFondo = 0;

  document.getElementById("btnContar").addEventListener("click", () => {
    contadorClics++;
    document.querySelector("#textoContador strong").textContent = contadorClics;
    registrarEvento("listaEventosClick", `Clic número ${contadorClics} registrado.`, "primary");
  });

  document.getElementById("btnCambiarFondo").addEventListener("click", () => {
    indiceFondo = (indiceFondo + 1) % coloresFondo.length;
    const color = coloresFondo[indiceFondo];
    document.getElementById("zonaClick").style.backgroundColor = color;
    document.getElementById("textoFondo").textContent = `Fondo actual: ${color}`;
    registrarEvento("listaEventosClick", `Fondo cambiado a ${color}.`, "info");
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    contadorClics = 0;
    indiceFondo = 0;
    document.querySelector("#textoContador strong").textContent = 0;
    document.getElementById("zonaClick").style.backgroundColor = "";
    document.getElementById("textoFondo").textContent = "Fondo actual: blanco";
    registrarEvento("listaEventosClick", "Contador y fondo reiniciados.", "danger");
  });
}

/**
 * Eventos de teclado: keydown y input sobre un campo de texto.
 */
function iniciarEventosTeclado() {
  const campo = document.getElementById("campoTeclado");

  /* Captura cada tecla presionada */
  campo.addEventListener("keydown", (e) => {
    document.getElementById("ultimaTecla").textContent = e.key;
    registrarEvento("listaTeclas", `keydown → tecla: "${e.key}"`, "warning");
  });

  /* Actualiza texto acumulado en tiempo real */
  campo.addEventListener("input", (e) => {
    const valor = e.target.value || "—";
    document.getElementById("textoAcumulado").textContent = valor;
    registrarEvento("listaTeclas", `input → valor: "${valor}"`, "secondary");
  });
}

/**
 * Eventos de foco: focus y blur en dos campos.
 */
function iniciarEventosFoco() {
  const campos = [
    { id: "campo1Foco", ayuda: "ayuda1", nombre: "Nombre" },
    { id: "campo2Foco", ayuda: "ayuda2", nombre: "Email" },
  ];

  campos.forEach(({ id, ayuda, nombre }) => {
    const campo = document.getElementById(id);
    const ayudaEl = document.getElementById(ayuda);

    /* Al recibir foco: muestra ayuda */
    campo.addEventListener("focus", () => {
      ayudaEl.classList.remove("d-none");
      document.getElementById("estadoFoco").textContent = `Campo "${nombre}" activo`;
      registrarEvento("listaFoco", `focus → campo "${nombre}" activado.`, "primary");
    });

    /* Al perder foco: oculta ayuda */
    campo.addEventListener("blur", () => {
      ayudaEl.classList.add("d-none");
      document.getElementById("estadoFoco").textContent = "Ningún campo activo";
      registrarEvento("listaFoco", `blur → campo "${nombre}" desactivado.`, "secondary");
    });
  });
}

/**
 * Eventos de ratón: mousemove, mouseover, mouseout, dblclick.
 */
function iniciarEventosRaton() {
  const zonaRaton = document.getElementById("zonaRaton");
  const zonaOver = document.getElementById("zonaOver");
  const zonaDbl = document.getElementById("zonaDblClick");

  const coloresDbl = ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6", "#f39c12"];
  let indiceDbl = 0;

  /* Seguimiento de posición del cursor */
  zonaRaton.addEventListener("mousemove", (e) => {
    const rect = zonaRaton.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    document.getElementById("posX").textContent = x;
    document.getElementById("posY").textContent = y;
  });

  /* Cambio visual al entrar al área */
  zonaOver.addEventListener("mouseover", () => {
    zonaOver.classList.add("activa");
    registrarEvento("listaRaton", "mouseover → cursor entró a la zona.", "success");
  });

  /* Restaura al salir del área */
  zonaOver.addEventListener("mouseout", () => {
    zonaOver.classList.remove("activa");
    registrarEvento("listaRaton", "mouseout → cursor salió de la zona.", "secondary");
  });

  /* Doble clic cambia el color de fondo */
  zonaDbl.addEventListener("dblclick", () => {
    indiceDbl = (indiceDbl + 1) % coloresDbl.length;
    zonaDbl.style.backgroundColor = coloresDbl[indiceDbl];
    zonaDbl.style.color = "white";
    registrarEvento("listaRaton", `dblclick → color ${coloresDbl[indiceDbl]}.`, "warning");
  });
}

/**
 * Eventos de formulario: input, change, submit/click.
 */
function iniciarEventosFormulario() {
  const inputLive = document.getElementById("inputLive");
  const selectColor = document.getElementById("selectColor");

  /* Actualiza vista previa en tiempo real */
  inputLive.addEventListener("input", (e) => {
    document.getElementById("textoPrevia").textContent = e.target.value || "—";
    registrarEvento("listaFormulario", `input → "${e.target.value}"`, "primary");
  });

  /* Muestra el color seleccionado */
  selectColor.addEventListener("change", (e) => {
    const color = e.target.value;
    document.getElementById("muestraColor").style.backgroundColor = color;
    registrarEvento("listaFormulario", `change → color seleccionado: ${color}`, "info");
  });

  /* Simula envío del formulario */
  document.getElementById("btnEnviarForm").addEventListener("click", (e) => {
    e.preventDefault();
    const texto = inputLive.value.trim();
    const color = selectColor.value;
    const msgEl = document.getElementById("mensajeForm");

    if (!texto || !color) {
      msgEl.className = "mt-2 alert alert-danger";
      msgEl.textContent = "Completá el texto y seleccioná un color antes de enviar.";
      msgEl.classList.remove("d-none");
      registrarEvento("listaFormulario", "submit → validación fallida.", "danger");
      return;
    }

    msgEl.className = "mt-2 alert alert-success";
    msgEl.textContent = `Formulario enviado: "${texto}" con color ${color}.`;
    msgEl.classList.remove("d-none");
    registrarEvento("listaFormulario", `submit → enviado correctamente.`, "success");
  });
}