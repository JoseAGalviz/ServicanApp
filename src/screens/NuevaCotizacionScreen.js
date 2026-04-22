import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Modal,
  Alert, KeyboardAvoidingView, Platform, FlatList, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getClientes, saveCotizacion } from '../services/storage';
import { Config } from '../constants/Config';
import Theme from '../constants/Theme';
import styles from '../styles/NuevaCotizacionScreen.styles';

const MONEDAS = ['USD', 'VES'];

const emptyItem = () => ({ id: Date.now().toString(), descripcion: '', cantidad: '1', precioUnitario: '', total: 0 });

export default function NuevaCotizacionScreen({ route, navigation }) {
  const existing = route.params?.cotizacion;

  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState(existing?.clienteId || '');
  const [clienteNombre, setClienteNombre] = useState(existing?.clienteNombre || '');
  const [moneda, setMoneda] = useState(existing?.moneda || Config.MONEDA_DEFAULT);
  const [validezDias, setValidezDias] = useState(String(existing?.validezDias || Config.VALIDEZ_DEFAULT));
  const [descuento, setDescuento] = useState(String(existing?.descuento || '0'));
  const [notas, setNotas] = useState(existing?.notas || '');
  const [items, setItems] = useState(existing?.items || []);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemForm, setItemForm] = useState(emptyItem());
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => { getClientes().then(setClientes); }, []);

  const calcTotals = () => {
    const subtotal = items.reduce((s, i) => s + (i.total || 0), 0);
    const desc = subtotal * ((parseFloat(descuento) || 0) / 100);
    const total = subtotal - desc;
    return { subtotal, total };
  };

  const openAddItem = () => { setItemForm(emptyItem()); setEditingItemId(null); setShowItemModal(true); };
  const openEditItem = (item) => { setItemForm({ ...item, cantidad: String(item.cantidad), precioUnitario: String(item.precioUnitario) }); setEditingItemId(item.id); setShowItemModal(true); };

  const handleSaveItem = () => {
    if (!itemForm.descripcion.trim()) { Alert.alert('Error', 'La descripción es requerida.'); return; }
    const cant = parseFloat(itemForm.cantidad) || 0;
    const precio = parseFloat(itemForm.precioUnitario) || 0;
    const total = cant * precio;
    const saved = { ...itemForm, cantidad: cant, precioUnitario: precio, total };
    if (editingItemId) {
      setItems(prev => prev.map(i => i.id === editingItemId ? saved : i));
    } else {
      setItems(prev => [...prev, { ...saved, id: Date.now().toString() }]);
    }
    setShowItemModal(false);
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const handleSave = async (estado = 'borrador') => {
    if (!clienteId) { Alert.alert('Error', 'Selecciona un cliente.'); return; }
    if (items.length === 0) { Alert.alert('Error', 'Agrega al menos un ítem.'); return; }
    const { subtotal, total } = calcTotals();
    await saveCotizacion({
      ...(existing || {}),
      clienteId,
      clienteNombre,
      moneda,
      validezDias: parseInt(validezDias) || 30,
      descuento: parseFloat(descuento) || 0,
      notas,
      items,
      subtotal,
      total,
      estado,
    });
    navigation.goBack();
  };

  const { subtotal, total } = calcTotals();
  const symbol = moneda === 'USD' ? '$' : 'Bs.';
  const fmt = (n) => Number(n || 0).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Cliente */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowClienteModal(true)}>
            <Text style={clienteId ? styles.pickerButtonText : styles.pickerButtonPlaceholder}>
              {clienteNombre || 'Seleccionar cliente...'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={Theme.colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Configuración */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Moneda</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {MONEDAS.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.pickerButton, { flex: 1, justifyContent: 'center', backgroundColor: moneda === m ? Theme.colors.primary : Theme.colors.surfaceAlt }]}
                    onPress={() => setMoneda(m)}
                  >
                    <Text style={{ textAlign: 'center', fontWeight: '700', color: moneda === m ? '#fff' : Theme.colors.muted }}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Validez (días)</Text>
              <TextInput style={styles.input} value={validezDias} onChangeText={setValidezDias} keyboardType="numeric" />
            </View>
          </View>
          <View style={[styles.row, { marginTop: Theme.spacing.md }]}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Descuento (%)</Text>
              <TextInput style={styles.input} value={descuento} onChangeText={setDescuento} keyboardType="decimal-pad" />
            </View>
          </View>
        </View>

        {/* Ítems */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Servicios / Productos</Text>
          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <TouchableOpacity onPress={() => openEditItem(item)} style={{ flex: 1 }}>
                <Text style={styles.itemDesc}>{item.descripcion}</Text>
                <Text style={styles.itemMeta}>Cant: {item.cantidad} × {symbol} {fmt(item.precioUnitario)}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={styles.itemTotal}>{symbol} {fmt(item.total)}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={18} color={Theme.colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addItemButton} onPress={openAddItem}>
            <Ionicons name="add-circle-outline" size={20} color={Theme.colors.primary} />
            <Text style={styles.addItemText}>Agregar ítem</Text>
          </TouchableOpacity>
        </View>

        {/* Totales */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalValue}>{symbol} {fmt(subtotal)}</Text></View>
          {parseFloat(descuento) > 0 && (
            <View style={styles.totalRow}><Text style={styles.totalLabel}>Descuento ({descuento}%)</Text><Text style={styles.totalValue}>- {symbol} {fmt(subtotal * (parseFloat(descuento) / 100))}</Text></View>
          )}
          <View style={styles.totalFinal}><Text style={styles.totalFinalLabel}>TOTAL</Text><Text style={styles.totalFinalValue}>{symbol} {fmt(total)}</Text></View>
        </View>

        {/* Notas */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notas</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Observaciones, condiciones especiales..." placeholderTextColor={Theme.colors.light} value={notas} onChangeText={setNotas} multiline numberOfLines={3} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={() => handleSave('borrador')}>
          <Text style={styles.saveButtonText}>Guardar Cotización</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: Theme.colors.success, marginTop: 8 }]} onPress={() => handleSave('enviada')}>
          <Text style={styles.saveButtonText}>Guardar y Marcar como Enviada</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal: Seleccionar Cliente */}
      <Modal visible={showClienteModal} transparent animationType="slide" onRequestClose={() => setShowClienteModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowClienteModal(false)}>
          <Pressable style={styles.clienteModal} onPress={() => {}}>

            <Text style={styles.clienteModalTitle}>Seleccionar Cliente</Text>
            <FlatList
              data={clientes}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.clienteOption} onPress={() => { setClienteId(item.id); setClienteNombre(item.nombre); setShowClienteModal(false); }}>
                  <Text style={styles.clienteOptionName}>{item.nombre}</Text>
                  {item.empresa ? <Text style={styles.clienteOptionEmpresa}>{item.empresa}</Text> : null}
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={{ color: Theme.colors.muted, textAlign: 'center', paddingVertical: 20 }}>Sin clientes registrados</Text>}
            />
            <TouchableOpacity style={[styles.modalCancelBtn, { marginTop: 12 }]} onPress={() => setShowClienteModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal: Agregar / Editar Ítem */}
      <Modal visible={showItemModal} transparent animationType="slide" onRequestClose={() => setShowItemModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowItemModal(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>{editingItemId ? 'Editar Ítem' : 'Nuevo Ítem'}</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Descripción *</Text>
              <TextInput style={styles.input} placeholder="Descripción del servicio/producto" placeholderTextColor={Theme.colors.light} value={itemForm.descripcion} onChangeText={v => setItemForm(f => ({ ...f, descripcion: v }))} />
            </View>
            <View style={[styles.row, { marginTop: 4 }]}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Cantidad</Text>
                <TextInput style={styles.input} keyboardType="decimal-pad" value={itemForm.cantidad} onChangeText={v => setItemForm(f => ({ ...f, cantidad: v }))} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Precio Unitario ({symbol})</Text>
                <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={Theme.colors.light} value={itemForm.precioUnitario} onChangeText={v => setItemForm(f => ({ ...f, precioUnitario: v }))} />
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowItemModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAddBtn} onPress={handleSaveItem}>
                <Text style={styles.modalAddText}>{editingItemId ? 'Guardar' : 'Agregar'}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
