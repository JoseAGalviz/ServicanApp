import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ClientesScreen from '../screens/ClientesScreen';
import CotizacionesScreen from '../screens/CotizacionesScreen';
import AgendaScreen from '../screens/AgendaScreen';
import PerfilScreen from '../screens/PerfilScreen';
import Theme from '../constants/Theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Inicio:       ['home', 'home-outline'],
  Clientes:     ['people', 'people-outline'],
  Cotizaciones: ['document-text', 'document-text-outline'],
  Agenda:       ['calendar', 'calendar-outline'],
  Perfil:       ['person-circle', 'person-circle-outline'],
};

export default function AppNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: Theme.colors.dark },
        headerTitleStyle: { color: '#fff', fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = TAB_ICONS[route.name] || ['ellipse', 'ellipse-outline'];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
        tabBarActiveTintColor: Theme.colors.accent,
        tabBarInactiveTintColor: Theme.colors.muted,
        tabBarStyle: {
          backgroundColor: Theme.colors.dark,
          borderTopWidth: 0,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Clientes" component={ClientesScreen} />
      <Tab.Screen name="Cotizaciones" component={CotizacionesScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
