import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { useAccessibility } from "../context/AccessibilityContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { bancos } from "../data/ListaBancos";

type TransferData = {
  transferType: string;
  bank: string;
  account: string;
  value: string;
  nome: string;
  cpfOuCNPJ: string;
  finalidade: string;
  tipoConta: string;
  date: string;
  recipientName?: string;
  recipientCPF?: string;
  identificacaoDeposito?: string;
  historico?: string;
};

const ConfirmationScreen = () => {
  const { settings, colors } = useAccessibility();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const transferData = (route.params as { transferData: TransferData })
    .transferData;

  const getTransferTypeText = () => {
    switch (transferData.transferType) {
      case "same":
        return "Mesma titularidade";
      case "third":
        return "Para terceiros";
      case "other":
        return "Depósito Judicial";
      default:
        return transferData.transferType;
    }
  };

  const getAccountTypeText = () => {
    switch (transferData.tipoConta) {
      case "CC":
        return "Conta Corrente";
      case "CP":
        return "Conta Poupança";
      default:
        return transferData.tipoConta;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Data não informada";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Data inválida";

      return (
        date.toLocaleDateString("pt-BR") +
        " " +
        date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Erro na data";
    }
  };

  const handleConfirm = () => {
    navigation.navigate("Success");
  };

  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    return isNaN(number)
      ? "R$ 0,00"
      : number.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
  };

  const formatCpfCnpj = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (cleaned.length === 14) {
      return cleaned.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
    return value;
  };

  const getBankName = (code: string) => {
    const bank = bancos.find((b) => b.codigo === code);
    return bank ? `${code} - ${bank.nome}` : code;
  };

  const formatAccount = (account: string) => {
    if (!account) return "";
    return account.replace(/(\d{4})(\d{6})(\d{1})/, "$1-$2-$3");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
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
        Confirmação de Transferência
      </Text>

      <View
        style={[
          styles.detailContainer,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Text
          style={[
            styles.detailTitle,
            { fontSize: settings.fontSize, color: colors.text },
          ]}
        >
          Tipo de Transferência:
        </Text>
        <Text
          style={[
            styles.detailValue,
            { fontSize: settings.fontSize, color: colors.text },
          ]}
        >
          {getTransferTypeText()}
        </Text>
      </View>

      {transferData.transferType === "other" ? (
        <>
          <View
            style={[
              styles.detailContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text
              style={[
                styles.detailTitle,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Banco:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              {getBankName(transferData.bank)}
            </Text>
          </View>

          <View
            style={[
              styles.detailContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text
              style={[
                styles.detailTitle,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Identificação do Depósito:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              {transferData.identificacaoDeposito}
            </Text>
          </View>
        </>
      ) : (
        <>
          <View
            style={[
              styles.detailContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text
              style={[
                styles.detailTitle,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Banco:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              {getBankName(transferData.bank)}
            </Text>
          </View>

          <View
            style={[
              styles.detailContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text
              style={[
                styles.detailTitle,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Tipo de Conta:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              {getAccountTypeText()}
            </Text>
          </View>

          <View
            style={[
              styles.detailContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text
              style={[
                styles.detailTitle,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Agência/Conta/DV:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              {formatAccount(transferData.account)}
            </Text>
          </View>

          <View
            style={[
              styles.detailContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text
              style={[
                styles.detailTitle,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              Nome do Titular:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              {transferData.nome}
            </Text>
          </View>

          <View
            style={[
              styles.detailContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text
              style={[
                styles.detailTitle,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              CPF/CNPJ:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { fontSize: settings.fontSize, color: colors.text },
              ]}
            >
              {formatCpfCnpj(transferData.cpfOuCNPJ)}
            </Text>
          </View>

          {transferData.transferType === "third" && (
            <>
              <View
                style={[
                  styles.detailContainer,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <Text
                  style={[
                    styles.detailTitle,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  Destinatário:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  {transferData.recipientName}
                </Text>
              </View>
              <View
                style={[
                  styles.detailContainer,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <Text
                  style={[
                    styles.detailTitle,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  CPF Destinatário:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { fontSize: settings.fontSize, color: colors.text },
                  ]}
                >
                  {transferData.recipientCPF}
                </Text>
              </View>
            </>
          )}

          {transferData.transferType === "same" && transferData.historico && (
            <View
              style={[
                styles.detailContainer,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <Text
                style={[
                  styles.detailTitle,
                  { fontSize: settings.fontSize, color: colors.text },
                ]}
              >
                Histórico:
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  { fontSize: settings.fontSize, color: colors.text },
                ]}
              >
                {transferData.historico}
              </Text>
            </View>
          )}
        </>
      )}

      <View
        style={[
          styles.detailContainer,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Text
          style={[
            styles.detailTitle,
            { fontSize: settings.fontSize, color: colors.text },
          ]}
        >
          Valor:
        </Text>
        <Text
          style={[
            styles.detailValue,
            { fontSize: settings.fontSize, color: colors.text },
          ]}
        >
          {formatCurrency(transferData.value)}
        </Text>
      </View>

      {transferData.finalidade && (
        <View
          style={[
            styles.detailContainer,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text
            style={[
              styles.detailTitle,
              { fontSize: settings.fontSize, color: colors.text },
            ]}
          >
            Finalidade:
          </Text>
          <Text
            style={[
              styles.detailValue,
              { fontSize: settings.fontSize, color: colors.text },
            ]}
          >
            {transferData.finalidade}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.detailContainer,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Text
          style={[
            styles.detailTitle,
            { fontSize: settings.fontSize, color: colors.text },
          ]}
        >
          Data/Hora:
        </Text>
        <Text
          style={[
            styles.detailValue,
            { fontSize: settings.fontSize, color: colors.text },
          ]}
        >
          {formatDate(transferData.date)}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          onPress={handleConfirm}
          style={[
            styles.button,
            { marginRight: 10, backgroundColor: colors.primary },
          ]}
          labelStyle={{ fontSize: settings.fontSize, color: colors.text }}
        >
          Confirmar
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={[styles.button, { borderColor: colors.primary }]}
          labelStyle={{ fontSize: settings.fontSize, color: colors.primary }}
        >
          Voltar
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  detailContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailTitle: {
    fontWeight: "bold",
  },
  detailValue: {
    textAlign: "right",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
  },
});

export default ConfirmationScreen;
