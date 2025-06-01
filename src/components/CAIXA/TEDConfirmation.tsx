import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const TEDConfirmation = ({ data, onBack, onConfirm }: any) => {
  const [password, setPassword] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação de TED</Text>
      <Text>Confira os dados informados:</Text>

      <View style={styles.box}>
        <Text>Banco: {data.bank}</Text>
        <Text>Conta: {data.agency}-{data.account}-{data.digit}</Text>
        <Text>Nome: {data.name}</Text>
        <Text>CPF/CNPJ: {data.cpf}</Text>
        <Text>Valor: R$ {data.value}</Text>
        <Text>Tarifa: R$ 12,00</Text>
      </View>

      <TextInput style={styles.input} placeholder="Senha de transação" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.continueButton} onPress={onConfirm}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.cancelText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0039A6', marginBottom: 12 },
  box: { backgroundColor: '#F5F5F5', padding: 16, borderRadius: 6, marginVertical: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6 },
  continueButton: { backgroundColor: '#FF7A00', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  cancelText: { textAlign: 'center', color: '#FF7A00', marginTop: 10 },
});

export default TEDConfirmation;
