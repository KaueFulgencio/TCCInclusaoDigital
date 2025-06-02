import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAccessibility } from "../context/AccessibilityContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";

type SuccessScreenRouteProp = RouteProp<RootStackParamList, "Success">;

const SuccessScreen = () => {
  const { settings, uploadAnalyticsToFirebase } = useAccessibility();
  const [startTime, setStartTime] = useState<number>(Date.now());
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showButton, setShowButton] = React.useState(false);
  const buttonTimer = useRef<NodeJS.Timeout | null>(null);
  const route = useRoute<SuccessScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { transferData, clickCount, executionTime } = route.params;

  const colors = {
    background: settings.highContrast ? "#000" : "#F8F9FA",
    text: settings.highContrast ? "#FFD700" : "#2F2F2F",
    icon: settings.highContrast ? "#FFD700" : "#4CAF50",
    button: settings.highContrast ? "#333" : "#6200ee",
  };

  useEffect(() => {
    console.log("Params recebidos:", route.params);
    console.log("clickCount:", clickCount);
    console.log("executionTime:", executionTime);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    buttonTimer.current = setTimeout(() => setShowButton(true), 2000);

    return () => {
      if (buttonTimer.current) clearTimeout(buttonTimer.current);
    };
  }, []);

  const handleGoHome = async () => {
    const now = new Date();
    const formattedDate = now.toLocaleString();

    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;

    console.log("==== Analytics Log ====");
    console.log(`Cliques: ${clickCount}`);
    console.log(`Tempo de execução: ${executionTime?.toFixed(2)}s`);
    console.log(`Data e hora: ${formattedDate}`);
    console.log("=======================");

    await uploadAnalyticsToFirebase(clickCount ?? 0, executionTime ?? 0);
    navigation.navigate("Home");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
        accessible
        accessibilityLabel="Transferência realizada com sucesso"
      >
        <Icon
          name="check-circle"
          size={100}
          color={colors.icon}
          accessibilityElementsHidden
        />

        <Text
          style={[
            styles.title,
            {
              fontSize: settings.fontSize + 8,
              color: colors.text,
            },
          ]}
          accessibilityRole="header"
        >
          Sucesso!
        </Text>

        <Text
          style={[
            styles.message,
            {
              fontSize: settings.fontSize,
              color: colors.text,
            },
          ]}
        >
          Transferência concluída com êxito
        </Text>

        {/* Exibe os dados de analytics */}
        <Text
          style={[
            styles.message,
            {
              fontSize: settings.fontSize - 2,
              color: colors.text,
            },
          ]}
        >
          Cliques: {clickCount} | Tempo: {(executionTime ?? 0).toFixed(2)}s
        </Text>

        {showButton && (
          <Button
            mode="contained"
            onPress={handleGoHome}
            style={[styles.button, { backgroundColor: colors.button }]}
            labelStyle={[
              styles.buttonText,
              {
                fontSize: settings.fontSize,
                color: settings.highContrast ? "#000" : "#FFF",
              },
            ]}
            accessibilityLabel="Voltar para página inicial"
            accessibilityHint="Retorna à tela principal do aplicativo"
          >
            Voltar ao Início
          </Button>
        )}
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 30,
    maxWidth: "80%",
  },
  button: {
    marginTop: 20,
    width: "80%",
  },
  buttonText: {
    fontWeight: "bold",
  },
});

export default SuccessScreen;
