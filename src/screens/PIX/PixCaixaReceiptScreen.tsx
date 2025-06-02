import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PixCaixaButton } from "../../components/PIX CAIXA/PixCaixaButton";

export const PixCaixaReceiptScreen = ({ navigation }: any) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Comprovante</Text>

      <View style={styles.receiptBox}>
        <Text style={styles.item}>Valor: R$ 150,00</Text>
        <Text style={styles.item}>Destinatário: João da Silva</Text>
        <Text style={styles.item}>CPF: ***.456.789-**</Text>
        <Text style={styles.item}>Banco: Caixa Econômica</Text>
        <Text style={styles.item}>Data: 02/06/2025</Text>
        <Text style={styles.item}>Hora: 14:32</Text>
        <Text style={styles.item}>Transação: 123456789ABC</Text>
      </View>

      <PixCaixaButton
        title="Compartilhar"
        onPress={() => console.log("Compartilhar")}
      />
      <PixCaixaButton
        title="Concluir"
        onPress={() => navigation.popToTop()}
        variant="secondary"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F2F2F2",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#0077C1",
  },
  receiptBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  item: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
});
