import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getCotizaciones } from '../services/storage';
import Theme from '../constants/Theme';
import styles from '../styles/CotizacionesScreen.styles';

const STATUS_COLOR = {
  borrador:  Theme.colors.statusBorrador,
  enviada:   Theme.colors.statusEnviada,
  aprobada:  Theme.colors.statusAprobada,
  rechazada: Theme.colors.statusRechazada,
};

const STATUS_LABEL = { borrador: 'Borrador', enviada: 'Enviada', aprobada: 'Aprobada', rechazada: 'Rechazada' };
const CARD_BORDER  = { borrador: styles.cardBorrador, enviada: styles.cardEnviada, aprobada: styles.cardAprobada, rechazada: styles.cardRechazada };
const FILTROS = ['todas', 'borrador', 'enviada', 'aprobada', 'rechazada'];

const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
  : '';

const fmtMoney = (n) => Number(n || 0).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CotizacionesScreen({ navigation }) {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filtro, setFiltro] = useState('todas');

  const load = useCallback(async () => {
    const data = await getCotizaciones();
    setCotizaciones(data.reverse());
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = filtro === 'todas' ? cotizaciones : cotizaciones.filter(c => c.estado === filtro);

  const renderItem = ({ item }) => {
    const symbol = item.moneda === 'USD' ? '$' : 'Bs.';
    return (
      <TouchableOpacity
        style={[styles.card, CARD_BORDER[item.estado]]}
        onPress={() => navigation.navigate('CotizacionDetalle', { cotizacionId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardNum}>{item.numero}</Text>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.estado] || '#ccc' }]}>
            <Text style={styles.statusText}>{STATUS_LABEL[item.estado] || item.estado}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 }}>
          <Ionicons name="person-outline" size={13} color={Theme.colors.muted} />
          <Text style={{ fontSize: 13, color: Theme.colors.muted, flex: 1 }} numberOfLines={1}>
            {item.clienteNombre || 'Sin cliente'}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardDate}>{fmtDate(item.fecha)}</Text>
            <Text style={{ fontSize: 11, color: Theme.colors.light, marginTop: 1 }}>
              {item.items?.length || 0} ítem{(item.items?.length || 0) !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, color: Theme.colors.muted, marginBottom: 1 }}>{item.moneda}</Text>
            <Text style={styles.cardTotal}>{symbol} {fmtMoney(item.total)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {FILTROS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filtro === f && styles.filterChipActive]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filterChipText, filtro === f && styles.filterChipTextActive]}>
              {f === 'todas' ? 'Todas' : STATUS_LABEL[f]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={52} color={Theme.colors.border} />
            <Text style={styles.emptyTitle}>Sin cotizaciones</Text>
            <Text style={styles.emptyText}>Toca + para crear una cotización</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NuevaCotizacion', {})}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
