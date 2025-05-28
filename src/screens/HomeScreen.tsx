import React from "react";
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
  const { settings, analytics } = useAccessibility();
  const { fontSize, highContrast, zoomEnabled } = settings;
  const { executionTime, clickCount, lastAccessed } = analytics;

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
      backgroundColor: highContrast ? "#FFD700" : "#6200ee", // Amarelo no alto contraste
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
    </ScrollView>
  );
};

export default HomeScreen;
