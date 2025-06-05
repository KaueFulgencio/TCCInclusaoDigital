import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAccessibility } from "../context/AccessibilityContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

type PixScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Pix">;
};

const PixScreen: React.FC<PixScreenProps> = ({ navigation }) => {
  const { settings, colors, incrementClickCount } = useAccessibility();

  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("0,00");
  const [pixKey, setPixKey] = useState("");
  const [step, setStep] = useState(1);
  const [showContacts, setShowContacts] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const startTimeRef = useRef(Date.now());

  const contacts = [
    { id: 1, name: "João Silva", key: "123.456.789-00", keyType: "CPF" },
    {
      id: 2,
      name: "Maria Souza",
      key: "maria.souza@email.com",
      keyType: "E-mail",
    },
    {
      id: 3,
      name: "Empresa XYZ",
      key: "+55 11 98765-4321",
      keyType: "Telefone",
    },
    {
      id: 4,
      name: "Carlos Oliveira",
      key: "carlos.oliveira@email.com",
      keyType: "E-mail",
    },
    { id: 5, name: "Ana Santos", key: "987.654.321-00", keyType: "CPF" },
  ];

  const handlePress = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      console.log("Clique registrado. Total:", newCount);
      return newCount;
    });
  };

  const formatCurrency = (value: string) => {
    let numericValue = value.replace(/\D/g, "");
    numericValue = numericValue.padStart(3, "0");

    const real = numericValue.slice(0, -2);
    const cents = numericValue.slice(-2);

    return `${real ? parseInt(real).toLocaleString("pt-BR") : "0"},${cents}`;
  };

  useEffect(() => {
    setFormattedAmount(formatCurrency(amount));
  }, [amount]);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  const uploadAnalyticsToFirebase = async (clickCount: number, executionTime: number) => {
    function formatDuration(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      const millis = Math.floor((seconds - Math.floor(seconds)) * 1000);

      return `${mins} min ${secs} s`;
    }

    try {
      const dataToSend = {
        clickCount,
        executionTime,
        currentTime: new Date().toLocaleString("pt-BR"),
        timestamp: serverTimestamp(),
        executionTimeFormatted: formatDuration(executionTime),
      };

      await addDoc(collection(db, "pix_analytics"), dataToSend);
      console.log("Dados enviados para o Firebase com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao enviar dados para o Firebase:", error);
      return false;
    }
  };

  const handleContinue = async () => {
    handlePress();

    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const newClickCount = clickCount + 1;

        const endTime = Date.now();
        const executionTime = (endTime - startTimeRef.current) / 1000;

        const success = await uploadAnalyticsToFirebase(newClickCount, executionTime);

        const transferData = {
          transferType: "Pix",
          bank: "",
          account: "",
          value: amount,
          recipientName: "",
        };

        if (success) {
          navigation.navigate("Success", {
            transferData,
            clickCount: newClickCount,
            executionTime,
          });
        } else {
          alert("Ocorreu um erro ao registrar os dados");
        }
      } catch (error) {
        console.error("Erro ao processar transação:", error);
        alert("Ocorreu um erro durante o processamento");
      }
    }
  };

  const handleContactSelect = (contact: (typeof contacts)[0]) => {
    handlePress();
    setPixKey(contact.key);
    setShowContacts(false);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.cardBackground },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            fontSize: settings.fontSize + 4,
            color: colors.text,
          },
        ]}
      >
        {step === 1 && "Enviar PIX"}
        {step === 2 && !showContacts && "Informe a Chave"}
        {step === 2 && showContacts && "Selecione um Contato"}
        {step === 3 && "Confirme os Dados"}
      </Text>

      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text
            style={[
              styles.label,
              {
                fontSize: settings.fontSize,
                color: colors.text,
              },
            ]}
          >
            Valor a enviar
          </Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Text
              style={[
                styles.currencySymbol,
                {
                  fontSize: settings.fontSize,
                  color: colors.text,
                },
              ]}
            >
              R$
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  fontSize: settings.fontSize,
                  color: colors.text,
                },
              ]}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
              }}
              placeholder="0,00"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              accessibilityLabel="Campo para inserir o valor do PIX"
              onFocus={handlePress}
            />
            {amount && (
              <Text
                style={[
                  styles.formattedValue,
                  {
                    fontSize: settings.fontSize,
                    color: colors.placeholder,
                  },
                ]}
              >
                {formattedAmount}
              </Text>
            )}
          </View>
        </View>
      )}

      {step === 2 && !showContacts && (
        <View style={styles.stepContainer}>
          <Text
            style={[
              styles.label,
              {
                fontSize: settings.fontSize,
                color: colors.text,
              },
            ]}
          >
            Chave PIX
          </Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput
              style={[
                styles.input,
                {
                  fontSize: settings.fontSize,
                  color: colors.text,
                },
              ]}
              value={pixKey}
              onChangeText={(text) => {
                setPixKey(text);
              }}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              placeholderTextColor={colors.placeholder}
              accessibilityLabel="Campo para inserir a chave PIX"
              onFocus={handlePress}
            />
          </View>
          <View style={styles.pixKeyOptions}>
            <TouchableOpacity
              style={styles.pixKeyOption}
              onPress={() => {
                handlePress();
                console.log("QR Code pressed");
              }}
            >
              <Icon name="qrcode-scan" size={24} color={colors.text} />
              <Text
                style={[
                  styles.pixKeyOptionText,
                  {
                    fontSize: settings.fontSize,
                    color: colors.text,
                  },
                ]}
              >
                Ler QR Code
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pixKeyOption}
              onPress={() => {
                handlePress();
                setShowContacts(true);
              }}
            >
              <Icon name="contacts" size={24} color={colors.text} />
              <Text
                style={[
                  styles.pixKeyOptionText,
                  {
                    fontSize: settings.fontSize,
                    color: colors.text,
                  },
                ]}
              >
                Contatos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 2 && showContacts && (
        <View style={styles.stepContainer}>
          <TouchableOpacity
            onPress={() => {
              handlePress();
              setShowContacts(false);
            }}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color={colors.text} />
            <Text
              style={[
                styles.backButtonText,
                {
                  fontSize: settings.fontSize,
                  color: colors.text,
                  marginLeft: 10,
                },
              ]}
            >
              Voltar
            </Text>
          </TouchableOpacity>

          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.contactItem,
                  { backgroundColor: colors.cardBackground },
                ]}
                onPress={() => handleContactSelect(item)}
              >
                <View style={styles.contactAvatar}>
                  <Icon name="account-circle" size={40} color={colors.text} />
                </View>
                <View style={styles.contactInfo}>
                  <Text
                    style={[
                      styles.contactName,
                      {
                        fontSize: settings.fontSize,
                        color: colors.text,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.contactKey,
                      {
                        fontSize: settings.fontSize - 2,
                        color: colors.placeholder,
                      },
                    ]}
                  >
                    {item.keyType}: {item.key}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.contactsList}
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.confirmationCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.confirmationTitle,
                {
                  fontSize: settings.fontSize + 2,
                  color: colors.text,
                  marginBottom: 20,
                },
              ]}
            >
              Confirmação de Transferência
            </Text>

            <View style={styles.confirmationRow}>
              <Text
                style={[
                  styles.confirmationLabel,
                  {
                    fontSize: settings.fontSize,
                    color: colors.placeholder,
                  },
                ]}
              >
                Valor:
              </Text>
              <Text
                style={[
                  styles.confirmationValue,
                  {
                    fontSize: settings.fontSize + 4,
                    color: colors.text,
                  },
                ]}
              >
                R$ {formattedAmount}
              </Text>
            </View>

            <View style={styles.confirmationRow}>
              <Text
                style={[
                  styles.confirmationLabel,
                  {
                    fontSize: settings.fontSize,
                    color: colors.placeholder,
                  },
                ]}
              >
                Para:
              </Text>
              <Text
                style={[
                  styles.confirmationValue,
                  {
                    fontSize: settings.fontSize + 2,
                    color: colors.text,
                  },
                ]}
              >
                {pixKey || "Chave não informada"}
              </Text>
            </View>

            <View style={styles.confirmationRow}>
              <Text
                style={[
                  styles.confirmationLabel,
                  {
                    fontSize: settings.fontSize,
                    color: colors.placeholder,
                  },
                ]}
              >
                Data/Hora:
              </Text>
              <Text
                style={[
                  styles.confirmationValue,
                  {
                    fontSize: settings.fontSize,
                    color: colors.text,
                  },
                ]}
              >
                {new Date().toLocaleDateString("pt-BR")} às {currentTime}
              </Text>
            </View>

            <View style={styles.confirmationRow}>
              <Text
                style={[
                  styles.confirmationLabel,
                  {
                    fontSize: settings.fontSize,
                    color: colors.placeholder,
                  },
                ]}
              >
                Tipo:
              </Text>
              <Text
                style={[
                  styles.confirmationValue,
                  {
                    fontSize: settings.fontSize,
                    color: colors.text,
                  },
                ]}
              >
                PIX
              </Text>
            </View>
          </View>
        </View>
      )}

      {!showContacts && (
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={handleContinue}
          accessibilityLabel={
            step < 3
              ? "Continuar para o próximo passo"
              : "Confirmar transferência PIX"
          }
        >
          <Text
            style={[
              styles.continueButtonText,
              {
                fontSize: settings.fontSize,
                color: colors.cardBackground,
              },
            ]}
          >
            {step < 3 ? "Continuar" : "Confirmar PIX"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  stepContainer: {
    marginBottom: 30,
  },
  label: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: "relative",
  },
  currencySymbol: {
    marginRight: 10,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    paddingRight: 80,
  },
  formattedValue: {
    position: "absolute",
    right: 15,
  },
  pixKeyOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  pixKeyOption: {
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    width: "48%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pixKeyOptionText: {
    marginTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    fontWeight: "bold",
  },
  contactsList: {
    width: "100%",
    maxHeight: 400,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  contactAvatar: {
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontWeight: "bold",
  },
  contactKey: {
    marginTop: 4,
  },
  confirmationCard: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 2,
  },
  confirmationTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  confirmationLabel: {},
  confirmationValue: {
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  continueButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    fontWeight: "bold",
  },
});

export default PixScreen;
