import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Theme from './src/constants/Theme';

import AppNavigator from './src/navigation/AppNavigator';
import { requestNotificationPermissions } from './src/services/notifications';
import ClienteFormScreen from './src/screens/ClienteFormScreen';
import NuevaCotizacionScreen from './src/screens/NuevaCotizacionScreen';
import CotizacionDetalleScreen from './src/screens/CotizacionDetalleScreen';
import ServicioFormScreen from './src/screens/ServicioFormScreen';

const Stack = createNativeStackNavigator();

const HEADER_OPTS = {
  headerStyle: { backgroundColor: Theme.colors.dark },
  headerTitleStyle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
};

export default function App() {
  useEffect(() => { requestNotificationPermissions(); }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={AppNavigator} />
          <Stack.Screen
            name="ClienteForm"
            component={ClienteFormScreen}
            options={({ route }) => ({
              ...HEADER_OPTS,
              headerShown: true,
              title: route.params?.cliente ? 'Editar Cliente' : 'Nuevo Cliente',
            })}
          />
          <Stack.Screen
            name="NuevaCotizacion"
            component={NuevaCotizacionScreen}
            options={({ route }) => ({
              ...HEADER_OPTS,
              headerShown: true,
              title: route.params?.cotizacion ? 'Editar Cotización' : 'Nueva Cotización',
            })}
          />
          <Stack.Screen
            name="CotizacionDetalle"
            component={CotizacionDetalleScreen}
            options={{ ...HEADER_OPTS, headerShown: true, title: 'Detalle de Cotización' }}
          />
          <Stack.Screen
            name="ServicioForm"
            component={ServicioFormScreen}
            options={({ route }) => ({
              ...HEADER_OPTS,
              headerShown: true,
              title: route.params?.servicio ? 'Editar Servicio' : 'Nuevo Servicio',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
