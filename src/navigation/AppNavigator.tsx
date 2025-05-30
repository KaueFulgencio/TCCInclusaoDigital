import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import AcessibilidadeScreen from "../screens/AcessibilidadeScreen";
import TEDScreen from "../screens/TEDScreen";
import ConfirmScreen from "../screens/ConfirmationScreen";
import SuccessScreen from "../screens/SuccessScreen";
import { useAccessibility } from "../context/AccessibilityContext";
import { useCallback } from "react";
import AcessibilidadeHelpScreen from "../screens/AcessibilidadeHelpScreen";
import PixScreen from "../screens/PixScreen";
import HistoryScreen from "../screens/HistoryScreen";
import {AppTracker} from "../../AppTracker";

const Stack = createStackNavigator();

function NavigatorWithAccessibility() {
  const { colors } = useAccessibility();

  const screenOptions = useCallback(() => ({
    headerStyle: {
      backgroundColor: colors.cardBackground,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      color: colors.text,
    },
    cardStyle: {
      backgroundColor: colors.cardBackground,
    },
  }), [colors]);

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Acessibilidade" component={AcessibilidadeScreen} />
      <Stack.Screen name="TED" component={TEDScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmScreen} />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="AcessibilidadeHelp" component={AcessibilidadeHelpScreen} options={{ title: 'Ajuda' }} />
      <Stack.Screen name="Pix" component={PixScreen} options={{ title: 'Enviar PIX' }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppTracker />
      <NavigatorWithAccessibility />
    </NavigationContainer>
  );
}