import React, { useState, useEffect } from 'react';
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
    updateSettings,
    incrementClickCount,
    updateExecutionTime,
  } = useAccessibility();

  const [localSettings, setLocalSettings] = useState(settings);
  const [startTime] = useState(Date.now());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    return () => {
      const endTime = Date.now();
      updateExecutionTime((endTime - startTime) / 1000);
    };
  }, [startTime, updateExecutionTime]);

  const handleSave = () => {
    incrementClickCount();
    setIsSaving(true);

    setTimeout(() => {
      updateSettings(localSettings);
      setIsSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }, 1000); // Simula tempo de salvamento
  };

  return (
    <ScrollView contentContainerStyle={[
      styles.container,
      localSettings.highContrast && styles.highContrastContainer
    ]}>
      <Text style={[styles.title, { fontSize: localSettings.fontSize + 4, color: localSettings.highContrast ? '#fff' : '#333' }]}>
        Configurações de Acessibilidade
      </Text>

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Icon name="format-size" size={24} color="#6200ee" />
          <Text style={[styles.settingText, { fontSize: localSettings.fontSize, color: localSettings.highContrast ? '#fff' : '#333' }]}>
            Tamanho da Fonte
          </Text>
        </View>
        <Slider
          value={localSettings.fontSize}
          onValueChange={(value) => setLocalSettings(prev => ({ ...prev, fontSize: value }))}
          minimumValue={14}
          maximumValue={24}
          step={2}
          style={styles.slider}
          minimumTrackTintColor="#6200ee"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#6200ee"
        />
        <View style={styles.sliderLabels}>
          <Text style={[styles.sliderLabel, { fontSize: localSettings.fontSize }]}>14px</Text>
          <Text style={[styles.sliderValue, { fontSize: localSettings.fontSize }]}>{localSettings.fontSize}px</Text>
          <Text style={[styles.sliderLabel, { fontSize: localSettings.fontSize }]}>24px</Text>
        </View>
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Icon name="contrast" size={24} color="#6200ee" />
          <Text style={[styles.settingText, { fontSize: localSettings.fontSize, color: localSettings.highContrast ? '#fff' : '#333' }]}>
            Alto Contraste
          </Text>
        </View>
        <Switch
          value={localSettings.highContrast}
          onValueChange={(value) => {
            setLocalSettings(prev => ({ ...prev, highContrast: value }));
            incrementClickCount();
          }}
          thumbColor="#6200ee"
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Icon name="magnify" size={24} color="#6200ee" />
          <Text style={[styles.settingText, { fontSize: localSettings.fontSize, color: localSettings.highContrast ? '#fff' : '#333' }]}>
            Zoom Habilitado
          </Text>
        </View>
        <Switch
          value={localSettings.zoomEnabled}
          onValueChange={(value) => {
            setLocalSettings(prev => ({ ...prev, zoomEnabled: value }));
            incrementClickCount();
          }}
          thumbColor="#6200ee"
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <View style={styles.saveButton}>
        {isSaving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : saveSuccess ? (
          <Icon name="check-circle" size={24} color="#fff" />
        ) : (
          <Button
            mode="contained"
            onPress={handleSave}
            labelStyle={styles.buttonText}
          >
            Salvar Configurações
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  highContrastContainer: {
    backgroundColor: '#000',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  settingItem: {
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
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
  sliderLabel: {
    color: '#757575',
  },
  sliderValue: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#6200ee',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default AcessibilidadeScreen;
