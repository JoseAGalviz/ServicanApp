import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getClientes, deleteCliente } from '../services/storage';
import Theme from '../constants/Theme';
import styles from '../styles/ClientesScreen.styles';

export default function ClientesScreen({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    const data = await getClientes();
    setClientes(data.sort((a, b) => a.nombre.localeCompare(b.nombre)));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.empresa || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono || '').includes(search)
  );

  const confirmDelete = (cliente) => {
    Alert.alert(
      'Eliminar Cliente',
      `¿Eliminar a ${cliente.nombre}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => { await deleteCliente(cliente.id); load(); } },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ClienteForm', { cliente: item })}
      onLongPress={() => confirmDelete(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.nombre.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.nombre}</Text>
        {item.empresa ? <Text style={styles.cardEmpresa}>{item.empresa}</Text> : null}
        {item.telefono ? <Text style={styles.cardTel}>{item.telefono}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={Theme.colors.light} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Theme.colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar clientes..."
          placeholderTextColor={Theme.colors.light}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Theme.colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={Theme.colors.border} />
            <Text style={styles.emptyTitle}>{search ? 'Sin resultados' : 'Sin clientes'}</Text>
            <Text style={styles.emptyText}>{search ? 'Intenta otra búsqueda' : 'Toca + para agregar un cliente'}</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ClienteForm', {})}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
