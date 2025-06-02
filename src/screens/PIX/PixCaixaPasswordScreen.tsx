import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export const PixCaixaPasswordScreen = ({ route, navigation }: any) => {
  const { clickCount: prevClickCount = 0, accumulatedTime = 0 } =
    route.params || {};
  const [password, setPassword] = useState("");
  const inputRef = useRef<TextInput>(null);
  const [clickCount, setClickCount] = useState(prevClickCount);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const handlePress = (action?: () => void) => {
    setClickCount((prev: number) => prev + 1);
    console.log("Clique registrado. Total:", clickCount + 1);
    if (action) action();
  };

  const handleChange = (text: string) => {
    if (text.length <= 6) {
      setPassword(text);
    }
  };

  const handleContinue = () => {
    const executionTime = (Date.now() - startTime) / 1000;
    const totalTime = accumulatedTime + executionTime;

    navigation.navigate("PixCaixaConfirmRecipientScreen", {
      clickCount: clickCount + 1,
      executionTime: totalTime,
    });
  };

  const renderSquares = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <View key={i} style={styles.square}>
        {password.length > i && <Text style={styles.asterisk}>*</Text>}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Top bar: cadeado e X */}
      <View style={styles.topBar}>
        <MaterialIcons name="lock" size={64} color="#0077C1" />
        <TouchableOpacity
          onPress={() => {
            handlePress(), navigation.goBack();
          }}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Texto de instrução */}
      <Text style={styles.instructionText}>Informe sua senha da transação</Text>

      {/* Quadradinhos clicáveis */}
      <TouchableOpacity
        style={styles.squaresContainer}
        onPress={() => {
          handlePress(), inputRef.current?.focus();
        }}
        activeOpacity={1}
      >
        {renderSquares()}
      </TouchableOpacity>

      {/* Input invisível */}
      <TextInput
        ref={inputRef}
        value={password}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
        style={{ height: 0, width: 0 }}
        onFocus={() => handlePress()}
      />

      {/* Informações da conta */}
      <View style={styles.accountRow}>
        <Text style={styles.accountText}>Conta utilizada</Text>
        <Text style={styles.genericText}>ABCDDDDDDDDDD123131</Text>
      </View>

      {/* Botão continuar */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          password.length !== 6 && styles.continueButtonDisabled,
        ]}
        onPress={() => {
          handlePress();
          handleContinue();
        }}
        disabled={password.length !== 6}
        activeOpacity={0.8}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#F2F2F2",
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: [{ translateY: -24 }],
    padding: 10,
  },
  instructionText: {
    fontSize: 24,
    color: "#0077C1",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  squaresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 20,
    gap: 5, // Se estiver em React Native 0.71 ou superior
    // Se estiver em versão anterior, comente a linha acima e use marginHorizontal no square
  },
  square: {
    width: 55,
    height: 55,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#0077C1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    // Para aumentar o espaço, se não usar "gap":
    // marginHorizontal: 8,
  },
  asterisk: {
    color: "#0077C1",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  accountRow: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginHorizontal: 40,
    marginBottom: 40,
    alignItems: "center",
  },
  accountText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
  },
  genericText: {
    fontSize: 18,
    color: "#666",
    marginLeft: 20,
  },
  continueButton: {
    backgroundColor: "#FF8000",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginHorizontal: 40,
    marginBottom: 40,
  },
  continueButtonDisabled: {
    backgroundColor: "#FFA64D",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  key: {
    width: "28%",
    aspectRatio: 1,
    margin: "2%",
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  keyText: {
    fontSize: 32,
    color: "#333",
  },
});
