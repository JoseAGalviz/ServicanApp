import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal,
  Alert, KeyboardAvoidingView, Platform, FlatList, Pressable,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { getClientes, saveCotizacion } from '../services/storage';
import { Config } from '../constants/Config';
import Theme from '../constants/Theme';
import styles from '../styles/NuevaCotizacionScreen.styles';

const MONEDAS = ['USD', 'VES', 'COP'];

const emptyItem = () => ({ id: Date.now().toString(), descripcion: '', cantidad: '1', precioUnitario: '', total: 0 });

export default function NuevaCotizacionScreen({ route, navigation }) {
  const existing = route.params?.cotizacion;

  const [clientes,      setClientes]      = useState([]);
  const [clienteId,     setClienteId]     = useState(existing?.clienteId     || '');
  const [clienteNombre, setClienteNombre] = useState(existing?.clienteNombre || '');
  const [moneda,        setMoneda]        = useState(existing?.moneda        || Config.MONEDA_DEFAULT);
  const [validezDias,   setValidezDias]   = useState(String(existing?.validezDias || Config.VALIDEZ_DEFAULT));
  const [notas,         setNotas]         = useState(existing?.notas         || '');
  const [items,         setItems]         = useState(existing?.items         || []);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showItemModal,    setShowItemModal]    = useState(false);
  const [itemForm,      setItemForm]      = useState(emptyItem());
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => { getClientes().then(setClientes); }, []);

  const calcTotal = () => items.reduce((s, i) => s + (i.total || 0), 0);

  const openAddItem  = () => { setItemForm(emptyItem()); setEditingItemId(null); setShowItemModal(true); };
  const openEditItem = (item) => {
    setItemForm({ ...item, cantidad: String(item.cantidad), precioUnitario: String(item.precioUnitario) });
    setEditingItemId(item.id);
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (!itemForm.descripcion.trim()) { Alert.alert('Error', 'La descripción es requerida.'); return; }
    const cant  = parseFloat(itemForm.cantidad)      || 0;
    const precio = parseFloat(itemForm.precioUnitario) || 0;
    const total  = cant * precio;
    const saved  = { ...itemForm, cantidad: cant, precioUnitario: precio, total };
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
    const total = calcTotal();
    await saveCotizacion({
      ...(existing || {}),
      clienteId, clienteNombre, moneda,
      validezDias: parseInt(validezDias) || 30,
      descuento: 0, notas, items,
      subtotal: total, total, estado,
    });
    navigation.goBack();
  };

  const total  = calcTotal();
  const symbol = moneda === 'USD' ? '$' : moneda === 'COP' ? 'Col$' : 'Bs.';
  const fmt    = (n) => Number(n || 0).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={[styles.scroll, { paddingBottom: 160 }]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
      >
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
          <Text style={styles.label}>Moneda</Text>
          <View style={styles.monedaRow}>
            {MONEDAS.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.monedaBtn, moneda === m && styles.monedaBtnActive]}
                onPress={() => setMoneda(m)}
              >
                <Text style={[styles.monedaBtnText, moneda === m && styles.monedaBtnTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ marginTop: Theme.spacing.md }}>
            <Text style={styles.label}>Validez (días)</Text>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={validezDias}
              onChangeText={setValidezDias}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Ítems */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Servicios / Productos</Text>
          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <TouchableOpacity onPress={() => openEditItem(item)} style={{ flex: 1 }}>
                <Text style={styles.itemDesc}>{item.descripcion}</Text>
                <Text style={styles.itemMeta}>{item.cantidad} × {symbol} {fmt(item.precioUnitario)}</Text>
              </TouchableOpacity>
              <View style={styles.itemRight}>
                <Text style={styles.itemTotal}>{symbol} {fmt(item.total)}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.itemDeleteBtn}>
                  <Ionicons name="trash-outline" size={16} color={Theme.colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addItemButton} onPress={openAddItem}>
            <Ionicons name="add-circle-outline" size={20} color={Theme.colors.primary} />
            <Text style={styles.addItemText}>Agregar ítem</Text>
          </TouchableOpacity>
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalCardLabel}>TOTAL</Text>
          <Text style={styles.totalCardValue}>{symbol} {fmt(total)}</Text>
        </View>

        {/* Notas */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observaciones, condiciones especiales..."
            placeholderTextColor={Theme.colors.light}
            value={notas}
            onChangeText={setNotas}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={() => handleSave('borrador')}>
            <Ionicons name="save-outline" size={18} color={Theme.colors.primary} />
            <Text style={styles.actionBtnOutlineText}>Guardar borrador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSolid]} onPress={() => handleSave('enviada')}>
            <Ionicons name="send-outline" size={18} color="#fff" />
            <Text style={styles.actionBtnSolidText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* Modal: Seleccionar Cliente */}
      <Modal visible={showClienteModal} transparent animationType="slide" onRequestClose={() => setShowClienteModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowClienteModal(false)}>
          <Pressable style={styles.clienteModal} onPress={() => {}}>
            <Text style={styles.clienteModalTitle}>Seleccionar Cliente</Text>
            <FlatList
              data={clientes}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.clienteOption}
                  onPress={() => { setClienteId(item.id); setClienteNombre(item.nombre); setShowClienteModal(false); }}
                >
                  <Text style={styles.clienteOptionName}>{item.nombre}</Text>
                  {item.empresa ? <Text style={styles.clienteOptionEmpresa}>{item.empresa}</Text> : null}
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Sin clientes registrados</Text>}
            />
            <TouchableOpacity style={[styles.modalCancelBtn, { marginTop: 12 }]} onPress={() => setShowClienteModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal: Agregar / Editar Ítem */}
      <Modal visible={showItemModal} transparent animationType="slide" onRequestClose={() => setShowItemModal(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowItemModal(false)}>
            <Pressable style={styles.modalContent} onPress={() => {}}>
              <Text style={styles.modalTitle}>{editingItemId ? 'Editar Ítem' : 'Nuevo Ítem'}</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Descripción *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Descripción del servicio / producto"
                  placeholderTextColor={Theme.colors.light}
                  value={itemForm.descripcion}
                  onChangeText={v => setItemForm(f => ({ ...f, descripcion: v }))}
                />
              </View>
              <View style={styles.row}>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Cantidad</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={itemForm.cantidad}
                    onChangeText={v => setItemForm(f => ({ ...f, cantidad: v }))}
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Precio ({symbol})</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={Theme.colors.light}
                    value={itemForm.precioUnitario}
                    onChangeText={v => setItemForm(f => ({ ...f, precioUnitario: v }))}
                  />
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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
