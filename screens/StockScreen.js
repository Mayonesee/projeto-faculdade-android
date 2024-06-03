import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StockScreen() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    }
  };

  const saveProducts = async (newProducts) => {
    try {
      await AsyncStorage.setItem('products', JSON.stringify(newProducts));
      setProducts(newProducts);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os produtos.');
    }
  };

  const addProduct = () => {
    if (!name || !category || !quantity || !expiryDate) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const newProduct = {
      id: editingProductId || new Date().getTime().toString(),
      name,
      category,
      quantity,
      expiryDate
    };

    const newProducts = editingProductId
      ? products.map(p => (p.id === editingProductId ? newProduct : p))
      : [...products, newProduct];

    saveProducts(newProducts);
    resetForm();
  };

  const editProduct = (product) => {
    setName(product.name);
    setCategory(product.category);
    setQuantity(product.quantity);
    setExpiryDate(product.expiryDate);
    setEditingProductId(product.id);
  };

  const deleteProduct = (id) => {
    const newProducts = products.filter(product => product.id !== id);
    saveProducts(newProducts);
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setQuantity('');
    setExpiryDate('');
    setEditingProductId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
      </View>
      <View style={styles.middleSection}>
        <Text style={styles.appName}>Gerenciador de Estoque</Text>
        <Text style={styles.appVersion}>Versão 1.1</Text>
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={() => Linking.openURL('https://wa.me/?text=Falta Farinha&phone=21999668306')}>
          <Text style={styles.whatsappButtonText}>Contatar via WhatsApp</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Produto"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Categoria"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Validade"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <Button title={editingProductId ? "Salvar Alterações" : "Adicionar Produto"} onPress={addProduct} />
      </View>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.name} - {item.category} - {item.quantity} - {item.expiryDate}</Text>
            <View style={styles.productButtons}>
              <Button title="Editar" onPress={() => editProduct(item)} />
              <Button title="Excluir" onPress={() => deleteProduct(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topSection: {
    marginBottom: 20,
  },
  middleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  appVersion: {
    fontSize: 16,
    color: 'gray',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  whatsappButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 7,
    borderRadius: 20,
  },
  productItem: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
  },
  productButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});