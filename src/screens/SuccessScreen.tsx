import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAccessibility } from '../context/AccessibilityContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-paper';
import { SuccessScreenNavigationProp } from '../navigation/types';

const SuccessScreen = () => {
  const { settings, uploadAnalyticsToFirebase, endCurrentSession } = useAccessibility();
  const navigation = useNavigation<SuccessScreenNavigationProp>();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showButton, setShowButton] = React.useState(false);
  const buttonTimer = useRef<NodeJS.Timeout | null>(null);

  const colors = {
    background: settings.highContrast ? "#000" : "#F8F9FA",
    text: settings.highContrast ? "#FFD700" : "#2F2F2F",
    icon: settings.highContrast ? "#FFD700" : "#4CAF50",
    button: settings.highContrast ? "#333" : "#6200ee",
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    buttonTimer.current = setTimeout(() => setShowButton(true), 2000);

    return () => {
      if (buttonTimer.current) clearTimeout(buttonTimer.current);
    };
  }, []);

  const handleGoHome = async () => {
    endCurrentSession(); // Finaliza a sessão
    await uploadAnalyticsToFirebase(); // Envia para o Firebase
    navigation.navigate("Home"); // Vai para a Home
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        style={[
          styles.content,
          { 
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }
        ]}
        accessible
        accessibilityLabel="Transferência realizada com sucesso"
      >
        <Icon 
          name="check-circle" 
          size={100} 
          color={colors.icon}
          accessibilityElementsHidden
        />
        
        <Text 
          style={[
            styles.title, 
            { 
              fontSize: settings.fontSize + 8,
              color: colors.text 
            }
          ]}
          accessibilityRole="header"
        >
          Sucesso!
        </Text>
        
        <Text 
          style={[
            styles.message, 
            { 
              fontSize: settings.fontSize,
              color: colors.text 
            }
          ]}
        >
          Transferência concluída com êxito
        </Text>

        {showButton && (
          <Button
            mode="contained"
            onPress={handleGoHome}
            style={[styles.button, { backgroundColor: colors.button }]}
            labelStyle={[
              styles.buttonText,
              { 
                fontSize: settings.fontSize,
                color: settings.highContrast ? "#000" : "#FFF"
              }
            ]}
            accessibilityLabel="Voltar para página inicial"
            accessibilityHint="Retorna à tela principal do aplicativo"
          >
            Voltar ao Início
          </Button>
        )}
      </Animated.View>
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
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: '80%',
  },
  button: {
    marginTop: 20,
    width: '80%',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default SuccessScreen;
