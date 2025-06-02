import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface PixCaixaButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: object;
  iconColor?: string;
  iconBorderColor?: string;
  icon?: React.ReactNode;  // <-- Adicione isso
}

export const PixCaixaButton: React.FC<PixCaixaButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variant === "primary" ? styles.primaryButton : styles.secondaryButton,
        style,
      ]}
    >
      {/* Renderiza o ícone se existir */}
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}

      <Text
        style={[
          styles.buttonText,
          variant === "primary" ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row", // para alinhar ícone e texto na horizontal
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#FF6600", // laranja
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0077C1", // azul CAIXA
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#0077C1",
  },
});
