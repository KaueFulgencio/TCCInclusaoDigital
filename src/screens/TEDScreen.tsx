import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TEDScreenNavigationProp } from "../navigation/types";
import { useAccessibility } from "../context/AccessibilityContext";
import { initDB, saveLog } from "../services/dbService";
import TransferTypeSelector from "../components/TransferTypeSelector";
import BankSelector from "../components/BankSelector";
import TransferOptionsWithDate from "../components/TransferOptionsWithDate";
import styles from "../styles/TEDScreenStyles";
import AccountTypePicker from "../components/AccountTypePicker";
import WarningBox from "../components/WarningBox";
import FinalidadePicker from "../components/FinalidadePicker";

type TEDScreenProps = {
  navigation: TEDScreenNavigationProp;
};

type TransferType = "same" | "third" | "other";

const TEDScreen: React.FC<TEDScreenProps> = ({ navigation }) => {
  const { settings, colors } = useAccessibility();
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
    identificacaoDeposito: false,
    historico: false,
  });
  const [tipoConta, setTipoConta] = useState("");
  const [query, setQuery] = useState("");
  const [nome, setNome] = useState("Kaue Medeiros Fulgencio");
  const [cpfOuCNPJ, setCpfOuCNPJ] = useState("494.827.158-61");
  const [finalidade, setFinalidade] = useState("");
  const [identificacaoDeposito, setIdentificacaoDeposito] = useState("");
  const [historico, setHistorico] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startTimeRef = useRef(Date.now());
  const [clickCount, setClickCount] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  const [agency, setAgency] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [digit, setDigit] = useState("");

  const handlePress = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      console.log("Clique registrado. Total:", newCount);
      return newCount;
    });
  };

  const handleFullAccount = () => {
    return `${agency}-${accountNumber}-${digit}`;
  };

  useEffect(() => {
    (async () => {
      await initDB();
      startTimeRef.current = Date.now();
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtonsContainer}>
          <TouchableWithoutFeedback onPress={handlePress}>
            <Button
              onPress={() => {
                handlePress();
                navigation.navigate("AcessibilidadeHelp");
              }}
              style={styles.helpHeaderButton}
              labelStyle={[styles.headerButtonText, { color: colors.primary }]}
            >
              <Icon name="help-circle" size={24} color={colors.primary} />
            </Button>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={handlePress}>
            <Button
              onPress={() => {
                handlePress();
                navigation.navigate("Acessibilidade");
              }}
              style={styles.settingsHeaderButton}
              labelStyle={[styles.headerButtonText, { color: colors.primary }]}
            >
              <Icon name="cog" size={24} color={colors.primary} />
            </Button>
          </TouchableWithoutFeedback>
        </View>
      ),
    });
  }, [navigation, colors.primary]);

  const validateForm = () => {
    const numericValue = parseFloat(parseCurrency(value));

    const newErrors = {
      account: false,
      bank: false,
      value: isNaN(numericValue) || numericValue <= 0,
      tipoConta: false,
      cpfOuCNPJ: false,
      finalidade: false,
      identificacaoDeposito: false,
      historico: false,
    };

    if (transferType === "other") {
      newErrors.bank = bank.trim() === "";
      newErrors.identificacaoDeposito = identificacaoDeposito.trim() === "";
    } else if (transferType === "same") {
      newErrors.bank = bank.trim() === "";
      newErrors.account = account.trim() === "";
      newErrors.tipoConta = tipoConta.trim() === "";
      newErrors.historico = historico.trim() === "";
    } else {
      newErrors.bank = bank.trim() === "";
      newErrors.account = account.trim() === "";
      newErrors.tipoConta = tipoConta.trim() === "";
      newErrors.cpfOuCNPJ = cpfOuCNPJ.trim() === "";
      newErrors.finalidade = finalidade.trim() === "";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleTransfer = async () => {
    handlePress();

    if (validateForm()) {
      const endTime = Date.now();
      const executionTimeInSeconds = (endTime - startTimeRef.current) / 1000;
      setExecutionTime(executionTimeInSeconds);

      console.log("Dados a serem enviados:", {
        clickCount: clickCount + 1,
        executionTime: executionTimeInSeconds,
      });

      const numericValue = parseCurrency(value);
      const transferData = {
        transferType,
        bank,
        account,
        value: numericValue.toString(),
        nome: transferType === "same" ? "Kaue Medeiros Fulgencio" : nome,
        cpfOuCNPJ:
          transferType === "same"
            ? "49482715861"
            : cpfOuCNPJ.replace(/\D/g, ""),
        finalidade: transferType === "other" ? "Depósito Judicial" : finalidade,
        tipoConta,
        date: selectedDate.toISOString(),
        identificacaoDeposito,
        historico,
      };

      navigation.navigate("Confirmation", {
        transferData,
        clickCount: clickCount + 1,
        executionTime: executionTimeInSeconds,
      });
    }
  };

  const formatCurrencyInput = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    const number = Number(onlyNumbers) / 100;
    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseCurrency = (formattedValue: string) => {
    return formattedValue.replace(/\./g, "").replace(",", ".");
  };

  const formatAccountInput = (input: string) => {
    // Remove tudo que não é número
    const cleaned = input.replace(/\D/g, "");

    // Aplica a máscara: 0000-000000-0
    let formatted = cleaned;

    // Insere o primeiro hífen após 4 dígitos
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }

    // Insere o segundo hífen após 10 dígitos (4 agência + 6 conta)
    if (cleaned.length > 10) {
      formatted = `${formatted.slice(0, 11)}-${formatted.slice(11)}`;
    }

    // Limita o tamanho máximo (4 agência + 6 conta + 1 DV = 11 dígitos)
    if (cleaned.length > 11) {
      formatted = formatted.slice(0, 13); // 4 + 1 + 6 + 1 + 1 = 13 caracteres (com hífens)
    }

    return formatted;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
      keyboardVerticalOffset={100}
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
          onChange={(value) => {
            handlePress();
            setTransferType(value);
          }}
          colors={{
            cardBackground: colors.cardBackground,
            text: colors.text,
            radioButton: colors.primary,
            placeholder: colors.placeholder,
            radioText: colors.text,
          }}
        />

        {transferType === "other" ? (
          <>
            <View
              style={[styles.card, { backgroundColor: colors.cardBackground }]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    fontSize: settings.fontSize + 2,
                    color: colors.text,
                  },
                ]}
              >
                Dados do Depósito Judicial
              </Text>

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: settings.fontSize + 2,
                    color: colors.text,
                  },
                ]}
              >
                Banco*
              </Text>

              <BankSelector
                value={bank}
                query={query}
                onQueryChange={setQuery}
                onSelectBank={(codigo: string, nomeCompleto: string) => {
                  setBank(codigo);
                  setQuery(nomeCompleto);
                  handlePress();
                }}
                error={errors.bank}
              />

              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  Identificação do Depósito*
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.identificacaoDeposito && styles.inputError,
                    {
                      fontSize: settings.fontSize,
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Número do processo ou identificação"
                  placeholderTextColor={colors.placeholder}
                  value={identificacaoDeposito}
                  onChangeText={setIdentificacaoDeposito}
                  onFocus={handlePress}
                />
                <HelperText
                  type="error"
                  visible={errors.identificacaoDeposito}
                  style={{ color: colors.error }}
                >
                  Identificação é obrigatória
                </HelperText>
              </View>
            </View>
          </>
        ) : transferType === "same" ? (
          <>
            <View
              style={[styles.card, { backgroundColor: colors.cardBackground }]}
            >
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

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: settings.fontSize + 2,
                    color: colors.text,
                  },
                ]}
              >
                Banco*
              </Text>

              <BankSelector
                value={bank}
                query={query}
                onQueryChange={setQuery}
                onSelectBank={(codigo: string, nomeCompleto: string) => {
                  setBank(codigo);
                  setQuery(nomeCompleto);
                  handlePress();
                }}
                error={errors.bank}
              />

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: settings.fontSize + 2,
                    color: colors.text,
                  },
                ]}
              >
                Tipo de conta a ser creditada*
              </Text>

              <TouchableWithoutFeedback onPress={handlePress}>
                <AccountTypePicker
                  value={tipoConta}
                  onChange={(value) => {
                    setTipoConta(value);
                    handlePress();
                  }}
                  colors={{
                    cardBackground: colors.cardBackground,
                    text: colors.text,
                    border: colors.border,
                    placeholder: colors.placeholder,
                  }}
                  error={errors.tipoConta}
                />
              </TouchableWithoutFeedback>

              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  Nome completo*
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
                  value="Kaue Medeiros Fulgencio"
                  editable={false}
                  onFocus={handlePress}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  CPF*
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
                  value="494.827.158-61"
                  editable={false}
                  onFocus={handlePress}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  Agência - Conta - DV*
                </Text>
                <View style={styles.row}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.smallInput,
                      {
                        fontSize: settings.fontSize,
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="Agência"
                    placeholderTextColor={colors.placeholder}
                    value={agency}
                    onChangeText={setAgency}
                    keyboardType="numeric"
                    maxLength={4}
                    onFocus={handlePress}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.mediumInput,
                      {
                        fontSize: settings.fontSize,
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="Conta"
                    placeholderTextColor={colors.placeholder}
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    keyboardType="numeric"
                    maxLength={6}
                    onFocus={handlePress}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.smallInput,
                      {
                        fontSize: settings.fontSize,
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="DV"
                    placeholderTextColor={colors.placeholder}
                    value={digit}
                    onChangeText={setDigit}
                    keyboardType="numeric"
                    maxLength={1}
                    onFocus={handlePress}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  Identificação da Transferência*
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
                  placeholder="Identifique esta transferência"
                  placeholderTextColor={colors.placeholder}
                  value={identificacaoDeposito}
                  onChangeText={setIdentificacaoDeposito}
                  onFocus={handlePress}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  Histórico*
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.historico && styles.inputError,
                    {
                      fontSize: settings.fontSize,
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Descreva o histórico"
                  placeholderTextColor={colors.placeholder}
                  value={historico}
                  onChangeText={setHistorico}
                  onFocus={handlePress}
                  multiline
                />
                <HelperText
                  type="error"
                  visible={errors.historico}
                  style={{ color: colors.error }}
                >
                  Histórico é obrigatório
                </HelperText>
              </View>
            </View>
          </>
        ) : (
          <>
            <View
              style={[styles.card, { backgroundColor: colors.cardBackground }]}
            >
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

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: settings.fontSize + 2,
                    color: colors.text,
                  },
                ]}
              >
                Banco*
              </Text>

              <BankSelector
                value={bank}
                query={query}
                onQueryChange={setQuery}
                onSelectBank={(codigo: string, nomeCompleto: string) => {
                  setBank(codigo);
                  setQuery(nomeCompleto);
                  handlePress();
                }}
                error={errors.bank}
              />

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: settings.fontSize + 2,
                    color: colors.text,
                  },
                ]}
              >
                Tipo de conta a ser creditada*
              </Text>

              <TouchableWithoutFeedback onPress={handlePress}>
                <AccountTypePicker
                  value={tipoConta}
                  onChange={(value) => {
                    setTipoConta(value);
                    handlePress(); // ✅ executa quando muda o valor
                  }}
                  colors={{
                    cardBackground: colors.cardBackground,
                    text: colors.text,
                    border: colors.border,
                    placeholder: colors.placeholder,
                  }}
                  error={errors.tipoConta}
                />
              </TouchableWithoutFeedback>

              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.label,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  Nome completo*
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
                  onFocus={handlePress}
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
                  Agência - Conta - DV*
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
                  onFocus={handlePress}
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
                      Nome do destinatário*
                    </Text>
                    <TouchableWithoutFeedback onPress={handlePress}>
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
                        onFocus={handlePress}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text
                      style={[
                        styles.label,
                        { fontSize: settings.fontSize, color: colors.text },
                      ]}
                    >
                      CPF do destinatário*
                    </Text>
                    <TouchableWithoutFeedback onPress={handlePress}>
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
                        onFocus={handlePress}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                </>
              )}
            </View>
            <Pressable onFocus={handlePress}>
              <FinalidadePicker
                value={finalidade}
                onChange={setFinalidade}
                error={errors.finalidade}
                onOpen={handlePress}
              />
            </Pressable>
          </>
        )}

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
              Valor (R$)**
            </Text>
            <TouchableWithoutFeedback onPress={handlePress}>
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
                onFocus={handlePress}
              />
            </TouchableWithoutFeedback>
            <HelperText
              type="error"
              visible={errors.value}
              style={{ color: colors.error }}
            >
              Valor inválido
            </HelperText>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={handlePress}>
          <TransferOptionsWithDate
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onClick={handlePress}
          />
        </TouchableWithoutFeedback>

        <WarningBox />

        <TouchableWithoutFeedback onPress={handlePress}>
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
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TEDScreen;
