import Theme from '../constants/Theme';

export const STATUS_COLOR = {
  borrador:  Theme.colors.statusBorrador,
  enviada:   Theme.colors.statusEnviada,
  aprobada:  Theme.colors.statusAprobada,
  rechazada: Theme.colors.statusRechazada,
  pagada:    Theme.colors.successDark,
};

export const STATUS_LABEL = {
  borrador:  'Borrador',
  enviada:   'Enviada',
  aprobada:  'Aprobada',
  rechazada: 'Rechazada',
  pagada:    'Pagada',
};

export const currencySymbol = (moneda) => {
  if (moneda === 'USD') return '$';
  if (moneda === 'COP') return 'Col$';
  return 'Bs.';
};

export const fmt = (n) =>
  Number(n || 0).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  : '';
