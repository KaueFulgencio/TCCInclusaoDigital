import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
  const { incrementClickCount } = useAccessibility();

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
          <Button
            onPress={() => navigation.navigate("AcessibilidadeHelp")}
            style={styles.helpHeaderButton}
            labelStyle={[styles.headerButtonText, { color: colors.primary }]}
          >
            <Icon name="help-circle" size={24} color={colors.primary} />
          </Button>
          <Button
            onPress={() => navigation.navigate("Acessibilidade")}
            style={styles.settingsHeaderButton}
            labelStyle={[styles.headerButtonText, { color: colors.primary }]}
          >
            <Icon name="cog" size={24} color={colors.primary} />
          </Button>
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
    incrementClickCount();

    if (validateForm()) {
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

      navigation.navigate("Confirmation", { transferData });

      const endTime = Date.now();
      const executionTimeInSeconds = (endTime - startTimeRef.current) / 1000;

      await saveLog(clickCount + 1, executionTimeInSeconds);
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
          onChange={setTransferType}
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
                  onChangeText={(text) => {
                    const formatted = formatAccountInput(text);
                    setAccount(formatted);
                  }}
                  keyboardType="numeric"
                  maxLength={13}
                />
                <HelperText
                  type="error"
                  visible={errors.account}
                  style={{ color: colors.error }}
                >
                  Conta é obrigatória
                </HelperText>
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
                      CPF do destinatário*
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

            <FinalidadePicker
              value={finalidade}
              onChange={setFinalidade}
              error={errors.finalidade}
            />
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

        <TransferOptionsWithDate
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <WarningBox />

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
