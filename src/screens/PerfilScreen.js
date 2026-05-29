import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { getEmpresa, saveEmpresa } from '../services/storage';
import Theme from '../constants/Theme';
import styles from '../styles/PerfilScreen.styles';

function Field({ label, value, onChangeText, placeholder, keyboard, multiline }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder || label}
        placeholderTextColor={Theme.colors.light}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboard || 'default'}
        multiline={multiline}
      />
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={17} color={Theme.colors.primary} style={styles.infoIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={value ? styles.infoValue : styles.infoValueEmpty}>{value || 'Sin datos'}</Text>
      </View>
    </View>
  );
}

export default function PerfilScreen() {
  const [editMode, setEditMode] = useState(false);
  const [empresa, setEmpresa] = useState({
    nombre: '', slogan: '', rif: '', telefono: '', email: '', direccion: '',
  });

  useEffect(() => {
    getEmpresa()
      .then(setEmpresa)
      .catch(() => Alert.alert('Error', 'No se pudieron cargar los datos de la empresa.'));
  }, []);

  const set = (field) => (val) => setEmpresa(e => ({ ...e, [field]: val }));

  const handleSave = async () => {
    if (!empresa.nombre.trim()) {
      Alert.alert('Campo requerido', 'El nombre de la empresa es obligatorio.');
      return;
    }
    try {
      await saveEmpresa(empresa);
      setEditMode(false);
      Alert.alert('Guardado', 'Datos actualizados. Se aplicarán en los próximos PDFs.');
    } catch {
      Alert.alert('Error', 'No se pudieron guardar los datos.');
    }
  };

  const handleCancel = async () => {
    try { const data = await getEmpresa(); setEmpresa(data); } catch { /* keep state */ }
    setEditMode(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 160 }]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
      >
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={30} color={Theme.colors.accent} />
          </View>
          <Text style={styles.companyName}>{empresa.nombre || 'Mi Empresa'}</Text>
          {empresa.slogan ? <Text style={styles.slogan}>{empresa.slogan}</Text> : null}
        </View>

        {editMode ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitleEdit}>Editar Datos de Empresa</Text>
            <Field label="Nombre de Empresa *"  value={empresa.nombre}    onChangeText={set('nombre')}    placeholder="Ej: Servican C.A."               />
            <Field label="Slogan / Descripción" value={empresa.slogan}    onChangeText={set('slogan')}    placeholder="Ej: Seguridad y CCTV Profesional" />
            <Field label="RIF / NIF"             value={empresa.rif}      onChangeText={set('rif')}       placeholder="J-XXXXXXXXX-X"                   />
            <Field label="Teléfono"              value={empresa.telefono} onChangeText={set('telefono')}  placeholder="+58 XXX XXX XXXX" keyboard="phone-pad"    />
            <Field label="Correo Electrónico"    value={empresa.email}    onChangeText={set('email')}     placeholder="ventas@miempresa.com" keyboard="email-address" />
            <Field label="Dirección"             value={empresa.direccion} onChangeText={set('direccion')} placeholder="Ciudad, Estado, País" multiline   />
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Datos de la Empresa</Text>
                <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editButton}>
                  <Ionicons name="create-outline" size={14} color={Theme.colors.primary} />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
              <InfoRow icon="card-outline"     label="RIF"       value={empresa.rif} />
              <InfoRow icon="call-outline"     label="Teléfono"  value={empresa.telefono} />
              <InfoRow icon="mail-outline"     label="Email"     value={empresa.email} />
              <InfoRow icon="location-outline" label="Dirección" value={empresa.direccion} />
            </View>
            <View style={styles.cardLast}>
              <Text style={styles.sectionTitle}>Aplicación</Text>
              <InfoRow icon="phone-portrait-outline" label="Versión"        value="1.0.0" />
              <InfoRow icon="server-outline"         label="Almacenamiento" value="Local (sin conexión)" />
              <InfoRow icon="document-text-outline"  label="PDF"            value="Los datos de empresa se usan en cada cotización" />
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
