const zona = document.getElementById('zona');
const editor = document.getElementById('editor');
const toast = document.getElementById('toast');
const textoVacio = '<p class="vacio">Todavía no agregaste contenido. Elegí una opción del menú.</p>';

let tipoActual = '';
let imagenElegida = '';
let temporizador = null;

// Mensaje emergente hecho a mano (reemplaza al alert)
function avisar(texto, tipo) {
  toast.textContent = texto;
  toast.className = 'toast visible ' + (tipo || '');
  clearTimeout(temporizador);
  temporizador = setTimeout(() => toast.classList.remove('visible'), 3000);
}

// Evita que el texto escrito se interprete como HTML
function esc(texto) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function lineas(texto) {
  return texto.split('\n').map((linea) => linea.trim()).filter((linea) => linea !== '');
}

// Cada tipo define: sus campos y cómo se arma el HTML que se inserta
const tipos = {
  titulo: {
    nombre: 'Título',
    campos: [{ id: 'texto', etiqueta: 'Texto del título', tipo: 'input' }],
    crear: (v) => '<h2>' + esc(v.texto) + '</h2>'
  },
  parrafo: {
    nombre: 'Párrafo',
    campos: [{ id: 'texto', etiqueta: 'Texto del párrafo', tipo: 'textarea' }],
    crear: (v) => '<p>' + esc(v.texto) + '</p>'
  },
  lista: {
    nombre: 'Lista',
    campos: [{ id: 'items', etiqueta: 'Elementos de la lista (uno por línea)', tipo: 'textarea' }],
    crear: (v) => '<ul>' + lineas(v.items).map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul>'
  },
  tabla: {
    nombre: 'Tabla',
    campos: [{ id: 'filas', etiqueta: 'Filas (una por línea, columnas separadas por coma; la primera fila es el encabezado)', tipo: 'textarea' }],
    crear: (v) => {
      let html = '<table>';
      lineas(v.filas).forEach((fila, i) => {
        const celda = i === 0 ? 'th' : 'td';
        html += '<tr>' + fila.split(',').map((c) => '<' + celda + '>' + esc(c.trim()) + '</' + celda + '>').join('') + '</tr>';
      });
      return html + '</table>';
    }
  },
  tarjeta: {
    nombre: 'Tarjeta',
    campos: [
      { id: 'titulo', etiqueta: 'Título de la tarjeta', tipo: 'input' },
      { id: 'texto', etiqueta: 'Texto de la tarjeta', tipo: 'textarea' },
      { id: 'imagen', etiqueta: 'Imagen', tipo: 'imagen' }
    ],
    crear: (v) => '<div class="tarjeta"><h3>' + esc(v.titulo) + '</h3><img src="' + v.imagen +
      '" alt="' + esc(v.titulo) + '"><p>' + esc(v.texto) + '</p></div>'
  },
  boton: {
    nombre: 'Botón',
    campos: [
      { id: 'texto', etiqueta: 'Texto del botón', tipo: 'input' },
      { id: 'mensaje', etiqueta: 'Mensaje que se muestra al presionarlo', tipo: 'input' }
    ],
    crear: (v) => '<button class="boton-creado" data-mensaje="' + esc(v.mensaje) + '">' + esc(v.texto) + '</button>'
  }
};

function mostrarEditor(tipo) {
  tipoActual = tipo;
  imagenElegida = '';
  const definicion = tipos[tipo];

  let html = '<h3>Agregar ' + definicion.nombre.toLowerCase() + '</h3>';
  definicion.campos.forEach((campo) => {
    html += '<label for="campo-' + campo.id + '">' + campo.etiqueta + '</label>';
    if (campo.tipo === 'input') {
      html += '<input type="text" id="campo-' + campo.id + '">';
    } else if (campo.tipo === 'textarea') {
      html += '<textarea id="campo-' + campo.id + '" rows="4"></textarea>';
    } else {
      html += '<div id="zonaArrastre" class="zona-arrastre">' +
        '<p>Arrastrá una imagen sobre este recuadro</p><p>o</p>' +
        '<button type="button" id="btnElegirImagen" class="secundario">Elegir desde el explorador de archivos</button>' +
        '<input type="file" id="archivoImagen" accept="image/*" class="oculto">' +
        '<img id="vistaPrevia" class="oculto" alt="Vista previa"></div>';
    }
  });
  html += '<p id="errorEditor" class="error"></p>' +
    '<div class="acciones"><button id="btnConfirmar">Agregar a la página</button>' +
    '<button id="btnCancelar" class="secundario">Cancelar</button></div>';

  editor.innerHTML = html;
  editor.classList.remove('oculto');
  document.getElementById('btnConfirmar').addEventListener('click', confirmar);
  document.getElementById('btnCancelar').addEventListener('click', cerrarEditor);
  if (tipo === 'tarjeta') activarImagen();
}

function cerrarEditor() {
  editor.classList.add('oculto');
  editor.innerHTML = '';
  tipoActual = '';
}

function mostrarError(texto) {
  document.getElementById('errorEditor').textContent = texto;
}

// ---- Imagen: botón del explorador y arrastrar y soltar ----
function activarImagen() {
  const area = document.getElementById('zonaArrastre');
  const archivo = document.getElementById('archivoImagen');

  document.getElementById('btnElegirImagen').addEventListener('click', () => archivo.click());
  archivo.addEventListener('change', () => leerImagen(archivo.files[0]));
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('sobre'); });
  area.addEventListener('dragleave', () => area.classList.remove('sobre'));
  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('sobre');
    leerImagen(e.dataTransfer.files[0]);
  });
}

function leerImagen(archivo) {
  if (!archivo) return;
  if (!archivo.type.startsWith('image/')) {
    mostrarError('El archivo elegido no es una imagen.');
    return;
  }
  const lector = new FileReader();
  lector.onload = () => {
    imagenElegida = lector.result;
    const vista = document.getElementById('vistaPrevia');
    vista.src = imagenElegida;
    vista.classList.remove('oculto');
    mostrarError('');
  };
  lector.readAsDataURL(archivo);
}

// Evita que el navegador abra la imagen si se suelta fuera del recuadro
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => e.preventDefault());

// ---- Agregar el objeto a la página con innerHTML ----
function confirmar() {
  const definicion = tipos[tipoActual];
  const valores = {};

  for (const campo of definicion.campos) {
    if (campo.tipo === 'imagen') {
      if (imagenElegida === '') { mostrarError('Elegí o arrastrá una imagen.'); return; }
      valores.imagen = imagenElegida;
    } else {
      valores[campo.id] = document.getElementById('campo-' + campo.id).value.trim();
      if (valores[campo.id] === '') { mostrarError('Completá el campo: ' + campo.etiqueta + '.'); return; }
    }
  }

  if (zona.querySelector('.vacio')) zona.innerHTML = '';
  zona.innerHTML += '<div class="objeto">' + definicion.crear(valores) + '</div>';
  cerrarEditor();
  avisar(definicion.nombre + ' agregado correctamente.');
}

// Los botones creados con innerHTML se detectan con el evento del contenedor
zona.addEventListener('click', (e) => {
  if (e.target.classList.contains('boton-creado')) {
    avisar(e.target.dataset.mensaje);
  }
});

document.querySelectorAll('.btn-agregar').forEach((boton) => {
  boton.addEventListener('click', () => mostrarEditor(boton.dataset.tipo));
});

document.getElementById('btnLimpiar').addEventListener('click', () => {
  zona.innerHTML = textoVacio;
  avisar('Se eliminó todo el contenido.', 'error');
});

// ---- Modo claro / oscuro ----
const btnTema = document.getElementById('btnTema');

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  btnTema.textContent = tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro';
}

aplicarTema(localStorage.getItem('tema') || 'claro');

btnTema.addEventListener('click', () => {
  const actual = document.documentElement.getAttribute('data-tema');
  const nuevo = actual === 'oscuro' ? 'claro' : 'oscuro';
  localStorage.setItem('tema', nuevo);
  aplicarTema(nuevo);
});
