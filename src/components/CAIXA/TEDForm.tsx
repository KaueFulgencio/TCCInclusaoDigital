import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";

import { TransferType } from "../../screens/TEDFlow";

const TEDForm = ({
  type,
  onSubmit,
  onCancel,
}: {
  type: TransferType;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const initialData: any = {
    bank: "",
    accountType: "",
    agency: "",
    account: "",
    digit: "",
    personType: "01 - Pessoa Física",
    name: "",
    cpf: "",
    value: "",
    purpose: "",
    transferId: "",
    history: "",
    schedule: "today",
    judicialId: "",
  };

  if (type === "same") {
    initialData.name = "KAUE MEDEIROS FULGENCIO";
    initialData.cpf = "494.827.158-61";
  }

  const [form, setForm] = useState(initialData);
  const [dropdownVisible, setDropdownVisible] = useState<
    "accountType" | "personType" | "purpose" | null
  >(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const accountTypes = ["Conta Corrente", "Conta Poupança", "Conta Salário"];
  const personTypes = ["01 - Pessoa Física", "02 - Pessoa Jurídica"];
  const purposes = [
    "01 - Pagamento",
    "02 - Transferência entre contas",
    "03 - Empréstimo",
    "04 - Doação",
    "05 - Compra",
    "06 - Investimento",
    "07 - Prestação de serviços",
    "08 - Salário",
    "09 - Reserva",
    "10 - Outros",
  ];

  const renderDropdownItem = (item: string) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        if (dropdownVisible === "accountType") {
          update("accountType", item);
        } else if (dropdownVisible === "personType") {
          update("personType", item);
        } else if (dropdownVisible === "purpose") {
          update("purpose", item);
        }
        setDropdownVisible(null);
      }}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ["bank", "value"];

    if (type === "judicial") {
      requiredFields.push("judicialId");
    } else {
      requiredFields.push("accountType", "agency", "account", "digit", "purpose", "transferId", "history");
      if (type === "third") {
        requiredFields.push("name", "cpf", "personType");
      }
    }

    for (const field of requiredFields) {
      if (!form[field]) {
        newErrors[field] = "Campo obrigatório";
      }
    }

    if (form.value && (isNaN(Number(form.value)) || Number(form.value) <= 0)) {
      newErrors.value = "Valor inválido";
    }

    if (type !== "same" && form.cpf && form.cpf.length < 11) {
      newErrors.cpf = "CPF/CNPJ inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...form,
        depositId: form.judicialId
      });
    }
  };

  const getHeaderTitle = () => {
    switch (type) {
      case "same": return "TED mesma titularidade";
      case "third": return "TED para terceiros";
      case "judicial": return "TED Depósito Judicial";
      default: return "TED";
    }
  };

  return (
    <>
      <View style={styles.headerBlue}>
        <Text style={styles.headerBlueText}>{getHeaderTitle()}</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {type === "judicial" ? "Dados do Depósito Judicial" : "Dados da conta destino"}
        </Text>
        <View style={styles.titleUnderline} />

        <Text style={styles.label}>Banco*</Text>
        <TextInput
          style={[styles.underlineInput, errors.bank && styles.errorInput]}
          value={form.bank}
          onChangeText={(v) => update("bank", v)}
        />
        {errors.bank && <Text style={styles.errorText}>{errors.bank}</Text>}

        {type === "judicial" ? (
          <>
            <Text style={styles.label}>Identificação de depósito*</Text>
            <TextInput
              style={[styles.underlineInput, errors.judicialId && styles.errorInput]}
              value={form.judicialId}
              onChangeText={(v) => update("judicialId", v)}
            />
            {errors.judicialId && <Text style={styles.errorText}>{errors.judicialId}</Text>}
          </>
        ) : (
          <>
            <Text style={styles.label}>Tipo de conta*</Text>
            <TouchableOpacity
              style={[styles.dropdownInput, errors.accountType && styles.errorInput]}
              onPress={() => setDropdownVisible("accountType")}
            >
              <Text
                style={[
                  styles.dropdownInputText,
                  form.accountType ? styles.selectedText : null,
                ]}
              >
                {form.accountType || "Selecione o tipo de conta"}
              </Text>
            </TouchableOpacity>
            {errors.accountType && <Text style={styles.errorText}>{errors.accountType}</Text>}

            <Text style={styles.label}>Agência - Conta - Dígito*</Text>
            <View style={styles.inlineRow}>
              <View style={styles.inlineInputContainer}>
                <TextInput
                  style={[styles.underlineInput, errors.agency && styles.errorInput]}
                  placeholder="Agência"
                  value={form.agency}
                  onChangeText={(v) => update("agency", v)}
                />
                {errors.agency && <Text style={styles.smallErrorText}>{errors.agency}</Text>}
              </View>
              <View style={styles.inlineInputContainer}>
                <TextInput
                  style={[styles.underlineInput, errors.account && styles.errorInput]}
                  placeholder="Conta"
                  value={form.account}
                  onChangeText={(v) => update("account", v)}
                />
                {errors.account && <Text style={styles.smallErrorText}>{errors.account}</Text>}
              </View>
              <View style={styles.inlineInputContainer}>
                <TextInput
                  style={[styles.underlineInput, errors.digit && styles.errorInput]}
                  placeholder="DV"
                  value={form.digit}
                  onChangeText={(v) => update("digit", v)}
                />
                {errors.digit && <Text style={styles.smallErrorText}>{errors.digit}</Text>}
              </View>
            </View>

            {type === "third" && (
              <>
                <Text style={styles.label}>Tipo de pessoa*</Text>
                <TouchableOpacity
                  style={[styles.dropdownInput, errors.personType && styles.errorInput]}
                  onPress={() => setDropdownVisible("personType")}
                >
                  <Text
                    style={[
                      styles.dropdownInputText,
                      form.personType ? styles.selectedText : null,
                    ]}
                  >
                    {form.personType}
                  </Text>
                </TouchableOpacity>
                {errors.personType && <Text style={styles.errorText}>{errors.personType}</Text>}

                <Text style={styles.label}>Nome*</Text>
                <TextInput
                  style={[styles.underlineInput, errors.name && styles.errorInput]}
                  value={form.name}
                  onChangeText={(v) => update("name", v)}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <Text style={styles.label}>CPF/CNPJ*</Text>
                <TextInput
                  style={[styles.underlineInput, errors.cpf && styles.errorInput]}
                  value={form.cpf}
                  onChangeText={(v) => update("cpf", v)}
                />
                {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
              </>
            )}
          </>
        )}

        <Text style={styles.label}>Valor*</Text>
        <TextInput
          style={[styles.underlineInput, errors.value && styles.errorInput]}
          keyboardType="numeric"
          value={form.value}
          onChangeText={(v) => update("value", v)}
        />
        {errors.value && <Text style={styles.errorText}>{errors.value}</Text>}

        {type !== "judicial" && (
          <>
            <Text style={styles.label}>Finalidade*</Text>
            <TouchableOpacity
              style={[styles.dropdownInput, errors.purpose && styles.errorInput]}
              onPress={() => setDropdownVisible("purpose")}
            >
              <Text
                style={[
                  styles.dropdownInputText,
                  form.purpose ? styles.selectedText : null,
                ]}
              >
                {form.purpose || "Selecione a finalidade"}
              </Text>
            </TouchableOpacity>
            {errors.purpose && <Text style={styles.errorText}>{errors.purpose}</Text>}

            <Text style={styles.label}>Identificação da transferência*</Text>
            <TextInput
              style={[styles.underlineInput, errors.transferId && styles.errorInput]}
              value={form.transferId}
              onChangeText={(v) => update("transferId", v)}
            />
            {errors.transferId && <Text style={styles.errorText}>{errors.transferId}</Text>}

            <Text style={styles.label}>Histórico*</Text>
            <TextInput
              style={[styles.underlineInput, { height: 80 }, errors.history && styles.errorInput]}
              multiline
              value={form.history}
              onChangeText={(v) => update("history", v)}
            />
            {errors.history && <Text style={styles.errorText}>{errors.history}</Text>}
          </>
        )}

        <View style={styles.scheduleBox}>
          <Text style={styles.label}>Agendamento</Text>
          {["today", "later"].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.option}
              onPress={() => update("schedule", opt)}
            >
              <View style={styles.radioWrapper}>
                <View style={styles.radioCircle}>
                  {form.schedule === opt && <View style={styles.radioFill} />}
                </View>
                <Text>
                  {opt === "today"
                    ? "Transferir hoje"
                    : "Agendar TED para dd/mm/aaaa"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={styles.underlineDivider} />
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warning}>
            [*] Campos obrigatórios{"\n"}[**] Valor mínimo R$ 1,00{"\n"}
            Tarifa: R$ 12,00 por transação{"\n"}Horário limite: 17h em dias
            úteis
          </Text>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal dropdown */}
      <Modal
        visible={dropdownVisible !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(null)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setDropdownVisible(null)}
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={
                dropdownVisible === "accountType" ? accountTypes :
                dropdownVisible === "personType" ? personTypes : 
                purposes
              }
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderDropdownItem(item)}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerBlue: {
    backgroundColor: "#0039A6",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  headerBlueText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
  },
  container: { padding: 20 },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#0039A6",
    marginTop: 20,
  },
  titleUnderline: {
    height: 2,
    backgroundColor: "#BDBDBD",
    marginBottom: 16,
    marginTop: 8,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    marginTop: 12,
    marginBottom: 4,
  },
  option: {
    paddingVertical: 10,
  },
  underlineInput: {
    borderBottomWidth: 2,
    borderBottomColor: "#BDBDBD",
    paddingVertical: 6,
    marginBottom: 12,
    color: "#333",
  },
  inlineRow: {
    flexDirection: "row",
    gap: 10,
  },
  inlineInputContainer: {
    flex: 1,
  },
  dropdownInput: {
    borderBottomWidth: 2,
    borderBottomColor: "#BDBDBD",
    paddingVertical: 10,
    marginBottom: 12,
    justifyContent: "center",
  },
  dropdownInputText: {
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    color: "#0039A6",
    fontWeight: "bold",
  },
  dropdownItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#0039A6",
  },
  scheduleBox: {
    backgroundColor: "#F2F2F2",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  radioWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0039A6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0039A6",
  },
  underlineDivider: {
    height: 3,
    backgroundColor: "#BDBDBD",
    marginTop: 16,
  },
  warningBox: {
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  warning: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: "#F39200",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  cancelButton: {
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F39200",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  cancelText: { color: "#F39200", fontWeight: "bold" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    maxHeight: 250,
  },
  errorInput: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  smallErrorText: {
    color: 'red',
    fontSize: 10,
    marginTop: -8,
    marginBottom: 8,
  },
});

export default TEDForm;