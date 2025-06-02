import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const PixCaixaConfirmDataScreen = ({ route, navigation }: any) => {
  const { clickCount: prevClickCount = 0, accumulatedTime = 0 } = route.params || {};
  const [clickCount, setClickCount] = useState(prevClickCount);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentDate = new Date().toLocaleDateString("pt-BR");

  const receiver = {
    nome: "João da Silva",
    chavePix: "joao.silva@email.com",
    cpf: "***.456.789-**",
    instituicao: "Caixa Econômica",
  };

  const handlePress = (action?: () => void) => {
    setClickCount((prev: number) => prev + 1);
    console.log("Clique registrado. Total:", clickCount + 1);
    if (action) action();
  };

  const handleContinue = () => {
    const executionTime = (Date.now() - startTime) / 1000;
    const totalTime = accumulatedTime + executionTime;

    navigation.navigate("PixCaixaPasswordScreen", {
      clickCount: clickCount + 1,
      accumulatedTime: totalTime,
    });
  };

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.topTitle}>Confirme as informações</Text>

      <View style={styles.valueDateCard}>
        <View style={styles.valueBox}>
          <Text style={styles.label}>Valor</Text>
          <Text style={styles.value}>R$ 150,00</Text>
        </View>
        <View style={styles.dateBox}>
          <Text style={styles.label}>Data</Text>
          <Text style={styles.value}>{currentDate}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Dados do recebedor</Text>
      <View style={styles.underline} />

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.valueBold}>{receiver.nome}</Text>

        <Text style={styles.label}>Chave Pix</Text>
        <Text style={styles.valueBold}>{receiver.chavePix}</Text>

        <Text style={styles.label}>CPF</Text>
        <Text style={styles.valueBold}>{receiver.cpf}</Text>

        <Text style={styles.label}>Instituição</Text>
        <Text style={styles.valueBold}>{receiver.instituicao}</Text>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.7}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          handlePress();
          navigation.goBack();
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  topTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0077C1",
    marginBottom: 20,
  },
  // Cartão com sombra para Valor e Data
  valueDateCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    // Shadow para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevation para Android
    elevation: 5,
  },
  valueBox: {
    flex: 7,
    paddingRight: 12,
    justifyContent: "center",
    
  },
  dateBox: {
    flex: 3,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: "normal",
    color: "#000",
  },
  valueBold: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0077C1",
    marginBottom: 4,
  },
  underline: {
    height: 1,
    backgroundColor: "#0077C1",
    marginBottom: 12,
    width: "100%",
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
    paddingLeft: 8,
  },
  continueButton: {
    backgroundColor: "#FF8000",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#fff",
    borderColor: "#FF8000",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FF8000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
