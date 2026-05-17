// dom.js — funciones reutilizables para proyecto 4

export function crearTarjetaEnlace(link, index) {
  const div = document.createElement('div');
  div.className = 'link-card';
  div.dataset.id = link.id;
  div.innerHTML = `
    <span class="link-num">${index + 1}</span>
    <span class="link-name">${link.nombre}</span>
    <span class="link-href">${link.href}</span>
    <span class="link-badge original">original</span>
  `;
  return div;
}

export function actualizarTarjeta(card, nuevoHref) {
  card.querySelector('.link-href').textContent = nuevoHref;
  card.querySelector('.link-badge').textContent = 'modificado';
  card.querySelector('.link-badge').classList.remove('original');
  card.classList.add('modified');
}

export function crearEntradaLog(nombre, viejo, nuevo) {
  const div = document.createElement('div');
  div.className = 'log-entry';
  div.innerHTML = `
    <span class="log-link-name">${nombre}</span>
    <span class="log-old" title="${viejo}">${viejo}</span>
    <span class="log-new" title="${nuevo}">${nuevo}</span>
  `;
  return div;
}

export function poblarSelect(select, links) {
  select.innerHTML = '';
  links.forEach(link => {
    const opt = document.createElement('option');
    opt.value = link.id;
    opt.textContent = link.nombre;
    select.appendChild(opt);
  });
}
