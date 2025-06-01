import React, { useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { useAccessibility } from "../context/AccessibilityContext";

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    settings,
    analytics,
    uploadAnalyticsToFirebase,
    saveUserToFirebase,
    saveTransactionToFirebase,
  } = useAccessibility();

  const { fontSize, highContrast, zoomEnabled } = settings;
  const { executionTime, clickCount, lastAccessed } = analytics;

  const handleSaveUser = useCallback(async () => {
    try {
      const userData = {
        name: "Usuário Teste",
        email: "teste@example.com",
        phone: "+5511999999999",
        accessCount: 1,
        settings: settings,
      };

      await saveUserToFirebase(userData);
      alert("Usuário salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário");
    }
  }, [saveUserToFirebase, settings]);

  const handleSaveTestTransaction = useCallback(async () => {
    try {
      const transactionData = {
        type: "PIX",
        amount: 100.5,
        recipient: "Test Recipient",
        status: "completed",
      };

      await saveTransactionToFirebase(transactionData);
      alert("Transação teste salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      alert("Erro ao salvar transação");
    }
  }, [saveTransactionToFirebase]);

  const handleUploadAnalytics = useCallback(async () => {
    try {
      await uploadAnalyticsToFirebase("testUser123");
      alert("Analytics enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar analytics:", error);
      alert("Erro ao enviar analytics");
    }
  }, [uploadAnalyticsToFirebase]);

  const dynamicStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: zoomEnabled ? 30 : 20,
      backgroundColor: highContrast ? "#000" : "#f5f5f5",
    },
    title: {
      fontSize: fontSize + (zoomEnabled ? 6 : 0),
      fontWeight: "bold",
      marginBottom: 30,
      textAlign: "center",
      color: highContrast ? "#fff" : "#333",
    },
    button: {
      marginVertical: 10,
      paddingVertical: zoomEnabled ? 20 : 15,
      borderRadius: 10,
      backgroundColor: highContrast ? "#FFD700" : "#6200ee",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: fontSize + (zoomEnabled ? 4 : 0),
      color: highContrast ? "#000" : "#fff",
    },
    buttonContent: {
      height: zoomEnabled ? 60 : 50,
    },
    icon: {
      marginRight: 10,
      color: highContrast ? "#000" : "white",
    },
    analyticsContainer: {
      marginTop: 20,
      padding: 15,
      borderRadius: 10,
      backgroundColor: highContrast ? "#333" : "#e0e0e0",
    },
    analyticsText: {
      fontSize: fontSize - 2,
      color: highContrast ? "#fff" : "#333",
      marginBottom: 5,
    },
  });

  return (
    <ScrollView contentContainerStyle={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Inclusão Digital</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("Acessibilidade")}
        style={dynamicStyles.button}
        labelStyle={dynamicStyles.buttonText}
        contentStyle={dynamicStyles.buttonContent}
      >
        <Icon
          name="cog"
          size={24 + (zoomEnabled ? 6 : 0)}
          style={dynamicStyles.icon}
        />
        Configurações de Acessibilidade
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("TED")}
        style={dynamicStyles.button}
        labelStyle={dynamicStyles.buttonText}
        contentStyle={dynamicStyles.buttonContent}
      >
        <Icon
          name="bank-transfer"
          size={24 + (zoomEnabled ? 6 : 0)}
          style={dynamicStyles.icon}
        />
        Transferência Eletrônica (TED)
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("Pix")}
        style={dynamicStyles.button}
        labelStyle={dynamicStyles.buttonText}
        contentStyle={dynamicStyles.buttonContent}
      >
        <Icon
          name="cash-fast"
          size={24 + (zoomEnabled ? 6 : 0)}
          style={dynamicStyles.icon}
        />
        Enviar PIX
      </Button>

      <Button
        mode="contained"
        onPress={handleSaveUser}
        style={dynamicStyles.button}
        labelStyle={dynamicStyles.buttonText}
        contentStyle={dynamicStyles.buttonContent}
      >
        <Icon
          name="account-plus"
          size={24 + (zoomEnabled ? 6 : 0)}
          style={dynamicStyles.icon}
        />
        Salvar Usuário Teste
      </Button>

      <Button
        mode="contained"
        onPress={handleSaveTestTransaction}
        style={dynamicStyles.button}
        labelStyle={dynamicStyles.buttonText}
        contentStyle={dynamicStyles.buttonContent}
      >
        <Icon
          name="cash-multiple"
          size={24 + (zoomEnabled ? 6 : 0)}
          style={dynamicStyles.icon}
        />
        Salvar Transação Teste
      </Button>

      <Button
        mode="contained"
        onPress={handleUploadAnalytics}
        style={dynamicStyles.button}
        labelStyle={dynamicStyles.buttonText}
        contentStyle={dynamicStyles.buttonContent}
      >
        <Icon
          name="cloud-upload"
          size={24 + (zoomEnabled ? 6 : 0)}
          style={dynamicStyles.icon}
        />
        Enviar Analytics
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("History")}
        style={dynamicStyles.button}
        labelStyle={dynamicStyles.buttonText}
        contentStyle={dynamicStyles.buttonContent}
      >
        <Icon
          name="history"
          size={24 + (zoomEnabled ? 6 : 0)}
          style={dynamicStyles.icon}
        />
        Histórico de Transações
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("TEDFlow")}
        style={dynamicStyles.button}
        labelStyle={dynamicStyles.buttonText}
        contentStyle={dynamicStyles.buttonContent}
      >
        <Icon
          name="transfer"
          size={24 + (zoomEnabled ? 6 : 0)}
          style={dynamicStyles.icon}
        />
        Fluxo de TED CAIXA
      </Button>

      <View style={dynamicStyles.analyticsContainer}>
        <Text style={dynamicStyles.analyticsText}>
          Último acesso: {lastAccessed || "N/A"}
        </Text>
        <Text style={dynamicStyles.analyticsText}>
          Tempo médio: {executionTime ? `${executionTime.toFixed(2)}s` : "N/A"}
        </Text>
        <Text style={dynamicStyles.analyticsText}>
          Interações: {clickCount || 0}
        </Text>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
