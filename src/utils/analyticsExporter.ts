import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export const exportAnalytics = async () => {
  try {
    const analytics = await AsyncStorage.getItem('@analytics_data');
    
    if (analytics) {
      const parsedData = JSON.parse(analytics);
      
      const fileUri = `${FileSystem.documentDirectory}analytics_${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(fileUri, analytics);
      
      return {
        filePath: fileUri,
        data: parsedData
      };
    }
    return null;
  } catch (error) {
    console.error('Error exporting analytics:', error);
    throw error;
  }
};
