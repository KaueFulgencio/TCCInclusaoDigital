import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from 'styled-components';
import { theme } from './src/styles/theme';
import { AccessibilityProvider } from './src/context/AccessibilityContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <AccessibilityProvider>
          <AppNavigator />
        </AccessibilityProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
