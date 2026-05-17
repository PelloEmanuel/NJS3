// dom.js — funciones reutilizables para el proyecto 6

export function leerFormulario() {
  const nombre = document.getElementById('inputNombre').value.trim();
  const email  = document.getElementById('inputEmail').value.trim();
  const edad   = document.getElementById('inputEdad').value.trim();
  const pais   = document.getElementById('selectPais').value;

  const generoEl = document.querySelector('input[name="genero"]:checked');
  const genero = generoEl ? generoEl.value : '';

  const intereses = Array.from(
    document.querySelectorAll('input[name="intereses"]:checked')
  ).map(el => el.value);

  return { nombre, email, edad, genero, intereses, pais };
}

// Dominios de email permitidos
const DOMINIOS_PERMITIDOS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
  'icloud.com', 'live.com', 'msn.com', 'protonmail.com',
  'zoho.com', 'mail.com', 'aol.com'
];

export function validarEmail(email) {
  if (!email) return 'El email es obligatorio.';

  // Debe tener exactamente un @
  const partes = email.split('@');
  if (partes.length !== 2) return 'El email no es válido.';

  const [usuario, dominio] = partes;
  if (!usuario || !dominio) return 'El email no es válido.';

  // El dominio debe terminar en .com (u otro TLD válido de al menos 2 letras, pero NO .co solo)
  // Aceptamos: .com, .net, .org, .edu, .io, .ar, .mx, etc — rechazamos .co a secas
  const tldRegex = /\.([a-zA-Z]{2,})$/;
  const tldMatch = dominio.match(tldRegex);
  if (!tldMatch) return 'El dominio del email no es válido.';

  const tld = tldMatch[1].toLowerCase();
  if (tld === 'co') return 'El email debe terminar en .com u otro dominio válido (no .co).';

  // El dominio debe ser uno de los permitidos
  const dominioLower = dominio.toLowerCase();
  if (!DOMINIOS_PERMITIDOS.includes(dominioLower)) {
    return `Solo se permiten emails de: ${DOMINIOS_PERMITIDOS.join(', ')}.`;
  }

  return null; // sin error
}

export function validarNombre(nombre) {
  if (!nombre) return 'El nombre es obligatorio.';
  if (nombre.length < 3) return 'El nombre debe tener al menos 3 caracteres.';

  // No se permiten números ni caracteres especiales (solo letras, espacios, tildes, ñ, guión)
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/;
  if (!nombreRegex.test(nombre)) return 'El nombre solo puede contener letras y espacios.';

  return null; // sin error
}

export function validarFormulario(datos) {
  const errores = [];
  const mensajes = {};

  const errorNombre = validarNombre(datos.nombre);
  if (errorNombre) {
    errores.push('nombre');
    mensajes.nombre = errorNombre;
  }

  const errorEmail = validarEmail(datos.email);
  if (errorEmail) {
    errores.push('email');
    mensajes.email = errorEmail;
  }

  if (!datos.edad || isNaN(datos.edad) || datos.edad < 1) {
    errores.push('edad');
    mensajes.edad = 'Ingresá una edad válida.';
  }

  if (!datos.pais) {
    errores.push('pais');
    mensajes.pais = 'Seleccioná un país.';
  }

  return { errores, mensajes };
}

export function marcarErrores(errores, mensajes = {}) {
  const map = {
    nombre: 'inputNombre',
    email:  'inputEmail',
    edad:   'inputEdad',
    pais:   'selectPais'
  };

  // Limpiar todo primero
  Object.values(map).forEach(id => {
    document.getElementById(id).classList.remove('error');
  });

  // Limpiar mensajes de error anteriores
  document.querySelectorAll('.field-error-msg').forEach(el => el.remove());

  // Marcar los campos con error y mostrar mensaje
  errores.forEach(campo => {
    const inputId = map[campo];
    if (!inputId) return;

    const input = document.getElementById(inputId);
    input.classList.add('error');

    if (mensajes[campo]) {
      const msgEl = document.createElement('span');
      msgEl.className = 'field-error-msg';
      msgEl.textContent = mensajes[campo];
      input.parentNode.appendChild(msgEl);
    }
  });
}

export function renderizarResultado(datos, contenedor) {
  contenedor.innerHTML = '';

  const filas = [
    { key: 'Nombre',    value: datos.nombre },
    { key: 'Email',     value: datos.email },
    { key: 'Edad',      value: `${datos.edad} años` },
    { key: 'Género',    value: datos.genero || '—' },
    { key: 'Intereses', value: datos.intereses, esTags: true },
    { key: 'País',      value: datos.pais },
  ];

  filas.forEach(fila => {
    const div = document.createElement('div');
    div.className = 'data-row';

    const keySpan = document.createElement('span');
    keySpan.className = 'data-key';
    keySpan.textContent = fila.key;

    const valSpan = document.createElement('span');
    valSpan.className = 'data-value';

    if (fila.esTags && Array.isArray(fila.value)) {
      if (fila.value.length === 0) {
        valSpan.textContent = '—';
      } else {
        fila.value.forEach(item => {
          const tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = item;
          valSpan.appendChild(tag);
        });
      }
    } else {
      valSpan.textContent = fila.value || '—';
    }

    div.appendChild(keySpan);
    div.appendChild(valSpan);
    contenedor.appendChild(div);
  });
}

export function limpiarFormulario() {
  document.getElementById('inputNombre').value = '';
  document.getElementById('inputEmail').value = '';
  document.getElementById('inputEdad').value = '';
  document.getElementById('selectPais').value = '';
  document.querySelectorAll('input[name="genero"]').forEach(el => el.checked = false);
  document.querySelectorAll('input[name="intereses"]').forEach(el => el.checked = false);
  ['inputNombre','inputEmail','inputEdad','selectPais'].forEach(id => {
    document.getElementById(id).classList.remove('error');
  });
  document.querySelectorAll('.field-error-msg').forEach(el => el.remove());
}
