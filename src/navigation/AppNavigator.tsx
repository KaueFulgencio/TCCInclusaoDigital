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
import { AppTracker } from "../../AppTracker";
import TEDFlow from "../screens/TEDFlow";
import { PixCaixaHomeScreen } from "../screens/PIX/PixCaixaHomeScreen";
import { PixCaixaConfirmRecipientScreen } from "../screens/PIX/PixCaixaConfirmRecipientScreen";
import { PixCaixaPasswordScreen } from "../screens/PIX/PixCaixaPasswordScreen";
import { PixCaixaConfirmDataScreen } from "../screens/PIX/PixCaixaConfirmDataScreen";

const Stack = createStackNavigator();

function NavigatorWithAccessibility() {
  const { colors } = useAccessibility();

  const screenOptions = useCallback(
    () => ({
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
    }),
    [colors]
  );

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
      <Stack.Screen
        name="AcessibilidadeHelp"
        component={AcessibilidadeHelpScreen}
        options={{ title: "Ajuda" }}
      />
      <Stack.Screen
        name="Pix"
        component={PixScreen}
        options={{ title: "Enviar PIX" }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Histórico" }}
      />
      <Stack.Screen
        name="TEDFlow"
        component={TEDFlow}
        options={{ title: "Transferência TED CAIXA" }}
      />
      <Stack.Screen
        name="PixCaixaHomeScreen"
        component={PixCaixaHomeScreen}
        options={{ title: "Pagar via Pix" }}
      />
      <Stack.Screen
        name="PixCaixaConfirmRecipientScreen"
        component={PixCaixaConfirmRecipientScreen}
        options={{ title: "Confirmar destinatário" }}
      />
      <Stack.Screen
        name="PixCaixaConfirmDataScreen"
        component={PixCaixaConfirmDataScreen}
        options={{ title: "Confirmar pagamento" }}
      />
      <Stack.Screen
        name="PixCaixaConfirmationScreen"
        component={PixCaixaConfirmDataScreen}
        options={{ title: "Confirmar pagamento" }}
      />
      <Stack.Screen
        name="PixCaixaPasswordScreen"
        component={PixCaixaPasswordScreen}
        options={{ title: "Senha" }}
      />
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
