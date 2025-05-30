import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';

const AcessibilidadeHelpScreen = () => {
  const { settings, colors } = useAccessibility();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.cardBackground }
      ]}
    >
      <Text style={[
        styles.title,
        {
          fontSize: settings.fontSize + 4,
          color: colors.text
        }
      ]}>
        Ajuda - Configurações de Acessibilidade
      </Text>

      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <Text style={[
          styles.helpTitle,
          {
            fontSize: settings.fontSize + 2,
            color: colors.text
          }
        ]}>
          Tamanho da Fonte
        </Text>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text
          }
        ]}>
          Ajuste o tamanho do texto em toda a aplicação. Valores entre 14px e 24px.
        </Text>
      </View>

      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <Text style={[
          styles.helpTitle,
          {
            fontSize: settings.fontSize + 2,
            color: colors.text
          }
        ]}>
          Alto Contraste
        </Text>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text
          }
        ]}>
          Ative para melhorar a visibilidade entre texto e fundo, ideal para usuários com baixa visão.
        </Text>
      </View>

      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <Text style={[
          styles.helpTitle,
          {
            fontSize: settings.fontSize + 2,
            color: colors.text
          }
        ]}>
          Zoom Habilitado
        </Text>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text
          }
        ]}>
          Permite ampliar áreas da tela com gestos de pinça, útil para leitura de textos pequenos.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  helpItem: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  helpTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  helpText: {
    lineHeight: 22,
  },
});

export default AcessibilidadeHelpScreen;