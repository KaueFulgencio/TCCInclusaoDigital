import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

interface PixCaixaInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const PixCaixaInput: React.FC<PixCaixaInputProps> = ({
  value,
  onChangeText,
  placeholder = "CPF/CNPJ, Celular, E-mail, ou chave aleatoria",
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={styles.underline} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  input: {
    fontSize: 16,
    color: "#000",
    paddingVertical: 8,
    // Sem border ou background para ficar clean
  },
  underline: {
    height: 2,
    backgroundColor: "#000",
    width: "100%",
  },
});
