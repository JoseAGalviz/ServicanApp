import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Theme from '../constants/Theme';
import styles from '../styles/LoginScreen.styles';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Campos requeridos', 'Ingresa tu usuario y contraseña.');
      return;
    }
    const result = await login(username, password);
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.background, { justifyContent: 'center' }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.logoContainer}>
              <Ionicons name="shield-checkmark" size={48} color={Theme.colors.primary} />
              <Text style={styles.appName}>Servican</Text>
              <Text style={styles.appSlogan}>Seguridad y CCTV Profesional</Text>
            </View>

            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor={Theme.colors.light}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInputBase]}
                placeholder="Contraseña"
                placeholderTextColor={Theme.colors.light}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                editable={!isLoading}
              />
              <TouchableOpacity style={styles.showPasswordButton} onPress={() => setShowPass(v => !v)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={Theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>{isLoading ? 'Ingresando...' : 'Ingresar'}</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
