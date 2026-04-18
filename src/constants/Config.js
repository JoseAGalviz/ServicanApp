export const Config = {
  APP_NAME: 'Servican',
  IVA: 0.16,
  MONEDA_DEFAULT: 'USD',
  VALIDEZ_DEFAULT: 30,
  STORAGE_KEYS: {
    USER:          'servican_user',
    CLIENTES:      'servican_clientes',
    COTIZACIONES:  'servican_cotizaciones',
    COT_COUNTER:   'servican_cot_counter',
  },
  // Credenciales por defecto (cambiar antes de producción)
  DEFAULT_USER: {
    username: 'admin',
    password: 'servican2024',
    nombre:   'Administrador',
    rol:      'admin',
  },
  EMPRESA: {
    nombre:    'Servican C.A.',
    rif:       'J-XXXXXXXXX-X',
    telefono:  '+58 XXX XXX XXXX',
    email:     'ventas@servican.com',
    direccion: 'Caracas, Venezuela',
    slogan:    'Seguridad y Servicios Profesionales de CCTV',
  },
  ESTADOS_COTIZACION: ['borrador', 'enviada', 'aprobada', 'rechazada'],
};
