import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { db } from "../../../firebase";

export const PixCaixaConfirmRecipientScreen = ({ navigation, route }: any) => {
  const [clickCount, setClickCount] = useState(route.params?.clickCount || 0);
  const [accumulatedTime, setAccumulatedTime] = useState(
    route.params?.accumulatedTime || 0
  );

  // Guarda o tempo inicial (quando a tela é aberta)
  const startTimeRef = useRef(Date.now());

  const uploadAnalyticsToFirebase = async (
    clickCount: number,
    executionTime: number
  ): Promise<boolean> => {
    function formatDuration(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins} min ${secs} s`;
    }

    try {
      const dataToSend = {
        clickCount,
        executionTime,
        executionTimeFormatted: formatDuration(executionTime),
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "dados app caixa - pix"), dataToSend);
      console.log("Analytics enviados para o Firebase com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao enviar analytics para o Firebase:", error);
      return false;
    }
  };

  const handleBackPress = async () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    const endTime = Date.now();
    const durationInSeconds = (endTime - startTimeRef.current) / 1000;

    console.log("----- Dados do Fluxo TED -----");
    console.log(`Total de cliques: ${newClickCount}`);
    console.log(`Tempo total do fluxo: ${durationInSeconds.toFixed(2)} segundos`);
    console.log(`Horário atual: ${new Date().toLocaleString()}`);
    console.log("------------------------------");

    await uploadAnalyticsToFirebase(newClickCount, durationInSeconds);

    navigation.navigate("Home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título topo */}
      <Text style={styles.sectionTitle}>Dados do Pagador</Text>
      <View style={styles.underline} />

      {/* Dados do Pagador */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>João da Silva</Text>

        <Text style={styles.label}>CPF</Text>
        <Text style={styles.value}>***.456.789-**</Text>

        <Text style={styles.label}>Instituição</Text>
        <Text style={styles.value}>Caixa Econômica</Text>
      </View>

      {/* Dados da Transação */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        Dados da Transação
      </Text>
      <View style={styles.underline} />

      <View style={styles.infoBox}>
        <Text style={styles.label}>Situação</Text>
        <Text style={styles.value}>Efetivado</Text>

        <Text style={styles.label}>Valor</Text>
        <Text style={styles.value}>R$ 1.500,00</Text>

        <Text style={styles.label}>Data / Hora</Text>
        <Text style={styles.value}>02/06/2025 14:35</Text>

        <Text style={styles.label}>ID Transação</Text>
        <Text style={styles.value}>1234567890</Text>

        <Text style={styles.label}>Código da Transação</Text>
        <Text style={styles.value}>ABCDEF123456</Text>

        <Text style={styles.label}>Chave de Segurança</Text>
        <Text style={styles.value}>0987654321</Text>

        <Text style={styles.label}>Chave Pix</Text>
        <Text style={styles.value}>joao.silva@email.com</Text>
      </View>

      {/* Aviso azul clarinho */}
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          Você poderá consultar futuramente essa e outras transações no item
          "Minhas Transações", opção "Consultas - Comprovantes"
        </Text>
      </View>

      {/* Botões horizontais */}
      <View style={styles.horizontalButtons}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="currency-usd" size={24} color="#0077C1" />
          <Text style={styles.iconButtonText}>Novo Pix</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Icon name="star-outline" size={24} color="#0077C1" />
          <Text style={styles.iconButtonText}>Favoritar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share-variant" size={24} color="#0077C1" />
          <Text style={styles.iconButtonText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

      {/* Botão voltar */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF", 
    flexGrow: 1,
    minHeight: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0077C1",
  },
  underline: {
    height: 1,
    backgroundColor: "#0077C1",
    marginTop: 4,
    marginBottom: 12,
    width: "100%",
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 12,
  },
  value: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
  },
  noticeBox: {
    backgroundColor: "#D9E9FF", // azul clarinho
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  noticeText: {
    color: "#003366", // azul escuro para texto no azul clarinho
    fontSize: 14,
    textAlign: "center",
  },
  horizontalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  iconButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B0CFFF", // borda azul clara
  },
  iconButtonText: {
    marginTop: 6,
    color: "#0077C1",
    fontWeight: "bold",
    fontSize: 14,
  },
  backButton: {
    marginTop: 24,
    borderWidth: 2, // borda mais fina
    borderColor: "#FF8000",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backButtonText: {
    color: "#FF8000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
