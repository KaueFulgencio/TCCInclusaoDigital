import React from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { HelperText } from "react-native-paper";
import { bancos } from "../data/ListaBancos";
import { useAccessibility } from "../context/AccessibilityContext"; // importe seu hook de contexto

type Props = {
  value: string;
  query: string;
  onQueryChange: (text: string) => void;
  onSelectBank: (codigo: string, nomeCompleto: string) => void;
  error: boolean;
};

const BankSelector: React.FC<Props> = ({
  value,
  query,
  onQueryChange,
  onSelectBank,
  error,
}) => {
  const { settings } = useAccessibility(); // pega do contexto
  const { fontSize, highContrast } = settings;

  const filteredBancos = bancos.filter(
    (item) =>
      item.nome.toLowerCase().includes(query.toLowerCase()) ||
      item.codigo.includes(query)
  );

  return (
    <View>
      <TextInput
        placeholder="Selecione ou digite o banco"
        value={query}
        onChangeText={onQueryChange}
        style={{
          borderWidth: 1,
          borderColor: error ? "red" : "#ccc",
          borderRadius: 5,
          padding: 8,
          fontSize,
          backgroundColor: highContrast ? "#000" : "#fff",
          color: highContrast ? "#fff" : "#000",
        }}
      />
      {filteredBancos.length > 0 && query.length > 0 && (
        <View
          style={{
            backgroundColor: highContrast ? "#000" : "#fff",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            maxHeight: 150,
          }}
        >
          <ScrollView>
            {filteredBancos.map((item) => (
              <Text
                key={item.codigo}
                style={{
                  padding: 10,
                  fontSize,
                  color: highContrast ? "#fff" : "#000",
                }}
                onPress={() => onSelectBank(item.codigo, `${item.nome} (${item.codigo})`)}
              >
                {item.nome} ({item.codigo})
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
      <HelperText type="error" visible={error}>
        Banco é obrigatório
      </HelperText>
    </View>
  );
};

export default BankSelector;
