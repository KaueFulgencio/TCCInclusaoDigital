import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAccessibility } from './src/context/AccessibilityContext';

export const AppTracker = () => {
  const navigation = useNavigation();
  const { startNewSession, recordScreenTransition } = useAccessibility();

  useEffect(() => {
    startNewSession();

    const unsubscribe = navigation.addListener('state', (e) => {
      const currentRoute = e.data?.state?.routes?.[e.data.state.index];
      if (currentRoute) {
        recordScreenTransition(currentRoute.name);
      }
    });

    return unsubscribe;
  }, [navigation, startNewSession, recordScreenTransition]);

  return null;
};