import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

type AccessibilitySettings = {
  fontSize: number;
  highContrast: boolean;
  zoomEnabled: boolean;
};

type AnalyticsData = {
  executionTime: number;
  clickCount: number;
  lastAccessed: string;
  sessionCount?: number;
};

type ExportAnalyticsResult = {
  filePath: string;
  data: AnalyticsData;
} | null;

type AccessibilityColors = {
  cardBackground: string;
  text: string;
  border: string;
  placeholder: string;
  error: string;
};

type AccessibilityContextType = {
  settings: AccessibilitySettings;
  colors: AccessibilityColors;
  analytics: AnalyticsData;
  updateSettings: (
    newSettings: Partial<AccessibilitySettings>
  ) => Promise<void>;
  incrementClickCount: () => void;
  updateExecutionTime: (time: number) => void;
  exportAnalytics: () => Promise<ExportAnalyticsResult>;
  listSavedAnalytics: () => Promise<string[]>;
  clearAnalytics: () => Promise<void>;
};

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  zoomEnabled: false,
};

const defaultAnalytics: AnalyticsData = {
  executionTime: 0,
  clickCount: 0,
  lastAccessed: new Date().toISOString(),
  sessionCount: 0,
};

const defaultColors: AccessibilityColors = {
  cardBackground: "#fff",
  text: "#000",
  border: "#ccc",
  placeholder: "#999",
  error: "red",
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  colors: defaultColors, 
  analytics: defaultAnalytics,
  updateSettings: async () => {},
  incrementClickCount: () => {},
  updateExecutionTime: () => {},
  exportAnalytics: async () => null,
  listSavedAnalytics: async () => [],
  clearAnalytics: async () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega dados ao iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedSettings, savedAnalytics] = await Promise.all([
          AsyncStorage.getItem("@accessibility_settings"),
          AsyncStorage.getItem("@analytics_data"),
        ]);

        if (savedSettings) setSettings(JSON.parse(savedSettings));
        if (savedAnalytics) {
          const parsedAnalytics = JSON.parse(savedAnalytics);
          // Incrementa contador de sessões
          setAnalytics({
            ...parsedAnalytics,
            sessionCount: (parsedAnalytics.sessionCount || 0) + 1,
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const saveData = async () => {
      try {
        await AsyncStorage.multiSet([
          ["@accessibility_settings", JSON.stringify(settings)],
          ["@analytics_data", JSON.stringify(analytics)],
        ]);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    saveData();
  }, [settings, analytics, isLoaded]);

  const updateSettings = async (
    newSettings: Partial<AccessibilitySettings>
  ) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const incrementClickCount = () => {
    setAnalytics((prev) => ({
      ...prev,
      clickCount: prev.clickCount + 1,
      lastAccessed: new Date().toISOString(),
    }));
  };

  const updateExecutionTime = (time: number) => {
    setAnalytics((prev) => ({
      ...prev,
      executionTime: prev.executionTime + time,
    }));
  };

  const exportAnalytics = async (): Promise<ExportAnalyticsResult> => {
    try {
      const analyticsData = await AsyncStorage.getItem("@analytics_data");

      if (analyticsData) {
        const parsedData = JSON.parse(analyticsData) as AnalyticsData;
        const fileName = `analytics_${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}.json`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, analyticsData);

        return {
          filePath: fileUri,
          data: parsedData,
        };
      }
      return null;
    } catch (error) {
      console.error("Error exporting analytics:", error);
      throw error;
    }
  };

  const listSavedAnalytics = async (): Promise<string[]> => {
    try {
      const directory = FileSystem.documentDirectory;
      if (!directory) {
        console.warn("Document directory not available");
        return [];
      }

      const files = await FileSystem.readDirectoryAsync(directory);

      return files.filter(
        (file) => file.startsWith("analytics_") && file.endsWith(".json")
      );
    } catch (error) {
      console.error("Error listing analytics files:", error);
      return [];
    }
  };

  const clearAnalytics = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("@analytics_data");
      setAnalytics(defaultAnalytics);
    } catch (error) {
      console.error("Error clearing analytics:", error);
    }
  };

  const colors = settings.highContrast
    ? {
        cardBackground: "#000000",
        text: "#FFFFFF",
        border: "#FFFFFF",
        placeholder: "#AAAAAA",
        error: "#FF6B6B",
      }
    : {
        cardBackground: "#FFFFFF",
        text: "#000000",
        border: "#CCCCCC",
        placeholder: "#999999",
        error: "#B00020",
      };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        colors,
        analytics,
        updateSettings,
        incrementClickCount,
        updateExecutionTime,
        exportAnalytics,
        listSavedAnalytics,
        clearAnalytics,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
