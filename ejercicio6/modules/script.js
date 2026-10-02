const formulario = document.getElementById('formulario');
const mensajeForm = document.getElementById('mensajeForm');
const resultado = document.getElementById('resultado');
const selectPais = document.getElementById('pais');
const campoOtroPais = document.getElementById('campoOtroPais');
const inputOtroPais = document.getElementById('otroPais');

const correosRegistrados = [];
let cantidadRegistros = 0;

// Muestra el campo de texto solo si se eligió "Otro"
function actualizarPais() {
  campoOtroPais.classList.toggle('oculto', selectPais.value !== 'Otro');
}
selectPais.addEventListener('change', actualizarPais);

function leerDatos() {
  const generoElegido = document.querySelector('input[name="genero"]:checked');
  const interesesElegidos = document.querySelectorAll('input[name="intereses"]:checked');
  const pais = selectPais.value;
  return {
    nombre: document.getElementById('nombre').value.trim(),
    email: document.getElementById('email').value.trim().toLowerCase(),
    edad: parseInt(document.getElementById('edad').value),
    genero: generoElegido ? generoElegido.value : '',
    pais: pais === 'Otro' ? inputOtroPais.value.trim() : pais,
    paisElegido: pais,
    intereses: Array.from(interesesElegidos).map((c) => c.value),
    terminos: document.getElementById('terminos').checked
  };
}

// Devuelve un array con los errores encontrados
function validar(datos) {
  const lista = [];
  if (datos.nombre.length < 2) lista.push('El nombre debe tener al menos 2 caracteres.');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
    lista.push('El correo no es válido.');
  } else if (correosRegistrados.includes(datos.email)) {
    lista.push('Ese correo ya está registrado.');
  }

  if (isNaN(datos.edad)) {
    lista.push('Ingresá tu edad.');
  } else if (datos.edad < 10) {
    lista.push('Tenés que tener al menos 10 años para registrarte.');
  } else if (datos.edad > 120) {
    lista.push('La edad no puede superar los 120 años.');
  }

  if (datos.genero === '') lista.push('Elegí un género.');
  if (datos.paisElegido === '') {
    lista.push('Elegí un país o región.');
  } else if (datos.paisElegido === 'Otro' && datos.pais.length < 2) {
    lista.push('Escribí el nombre de tu país o región.');
  }
  if (!datos.terminos) lista.push('Tenés que aceptar los términos.');
  return lista;
}

function mostrarRegistro(datos) {
  cantidadRegistros++;
  if (cantidadRegistros === 1) resultado.innerHTML = '';

  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta';
  tarjeta.style.marginBottom = '1rem';

  const titulo = document.createElement('h3');
  titulo.textContent = 'Registro #' + cantidadRegistros;
  tarjeta.appendChild(titulo);

  const filas = [
    ['Nombre', datos.nombre],
    ['Correo', datos.email],
    ['Edad', datos.edad],
    ['Género', datos.genero],
    ['País o región', datos.pais],
    ['Intereses', datos.intereses.length > 0 ? datos.intereses.join(', ') : 'Ninguno']
  ];
  filas.forEach(([etiqueta, valor]) => {
    const linea = document.createElement('p');
    linea.textContent = etiqueta + ': ' + valor;
    tarjeta.appendChild(linea);
  });
  resultado.appendChild(tarjeta);
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = leerDatos();
  const lista = validar(datos);

  if (lista.length > 0) {
    mensajeForm.className = 'error';
    mensajeForm.innerHTML = lista.join('<br>');
    return;
  }

  correosRegistrados.push(datos.email);
  mostrarRegistro(datos);
  formulario.reset();
  actualizarPais();
  mensajeForm.className = 'ok';
  mensajeForm.textContent = 'Registro completado correctamente.';
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
