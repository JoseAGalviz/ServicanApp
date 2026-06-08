import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  Modal, FlatList, Pressable, Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { getCotizaciones, saveServicio, deleteServicio } from '../services/storage';
import { scheduleServicioNotification, cancelServicioNotification, requestNotificationPermissions } from '../services/notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '../constants/Theme';
import styles from '../styles/ServicioFormScreen.styles';

export default function ServicioFormScreen({ route, navigation }) {
  const existing = route.params?.servicio;
  const prefill  = route.params || {};

  const today = new Date().toISOString().split('T')[0];

  const [fechaISO,         setFechaISO]         = useState(existing?.fechaISO         || prefill.fechaISO         || today);
  const [hora,             setHora]             = useState(existing?.hora             || '08:00');
  const [descripcion,      setDescripcion]      = useState(existing?.descripcion      || '');
  const [clienteId,        setClienteId]        = useState(existing?.clienteId        || prefill.clienteId        || '');
  const [clienteNombre,    setClienteNombre]    = useState(existing?.clienteNombre    || prefill.clienteNombre    || '');
  const [cotizacionId,     setCotizacionId]     = useState(existing?.cotizacionId     || prefill.cotizacionId     || '');
  const [cotizacionNumero, setCotizacionNumero] = useState(existing?.cotizacionNumero || prefill.cotizacionNumero || '');
  const [estado,           setEstado]           = useState(existing?.estado           || 'pendiente');

  // Locked when coming from cotización detail OR editing a service that already has one
  const cotizLocked = !!prefill.cotizacionId || !!existing?.cotizacionId;

  const [cotizaciones,     setCotizaciones]     = useState([]);
  const [showDatePicker,   setShowDatePicker]   = useState(false);
  const [showCotizModal,   setShowCotizModal]   = useState(false);
  const [saving,           setSaving]           = useState(false);

  useEffect(() => {
    getCotizaciones().then(setCotizaciones);
  }, []);

  const parseLocalDate = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      const y = selected.getFullYear();
      const m = String(selected.getMonth() + 1).padStart(2, '0');
      const d = String(selected.getDate()).padStart(2, '0');
      setFechaISO(`${y}-${m}-${d}`);
    }
  };

  const selectCotizacion = (item) => {
    setCotizacionId(item.id);
    setCotizacionNumero(item.numero);
    setClienteId(item.clienteId || '');
    setClienteNombre(item.clienteNombre || '');
    setShowCotizModal(false);
  };

  const clearCotizacion = () => {
    setCotizacionId('');
    setCotizacionNumero('');
    setClienteId('');
    setClienteNombre('');
  };

  const handleSave = async () => {
    if (!cotizacionId) { Alert.alert('Error', 'Selecciona una cotización.'); return; }
    if (!fechaISO.trim()) { Alert.alert('Error', 'Ingresa la fecha.'); return; }
    if (!descripcion.trim()) { Alert.alert('Error', 'Ingresa una descripción.'); return; }
    if (hora && !/^\d{2}:\d{2}$/.test(hora)) {
      Alert.alert('Hora inválida', 'Usa el formato HH:MM  (ej: 10:30).');
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...(existing || {}),
        fechaISO, hora, descripcion,
        clienteId, clienteNombre,
        cotizacionId, cotizacionNumero,
        estado,
      };

      if (existing?.notificationIds) {
        await cancelServicioNotification(existing.notificationIds);
      }

      let notificationIds = null;
      if (estado === 'pendiente') {
        const granted = await requestNotificationPermissions();
        if (granted) {
          notificationIds = await scheduleServicioNotification(data);
        }
      }
      data.notificationIds = notificationIds;

      await saveServicio(data);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'No se pudo guardar el servicio.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar', '¿Eliminar este servicio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            if (existing?.notificationIds) await cancelServicioNotification(existing.notificationIds);
            await deleteServicio(existing.id);
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar el servicio.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.background }} edges={['bottom']}>
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={24}
    >
      {/* Cotización */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Cotización *</Text>
        {cotizLocked ? (
          <View style={[styles.pickerBtn, { opacity: 0.75 }]}>
            <Ionicons name="document-text-outline" size={16} color={Theme.colors.muted} style={{ marginRight: 8 }} />
            <Text style={[styles.pickerText, { color: Theme.colors.muted }]} numberOfLines={1}>
              {cotizacionNumero}
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowCotizModal(true)}>
              <Text style={cotizacionId ? styles.pickerText : styles.pickerPlaceholder} numberOfLines={1}>
                {cotizacionNumero || 'Seleccionar cotización...'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={Theme.colors.muted} />
            </TouchableOpacity>
            {cotizacionId ? (
              <TouchableOpacity onPress={clearCotizacion}>
                <Text style={styles.clearBtn}>Quitar cotización</Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </View>

      {/* Cliente (derivado de la cotización, solo lectura) */}
      {clienteNombre ? (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Cliente</Text>
          <View style={[styles.pickerBtn, { opacity: 0.75 }]}>
            <Ionicons name="person-outline" size={16} color={Theme.colors.muted} style={{ marginRight: 8 }} />
            <Text style={[styles.pickerText, { color: Theme.colors.muted }]} numberOfLines={1}>
              {clienteNombre}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Fecha */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Fecha *</Text>
        <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.pickerText}>{fechaISO}</Text>
          <Ionicons name="calendar-outline" size={18} color={Theme.colors.muted} />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={parseLocalDate(fechaISO)}
            mode="date"
            display={Platform.OS === 'android' ? 'calendar' : 'inline'}
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Hora */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Hora</Text>
        <TextInput
          style={styles.input}
          value={hora}
          onChangeText={setHora}
          placeholder="HH:MM"
          placeholderTextColor={Theme.colors.light}
          keyboardType="numbers-and-punctuation"
          maxLength={5}
        />
      </View>

      {/* Descripción */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Descripción del trabajo *</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Ej: Instalación de cámara IP en planta baja..."
          placeholderTextColor={Theme.colors.light}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Estado */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Estado</Text>
        <View style={styles.estadoRow}>
          <TouchableOpacity
            style={[styles.estadoBtn, estado === 'pendiente' && styles.estadoBtnActive]}
            onPress={() => setEstado('pendiente')}
          >
            <Ionicons name="time-outline" size={16} color={estado === 'pendiente' ? '#fff' : Theme.colors.warning} />
            <Text style={[styles.estadoBtnText, estado === 'pendiente' && styles.estadoBtnTextActive]}>Pendiente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.estadoBtn, styles.estadoBtnSuccess, estado === 'completado' && styles.estadoBtnSuccessActive]}
            onPress={() => setEstado('completado')}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color={estado === 'completado' ? '#fff' : Theme.colors.success} />
            <Text style={[styles.estadoBtnText, estado === 'completado' && styles.estadoBtnTextActive]}>Completado</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>
          {saving ? 'Guardando...' : existing ? 'Guardar Cambios' : 'Crear Servicio'}
        </Text>
      </TouchableOpacity>

      {existing ? (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Eliminar Servicio</Text>
        </TouchableOpacity>
      ) : null}

      {/* Modal: Cotización */}
      <Modal visible={showCotizModal} transparent animationType="slide" onRequestClose={() => setShowCotizModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowCotizModal(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Seleccionar Cotización</Text>
            <FlatList
              data={cotizaciones}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => selectCotizacion(item)}
                >
                  <Text style={styles.modalOptionName}>{item.numero}</Text>
                  <Text style={styles.modalOptionSub}>{item.clienteNombre} · {item.estado}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Sin cotizaciones registradas</Text>}
            />
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowCotizModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
