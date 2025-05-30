import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WarningBox = () => {
  const { settings, colors } = useAccessibility();

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.cardBackground,
        borderColor: colors.error,
      }
    ]}>
      <View style={styles.header}>
        <Icon 
          name="alert-circle" 
          size={settings.fontSize + 4} 
          color={colors.error} 
        />
        <Text style={[
          styles.title,
          { 
            fontSize: settings.fontSize + 2,
            color: colors.error,
            marginLeft: 8 
          }
        ]}>
          Atenção:
        </Text>
      </View>

      <Text style={[
        styles.content,
        { 
          fontSize: settings.fontSize,
          color: colors.text,
          lineHeight: settings.fontSize * 1.5
        }
      ]}>
        {`(*) Campos obrigatórios
(**) Campo obrigatório. Observe o limite de valor no link horários e limites do serviço.
(***) Preencha este campo apenas se a conta destino possuir esta informação.
Caso não haja saldo disponível na data da transferência, a operação não será realizada.
Agendamentos somente podem ser cancelados até o dia anterior à data programada.
Agendamentos para o próprio dia não serão cancelados.

O agendamento poderá ser efetivado até às 17h, em dias úteis.`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontWeight: 'bold'
  },
  content: {
    textAlign: 'justify'
  }
});

export default WarningBox;