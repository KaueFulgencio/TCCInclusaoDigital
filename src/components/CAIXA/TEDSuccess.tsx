import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const TEDSuccess = ({ data }: { data: any }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/caixa-logo-01.png')} style={styles.logo} />
      <Text style={styles.title}>Transferência realizada com sucesso!</Text>
      <Text>Valor: R$ {data.value}</Text>
      <Text>Data/Hora: {new Date().toLocaleString('pt-BR')}</Text>
      <Text>Nome: {data.name}</Text>
      <Text>CPF/CNPJ: {data.cpf}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 150, height: 60, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0039A6', marginBottom: 12 },
});

export default TEDSuccess;
