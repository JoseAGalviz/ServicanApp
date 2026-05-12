import { getEmpresa } from '../services/storage';
import { printAndSharePdf } from './pdfUtils';
import { STATUS_COLOR, STATUS_LABEL, currencySymbol, fmt, fmtDate } from './cotizacionHelpers';

const MS_PER_DAY = 86400 * 1000;

export const generarPdfCotizacion = async (cotizacion, cliente) => {
  const emp = await getEmpresa();
  const symbol = currencySymbol(cotizacion.moneda);
  const moneda = cotizacion.moneda || 'USD';

  const itemsRows = (cotizacion.items || []).map((item, i) => `
    <tr style="background:${i % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}">
      <td style="padding:8px 10px;text-align:center;color:#64748B;font-size:12px">${i + 1}</td>
      <td style="padding:8px 10px;font-size:13px">${item.descripcion}</td>
      <td style="padding:8px 10px;text-align:center;font-size:13px">${item.cantidad}</td>
      <td style="padding:8px 10px;text-align:right;font-size:13px">${symbol} ${fmt(item.precioUnitario)}</td>
      <td style="padding:8px 10px;text-align:right;font-weight:600;font-size:13px">${symbol} ${fmt(item.total)}</td>
    </tr>
  `).join('');

  const descuentoMonto = cotizacion.subtotal * ((cotizacion.descuento || 0) / 100);

  const validezDate = cotizacion.fecha
    ? new Date(new Date(cotizacion.fecha).getTime() + (cotizacion.validezDias || 30) * MS_PER_DAY)
    : null;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color:#1A1F36; background:#fff; font-size:13px; }
  .page { max-width:800px; margin:0 auto; padding:40px; }

  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
  .company-block h1 { font-size:24px; font-weight:800; color:#1B3A6B; letter-spacing:-0.5px; }
  .company-block p { color:#64748B; font-size:12px; line-height:1.7; margin-top:6px; }
  .doc-block { text-align:right; }
  .doc-title { font-size:20px; font-weight:700; color:#1B3A6B; }
  .doc-num { font-size:16px; font-weight:600; color:#E5A623; margin-top:4px; }
  .doc-meta { font-size:11px; color:#64748B; margin-top:6px; line-height:1.6; }
  .status-badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700; color:#fff; margin-top:8px; background:${STATUS_COLOR[cotizacion.estado] || '#94A3B8'}; text-transform:uppercase; letter-spacing:0.5px; }

  .divider { height:3px; background:linear-gradient(to right,#1B3A6B,#E5A623); border-radius:2px; margin-bottom:24px; }

  .parties { display:flex; gap:20px; margin-bottom:24px; }
  .party-box { flex:1; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:14px; }
  .party-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#1B3A6B; margin-bottom:6px; }
  .party-name { font-size:15px; font-weight:700; color:#1A1F36; margin-bottom:4px; }
  .party-info { font-size:12px; color:#64748B; line-height:1.6; }

  .section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#1B3A6B; margin-bottom:10px; }

  table { width:100%; border-collapse:collapse; margin-bottom:20px; }
  thead { background:#1B3A6B; }
  thead th { color:#fff; padding:10px; font-size:11px; font-weight:600; text-transform:uppercase; }
  thead th:first-child, thead th:nth-child(3) { text-align:center; }
  thead th:nth-child(4), thead th:last-child { text-align:right; }
  tbody tr { border-bottom:1px solid #E2E8F0; }

  .totals-section { display:flex; justify-content:flex-end; margin-bottom:24px; }
  .totals-box { width:280px; }
  .totals-row { display:flex; justify-content:space-between; padding:6px 0; font-size:13px; border-bottom:1px solid #E2E8F0; }
  .total-final { display:flex; justify-content:space-between; background:#1B3A6B; color:#fff; padding:10px 12px; border-radius:8px; font-size:16px; font-weight:700; margin-top:8px; }

  .notes-box { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:14px; margin-bottom:24px; }
  .notes-box p { font-size:12px; color:#64748B; line-height:1.6; }

  .terms ul { padding-left:16px; color:#64748B; font-size:11px; line-height:1.8; margin-bottom:28px; }

  .signatures { display:flex; gap:40px; margin-top:32px; }
  .sig-block { flex:1; text-align:center; }
  .sig-line { border-top:1px solid #CBD5E1; padding-top:8px; font-size:11px; color:#64748B; margin-top:48px; }

  .footer { text-align:center; margin-top:28px; padding-top:14px; border-top:1px solid #E2E8F0; font-size:10px; color:#94A3B8; }
  .footer strong { color:#1B3A6B; }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="company-block">
      <h1>${emp.nombre}</h1>
      <p>
        ${emp.slogan ? emp.slogan + '<br/>' : ''}
        ${emp.rif ? 'RIF: ' + emp.rif + '<br/>' : ''}
        ${emp.telefono ? emp.telefono + '<br/>' : ''}
        ${emp.email ? emp.email + '<br/>' : ''}
        ${emp.direccion || ''}
      </p>
    </div>
    <div class="doc-block">
      <div class="doc-title">COTIZACIÓN</div>
      <div class="doc-num">${cotizacion.numero}</div>
      <div class="doc-meta">
        Fecha: ${fmtDate(cotizacion.fecha)}<br/>
        ${validezDate ? 'Válida hasta: ' + fmtDate(validezDate.toISOString()) : ''}
      </div>
      <div class="status-badge">${STATUS_LABEL[cotizacion.estado] || cotizacion.estado}</div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="parties">
    <div class="party-box">
      <div class="party-label">Empresa Emisora</div>
      <div class="party-name">${emp.nombre}</div>
      <div class="party-info">
        ${emp.rif ? 'RIF: ' + emp.rif + '<br/>' : ''}
        ${emp.telefono ? emp.telefono + '<br/>' : ''}
        ${emp.email || ''}
      </div>
    </div>
    <div class="party-box">
      <div class="party-label">Cliente</div>
      <div class="party-name">${cliente.nombre}</div>
      <div class="party-info">
        ${cliente.empresa ? 'Empresa: ' + cliente.empresa + '<br/>' : ''}
        ${cliente.rif ? 'RIF: ' + cliente.rif + '<br/>' : ''}
        ${cliente.telefono ? 'Tel: ' + cliente.telefono + '<br/>' : ''}
        ${cliente.email ? cliente.email + '<br/>' : ''}
        ${cliente.direccion || ''}
      </div>
    </div>
  </div>

  <div class="section-title">Descripción de Servicios / Productos</div>
  <table>
    <thead>
      <tr><th>#</th><th>Descripción</th><th>Cant.</th><th>P. Unitario</th><th>Total</th></tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div class="totals-section">
    <div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span>${symbol} ${fmt(cotizacion.subtotal)}</span></div>
      ${cotizacion.descuento > 0 ? `<div class="totals-row"><span>Descuento (${cotizacion.descuento}%)</span><span>- ${symbol} ${fmt(descuentoMonto)}</span></div>` : ''}
      <div class="total-final"><span>TOTAL ${moneda}</span><span>${symbol} ${fmt(cotizacion.total)}</span></div>
    </div>
  </div>

  ${cotizacion.notas ? `<div class="notes-box"><div class="section-title" style="margin-bottom:6px">Notas</div><p>${cotizacion.notas}</p></div>` : ''}

  <div class="terms">
    <div class="section-title">Términos y Condiciones</div>
    <ul>
      <li>Esta cotización tiene validez de ${cotizacion.validezDias || 30} días a partir de la fecha de emisión.</li>
      <li>Precios expresados en ${moneda}.</li>
    </ul>
  </div>

  <div class="signatures">
    <div class="sig-block"><div class="sig-line">Autorizado por<br/><strong>${emp.nombre}</strong></div></div>
    <div class="sig-block"><div class="sig-line">Aceptado por<br/><strong>${cliente.nombre}</strong></div></div>
  </div>

  <div class="footer">
    <strong>${emp.nombre}</strong>${emp.slogan ? ' · ' + emp.slogan : ''}<br/>
    ${[emp.telefono, emp.email, emp.direccion].filter(Boolean).join(' · ')}
  </div>

</div>
</body>
</html>`;

  await printAndSharePdf(html, `Cotizacion-${cotizacion.numero}`);
};

export const generarPdfRecibo = async (cotizacion, cliente) => {
  const emp = await getEmpresa();
  const symbol = currencySymbol(cotizacion.moneda);
  const pago = cotizacion.pago || {};
  const symbolPago = currencySymbol(pago.monedaPago || cotizacion.moneda);
  const monedaPago = pago.monedaPago || cotizacion.moneda;
  const descuentoMonto = cotizacion.subtotal * ((cotizacion.descuento || 0) / 100);

  const itemsRows = (cotizacion.items || []).map((item, i) => `
    <tr style="background:${i % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}">
      <td style="padding:8px 10px;text-align:center;color:#64748B;font-size:12px">${i + 1}</td>
      <td style="padding:8px 10px;font-size:13px">${item.descripcion}</td>
      <td style="padding:8px 10px;text-align:center;font-size:13px">${item.cantidad}</td>
      <td style="padding:8px 10px;text-align:right;font-size:13px">${symbol} ${fmt(item.precioUnitario)}</td>
      <td style="padding:8px 10px;text-align:right;font-weight:600;font-size:13px">${symbol} ${fmt(item.total)}</td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color:#1A1F36; background:#fff; font-size:13px; }
  .page { max-width:800px; margin:0 auto; padding:40px; }

  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
  .company-block h1 { font-size:24px; font-weight:800; color:#1B3A6B; letter-spacing:-0.5px; }
  .company-block p { color:#64748B; font-size:12px; line-height:1.7; margin-top:6px; }
  .doc-block { text-align:right; }
  .doc-title { font-size:20px; font-weight:700; color:#047857; }
  .doc-num { font-size:16px; font-weight:600; color:#E5A623; margin-top:4px; }
  .doc-meta { font-size:11px; color:#64748B; margin-top:6px; line-height:1.6; }
  .paid-badge { display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; color:#fff; margin-top:8px; background:#047857; text-transform:uppercase; letter-spacing:0.5px; }

  .divider { height:3px; background:linear-gradient(to right,#047857,#E5A623); border-radius:2px; margin-bottom:24px; }

  .parties { display:flex; gap:20px; margin-bottom:24px; }
  .party-box { flex:1; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:14px; }
  .party-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#1B3A6B; margin-bottom:6px; }
  .party-name { font-size:15px; font-weight:700; color:#1A1F36; margin-bottom:4px; }
  .party-info { font-size:12px; color:#64748B; line-height:1.6; }

  .section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#1B3A6B; margin-bottom:10px; }

  table { width:100%; border-collapse:collapse; margin-bottom:20px; }
  thead { background:#047857; }
  thead th { color:#fff; padding:10px; font-size:11px; font-weight:600; text-transform:uppercase; }
  thead th:first-child, thead th:nth-child(3) { text-align:center; }
  thead th:nth-child(4), thead th:last-child { text-align:right; }
  tbody tr { border-bottom:1px solid #E2E8F0; }

  .totals-section { display:flex; justify-content:flex-end; margin-bottom:24px; }
  .totals-box { width:280px; }
  .totals-row { display:flex; justify-content:space-between; padding:6px 0; font-size:13px; border-bottom:1px solid #E2E8F0; }
  .total-final { display:flex; justify-content:space-between; background:#1B3A6B; color:#fff; padding:10px 12px; border-radius:8px; font-size:16px; font-weight:700; margin-top:8px; }

  .pago-box { background:#ECFDF5; border:1.5px solid #10B981; border-radius:10px; padding:16px; margin-bottom:24px; }
  .pago-title { font-size:11px; font-weight:700; text-transform:uppercase; color:#047857; letter-spacing:0.5px; margin-bottom:10px; }
  .pago-row { display:flex; justify-content:space-between; padding:5px 0; font-size:13px; border-bottom:1px solid #BBF7D0; }
  .pago-row:last-child { border-bottom:none; }
  .pago-label { color:#047857; font-weight:600; }
  .pago-valor { color:#1A1F36; }
  .pago-total { background:#047857; color:#fff; padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; font-size:16px; font-weight:700; margin-top:10px; }

  .confirm-box { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:14px; margin-bottom:24px; font-size:12px; color:#64748B; line-height:1.7; }

  .signatures { display:flex; gap:40px; margin-top:32px; }
  .sig-block { flex:1; text-align:center; }
  .sig-line { border-top:1px solid #CBD5E1; padding-top:8px; font-size:11px; color:#64748B; margin-top:48px; }

  .footer { text-align:center; margin-top:28px; padding-top:14px; border-top:1px solid #E2E8F0; font-size:10px; color:#94A3B8; }
  .footer strong { color:#1B3A6B; }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="company-block">
      <h1>${emp.nombre}</h1>
      <p>
        ${emp.slogan ? emp.slogan + '<br/>' : ''}
        ${emp.rif ? 'RIF: ' + emp.rif + '<br/>' : ''}
        ${emp.telefono ? emp.telefono + '<br/>' : ''}
        ${emp.email ? emp.email + '<br/>' : ''}
        ${emp.direccion || ''}
      </p>
    </div>
    <div class="doc-block">
      <div class="doc-title">RECIBO DE PAGO</div>
      <div class="doc-num">Ref. ${cotizacion.numero}</div>
      <div class="doc-meta">
        Fecha de pago: ${fmtDate(pago.fechaPago || new Date().toISOString())}<br/>
        Emitido: ${fmtDate(new Date().toISOString())}
      </div>
      <div class="paid-badge">&#10003; Pagado</div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="parties">
    <div class="party-box">
      <div class="party-label">Empresa Emisora</div>
      <div class="party-name">${emp.nombre}</div>
      <div class="party-info">
        ${emp.rif ? 'RIF: ' + emp.rif + '<br/>' : ''}
        ${emp.telefono ? emp.telefono + '<br/>' : ''}
        ${emp.email || ''}
      </div>
    </div>
    <div class="party-box">
      <div class="party-label">Cliente</div>
      <div class="party-name">${cliente.nombre}</div>
      <div class="party-info">
        ${cliente.empresa ? 'Empresa: ' + cliente.empresa + '<br/>' : ''}
        ${cliente.rif ? 'RIF: ' + cliente.rif + '<br/>' : ''}
        ${cliente.telefono ? 'Tel: ' + cliente.telefono + '<br/>' : ''}
        ${cliente.email ? cliente.email + '<br/>' : ''}
        ${cliente.direccion || ''}
      </div>
    </div>
  </div>

  <div class="section-title">Servicios / Productos Cancelados</div>
  <table>
    <thead>
      <tr><th>#</th><th>Descripción</th><th>Cant.</th><th>P. Unitario</th><th>Total</th></tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div class="totals-section">
    <div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span>${symbol} ${fmt(cotizacion.subtotal)}</span></div>
      ${cotizacion.descuento > 0 ? `<div class="totals-row"><span>Descuento (${cotizacion.descuento}%)</span><span>- ${symbol} ${fmt(descuentoMonto)}</span></div>` : ''}
      <div class="total-final"><span>TOTAL ${cotizacion.moneda}</span><span>${symbol} ${fmt(cotizacion.total)}</span></div>
    </div>
  </div>

  <div class="pago-box">
    <div class="pago-title">Detalle del Pago Recibido</div>
    <div class="pago-row"><span class="pago-label">Moneda de Pago</span><span class="pago-valor">${monedaPago}</span></div>
    <div class="pago-row"><span class="pago-label">Fecha de Pago</span><span class="pago-valor">${fmtDate(pago.fechaPago || new Date().toISOString())}</span></div>
    ${pago.observacionPago ? `<div class="pago-row"><span class="pago-label">Observación</span><span class="pago-valor">${pago.observacionPago}</span></div>` : ''}
    <div class="pago-total"><span>MONTO CANCELADO</span><span>${symbolPago} ${fmt(pago.montoPago != null ? pago.montoPago : cotizacion.total)}</span></div>
  </div>

  <div class="confirm-box">
    Por medio del presente recibo, <strong>${emp.nombre}</strong> confirma haber recibido el pago
    correspondiente a los servicios descritos, por un monto de
    <strong>${symbolPago} ${fmt(pago.montoPago != null ? pago.montoPago : cotizacion.total)} ${monedaPago}</strong>,
    cancelado por <strong>${cliente.nombre}</strong> en fecha
    <strong>${fmtDate(pago.fechaPago || new Date().toISOString())}</strong>.
    Ref. cotización <strong>${cotizacion.numero}</strong>.
  </div>

  <div class="signatures">
    <div class="sig-block"><div class="sig-line">Firma y Sello<br/><strong>${emp.nombre}</strong></div></div>
    <div class="sig-block"><div class="sig-line">Recibido por<br/><strong>${cliente.nombre}</strong></div></div>
  </div>

  <div class="footer">
    <strong>${emp.nombre}</strong>${emp.slogan ? ' · ' + emp.slogan : ''}<br/>
    ${[emp.telefono, emp.email, emp.direccion].filter(Boolean).join(' · ')}
  </div>

</div>
</body>
</html>`;

  await printAndSharePdf(html, `Recibo-${cotizacion.numero}`);
};
