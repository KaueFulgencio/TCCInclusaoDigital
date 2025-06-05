import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { PixCaixaHomeScreenNavigationProp } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";

export const PixCaixaHomeScreen = () => {
  const [pixKey, setPixKey] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const navigation = useNavigation<PixCaixaHomeScreenNavigationProp>();
  const [showRecipient, setShowRecipient] = useState(false);

  const handlePress = (action?: () => void) => {
    setClickCount((prev) => prev + 1);
    console.log("Clique registrado. Total:", clickCount + 1);
    if (action) action();
  };

  const handleConfirm = () => {
    handlePress(() => setShowRecipient(true));
  };

  const handleContinue = () => {
    const executionTime = (Date.now() - startTime) / 1000;
    navigation.navigate("PixCaixaConfirmDataScreen", {
      clickCount,
      executionTime,
    });
  };

  const handleBack = () => {
    handlePress(() => setShowRecipient(false));
  };

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const RenderButton = ({
    title,
    onPress,
    variant = "primary",
    style,
    icon,
  }: {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "white";
    style?: object;
    icon?: React.ReactNode;
  }) => {
    const isPrimary = variant === "primary";
    const isSecondary = variant === "secondary";
    const isWhite = variant === "white";

    return (
      <TouchableOpacity
        onPress={() => handlePress(onPress)}
        style={[
          styles.buttonBase,
          isPrimary && styles.primaryButton,
          isSecondary && styles.secondaryButton,
          isWhite && styles.whiteButton,
          style,
        ]}
        activeOpacity={0.7}
      >
        {icon && <View style={styles.iconWrapper}>{icon}</View>}
        <Text
          style={[
            styles.buttonText,
            isPrimary && styles.primaryText,
            isSecondary && styles.secondaryText,
            isWhite && styles.whiteText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Pagar via Pix</Text>
        </View>

        <Text style={styles.subTitle}>Cole ou digite a chave Pix</Text>

        <View style={styles.labelRow}>
          <Text style={styles.label}>Chave Pix</Text>
          <TouchableOpacity onPress={() => handlePress()}>
            <Text style={styles.pasteButton}>Colar</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="CPF/CNPJ, Celular, E-mail, ou chave aleatória"
          placeholderTextColor="#999"
          value={pixKey}
          onChangeText={(text) => {
            handlePress(() => setPixKey(text));
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          onFocus={() => handlePress()}
        />

        <View style={styles.underline} />

        <View style={styles.mainButtonsRow}>
          <RenderButton
            title="PIX Copia e Cola"
            onPress={() => {}}
            variant="white"
            style={styles.mainButton}
            icon={<Icon name="link" size={20} color="#000" />}
          />
          <RenderButton
            title="Escanear QR Code"
            onPress={() => {}}
            variant="white"
            style={styles.mainButton}
            icon={<Icon name="sort" size={20} color="#000" />}
          />
          <RenderButton
            title="Agência e Conta"
            onPress={() => {}}
            variant="white"
            style={styles.mainButton}
            icon={<Icon name="dialpad" size={20} color="#000" />}
          />
        </View>

        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Contatos</Text>

          <View style={styles.contactButtonsColumn}>
            <RenderButton
              title="PIX Frequentes"
              onPress={() => {}}
              variant="secondary"
              style={styles.contactButton}
              icon={<Icon name="anchor" size={20} color="#0077C1" />}
            />
            <RenderButton
              title="Buscar Chaves no Celular"
              onPress={() => {}}
              variant="secondary"
              style={styles.contactButton}
              icon={<Icon name="radio" size={20} color="#0077C1" />}
            />
            <Text style={styles.faleComCaixaText}>fale com a Caixa</Text>
          </View>
        </View>

        <View style={styles.footerButtonsColumn}>
          <RenderButton
            title="Confirmar"
            onPress={handleConfirm}
            variant="primary"
            style={styles.confirmButton}
          />
          <RenderButton
            title="Cancelar"
            onPress={() => {}}
            variant="secondary"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>

      <Modal
        visible={showRecipient}
        animationType="fade"
        transparent
        onRequestClose={handleBack}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recipientContainer}>
            <Text style={styles.recipientTitle}>Dados do Recebedor</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome:</Text>
              <Text style={styles.infoValue}>Fulano da Silva</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CPF:</Text>
              <Text style={styles.infoValue}>123.456.789-00</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Chave Pix:</Text>
              <Text style={styles.infoValue}>{pixKey}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Banco:</Text>
              <Text style={styles.infoValue}>Caixa Econômica Federal</Text>
            </View>

            <View style={styles.footerButtonsColumn}>
              <RenderButton
                title="Continuar"
                onPress={handleContinue}
                variant="primary"
                style={styles.confirmButton}
              />
              <RenderButton
                title="Voltar"
                onPress={handleBack}
                variant="secondary"
                style={styles.cancelButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#0077C1",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  subTitle: {
    color: "#0077C1",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  pasteButton: {
    color: "#0077C1",
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    height: 40,
    fontSize: 16,
    color: "#000",
    paddingVertical: 4,
    marginBottom: 0,
  },
  underline: {
    height: 1,
    backgroundColor: "#000",
    marginBottom: 24,
  },

  mainButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  mainButton: {
    flex: 1,
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingVertical: 12,
  },

  sectionTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },

  contactsSection: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
     width: "100%",
  },

  contactButtonsColumn: {
    flexDirection: "column",
  },
  contactButton: {
    flex: 1,
    marginVertical: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  faleComCaixaText: {
    color: "#0077C1",
    fontSize: 14,
    alignSelf: "flex-end",
    marginTop: 8,
    marginRight: 8,
  },

  footerButtonsColumn: {
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 40,
  },
  confirmButton: {
    backgroundColor: "#FF7800",
    borderRadius: 6,
    marginBottom: 16,
    height: 48,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    height: 48,
    justifyContent: "center",
  },

  buttonBase: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#0077C1",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0077C1",
  },
  whiteButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#0077C1",
  },
  whiteText: {
    color: "#000",
  },
  iconWrapper: {
    position: "absolute",
    top: 8,
    left: 8,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  recipientContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipientTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: "bold",
    width: 90,
  },
  infoValue: {
    flex: 1,
    color: "#333",
  },
});
