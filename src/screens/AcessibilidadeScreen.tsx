import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAccessibility } from '../context/AccessibilityContext';
import { useNavigation } from '@react-navigation/native';

const AcessibilidadeScreen = () => {
  const navigation = useNavigation();
  const {
    settings,
    colors,
    updateSettings,
    incrementClickCount,
    updateExecutionTime,
  } = useAccessibility();

  const [localSettings, setLocalSettings] = useState(settings);
  const [startTime] = useState(Date.now());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Atualiza o tempo de execução ao desmontar (sem dependências problemáticas)
  useEffect(() => {
    return () => {
      const endTime = Date.now();
      updateExecutionTime((endTime - startTime) / 1000);
    };
  }, [updateExecutionTime, startTime]);

  // Função de salvamento otimizada
  const handleSave = useCallback(() => {
    incrementClickCount();
    setIsSaving(true);

    setTimeout(() => {
      updateSettings(localSettings);
      setIsSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }, 1000);
  }, [localSettings, updateSettings, incrementClickCount, navigation]);

  // Atualizações de estado para cada configuração (evitando renderizações excessivas)
  const handleFontSizeChange = useCallback((value: number) => {
    setLocalSettings(prev => ({ ...prev, fontSize: value }));
  }, []);

  const handleHighContrastToggle = useCallback((value: boolean) => {
    setLocalSettings(prev => ({ ...prev, highContrast: value }));
    incrementClickCount();
  }, [incrementClickCount]);

  const handleZoomToggle = useCallback((value: boolean) => {
    setLocalSettings(prev => ({ ...prev, zoomEnabled: value }));
    incrementClickCount();
  }, [incrementClickCount]);

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
          fontSize: localSettings.fontSize + 4, 
          color: colors.text 
        }
      ]}>
        Configurações de Acessibilidade
      </Text>

      {/* Controle de Tamanho da Fonte */}
      <View style={[
        styles.settingItem, 
        { 
          backgroundColor: colors.cardBackground, 
          borderColor: colors.border 
        }
      ]}>
        <View style={styles.settingTextContainer}>
          <Icon name="format-size" size={24} color={colors.text} />
          <Text style={[
            styles.settingText, 
            { 
              fontSize: localSettings.fontSize, 
              color: colors.text 
            }
          ]}>
            Tamanho da Fonte
          </Text>
        </View>
        <Slider
          value={localSettings.fontSize}
          onValueChange={handleFontSizeChange}
          minimumValue={14}
          maximumValue={24}
          step={2}
          style={styles.slider}
          minimumTrackTintColor={colors.text}
          maximumTrackTintColor={colors.placeholder}
          thumbTintColor={colors.text}
        />
        <View style={styles.sliderLabels}>
          <Text style={[
            styles.sliderLabel, 
            { 
              fontSize: localSettings.fontSize, 
              color: colors.text 
            }
          ]}>
            14px
          </Text>
          <Text style={[
            styles.sliderValue, 
            { 
              fontSize: localSettings.fontSize, 
              color: colors.text 
            }
          ]}>
            {localSettings.fontSize}px
          </Text>
          <Text style={[
            styles.sliderLabel, 
            { 
              fontSize: localSettings.fontSize, 
              color: colors.text 
            }
          ]}>
            24px
          </Text>
        </View>
      </View>

      {/* Controle de Alto Contraste */}
      <View style={[
        styles.settingItem, 
        { 
          backgroundColor: colors.cardBackground, 
          borderColor: colors.border 
        }
      ]}>
        <View style={styles.settingTextContainer}>
          <Icon name="contrast" size={24} color={colors.text} />
          <Text style={[
            styles.settingText, 
            { 
              fontSize: localSettings.fontSize, 
              color: colors.text 
            }
          ]}>
            Alto Contraste
          </Text>
        </View>
        <Switch
          value={localSettings.highContrast}
          onValueChange={handleHighContrastToggle}
          thumbColor={colors.text}
          trackColor={{ 
            false: colors.placeholder, 
            true: colors.text 
          }}
        />
      </View>

      {/* Controle de Zoom */}
      <View style={[
        styles.settingItem, 
        { 
          backgroundColor: colors.cardBackground, 
          borderColor: colors.border 
        }
      ]}>
        <View style={styles.settingTextContainer}>
          <Icon name="magnify" size={24} color={colors.text} />
          <Text style={[
            styles.settingText, 
            { 
              fontSize: localSettings.fontSize, 
              color: colors.text 
            }
          ]}>
            Zoom Habilitado
          </Text>
        </View>
        <Switch
          value={localSettings.zoomEnabled}
          onValueChange={handleZoomToggle}
          thumbColor={colors.text}
          trackColor={{ 
            false: colors.placeholder, 
            true: colors.text 
          }}
        />
      </View>

      {/* Botão de Salvar */}
      <View style={[
        styles.saveButton, 
        { backgroundColor: colors.text }
      ]}>
        {isSaving ? (
          <ActivityIndicator 
            size="small" 
            color={colors.cardBackground} 
          />
        ) : saveSuccess ? (
          <Icon 
            name="check-circle" 
            size={24} 
            color={colors.cardBackground} 
          />
        ) : (
          <Button
            mode="contained"
            onPress={handleSave}
            labelStyle={[
              styles.buttonText, 
              { color: colors.cardBackground }
            ]}
            color={colors.text}
          >
            Salvar Configurações
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

// Estilos (sem cores fixas)
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
  settingItem: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 2,
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingText: {
    marginLeft: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderLabel: {},
  sliderValue: {
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default AcessibilidadeScreen;