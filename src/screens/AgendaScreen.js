import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getServicios, toggleServicioEstado, deleteServicio, saveServicio } from '../services/storage';
import { cancelServicioNotification, scheduleServicioNotification, requestNotificationPermissions } from '../services/notifications';
import Theme from '../constants/Theme';
import styles from '../styles/AgendaScreen.styles';

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_HEADERS = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];

function buildCalendarDays(year, month) {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfWeek + 6) % 7; // Mon = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function toISO(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function AgendaScreen({ navigation }) {
  const today = new Date();
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

  const [year,        setYear]        = useState(today.getFullYear());
  const [month,       setMonth]       = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [servicios,   setServicios]   = useState([]);
  const [loading,     setLoading]     = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setServicios(await getServicios()); }
    catch { Alert.alert('Error', 'No se pudo cargar la agenda.'); }
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const calendarDays = useMemo(() => buildCalendarDays(year, month), [year, month]);

  const serviceDays = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
    const set = new Set();
    servicios.forEach(s => {
      if (s.fechaISO?.startsWith(prefix)) {
        set.add(parseInt(s.fechaISO.split('-')[2], 10));
      }
    });
    return set;
  }, [servicios, year, month]);

  const selectedISO = selectedDay ? toISO(year, month, selectedDay) : null;

  const selectedServicios = useMemo(() => {
    if (!selectedISO) return [];
    return [...servicios.filter(s => s.fechaISO === selectedISO)]
      .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
  }, [servicios, selectedISO]);

  const handleToggle = async (servicio) => {
    try {
      if (servicio.notificationIds) await cancelServicioNotification(servicio.notificationIds);
      const updated = await toggleServicioEstado(servicio.id);
      if (updated) {
        if (updated.estado === 'pendiente') {
          const granted = await requestNotificationPermissions();
          updated.notificationIds = granted ? await scheduleServicioNotification(updated) : null;
        } else {
          updated.notificationIds = null;
        }
        await saveServicio(updated);
      }
      load();
    } catch { Alert.alert('Error', 'No se pudo actualizar el estado.'); }
  };

  const handleDelete = (s) => {
    Alert.alert('Eliminar', `¿Eliminar "${s.descripcion}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            if (s.notificationIds) await cancelServicioNotification(s.notificationIds);
            await deleteServicio(s.id); load();
          } catch { Alert.alert('Error', 'No se pudo eliminar.'); }
        },
      },
    ]);
  };

  const renderWeeks = () => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(
        <View key={i} style={styles.weekRow}>
          {calendarDays.slice(i, i + 7).map((day, j) => {
            if (!day) return <View key={j} style={styles.dayCell} />;
            const iso       = toISO(year, month, day);
            const isToday   = iso === todayISO;
            const isSelected = day === selectedDay;
            const hasDot    = serviceDays.has(day);
            return (
              <TouchableOpacity
                key={j}
                style={[styles.dayCell, isSelected && styles.dayCellSelected, isToday && !isSelected && styles.dayCellToday]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected, isToday && !isSelected && styles.dayTextToday]}>
                  {day}
                </Text>
                {hasDot && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return weeks;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Month navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={22} color={Theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={22} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Day headers */}
        <View style={styles.weekRow}>
          {DAY_HEADERS.map(d => (
            <View key={d} style={styles.dayCell}>
              <Text style={styles.dayHeader}>{d}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarCard}>
          {renderWeeks()}
        </View>

        {/* Service list */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>
            {selectedDay ? `${selectedDay} de ${MONTH_NAMES[month]}` : 'Selecciona un día'}
          </Text>

          {loading ? (
            <ActivityIndicator color={Theme.colors.primary} style={{ marginTop: 24 }} />
          ) : selectedServicios.length === 0 ? (
            <View style={styles.emptyDay}>
              <Ionicons name="calendar-outline" size={40} color={Theme.colors.border} />
              <Text style={styles.emptyDayText}>
                {selectedDay ? 'Sin servicios para este día' : 'Toca un día del calendario'}
              </Text>
            </View>
          ) : (
            selectedServicios.map(s => (
              <View key={s.id} style={[styles.servicioCard, s.estado === 'completado' && styles.servicioCardDone]}>
                <TouchableOpacity style={styles.checkBtn} onPress={() => handleToggle(s)}>
                  <Ionicons
                    name={s.estado === 'completado' ? 'checkmark-circle' : 'ellipse-outline'}
                    size={26}
                    color={s.estado === 'completado' ? Theme.colors.success : Theme.colors.muted}
                  />
                </TouchableOpacity>
                <View style={styles.servicioInfo}>
                  <View style={styles.servicioTopRow}>
                    <Text style={styles.servicioHora}>{s.hora || '–'}</Text>
                    {s.cotizacionNumero ? (
                      <Text style={styles.cotizRef}>{s.cotizacionNumero}</Text>
                    ) : null}
                  </View>
                  <Text style={[styles.servicioDesc, s.estado === 'completado' && styles.servicioDescDone]}>
                    {s.descripcion}
                  </Text>
                  {s.clienteNombre ? (
                    <View style={styles.servicioClientRow}>
                      <Ionicons name="person-outline" size={12} color={Theme.colors.muted} />
                      <Text style={styles.servicioCliente}>{s.clienteNombre}</Text>
                    </View>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('ServicioForm', { servicio: s })}
                >
                  <Ionicons name="create-outline" size={18} color={Theme.colors.muted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(s)}>
                  <Ionicons name="trash-outline" size={18} color={Theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ServicioForm', selectedISO ? { fechaISO: selectedISO } : {})}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
