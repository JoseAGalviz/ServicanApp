import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('servicios', {
      name: 'Servicios Técnicos',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

const buildBody = (servicio) => {
  const desc = servicio.clienteNombre
    ? `${servicio.descripcion} · ${servicio.clienteNombre}`
    : servicio.descripcion;
  return servicio.hora ? `${servicio.hora} — ${desc}` : desc;
};

export const scheduleServicioNotification = async (servicio) => {
  const [year, month, day] = servicio.fechaISO.split('-').map(Number);
  const now = new Date();
  const ids = [];

  const schedule = async (title, date) => {
    if (date <= now) return;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: buildBody(servicio),
        sound: true,
        data: { servicioId: servicio.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: 'servicios',
      },
    });
    ids.push(id);
  };

  // Día anterior a las 8:00 AM
  await schedule('Servicio técnico mañana', new Date(year, month - 1, day - 1, 8, 0, 0));

  // Mismo día a las 7:00 AM
  await schedule('Servicio técnico hoy', new Date(year, month - 1, day, 7, 0, 0));

  // 1 hora antes (solo si hay hora definida)
  if (servicio.hora) {
    const [h, m] = servicio.hora.split(':').map(Number);
    const oneHourBefore = new Date(year, month - 1, day, h, m, 0) - 60 * 60 * 1000;
    await schedule('Servicio técnico en 1 hora', new Date(oneHourBefore));
  }

  return ids.length > 0 ? ids : null;
};

export const cancelServicioNotification = async (notificationIds) => {
  if (!notificationIds) return;
  const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
  for (const id of ids) {
    try { await Notifications.cancelScheduledNotificationAsync(id); } catch (_) {}
  }
};
