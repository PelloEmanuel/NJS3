// dom.js — generadores de HTML con innerHTML

export function htmlParrafo(texto) {
  return `<p>${texto}</p>`;
}

export function htmlImagen(url, alt) {
  const src = url.trim() || `https://picsum.photos/seed/${Date.now()}/600/300`;
  return `
    <img src="${src}" alt="${alt || 'Imagen dinámica'}" />
    <p>${alt || 'Imagen dinámica'}</p>
  `;
}

export function htmlLista(titulo, items, tipo) {
  const tag = tipo === 'ol' ? 'ol' : 'ul';
  const itemsHtml = items.map(i => `<li>${i}</li>`).join('');
  return `
    <h4>${titulo || 'Lista'}</h4>
    <${tag}>${itemsHtml}</${tag}>
  `;
}

export function crearBloque(tipo, contenidoHtml) {
  const div = document.createElement('div');
  div.className = `inserted-block block-${tipo}`;
  div.dataset.type = tipo;
  div.innerHTML = contenidoHtml;
  return div;
}

export function actualizarContador(badge, canvas) {
  const n = canvas.querySelectorAll('.inserted-block').length;
  badge.textContent = `${n} elemento${n !== 1 ? 's' : ''}`;
}
