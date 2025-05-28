import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, RadioButton, HelperText } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TEDScreenNavigationProp } from "../navigation/types";
import { useAccessibility } from "../context/AccessibilityContext";
import { initDB, saveLog } from "../services/dbService";
import { bancos } from "../data/ListaBancos";
import { apenasNumeros, cpfOuCnpjRegex } from "../services/regex";
import { Picker } from "@react-native-picker/picker";
import TransferTypeSelector from "../components/TransferTypeSelector";
import BankSelector from "../components/BankSelector";
import TransferOptionsWithDate from "../components/TransferOptionsWithDate";
import styles from "../styles/TEDScreenStyles";
import AccountTypePicker from "../components/AccountTypePicker";

type TEDScreenProps = {
  navigation: TEDScreenNavigationProp;
};

type TransferType = "same" | "third";

const TEDScreen: React.FC<TEDScreenProps> = ({ navigation }) => {
  const { settings } = useAccessibility();
  const [transferType, setTransferType] = useState<TransferType>("same");
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState({
    account: false,
    bank: false,
    value: false,
    tipoConta: false,
    cpfOuCNPJ: false,
    finalidade: false,
  });
  const [tipoConta, setTipoConta] = useState("");
  const [query, setQuery] = useState("");
  const [nome, setNome] = useState("");
  const [cpfOuCNPJ, setCpfOuCNPJ] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [erroCpfCnpj, setErroCpfCnpj] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startTimeRef = useRef(Date.now());
  const [clickCount, setClickCount] = useState(0);

  const getThemeColors = () => {
    return {
      background: settings.highContrast ? "#000000" : "#F8F9FA",
      cardBackground: settings.highContrast ? "#121212" : "#FFFFFF",
      text: settings.highContrast ? "#FFFFFF" : "#2F2F2F",
      primary: settings.highContrast ? "#FFD700" : "#0066CC",
      error: settings.highContrast ? "#FF0000" : "#D32F2F",
      border: settings.highContrast ? "#FFFFFF" : "#E0E0E0",
      placeholder: settings.highContrast ? "#AAAAAA" : "#9E9E9E",
      radioText: settings.highContrast ? "#FFFFFF" : "#333333",
      radioButton: settings.highContrast ? "#FFD700" : "#0066CC",
    };
  };

  const colors = getThemeColors();

  useEffect(() => {
    (async () => {
      await initDB();
      startTimeRef.current = Date.now();
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate("Acessibilidade")}
          style={styles.helpHeaderButton}
          labelStyle={[styles.helpHeaderButtonText, { color: colors.primary }]}
        >
          <Icon name="help-circle" size={24} color={colors.primary} />
        </Button>
      ),
    });
  }, [navigation, colors.primary]);

  const validateForm = () => {
    const numericValue = parseFloat(parseCurrency(value));

    const newErrors = {
      account: account.trim() === "",
      bank: bank.trim() === "",
      value: isNaN(numericValue) || numericValue <= 0,
      tipoConta: tipoConta.trim() === "",
      cpfOuCNPJ: cpfOuCNPJ.trim() === "",
      finalidade: finalidade.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleTransfer = async () => {
    setClickCount((prev) => prev + 1);

    if (validateForm()) {
      const numericValue = parseCurrency(value);

      const transferData = {
        transferType,
        bank,
        account,
        value: numericValue.toString(),
        nome,
        cpfOuCNPJ,
        finalidade,
        tipoConta,
        date: selectedDate.toISOString(),
      };

      console.log("Dados sendo enviados:", transferData);

      navigation.navigate("Confirmation", { transferData });

      const endTime = Date.now();
      const executionTimeInSeconds = (endTime - startTimeRef.current) / 1000;
      await saveLog(clickCount + 1, executionTimeInSeconds);
    }
  };

  const handleCpfOuCnpjChange = (text: string) => {
    const valor = text.replace(apenasNumeros, "");
    setCpfOuCNPJ(valor);

    if (cpfOuCnpjRegex.test(valor)) {
      setErroCpfCnpj("");
    } else {
      setErroCpfCnpj("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido");
    }
  };

  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "R$ 0,00";

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatCurrencyInput = (value: string) => {
    // Remove todos os caracteres não numéricos
    const onlyNumbers = value.replace(/\D/g, "");

    // Converte para número e formata como moeda brasileira
    const number = Number(onlyNumbers) / 100;

    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseCurrency = (formattedValue: string) => {
    // Remove pontos e substitui vírgula por ponto para obter o valor numérico
    return formattedValue.replace(/\./g, "").replace(",", ".");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                fontSize: settings.fontSize + 4,
                color: colors.text,
              },
            ]}
          >
            Transferência Eletrônica
          </Text>
        </View>

        <TransferTypeSelector
          value={transferType}
          onChange={setTransferType}
          colors={{
            cardBackground: "#fff",
            text: "#000",
            radioButton: "#007bff",
            placeholder: "#ccc",
            radioText: "#333",
          }}
        />

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: settings.fontSize + 2,
                color: colors.text,
              },
            ]}
          >
            Dados da Conta
          </Text>

          <BankSelector
            value={bank}
            query={query}
            onQueryChange={setQuery}
            onSelectBank={(codigo: string, nomeCompleto: string) => {
              setBank(codigo);
              setQuery(nomeCompleto);
            }}
            error={false}
          />

          <AccountTypePicker
            value={tipoConta}
            onChange={setTipoConta}
            colors={{
              cardBackground: colors.cardBackground,
              text: colors.text,
              border: colors.border,
              placeholder: colors.placeholder,
            }}
            error={errors.tipoConta}
          />

          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Nome completo
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.account && styles.inputError,
                {
                  fontSize: settings.fontSize,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Digite seu nome completo"
              placeholderTextColor={colors.placeholder}
              value={nome}
              onChangeText={setNome}
              keyboardType="default"
            />
            <HelperText
              type="error"
              visible={errors.account}
              style={{ color: colors.error }}
            >
              Nome é obrigatório
            </HelperText>
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Agência - Conta - DV
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.account && styles.inputError,
                {
                  fontSize: settings.fontSize,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="0000-000000-0"
              placeholderTextColor={colors.placeholder}
              value={account}
              onChangeText={setAccount}
              keyboardType="numeric"
            />
            <HelperText
              type="error"
              visible={errors.account}
              style={{ color: colors.error }}
            >
              Conta é obrigatória
            </HelperText>
          </View>

          {transferType === "third" && (
            <>
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  Nome do destinatário
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      fontSize: settings.fontSize,
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Digite o nome do destinatário"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  CPF do destinatário
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      fontSize: settings.fontSize,
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="000.000.000-00"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="numeric"
                />
              </View>
            </>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: settings.fontSize + 2,
                color: colors.text,
              },
            ]}
          >
            Valor da Transferência
          </Text>
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Valor (R$)
            </Text>
            <TextInput
              style={[
                styles.valueInput,
                errors.value && styles.inputError,
                {
                  fontSize: settings.fontSize,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="0,00"
              placeholderTextColor={colors.placeholder}
              value={value}
              onChangeText={(text) => {
                if (text === "" || text === "0") {
                  setValue("0,00");
                  return;
                }

                const cleanText = text.replace(/[^0-9]/g, "");

                if (cleanText === "") {
                  setValue("0,00");
                  return;
                }

                const formattedValue = formatCurrencyInput(cleanText);
                setValue(formattedValue);
              }}
              keyboardType="numeric"
            />
            <HelperText
              type="error"
              visible={errors.value}
              style={{ color: colors.error }}
            >
              Valor inválido
            </HelperText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              CPF ou CNPJ
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.cpfOuCNPJ && styles.inputError,
                {
                  fontSize: settings.fontSize,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              placeholderTextColor={colors.placeholder}
              value={cpfOuCNPJ}
              onChangeText={handleCpfOuCnpjChange}
              keyboardType="numeric"
            />
            <HelperText
              type="error"
              visible={errors.cpfOuCNPJ}
              style={{ color: colors.error }}
            >
              CPF ou CNPJ inválido
            </HelperText>
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Finalidade da transferência
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.finalidade && styles.inputError,
                {
                  fontSize: settings.fontSize,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Descreva a finalidade"
              placeholderTextColor={colors.placeholder}
              value={finalidade}
              onChangeText={setFinalidade}
              keyboardType="default"
            />
            <HelperText
              type="error"
              visible={errors.finalidade}
              style={{ color: colors.error }}
            >
              Finalidade é obrigatória
            </HelperText>
          </View>
        </View>

        <TransferOptionsWithDate
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <Button
          mode="contained"
          onPress={handleTransfer}
          style={[styles.button, { backgroundColor: colors.primary }]}
          labelStyle={[
            styles.buttonLabel,
            {
              fontSize: settings.fontSize,
              color: settings.highContrast ? "#000" : "#FFF",
            },
          ]}
        >
          Transferir
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TEDScreen;
