import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const AcessibilidadeHelpScreen = () => {
  const { settings, colors } = useAccessibility();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background }
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

      <Text style={[
        styles.subtitle,
        {
          fontSize: settings.fontSize + 2,
          color: colors.text,
          marginBottom: 20
        }
      ]}>
        Personalize sua experiência e entenda os campos da transferência
      </Text>

      {/* Seção de Configurações de Acessibilidade */}
      <Text style={[
        styles.sectionHeader,
        {
          fontSize: settings.fontSize + 2,
          color: colors.primary,
          marginBottom: 15
        }
      ]}>
        Configurações Disponíveis
      </Text>

      {/* Tamanho da Fonte */}
      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <View style={styles.iconTitleContainer}>
          <Icon name="format-size" size={24} color={colors.primary} />
          <Text style={[
            styles.helpTitle,
            {
              fontSize: settings.fontSize + 2,
              color: colors.text,
              marginLeft: 10
            }
          ]}>
            Tamanho da Fonte
          </Text>
        </View>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text,
            marginTop: 8
          }
        ]}>
          Ajusta o tamanho de todos os textos na aplicação para melhor legibilidade.
        </Text>
        <Text style={[
          styles.tipText,
          {
            fontSize: settings.fontSize,
            color: colors.primary,
            marginTop: 10
          }
        ]}>
          Faixa: 14px (padrão) até 24px (grande)
        </Text>
      </View>

      {/* Alto Contraste */}
      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <View style={styles.iconTitleContainer}>
          <Icon name="contrast" size={24} color={colors.primary} />
          <Text style={[
            styles.helpTitle,
            {
              fontSize: settings.fontSize + 2,
              color: colors.text,
              marginLeft: 10
            }
          ]}>
            Alto Contraste
          </Text>
        </View>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text,
            marginTop: 8
          }
        ]}>
          Melhora a distinção entre elementos visuais, ideal para usuários com baixa visão.
        </Text>
        <Text style={[
          styles.exampleText,
          {
            fontSize: settings.fontSize,
            color: colors.text,
            fontStyle: 'italic',
            marginTop: 5
          }
        ]}>
          Ativado: Cores mais vibrantes com máximo contraste
        </Text>
      </View>

      {/* Zoom */}
      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <View style={styles.iconTitleContainer}>
          <Icon name="magnify" size={24} color={colors.primary} />
          <Text style={[
            styles.helpTitle,
            {
              fontSize: settings.fontSize + 2,
              color: colors.text,
              marginLeft: 10
            }
          ]}>
            Zoom Habilitado
          </Text>
        </View>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text,
            marginTop: 8
          }
        ]}>
          Permite ampliar áreas da tela com gestos de pinça.
        </Text>
        <Text style={[
          styles.tipText,
          {
            fontSize: settings.fontSize,
            color: colors.primary,
            marginTop: 10
          }
        ]}>
          Como usar: Toque três vezes na tela ou faça gesto de pinça para ativar
        </Text>
      </View>

      {/* Seção de Campos do TED */}
      <Text style={[
        styles.sectionHeader,
        {
          fontSize: settings.fontSize + 2,
          color: colors.primary,
          marginTop: 30,
          marginBottom: 15
        }
      ]}>
        Campos da Transferência (TED)
      </Text>

      {/* Tipo de Transferência */}
      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <View style={styles.iconTitleContainer}>
          <Icon name="swap-horizontal" size={24} color={colors.primary} />
          <Text style={[
            styles.helpTitle,
            {
              fontSize: settings.fontSize + 2,
              color: colors.text,
              marginLeft: 10
            }
          ]}>
            Tipo de Transferência
          </Text>
        </View>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text,
            marginTop: 8
          }
        ]}>
          Escolha entre: Mesma Titularidade, Terceiros ou Depósito Judicial.
        </Text>
        <Text style={[
          styles.tipText,
          {
            fontSize: settings.fontSize,
            color: colors.primary,
            marginTop: 10
          }
        ]}>
          Mesma Titularidade: Contas em seu nome
        </Text>
        <Text style={[
          styles.tipText,
          {
            fontSize: settings.fontSize,
            color: colors.primary
          }
        ]}>
          Terceiros: Para outras pessoas
        </Text>
        <Text style={[
          styles.tipText,
          {
            fontSize: settings.fontSize,
            color: colors.primary
          }
        ]}>
          Depósito Judicial: Para processos judiciais
        </Text>
      </View>

      {/* Dados Bancários */}
      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <View style={styles.iconTitleContainer}>
          <Icon name="bank" size={24} color={colors.primary} />
          <Text style={[
            styles.helpTitle,
            {
              fontSize: settings.fontSize + 2,
              color: colors.text,
              marginLeft: 10
            }
          ]}>
            Dados Bancários
          </Text>
        </View>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text,
            marginTop: 8
          }
        ]}>
          Informações obrigatórias para todas as transferências:
        </Text>
        <View style={styles.fieldDetail}>
          <Text style={[
            styles.fieldName,
            {
              fontSize: settings.fontSize,
              color: colors.text,
              fontWeight: 'bold'
            }
          ]}>
            Banco:
          </Text>
          <Text style={[
            styles.fieldDescription,
            {
              fontSize: settings.fontSize,
              color: colors.text
            }
          ]}>
            Selecione o banco destino na lista
          </Text>
        </View>
        <View style={styles.fieldDetail}>
          <Text style={[
            styles.fieldName,
            {
              fontSize: settings.fontSize,
              color: colors.text,
              fontWeight: 'bold'
            }
          ]}>
            Agência/Conta:
          </Text>
          <Text style={[
            styles.fieldDescription,
            {
              fontSize: settings.fontSize,
              color: colors.text
            }
          ]}>
            Formato: 0000-000000-0 (Agência-Conta-DV)
          </Text>
        </View>
      </View>

      {/* Valor e Data */}
      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <View style={styles.iconTitleContainer}>
          <Icon name="cash" size={24} color={colors.primary} />
          <Text style={[
            styles.helpTitle,
            {
              fontSize: settings.fontSize + 2,
              color: colors.text,
              marginLeft: 10
            }
          ]}>
            Valor e Data
          </Text>
        </View>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text,
            marginTop: 8
          }
        ]}>
          Campos essenciais para completar a transferência:
        </Text>
        <View style={styles.fieldDetail}>
          <Text style={[
            styles.fieldName,
            {
              fontSize: settings.fontSize,
              color: colors.text,
              fontWeight: 'bold'
            }
          ]}>
            Valor (R$):
          </Text>
          <Text style={[
            styles.fieldDescription,
            {
              fontSize: settings.fontSize,
              color: colors.text
            }
          ]}>
            Digite o valor com centavos (ex: 150,99)
          </Text>
        </View>
        <View style={styles.fieldDetail}>
          <Text style={[
            styles.fieldName,
            {
              fontSize: settings.fontSize,
              color: colors.text,
              fontWeight: 'bold'
            }
          ]}>
            Data:
          </Text>
          <Text style={[
            styles.fieldDescription,
            {
              fontSize: settings.fontSize,
              color: colors.text
            }
          ]}>
            Selecione a data de execução da transferência
          </Text>
        </View>
      </View>

      {/* Campos Específicos por Tipo */}
      <View style={[
        styles.helpItem,
        { backgroundColor: colors.cardBackground }
      ]}>
        <View style={styles.iconTitleContainer}>
          <Icon name="form-textbox" size={24} color={colors.primary} />
          <Text style={[
            styles.helpTitle,
            {
              fontSize: settings.fontSize + 2,
              color: colors.text,
              marginLeft: 10
            }
          ]}>
            Campos Específicos
          </Text>
        </View>
        <Text style={[
          styles.helpText,
          {
            fontSize: settings.fontSize,
            color: colors.text,
            marginTop: 8
          }
        ]}>
          Diferentes tipos de transferência exigem informações adicionais:
        </Text>
        
        <View style={styles.fieldDetail}>
          <Text style={[
            styles.fieldName,
            {
              fontSize: settings.fontSize,
              color: colors.primary,
              fontWeight: 'bold'
            }
          ]}>
            Terceiros:
          </Text>
          <Text style={[
            styles.fieldDescription,
            {
              fontSize: settings.fontSize,
              color: colors.text
            }
          ]}>
            - CPF do destinatário
          </Text>
          <Text style={[
            styles.fieldDescription,
            {
              fontSize: settings.fontSize,
              color: colors.text
            }
          ]}>
            - Finalidade da transferência
          </Text>
        </View>

        <View style={styles.fieldDetail}>
          <Text style={[
            styles.fieldName,
            {
              fontSize: settings.fontSize,
              color: colors.primary,
              fontWeight: 'bold'
            }
          ]}>
            Depósito Judicial:
          </Text>
          <Text style={[
            styles.fieldDescription,
            {
              fontSize: settings.fontSize,
              color: colors.text
            }
          ]}>
            - Número do processo/identificação
          </Text>
        </View>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionHeader: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  helpItem: {
    marginBottom: 25,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpTitle: {
    fontWeight: 'bold',
  },
  helpText: {
    lineHeight: 22,
  },
  tipText: {
    lineHeight: 20,
    fontWeight: '500',
  },
  exampleText: {
    lineHeight: 20,
  },
  fieldDetail: {
    marginTop: 10,
    marginLeft: 10,
  },
  fieldName: {
    marginBottom: 3,
  },
  fieldDescription: {
    marginLeft: 10,
    marginBottom: 5,
  },
});

export default AcessibilidadeHelpScreen;