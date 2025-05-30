import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { useAccessibility } from "../context/AccessibilityContext";
import { collection, addDoc } from 'firebase/firestore';
import { db } from "../../firebase"; 

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { settings, analytics } = useAccessibility();
  const { fontSize, highContrast, zoomEnabled } = settings;
  const { executionTime, clickCount, lastAccessed } = analytics;

  const { uploadAnalyticsToFirebase } = useAccessibility();

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
        onPress={async () => {
            try {
              await addDoc(collection(db, "usuarios"), {
                nome: "Kaue",
                idade: 30,
              });
              alert("Usuário salvo com sucesso!");
            } catch (e) {
              console.error("Erro ao adicionar documento: ", e);
            }
        }}
        style={dynamicStyles.button}
        labelStyle={dynamicStyles.buttonText}
        contentStyle={dynamicStyles.buttonContent}
      >
        <Icon
          name="cloud-upload"
          size={24 + (zoomEnabled ? 6 : 0)}
          style={dynamicStyles.icon}
        />
        Enviar dados ao Firebase
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

      <View style={dynamicStyles.analyticsContainer}>
        <Text style={dynamicStyles.analyticsText}>
          Último acesso: {lastAccessed || "N/A"}
        </Text>
        <Text style={dynamicStyles.analyticsText}>
          Tempo médio: {executionTime ? `${executionTime}s` : "N/A"}
        </Text>
        <Text style={dynamicStyles.analyticsText}>
          Interações: {clickCount || 0}
        </Text>
      </View>

      
    </ScrollView>
  );
};

export default HomeScreen;
