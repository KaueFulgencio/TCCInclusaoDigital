import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";

interface AccountTypePickerProps {
  value: string;
  onChange: (value: string) => void;
  colors: {
    cardBackground: string;
    text: string;
    border: string;
    placeholder?: string;
  };
  error?: boolean;
}

const AccountTypePicker: React.FC<AccountTypePickerProps> = ({
  value,
  onChange,
  colors,
  error = false,
}) => {
  return (
    <View
      style={[
        styles.pickerContainer,
        {
          backgroundColor: colors.cardBackground,
          borderColor: error ? '#D32F2F' : colors.border,
        },
      ]}
    >
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        dropdownIconColor={colors.text}
        style={[styles.picker, { color: colors.text }]}
      >
        <Picker.Item 
          label="Selecione o tipo de conta" 
          value="" 
          color={colors.placeholder || '#9E9E9E'}
        />
        <Picker.Item label="Conta Corrente" value="CC" />
        <Picker.Item label="Conta Poupança" value="CP" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
});

export default AccountTypePicker;