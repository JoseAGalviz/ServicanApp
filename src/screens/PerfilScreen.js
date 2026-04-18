import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getEmpresa, saveEmpresa } from '../services/storage';
import Theme from '../constants/Theme';

function Field({ label, value, onChangeText, placeholder, keyboard, multiline }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: Theme.colors.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5 }}>{label}</Text>
      <TextInput
        style={{
          backgroundColor: Theme.colors.surfaceAlt,
          borderWidth: 1, borderColor: Theme.colors.border,
          borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12,
          fontSize: 14, color: Theme.colors.text,
          height: multiline ? 70 : undefined,
          textAlignVertical: multiline ? 'top' : 'auto',
        }}
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

export default function PerfilScreen() {
  const [editMode, setEditMode] = useState(false);
  const [empresa, setEmpresa] = useState({
    nombre: '', slogan: '', rif: '', telefono: '', email: '', direccion: '',
  });

  useEffect(() => {
    getEmpresa().then(setEmpresa);
  }, []);

  const set = (field) => (val) => setEmpresa(e => ({ ...e, [field]: val }));

  const handleSave = async () => {
    if (!empresa.nombre.trim()) {
      Alert.alert('Campo requerido', 'El nombre de la empresa es obligatorio.');
      return;
    }
    await saveEmpresa(empresa);
    setEditMode(false);
    Alert.alert('Guardado', 'Datos actualizados. Se aplicarán en los próximos PDFs.');
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Theme.colors.border }}>
      <Ionicons name={icon} size={17} color={Theme.colors.primary} style={{ width: 26, marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 10, color: Theme.colors.muted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</Text>
        <Text style={{ fontSize: 14, color: value ? Theme.colors.text : Theme.colors.light, marginTop: 2 }}>{value || 'Sin datos'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

          {/* Header card */}
          <View style={{ backgroundColor: Theme.colors.dark, borderRadius: 14, padding: 24, alignItems: 'center', marginBottom: 16, ...Theme.shadow.md }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: Theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Ionicons name="shield-checkmark" size={30} color={Theme.colors.accent} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff', textAlign: 'center' }}>{empresa.nombre || 'Mi Empresa'}</Text>
            {empresa.slogan ? <Text style={{ fontSize: 12, color: Theme.colors.light, marginTop: 4, textAlign: 'center' }}>{empresa.slogan}</Text> : null}
          </View>

          {editMode ? (
            /* ── Modo edición ── */
            <View style={{ backgroundColor: Theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, ...Theme.shadow.xs }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: Theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 16 }}>Editar Datos de Empresa</Text>
              <Field label="Nombre de Empresa *" value={empresa.nombre}    onChangeText={set('nombre')}    placeholder="Ej: Servican C.A." />
              <Field label="Slogan / Descripción" value={empresa.slogan}   onChangeText={set('slogan')}    placeholder="Ej: Seguridad y CCTV Profesional" />
              <Field label="RIF / NIF"            value={empresa.rif}      onChangeText={set('rif')}       placeholder="J-XXXXXXXXX-X" />
              <Field label="Teléfono"             value={empresa.telefono} onChangeText={set('telefono')}  placeholder="+58 XXX XXX XXXX" keyboard="phone-pad" />
              <Field label="Correo Electrónico"   value={empresa.email}    onChangeText={set('email')}     placeholder="ventas@miempresa.com" keyboard="email-address" />
              <Field label="Dirección"            value={empresa.direccion} onChangeText={set('direccion')} placeholder="Ciudad, Estado, País" multiline />

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                <TouchableOpacity
                  onPress={() => { setEditMode(false); getEmpresa().then(setEmpresa); }}
                  style={{ flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1, borderColor: Theme.colors.border, alignItems: 'center' }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: Theme.colors.muted }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={{ flex: 1, paddingVertical: 13, borderRadius: 10, backgroundColor: Theme.colors.primary, alignItems: 'center', ...Theme.shadow.sm }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ── Modo vista ── */
            <>
              <View style={{ backgroundColor: Theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, ...Theme.shadow.xs }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: Theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Datos de la Empresa</Text>
                  <TouchableOpacity
                    onPress={() => setEditMode(true)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Theme.colors.primaryLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}
                  >
                    <Ionicons name="create-outline" size={14} color={Theme.colors.primary} />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: Theme.colors.primary }}>Editar</Text>
                  </TouchableOpacity>
                </View>
                <InfoRow icon="card-outline"     label="RIF"       value={empresa.rif} />
                <InfoRow icon="call-outline"     label="Teléfono"  value={empresa.telefono} />
                <InfoRow icon="mail-outline"     label="Email"     value={empresa.email} />
                <InfoRow icon="location-outline" label="Dirección" value={empresa.direccion} />
              </View>

              <View style={{ backgroundColor: Theme.colors.surface, borderRadius: 12, padding: 16, ...Theme.shadow.xs }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: Theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>Aplicación</Text>
                <InfoRow icon="phone-portrait-outline"   label="Versión"        value="1.0.0" />
                <InfoRow icon="server-outline"           label="Almacenamiento" value="Local (sin conexión)" />
                <InfoRow icon="document-text-outline"    label="PDF"            value="Los datos de empresa se usan en cada cotización" />
              </View>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
