// CONFIGURACIÓN DEL SISTEMA
// Pega aquí la URL de tu Apps Script Web App (termina en /exec)
// y el mismo TOKEN que pusiste en Codigo.gs

const GAS_URL = 'https://script.google.com/macros/s/AKfycby_dXB8L5oysmbQqwKRxAnnLvQuf9necPQV181linZYQEyaRfqb__TQJcVYyA6cI2vxZQ/exec';
// IMPORTANTE: este valor debe ser IDÉNTICO al TOKEN que pusiste en Codigo.gs (paso 1 del README)
const TOKEN = 'UCC-2026-xK9pL3'; // <-- cámbialo por el mismo que definiste en Apps Script

// Ayuda para hacer GET con parámetros
async function gasGet(action, params) {
  params = params || {};
  const query = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${GAS_URL}?${query}`);
  return res.json();
}

// Ayuda para hacer POST (registrar incidencia o verificación)
async function gasPost(body) {
  body.token = TOKEN;
  const res = await fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  return res.json();
}

// ---------------------------------------------------------------
// BUSCADOR DE PERSONAL (autocompletado por nombre, apellido o DNI)
// ---------------------------------------------------------------
// opciones:
//   inputEl, listEl, hiddenEl: elementos del DOM
//   datos: array de personal [{nombre, dni, area, turno}]
//   onSeleccionar(persona): se ejecuta al elegir un resultado
//   onLimpiar(): se ejecuta cuando el usuario borra el texto (opcional)
function crearBuscadorPersonal({ inputEl, listEl, hiddenEl, datos, onSeleccionar, onLimpiar }) {

  function coincide(persona, q) {
    const nombre = (persona.nombre || '').toLowerCase();
    const dni = String(persona.dni || '').toLowerCase();
    return nombre.includes(q) || dni.includes(q);
  }

  function render(items) {
    if (!items.length) {
      listEl.innerHTML = '<div class="autocomplete-vacio">Sin coincidencias</div>';
      listEl.style.display = 'block';
      return;
    }
    listEl.innerHTML = items.slice(0, 8).map((p, idx) => `
      <div class="autocomplete-item" data-idx="${idx}">
        <div class="autocomplete-nombre">${p.nombre}</div>
        <div class="autocomplete-sub">${p.area || ''}${p.dni ? ' · DNI ' + p.dni : ''}</div>
      </div>
    `).join('');
    listEl.style.display = 'block';

    listEl.querySelectorAll('.autocomplete-item').forEach((el, idx) => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const persona = items[idx];
        inputEl.value = persona.nombre;
        hiddenEl.value = persona.nombre;
        listEl.style.display = 'none';
        onSeleccionar(persona);
      });
    });
  }

  inputEl.addEventListener('input', () => {
    const q = inputEl.value.trim().toLowerCase();
    hiddenEl.value = '';
    if (!q) {
      listEl.style.display = 'none';
      if (onLimpiar) onLimpiar();
      return;
    }
    render(datos.filter(p => coincide(p, q)));
  });

  inputEl.addEventListener('focus', () => {
    if (inputEl.value.trim()) inputEl.dispatchEvent(new Event('input'));
  });

  document.addEventListener('click', (e) => {
    if (e.target !== inputEl && !listEl.contains(e.target)) {
      listEl.style.display = 'none';
    }
  });
}
