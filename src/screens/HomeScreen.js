import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getClientes, getCotizaciones } from '../services/storage';
import { STATUS_COLOR } from '../utils/cotizacionHelpers';
import Theme from '../constants/Theme';
import styles from '../styles/HomeScreen.styles';

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({ clientes: 0, cotizaciones: 0, aprobadas: 0 });
  const [recientes, setRecientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [clientes, cotizaciones] = await Promise.all([getClientes(), getCotizaciones()]);
      setStats({
        clientes: clientes.length,
        cotizaciones: cotizaciones.length,
        aprobadas: cotizaciones.filter(c => c.estado === 'aprobada').length,
      });
      setRecientes(cotizaciones.slice(-5).reverse());
    } catch {
      Alert.alert('Error', 'No se pudo cargar el resumen.');
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} colors={[Theme.colors.primary]} />}
      >
        <Text style={styles.greeting}>Servican</Text>
        <Text style={styles.subtitle}>Resumen de actividad</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={22} color={Theme.colors.primary} />
            <Text style={styles.statNumber}>{stats.clientes}</Text>
            <Text style={styles.statLabel}>Clientes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="document-text-outline" size={22} color={Theme.colors.accent} />
            <Text style={[styles.statNumber, { color: Theme.colors.accent }]}>{stats.cotizaciones}</Text>
            <Text style={styles.statLabel}>Cotizaciones</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={22} color={Theme.colors.success} />
            <Text style={[styles.statNumber, { color: Theme.colors.success }]}>{stats.aprobadas}</Text>
            <Text style={styles.statLabel}>Aprobadas</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ClienteForm', {})}>
          <View style={[styles.actionIconBox, { backgroundColor: Theme.colors.primaryLight }]}>
            <Ionicons name="person-add-outline" size={22} color={Theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionLabel}>Nuevo Cliente</Text>
            <Text style={styles.actionSub}>Registrar cliente</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Theme.colors.light} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('NuevaCotizacion', {})}>
          <View style={[styles.actionIconBox, { backgroundColor: Theme.colors.accentLight }]}>
            <Ionicons name="add-circle-outline" size={22} color={Theme.colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionLabel}>Nueva Cotización</Text>
            <Text style={styles.actionSub}>Crear presupuesto</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Theme.colors.light} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Cotizaciones Recientes</Text>

        {recientes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Sin cotizaciones aún</Text>
          </View>
        ) : (
          recientes.map(cot => (
            <TouchableOpacity
              key={cot.id}
              style={styles.recentItem}
              onPress={() => navigation.navigate('CotizacionDetalle', { cotizacionId: cot.id })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.recentTitle}>{cot.numero}</Text>
                <Text style={styles.recentSub}>{cot.clienteNombre || 'Cliente'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: Theme.colors.primary }}>
                  {cot.moneda} {Number(cot.total || 0).toFixed(2)}
                </Text>
                <View style={{ backgroundColor: STATUS_COLOR[cot.estado] || Theme.colors.light, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 3 }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: '#fff', textTransform: 'uppercase' }}>{cot.estado}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
