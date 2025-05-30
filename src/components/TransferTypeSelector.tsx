import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useAccessibility } from '../context/AccessibilityContext';

type TransferType = 'same' | 'third' | 'other';

type Props = {
  value: TransferType;
  onChange: (value: TransferType) => void;
  colors: {
    cardBackground: string;
    text: string;
    radioButton: string;
    placeholder: string;
    radioText: string;
  };
};

const TransferTypeSelector: React.FC<Props> = ({ value, onChange, colors }) => {
  const { settings } = useAccessibility();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground },
        settings.highContrast && { backgroundColor: '#000' }
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          {
            color: settings.highContrast ? '#fff' : colors.text,
            fontSize: settings.fontSize + 2,
          },
        ]}
      >
        Tipo de Transferência
      </Text>

      <RadioButton.Group
        onValueChange={(val) => onChange(val as TransferType)}
        value={value}
      >
        <View style={styles.radioOption}>
          <RadioButton
            value="same"
            color={colors.radioButton}
            uncheckedColor={colors.placeholder}
          />
          <Text
            style={[
              styles.radioText,
              {
                color: settings.highContrast ? '#fff' : colors.radioText,
                fontSize: settings.fontSize,
              },
            ]}
          >
            Mesma Titularidade
          </Text>
        </View>

        <View style={styles.radioOption}>
          <RadioButton
            value="third"
            color={colors.radioButton}
            uncheckedColor={colors.placeholder}
          />
          <Text
            style={[
              styles.radioText,
              {
                color: settings.highContrast ? '#fff' : colors.radioText,
                fontSize: settings.fontSize,
              },
            ]}
          >
            Entre Terceiros
          </Text>
        </View>

        <View style={styles.radioOption}>
          <RadioButton
            value="other"
            color={colors.radioButton}
            uncheckedColor={colors.placeholder}
          />
          <Text
            style={[
              styles.radioText,
              {
                color: settings.highContrast ? '#fff' : colors.radioText,
                fontSize: settings.fontSize,
              },
            ]}
          >
            TED para depósito judicial
          </Text>
        </View>
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioText: {
    marginLeft: 8,
  },
});

export default TransferTypeSelector;
