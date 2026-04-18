import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';

import Theme from './src/constants/Theme';

import AppNavigator from './src/navigation/AppNavigator';
import ClienteFormScreen from './src/screens/ClienteFormScreen';
import NuevaCotizacionScreen from './src/screens/NuevaCotizacionScreen';
import CotizacionDetalleScreen from './src/screens/CotizacionDetalleScreen';

const Stack = createNativeStackNavigator();

const HEADER_OPTS = {
  headerStyle: { backgroundColor: Theme.colors.dark },
  headerTitleStyle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
};

export default function App() {
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
        </Stack.Navigator>
        <FlashMessage
          position="top"
          floating
          statusBarHeight={StatusBar.currentHeight}
          style={{ marginTop: Platform.OS === 'android' ? 30 : 0 }}
          titleStyle={{ paddingTop: 5 }}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
