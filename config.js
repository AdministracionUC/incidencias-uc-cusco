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
