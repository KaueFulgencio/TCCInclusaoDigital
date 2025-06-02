import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAccessibility } from '../context/AccessibilityContext';

type FinalidadePickerProps = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  onOpen?: () => void;
};

const FinalidadePicker: React.FC<FinalidadePickerProps> = ({ value, onChange, error, onOpen }) => {
  const { settings, colors } = useAccessibility();

  const finalidades = [
    { label: 'Selecione a finalidade', value: '' },
    { label: '01 - Pagamento de impostos, tributos, taxas', value: '01' },
    { label: '02 - Pagamento de salários', value: '02' },
    { label: '03 - Pagamento de fornecedores', value: '03' },
    { label: '04 - Transferência entre contas próprias', value: '04' },
    { label: '05 - Pagamento de serviços', value: '05' },
    { label: '06 - Outros', value: '06' },
  ];

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          { fontSize: settings.fontSize, color: colors.text },
        ]}
      >
        Finalidade da transferência*
      </Text>
      <Pressable
        onPress={() => {
          if (onOpen) onOpen();
        }}
        style={[
          styles.pickerContainer,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={[styles.picker, { color: colors.text }]}
          dropdownIconColor={colors.text}
          accessibilityLabel="Seletor de finalidade da transferência"
        >
          {finalidades.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
              color={item.value ? colors.text : colors.placeholder}
            />
          ))}
        </Picker>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { marginBottom: 8, fontWeight: 'bold' },
  pickerContainer: { borderWidth: 1, borderRadius: 4, overflow: 'hidden' },
  picker: { height: 50 },
});

export default FinalidadePicker;
