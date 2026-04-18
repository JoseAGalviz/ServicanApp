import React from 'react';
import { View, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Theme from '../constants/Theme';
import styles from '../styles/CustomDrawerContent.styles';

export default function CustomDrawerContent(props) {
  const { user, logout } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={32} color="#fff" />
        <Text style={styles.appName}>Servican</Text>
        <Text style={styles.appSlogan}>Seguridad y CCTV Profesional</Text>
      </View>

      <View style={{ flex: 1, marginTop: 8 }}>
        <DrawerItemList {...props} />
      </View>

      {user && (
        <View style={{ padding: Theme.spacing.lg, borderTopWidth: 1, borderTopColor: Theme.colors.border }}>
          <Text style={styles.userName}>{user.nombre}</Text>
          <Text style={styles.userRole}>{user.rol}</Text>
        </View>
      )}

      <DrawerItem
        label="Cerrar Sesión"
        onPress={logout}
        icon={({ color, size }) => <Ionicons name="log-out-outline" color="#fff" size={size} />}
        style={{ backgroundColor: Theme.colors.error, borderRadius: Theme.radius.md, margin: Theme.spacing.md }}
        labelStyle={{ color: '#fff', fontWeight: '700' }}
      />
    </DrawerContentScrollView>
  );
}
