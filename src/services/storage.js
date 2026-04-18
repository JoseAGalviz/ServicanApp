import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/Config';

const KEYS = {
  ...Config.STORAGE_KEYS,
  EMPRESA: 'servican_empresa',
};

// ─── Empresa ──────────────────────────────────────────────────────────────────

export const getEmpresa = async () => {
  const raw = await AsyncStorage.getItem(KEYS.EMPRESA);
  return raw ? JSON.parse(raw) : { ...Config.EMPRESA };
};

export const saveEmpresa = async (empresa) => {
  await AsyncStorage.setItem(KEYS.EMPRESA, JSON.stringify(empresa));
};

// ─── Clientes ────────────────────────────────────────────────────────────────

export const getClientes = async () => {
  const raw = await AsyncStorage.getItem(KEYS.CLIENTES);
  return raw ? JSON.parse(raw) : [];
};

export const saveCliente = async (cliente) => {
  const list = await getClientes();
  if (cliente.id) {
    const idx = list.findIndex(c => c.id === cliente.id);
    if (idx >= 0) list[idx] = cliente;
    else list.push(cliente);
  } else {
    cliente.id = Date.now().toString();
    cliente.fechaCreacion = new Date().toISOString();
    list.push(cliente);
  }
  await AsyncStorage.setItem(KEYS.CLIENTES, JSON.stringify(list));
  return cliente;
};

export const deleteCliente = async (id) => {
  const list = await getClientes();
  await AsyncStorage.setItem(KEYS.CLIENTES, JSON.stringify(list.filter(c => c.id !== id)));
};

// ─── Cotizaciones ─────────────────────────────────────────────────────────────

export const getCotizaciones = async () => {
  const raw = await AsyncStorage.getItem(KEYS.COTIZACIONES);
  return raw ? JSON.parse(raw) : [];
};

export const getCotizacionesByCliente = async (clienteId) => {
  const all = await getCotizaciones();
  return all.filter(c => c.clienteId === clienteId);
};

const getNextNumero = async () => {
  const raw = await AsyncStorage.getItem(KEYS.COT_COUNTER);
  const n = raw ? parseInt(raw, 10) + 1 : 1;
  await AsyncStorage.setItem(KEYS.COT_COUNTER, n.toString());
  return `COT-${new Date().getFullYear()}-${String(n).padStart(4, '0')}`;
};

export const saveCotizacion = async (cotizacion) => {
  const list = await getCotizaciones();
  if (cotizacion.id) {
    const idx = list.findIndex(c => c.id === cotizacion.id);
    if (idx >= 0) list[idx] = cotizacion;
    else list.push(cotizacion);
  } else {
    cotizacion.id = Date.now().toString();
    cotizacion.numero = await getNextNumero();
    cotizacion.fecha = new Date().toISOString();
    list.push(cotizacion);
  }
  await AsyncStorage.setItem(KEYS.COTIZACIONES, JSON.stringify(list));
  return cotizacion;
};

export const deleteCotizacion = async (id) => {
  const list = await getCotizaciones();
  await AsyncStorage.setItem(KEYS.COTIZACIONES, JSON.stringify(list.filter(c => c.id !== id)));
};

export const updateEstadoCotizacion = async (id, estado) => {
  const list = await getCotizaciones();
  const idx = list.findIndex(c => c.id === id);
  if (idx >= 0) {
    list[idx].estado = estado;
    await AsyncStorage.setItem(KEYS.COTIZACIONES, JSON.stringify(list));
    return list[idx];
  }
  return null;
};
