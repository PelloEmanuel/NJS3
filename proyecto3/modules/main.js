/**
 * Main proyecto3.
 * Gestiona conteo de hijos al pulsar el botón.
 */
import {
  mapaElementos,
  contarHijos,
  mostrarResultadoConteo,
  agregarHistorial,
  aplicarTema,
} from "./dom.js";

let modoOscuro = false;
let contadorHijosAgregados = 0;

/* === EVENTO: Modo oscuro (click) === */
document.getElementById("btnTema")?.addEventListener("click", () => {
  modoOscuro = !modoOscuro;
  aplicarTema(modoOscuro);
  const btn = document.getElementById("btnTema");
  btn.textContent = modoOscuro ? "☀️ Claro" : "🌙 Oscuro";
});

/* === EVENTO: Contar hijos al pulsar botón (click) === */
document.getElementById("btnContarHijos")?.addEventListener("click", () => {
  const selector = document.getElementById("selectorNodo").value;
  const obtenerElemento = mapaElementos[selector];

  if (!obtenerElemento) return;

  const elemento = obtenerElemento();
  const nombreLegible = document.getElementById("selectorNodo")
    .options[document.getElementById("selectorNodo").selectedIndex].text;

  const resultado = contarHijos(elemento);
  mostrarResultadoConteo(nombreLegible, resultado);
  agregarHistorial(`Inspeccionado: "${nombreLegible}" → ${resultado.total} hijo(s).`);
});

/* === EVENTO: Agregar hijo dinámico a la lista (click) === */
document.getElementById("btnAgregarHijo")?.addEventListener("click", () => {
  const lista = document.getElementById("listaComponentes");
  contadorHijosAgregados++;

  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-lg-4";
  col.innerHTML = `
    <div class="card tarjeta-componente text-center p-3 h-100 elemento-nuevo">
      <div class="fs-3 mb-2">⭐</div>
      <h6>Componente extra ${contadorHijosAgregados}</h6>
      <small class="text-muted">Agregado dinámicamente</small>
    </div>
  `;
  lista.appendChild(col);

  agregarHistorial(`Nuevo hijo agregado: "Componente extra ${contadorHijosAgregados}".`);
});

/* === EVENTO: Cambio de selector actualiza info (change) === */
document.getElementById("selectorNodo")?.addEventListener("change", (e) => {
  agregarHistorial(`Selector cambiado a: "${e.target.options[e.target.selectedIndex].text}".`);
});