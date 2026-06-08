import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveCliente, deleteCliente } from '../services/storage';
import styles from '../styles/ClienteFormScreen.styles';

function Field({ label, value, onChangeText, placeholder, keyboard, multiline }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder || label}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboard || 'default'}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

export default function ClienteFormScreen({ route, navigation }) {
  const existing = route.params?.cliente;
  const [nombre,    setNombre]    = useState(existing?.nombre    || '');
  const [empresa,   setEmpresa]   = useState(existing?.empresa   || '');
  const [rif,       setRif]       = useState(existing?.rif       || '');
  const [telefono,  setTelefono]  = useState(existing?.telefono  || '');
  const [email,     setEmail]     = useState(existing?.email     || '');
  const [direccion, setDireccion] = useState(existing?.direccion || '');
  const [notas,     setNotas]     = useState(existing?.notas     || '');

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Campo requerido', 'El nombre del cliente es obligatorio.');
      return;
    }
    try {
      await saveCliente({ ...(existing || {}), nombre, empresa, rif, telefono, email, direccion, notas });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'No se pudo guardar el cliente.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar', `¿Eliminar a ${nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try { await deleteCliente(existing.id); navigation.goBack(); }
        catch { Alert.alert('Error', 'No se pudo eliminar el cliente.'); }
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.scroll, { paddingBottom: 40 }]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={24}
    >
      <Field label="Nombre *"           value={nombre}    onChangeText={setNombre}    placeholder="Nombre completo"    />
      <Field label="Empresa"            value={empresa}   onChangeText={setEmpresa}   placeholder="Razón social"       />
      <Field label="RIF / NIF"          value={rif}       onChangeText={setRif}       placeholder="J-XXXXXXXXX-X"      />
      <Field label="Teléfono"           value={telefono}  onChangeText={setTelefono}  placeholder="+58 XXX XXX XXXX"   keyboard="phone-pad" />
      <Field label="Correo Electrónico" value={email}     onChangeText={setEmail}     placeholder="correo@empresa.com" keyboard="email-address" />
      <Field label="Dirección"          value={direccion} onChangeText={setDireccion} placeholder="Dirección"          multiline />
      <Field label="Notas"              value={notas}     onChangeText={setNotas}     placeholder="Notas adicionales..." multiline />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{existing ? 'Guardar Cambios' : 'Registrar Cliente'}</Text>
      </TouchableOpacity>
      {existing ? (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Eliminar Cliente</Text>
        </TouchableOpacity>
      ) : null}
    </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
