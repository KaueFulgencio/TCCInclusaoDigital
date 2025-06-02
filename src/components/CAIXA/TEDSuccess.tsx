import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const TEDSuccess = ({
  data,
  type,
  onContinue,
}: {
  data: any;
  type: "same" | "third" | "judicial";
  onContinue: () => void;
  clickCount: number;
  executionTime: number;
}) => {
  const currentDate = new Date();

  const handleContinue = async () => {
    onContinue();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Comprovante TED</Text>
        </View>

        <View style={styles.headerContainer}>
          <Image
            source={require("../../../assets/caixa-logo-01.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.topBox}>
          <View style={styles.boxLeft}>
            <Text style={styles.boxLabel}>Valor</Text>
            <Text style={styles.boxValue}>R$ {data.value}</Text>
          </View>
          <View style={styles.boxRight}>
            <Text style={styles.boxLabel}>Data</Text>
            <Text style={styles.boxValue}>
              {currentDate.toLocaleDateString("pt-BR")}
              {"\n"}
              {currentDate.toLocaleTimeString("pt-BR")}
            </Text>
          </View>
        </View>

        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            ✅ Operação realizada com sucesso!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Pagador</Text>
          <View style={styles.underline} />

          <View style={styles.line}>
            <Text style={styles.label}>Conta origem</Text>
            <Text style={styles.value}>{data.originAccount}</Text>
          </View>

          {type !== "judicial" && (
            <>
              <View style={styles.line}>
                <Text style={styles.label}>Tipo de conta</Text>
                <Text style={styles.value}>{data.accountType}</Text>
              </View>

              <View style={styles.line}>
                <Text style={styles.label}>Tipo de pessoa</Text>
                <Text style={styles.value}>{data.personType}</Text>
              </View>

              <View style={styles.line}>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.value}>{data.name}</Text>
              </View>

              <View style={styles.line}>
                <Text style={styles.label}>CPF/CNPJ</Text>
                <Text style={styles.value}>{data.cpf}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {type === "judicial"
              ? "Dados do Depósito Judicial"
              : "Dados do Recebedor"}
          </Text>
          <View style={styles.underline} />

          <View style={styles.line}>
            <Text style={styles.label}>Banco</Text>
            <Text style={styles.value}>{data.bank}</Text>
          </View>

          {type === "judicial" ? (
            <View style={styles.line}>
              <Text style={styles.label}>Identificação do depósito</Text>
              <Text style={styles.value}>
                {data.judicialId || data.depositId}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.line}>
                <Text style={styles.label}>Conta destino</Text>
                <Text style={styles.value}>
                  {data.agency}-{data.account}-{data.digit}
                </Text>
              </View>

              {type === "third" && (
                <>
                  <View style={styles.line}>
                    <Text style={styles.label}>Tipo de conta</Text>
                    <Text style={styles.value}>{data.accountType}</Text>
                  </View>

                  <View style={styles.line}>
                    <Text style={styles.label}>Tipo de pessoa</Text>
                    <Text style={styles.value}>{data.personType}</Text>
                  </View>

                  <View style={styles.line}>
                    <Text style={styles.label}>Nome</Text>
                    <Text style={styles.value}>{data.name}</Text>
                  </View>

                  <View style={styles.line}>
                    <Text style={styles.label}>CPF/CNPJ</Text>
                    <Text style={styles.value}>{data.cpf}</Text>
                  </View>
                </>
              )}
            </>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleContainer: {
    backgroundColor: "#0039A6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "left",
  },
  headerContainer: {
    backgroundColor: "#0039A6",
    alignItems: "center",
    paddingVertical: 40,
  },
  logo: {
    width: 140,
    height: 60,
  },
  topBox: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    marginTop: -20,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  boxLeft: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  boxRight: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  boxLabel: {
    color: "#0039A6",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  boxValue: {
    fontWeight: "bold",
    color: "#111",
    fontSize: 20,
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: "#F2F2F2",
    padding: 14,
    marginHorizontal: 0,
    marginTop: 16,
  },
  successText: {
    color: "#0039A6",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#0039A6",
    fontSize: 18,
    marginBottom: 4,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#0039A6",
    width: "100%",
    marginBottom: 12,
  },
  line: {
    marginBottom: 12,
  },
  label: {
    color: "#777",
    fontSize: 15,
    marginBottom: 2,
  },
  value: {
    color: "#111",
    fontSize: 17,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FF7900",
    padding: 14,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TEDSuccess;