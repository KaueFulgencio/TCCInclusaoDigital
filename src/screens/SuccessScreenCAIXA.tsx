import React, { use } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAccessibility } from '../context/AccessibilityContext';
import { SuccessScreenCAIXANavigationProp } from '../navigation/types';

const SuccessScreenCAIXA = () => {
  const { colors } = useAccessibility();
  const navigation = useNavigation<SuccessScreenCAIXANavigationProp>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>TED realizado com sucesso!</Text>
      <Text style={[styles.message, { color: colors.text }]}>
        Sua transferência foi processada.
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>Voltar ao início</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default SuccessScreenCAIXA;