import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

interface TEDConfirmationProps {
  data: {
    originAccount: string;
    bank: string;
    accountType: string;
    agency: string;
    account: string;
    digit: string;
    personType: string;
    name: string;
    cpf: string;
    value: string;
    purpose: string;
    history: string;
  };
  type: "same" | "third" | "judicial";
  onBack: () => void;
  onConfirm: (password: string) => void;
}

const TEDConfirmation: React.FC<TEDConfirmationProps> = ({
  data,
  type,
  onBack,
  onConfirm,
}) => {
  const [password, setPassword] = React.useState("");

  const getTitleByType = (type: string) => {
    switch (type) {
      case "same":
        return "Verificação de TED - mesma titularidade";
      case "third":
        return "Verificação de TED - terceiros";
      case "judicial":
        return "Verificação de TED - judicial";
      default:
        return "Verificação de TED";
    }
  };

  const handleConfirm = () => {
    if (!password) {
      Alert.alert("Atenção", "Por favor, digite sua senha de transação.");
      return;
    }
    onConfirm(password);
  };

  const {
    originAccount,
    bank,
    accountType,
    agency,
    account,
    digit,
    personType,
    name,
    cpf,
    value,
    purpose,
    history,
  } = data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{getTitleByType(type)}</Text>
      </View>

      <Text style={styles.infoText}>
        Confira os dados informados, digite abaixo a senha da transação de sua
        conta, selecione CONFIRMAR e aguarde o comprovante.
      </Text>

      <View style={styles.dataBox}>
        <InfoItem label="Conta de origem" value={originAccount || "0000-0"} />
        <InfoItem label="Banco" value={bank} />
        <InfoItem label="Tipo de conta a ser creditada" value={accountType} />
        <InfoItem
          label="Conta destino"
          value={`${agency || "----"}-${account || "----"}-${digit || "-"}`}
        />
        <InfoItem label="Tipo de pessoa destino" value={personType} />
        <InfoItem label="Nome do destinatário" value={name} />
        <InfoItem label="CPF/CNPJ do destinatário" value={cpf} />
        <InfoItem label="Valor" value={`R$ ${value}`} />
        <InfoItem label="Valor da tarifa" value={`R$ 12,00`} />
        <InfoItem label="Finalidade" value={purpose} />
        <InfoItem label="Histórico" value={history} />
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Autorizo a CAIXA a debitar o valor da tarifa vigente de TED na data
          agendada.
        </Text>
      </View>

      <Text style={styles.passwordLabel}>Senha da transação</Text>
      <TextInput
        secureTextEntry
        style={styles.passwordInput}
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirmar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0039A6",
    padding: 16,
    width: "100%",
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  infoText: {
    color: "#0039A6",
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  dataBox: {
    backgroundColor: "#F2F2F2",
    padding: 20,
    marginBottom: 20,
    width: "100%",
  },
  label: {
    color: "#555",
    fontSize: 15,
    marginTop: 16,
  },
  value: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#000",
    marginTop: 4,
  },
  warningBox: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  warningText: {
    color: "#444",
    fontSize: 14,
  },
  passwordLabel: {
    color: "#0039A6",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  passwordInput: {
    backgroundColor: "#F2F2F2",
    height: 50,
    marginHorizontal: 20,
    borderRadius: 6,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  confirmButton: {
    backgroundColor: "#F39200",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 20,
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelText: {
    color: "#F39200",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TEDConfirmation;
