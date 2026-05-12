import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, Modal, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  getCotizaciones, getClientes, deleteCotizacion,
  updateEstadoCotizacion, registrarPago,
} from '../services/storage';
import { generarPdfCotizacion, generarPdfRecibo } from '../utils/pdfService';
import { STATUS_COLOR, STATUS_LABEL, currencySymbol, fmt, fmtDate } from '../utils/cotizacionHelpers';
import { Config } from '../constants/Config';
import Theme from '../constants/Theme';
import styles from '../styles/CotizacionDetalleScreen.styles';

const MONEDAS = Config.MONEDAS || ['USD', 'VES', 'COP'];

export default function CotizacionDetalleScreen({ route, navigation }) {
  const { cotizacionId } = route.params;
  const [cotizacion, setCotizacion] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const [pagoModal, setPagoModal] = useState(false);
  const [pagoMoneda, setPagoMoneda] = useState('USD');
  const [pagoMonto, setPagoMonto] = useState('');
  const [pagoFecha, setPagoFecha] = useState(new Date().toISOString().split('T')[0]);
  const [pagoObservacion, setPagoObservacion] = useState('');
  const [guardandoPago, setGuardandoPago] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cots, cls] = await Promise.all([getCotizaciones(), getClientes()]);
      const cot = cots.find(c => c.id === cotizacionId);
      const cl = cot ? cls.find(c => c.id === cot.clienteId) : null;
      setCotizacion(cot || null);
      setCliente(cl || { nombre: cot?.clienteNombre || 'Cliente' });
    } catch {
      Alert.alert('Error', 'No se pudo cargar la cotización.');
    } finally {
      setLoading(false);
    }
  }, [cotizacionId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleEstado = async (estado) => {
    if (estado === 'pagada') { setPagoModal(true); return; }
    try {
      await updateEstadoCotizacion(cotizacionId, estado);
      load();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    }
  };

  const handleConfirmarPago = async () => {
    if (!pagoFecha.trim()) { Alert.alert('Error', 'Ingresa la fecha de pago.'); return; }
    setGuardandoPago(true);
    try {
      await registrarPago(cotizacionId, {
        monedaPago: pagoMoneda,
        montoPago: pagoMonto.trim() ? parseFloat(pagoMonto.replace(',', '.')) : null,
        fechaPago: pagoFecha,
        observacionPago: pagoObservacion.trim(),
      });
      setPagoModal(false);
      setPagoMonto('');
      setPagoObservacion('');
      load();
    } catch {
      Alert.alert('Error', 'No se pudo registrar el pago.');
    } finally {
      setGuardandoPago(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar', '¿Eliminar esta cotización?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await deleteCotizacion(cotizacionId);
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar la cotización.');
          }
        },
      },
    ]);
  };

  const handlePdf = async () => {
    if (!cotizacion || !cliente) return;
    setGeneratingPdf(true);
    try {
      await generarPdfCotizacion(cotizacion, cliente);
    } catch (e) {
      Alert.alert('Error', 'No se pudo generar el PDF: ' + e.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleRecibo = async () => {
    if (!cotizacion || !cliente) return;
    setGeneratingPdf(true);
    try {
      await generarPdfRecibo(cotizacion, cliente);
    } catch (e) {
      Alert.alert('Error', 'No se pudo generar el recibo: ' + e.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading || !cotizacion) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={Theme.colors.primary} /></View>;
  }

  const symbol = currencySymbol(cotizacion.moneda);
  const descuentoMonto = cotizacion.subtotal * ((cotizacion.descuento || 0) / 100);
  const esPagada = cotizacion.estado === 'pagada';

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.docNum}>{cotizacion.numero}</Text>
          <Text style={styles.docDate}>{fmtDate(cotizacion.fecha)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[cotizacion.estado] || Theme.colors.light }]}>
            <Text style={styles.statusText}>{STATUS_LABEL[cotizacion.estado] || cotizacion.estado}</Text>
          </View>
        </View>

        {/* Botones PDF / Recibo */}
        <TouchableOpacity style={styles.pdfButton} onPress={handlePdf} disabled={generatingPdf}>
          {generatingPdf ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="document-text-outline" size={20} color="#fff" />}
          <Text style={styles.pdfButtonText}>{generatingPdf ? 'Generando...' : 'Exportar PDF Cotización'}</Text>
        </TouchableOpacity>

        {esPagada && (
          <TouchableOpacity style={[styles.pdfButton, { backgroundColor: Theme.colors.successDark }]} onPress={handleRecibo} disabled={generatingPdf}>
            <Ionicons name="receipt-outline" size={20} color="#fff" />
            <Text style={styles.pdfButtonText}>Generar Recibo de Pago</Text>
          </TouchableOpacity>
        )}

        {/* Cliente */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Text style={styles.clienteName}>{cliente.nombre}</Text>
          <Text style={styles.clienteInfo}>
            {[cliente.empresa, cliente.rif, cliente.telefono, cliente.email, cliente.direccion].filter(Boolean).join('\n')}
          </Text>
        </View>

        {/* Ítems */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Servicios / Productos</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Descripción</Text>
            <Text style={[styles.tableHeaderText, { width: 40, textAlign: 'center' }]}>Cant</Text>
            <Text style={[styles.tableHeaderText, { width: 80, textAlign: 'right' }]}>P.Unit</Text>
            <Text style={[styles.tableHeaderText, { width: 80, textAlign: 'right' }]}>Total</Text>
          </View>
          {(cotizacion.items || []).map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={[styles.itemDesc, { flex: 1 }]}>{item.descripcion}</Text>
              <Text style={[styles.itemQty, { width: 40 }]}>{item.cantidad}</Text>
              <Text style={[styles.itemPrice, { width: 80 }]}>{symbol} {fmt(item.precioUnitario)}</Text>
              <Text style={[styles.itemTotal, { width: 80 }]}>{symbol} {fmt(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Resumen Financiero</Text>
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalValue}>{symbol} {fmt(cotizacion.subtotal)}</Text></View>
          {cotizacion.descuento > 0 && <View style={styles.totalRow}><Text style={styles.totalLabel}>Descuento ({cotizacion.descuento}%)</Text><Text style={styles.totalValue}>- {symbol} {fmt(descuentoMonto)}</Text></View>}
          <View style={styles.totalFinalRow}>
            <Text style={styles.totalFinalLabel}>TOTAL {cotizacion.moneda}</Text>
            <Text style={styles.totalFinalValue}>{symbol} {fmt(cotizacion.total)}</Text>
          </View>
        </View>

        {/* Info pago si existe */}
        {esPagada && cotizacion.pago && (
          <View style={[styles.sectionCard, { borderLeftWidth: 4, borderLeftColor: Theme.colors.successDark }]}>
            <Text style={[styles.sectionTitle, { color: Theme.colors.successDark }]}>Pago Registrado</Text>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Moneda de pago</Text>
              <Text style={styles.totalValue}>{cotizacion.pago.monedaPago}</Text>
            </View>
            {cotizacion.pago.montoPago != null && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Monto recibido</Text>
                <Text style={styles.totalValue}>{currencySymbol(cotizacion.pago.monedaPago)} {fmt(cotizacion.pago.montoPago)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Fecha de pago</Text>
              <Text style={styles.totalValue}>{fmtDate(cotizacion.pago.fechaPago)}</Text>
            </View>
            {cotizacion.pago.observacionPago ? (
              <View style={{ marginTop: 6 }}>
                <Text style={styles.totalLabel}>Observación</Text>
                <Text style={[styles.notesText, { marginTop: 4 }]}>{cotizacion.pago.observacionPago}</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Notas */}
        {cotizacion.notas ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={styles.notesText}>{cotizacion.notas}</Text>
          </View>
        ) : null}

        {/* Cambiar Estado */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Cambiar Estado</Text>
          <View style={styles.statusRow}>
            {Config.ESTADOS_COTIZACION.map(estado => (
              <TouchableOpacity
                key={estado}
                style={[styles.statusBtn, { borderColor: STATUS_COLOR[estado], backgroundColor: cotizacion.estado === estado ? STATUS_COLOR[estado] : 'transparent' }]}
                onPress={() => handleEstado(estado)}
              >
                <Text style={[styles.statusBtnText, { color: cotizacion.estado === estado ? '#fff' : STATUS_COLOR[estado] }]}>
                  {STATUS_LABEL[estado]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Editar y Eliminar */}
        <TouchableOpacity
          style={[styles.pdfButton, { backgroundColor: Theme.colors.primary, marginBottom: 8 }]}
          onPress={() => navigation.navigate('NuevaCotizacion', { cotizacion })}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.pdfButtonText}>Editar Cotización</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Eliminar Cotización</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Registrar Pago */}
      <Modal visible={pagoModal} transparent animationType="slide" onRequestClose={() => setPagoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Pago</Text>

            <Text style={styles.modalLabel}>Moneda de Pago</Text>
            <View style={styles.monedaRow}>
              {MONEDAS.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.monedaBtn, pagoMoneda === m && styles.monedaBtnActive]}
                  onPress={() => setPagoMoneda(m)}
                >
                  <Text style={[styles.monedaBtnText, pagoMoneda === m && styles.monedaBtnTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Monto Recibido</Text>
            <TextInput
              style={styles.modalInput}
              value={pagoMonto}
              onChangeText={setPagoMonto}
              placeholder="0.00"
              placeholderTextColor={Theme.colors.light}
              keyboardType="decimal-pad"
            />

            <Text style={styles.modalLabel}>Fecha de Pago</Text>
            <TextInput
              style={styles.modalInput}
              value={pagoFecha}
              onChangeText={setPagoFecha}
              placeholder="2024-01-15"
              placeholderTextColor={Theme.colors.light}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            />

            <Text style={styles.modalLabel}>Observación</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              value={pagoObservacion}
              onChangeText={setPagoObservacion}
              placeholder="Transferencia bancaria, efectivo, etc."
              placeholderTextColor={Theme.colors.light}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setPagoModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleConfirmarPago} disabled={guardandoPago}>
                {guardandoPago
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.modalConfirmText}>Confirmar Pago</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
