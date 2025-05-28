import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { HelperText } from "react-native-paper";
import { useAccessibility } from "../context/AccessibilityContext"; // seu contexto de acessibilidade

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
};

const AccessibleTextInput: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  error = false,
  placeholder,
  keyboardType = "default",
}) => {
  const { settings, colors } = useAccessibility();

  return (
    <View style={styles.inputContainer}>
      <Text
        style={[
          styles.label,
          { fontSize: settings.fontSize, color: colors.text },
        ]}
      >
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          {
            fontSize: settings.fontSize,
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder={placeholder || label}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      <HelperText
        type="error"
        visible={error}
        style={{ color: colors.error }}
      >
        {label} é obrigatório
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  inputError: {
    borderColor: "red",
  },
});

export default AccessibleTextInput;
