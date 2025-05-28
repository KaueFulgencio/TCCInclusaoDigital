import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import AcessibilidadeScreen from "../screens/AcessibilidadeScreen";
import TEDScreen from "../screens/TEDScreen";
import ConfirmScreen from "../screens/ConfirmationScreen";
import SuccessScreen from "../screens/SuccessScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
