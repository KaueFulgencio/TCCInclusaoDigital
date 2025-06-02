import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const TEDConfirmation = ({
  data,
  type,
  onBack,
  onConfirm,
  clickCount
}: {
  data: any;
  type: "same" | "third" | "judicial";
  onBack: () => void;
  onConfirm: (totalClicks: number) => void;
  clickCount: number;
}) => {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [localClickCount, setLocalClickCount] = React.useState(0);

  const incrementLocalClick = () => { setLocalClickCount((c) => c + 1); };

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
      setError('Senha é obrigatória');
      return;
    }
    
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setError('');
    const totalClicks = clickCount + localClickCount;
    onConfirm(totalClicks);
  };

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
        <Text style={styles.label}>Conta de origem</Text>
        <Text style={styles.value}>{data.originAccount || "0000-0"}</Text>

        <Text style={styles.label}>Banco</Text>
        <Text style={styles.value}>{data.bank}</Text>

        {type === "judicial" ? (
          <>
            <Text style={styles.label}>Identificação do depósito</Text>
            <Text style={styles.value}>{data.judicialId || data.depositId}</Text>

            <Text style={styles.label}>Valor</Text>
            <Text style={styles.value}>R$ {data.value}</Text>

            <Text style={styles.label}>Valor da tarifa</Text>
            <Text style={styles.value}>R$ 12,00</Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>Tipo de conta a ser creditada</Text>
            <Text style={styles.value}>{data.accountType}</Text>

            <Text style={styles.label}>Conta destino</Text>
            <Text style={styles.value}>
              {data.agency}-{data.account}-{data.digit}
            </Text>

            {type === "third" && (
              <>
                <Text style={styles.label}>Tipo de pessoa destino</Text>
                <Text style={styles.value}>{data.personType}</Text>

                <Text style={styles.label}>Nome do destinatário</Text>
                <Text style={styles.value}>{data.name}</Text>

                <Text style={styles.label}>CPF/CNPJ do destinatário</Text>
                <Text style={styles.value}>{data.cpf}</Text>
              </>
            )}

            <Text style={styles.label}>Valor</Text>
            <Text style={styles.value}>R$ {data.value}</Text>

            <Text style={styles.label}>Valor da tarifa</Text>
            <Text style={styles.value}>R$ 12,00</Text>

            <>
              <Text style={styles.label}>Finalidade</Text>
              <Text style={styles.value}>{data.purpose}</Text>

              <Text style={styles.label}>Histórico</Text>
              <Text style={styles.value}>{data.history}</Text>
            </>
          </>
        )}
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
        onChangeText={(text) => {
          setPassword(text);
          incrementLocalClick(); 
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
      >
        <Text style={styles.confirmText}>Confirmar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    paddingHorizontal: 20,
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