import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from 'styled-components';
import { theme } from './src/styles/theme';
import { AccessibilityProvider } from './src/context/AccessibilityContext';

export default function App() {
  
  return (
    <ThemeProvider theme={theme}>
      <AccessibilityProvider>
        <AppNavigator />
      </AccessibilityProvider>
    </ThemeProvider>
  );
}