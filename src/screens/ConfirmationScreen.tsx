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
};

type ConfirmationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Confirmation">;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("pt-BR") +
    " " +
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
};

const getBankName = (code: string) => {
  const bank = bancos.find((b) => b.codigo === code);
  return bank ? `${code} - ${bank.nome}` : code;
};

const ConfirmationScreen = () => {
  const { settings } = useAccessibility();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const transferData = (route.params as { transferData: TransferData })
    .transferData;

  console.log("Dados recebidos:", transferData);

  const getTransferTypeText = () => {
    switch (transferData.transferType) {
      case "same":
        return "Mesma titularidade";
      case "third":
        return "Para terceiros";
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

      if (isNaN(date.getTime())) {
        return "Data inválida";
      }

      return (
        date.toLocaleDateString("pt-BR") +
        " " +
        date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
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
    if (isNaN(number)) return "R$ 0,00";

    return number.toLocaleString("pt-BR", {
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

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        settings.highContrast && { backgroundColor: "#000" },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            fontSize: settings.fontSize + 4,
            color: settings.highContrast ? "#fff" : "#000",
          },
        ]}
      >
        Confirmação de Transferência
      </Text>

      <View
        style={[
          styles.detailContainer,
          settings.highContrast && { backgroundColor: "#333" },
        ]}
      >
        <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
          Tipo de Transferência:
        </Text>
        <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
          {getTransferTypeText()}
        </Text>
      </View>

      <View
        style={[
          styles.detailContainer,
          settings.highContrast && { backgroundColor: "#333" },
        ]}
      >
        <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
          Banco:
        </Text>
        <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
          {getBankName(transferData.bank)}
        </Text>
      </View>

      <View
        style={[
          styles.detailContainer,
          settings.highContrast && { backgroundColor: "#333" },
        ]}
      >
        <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
          Tipo de Conta:
        </Text>
        <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
          {getAccountTypeText()}
        </Text>
      </View>

      <View
        style={[
          styles.detailContainer,
          settings.highContrast && { backgroundColor: "#333" },
        ]}
      >
        <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
          Agência/Conta:
        </Text>
        <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
          {transferData.account}
        </Text>
      </View>

      <View
        style={[
          styles.detailContainer,
          settings.highContrast && { backgroundColor: "#333" },
        ]}
      >
        <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
          Nome do Titular:
        </Text>
        <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
          {transferData.nome}
        </Text>
      </View>

      <View
        style={[
          styles.detailContainer,
          settings.highContrast && { backgroundColor: "#333" },
        ]}
      >
        <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
          CPF/CNPJ:
        </Text>
        <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
          {formatCpfCnpj(transferData.cpfOuCNPJ)}
        </Text>
      </View>

      {transferData.transferType === "third" && (
        <>
          <View
            style={[
              styles.detailContainer,
              settings.highContrast && { backgroundColor: "#333" },
            ]}
          >
            <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
              Destinatário:
            </Text>
            <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
              {transferData.recipientName}
            </Text>
          </View>
          <View
            style={[
              styles.detailContainer,
              settings.highContrast && { backgroundColor: "#333" },
            ]}
          >
            <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
              CPF Destinatário:
            </Text>
            <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
              {transferData.recipientCPF}
            </Text>
          </View>
        </>
      )}

      <View
        style={[
          styles.detailContainer,
          settings.highContrast && { backgroundColor: "#333" },
        ]}
      >
        <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
          Valor:
        </Text>
        <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
          {formatCurrency(transferData.value)}
        </Text>
      </View>

      <View
        style={[
          styles.detailContainer,
          settings.highContrast && { backgroundColor: "#333" },
        ]}
      >
        <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
          Finalidade:
        </Text>
        <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
          {transferData.finalidade}
        </Text>
      </View>

      <View
        style={[
          styles.detailContainer,
          settings.highContrast && { backgroundColor: "#333" },
        ]}
      >
        <Text style={[styles.detailTitle, { fontSize: settings.fontSize }]}>
          Data/Hora:
        </Text>
        <Text style={[styles.detailValue, { fontSize: settings.fontSize }]}>
          {formatDate(transferData.date)}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          onPress={handleConfirm}
          style={[styles.button, { marginRight: 10 }]}
          labelStyle={{ fontSize: settings.fontSize }}
        >
          Confirmar
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
          labelStyle={{ fontSize: settings.fontSize }}
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
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  detailContainer: {
    backgroundColor: "#fff",
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
