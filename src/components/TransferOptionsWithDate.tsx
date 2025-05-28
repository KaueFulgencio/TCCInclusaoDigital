import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DatePickerModal } from "react-native-paper-dates";
import { textos } from "../data/textos";
import { useAccessibility } from "../context/AccessibilityContext";

const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

type TransferOptionsWithDateProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

type Option = "now" | "today" | "custom";

const TransferOptionsWithDate: React.FC<TransferOptionsWithDateProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const { settings } = useAccessibility();
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>("now");

  const today = new Date();
  const textoAgendarTED = textos.opcoesTransferencia.agendarTED.replace(
    "(dd/mm/aaaa)",
    formatDate(selectedDate)
  );

  const getThemeColors = () => ({
    background: settings.highContrast ? "#000000" : "#FFFFFF",
    text: settings.highContrast ? "#FFFFFF" : "#333333",
    primary: settings.highContrast ? "#FFD700" : "#6200ee",
    border: settings.highContrast ? "#FFFFFF" : "#E0E0E0",
    selectedBg: settings.highContrast ? "#333333" : "#E0E0E0",
  });

  const colors = getThemeColors();

  const onSelectOption = (option: Option) => {
    setSelectedOption(option);
    if (option === "now") {
      onDateChange(new Date());
    } else if (option === "today") {
      onDateChange(
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );
    } else if (option === "custom") {
      setOpen(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text
        style={[
          styles.title,
          {
            fontSize: settings.fontSize + 4,
            color: colors.text,
          },
        ]}
      >
        Opções de Transferência
      </Text>

      <TouchableOpacity
        onPress={() => onSelectOption("now")}
        style={[
          styles.optionContainer,
          selectedOption === "now" && {
            backgroundColor: colors.selectedBg,
            borderColor: colors.primary,
            borderWidth: 1,
          },
        ]}
      >
        <Text
          style={[
            styles.option,
            {
              fontSize: settings.fontSize,
              color: colors.text,
            },
          ]}
        >
          {textos.opcoesTransferencia.transferirHoje}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelectOption("today")}
        style={[
          styles.optionContainer,
          selectedOption === "today" && {
            backgroundColor: colors.selectedBg,
            borderColor: colors.primary,
            borderWidth: 1,
          },
        ]}
      >
        <Text
          style={[
            styles.option,
            {
              fontSize: settings.fontSize,
              color: colors.text,
            },
          ]}
        >
          {textos.opcoesTransferencia.agendarHoje}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelectOption("custom")}
        style={[
          styles.optionContainer,
          selectedOption === "custom" && {
            backgroundColor: colors.selectedBg,
            borderColor: colors.primary,
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.datePickerRow}>
          <Text
            style={[
              styles.option,
              {
                flex: 1,
                fontSize: settings.fontSize,
                color: colors.text,
              },
            ]}
          >
            {textoAgendarTED}
          </Text>
          <Icon
            name="calendar"
            size={settings.fontSize + 10}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>

      <DatePickerModal
        locale="pt"
        mode="single"
        visible={open}
        onDismiss={() => setOpen(false)}
        date={selectedDate}
        onConfirm={(params) => {
          setOpen(false);
          if (params.date) {
            onDateChange(params.date);
            setSelectedOption("custom");
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  optionContainer: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  option: {
    fontSize: 16,
  },
  datePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default TransferOptionsWithDate;
