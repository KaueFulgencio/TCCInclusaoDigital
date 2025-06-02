import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type TransactionData = {
  amount: string;
  pixKey: string;
  userId: string;
  type: string;
  status: string;
};

type AccessibilitySettings = {
  fontSize: number;
  highContrast: boolean;
  zoomEnabled: boolean;
};

type SessionData = {
  startTime: number;
  endTime: number | null;
  screenFlow: string[];
};

type AnalyticsData = {
  executionTime: number;
  clickCount: number;
  lastAccessed: string;
  sessionCount?: number;
  currentSession: SessionData;
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
  primary: string;
  background: string;
  radioText: string;
  radioButton: string;
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
  startNewSession: () => void;
  recordScreenTransition: (screenName: string) => void;
  endCurrentSession: () => void;
  exportCompleteSessionData: () => Promise<any>;
  saveUserToFirebase: (userData: any) => Promise<boolean>;
  saveTransactionToFirebase: (transactionData: any) => Promise<boolean>;
  uploadAnalyticsToFirebase: (
    clickCount: number,
    duration: number
  ) => Promise<boolean>;
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
  currentSession: {
    startTime: Date.now(),
    endTime: null,
    screenFlow: ["AppStart"],
  },
};

const defaultColors: AccessibilityColors = {
  cardBackground: "#fff",
  text: "#000",
  border: "#ccc",
  placeholder: "#999",
  error: "red",
  primary: "#0066CC",
  background: "#F8F9FA",
  radioText: "#333",
  radioButton: "#0066CC",
};

export const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  colors: defaultColors,
  analytics: defaultAnalytics,
  updateSettings: async () => {},
  incrementClickCount: () => {},
  updateExecutionTime: () => {},
  exportAnalytics: async () => null,
  listSavedAnalytics: async () => [],
  clearAnalytics: async () => {},
  startNewSession: () => {},
  recordScreenTransition: () => {},
  endCurrentSession: () => {},
  exportCompleteSessionData: async () => null,
  uploadAnalyticsToFirebase: async () => false,
  saveUserToFirebase: async () => false,
  saveTransactionToFirebase: async () => false,
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveUserToFirebase = async (userData: any) => {
    try {
      await addDoc(collection(db, "users"), {
        ...userData,
        settings: settings,
        lastAccess: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      console.log("Usuário salvo no Firebase com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao salvar usuário no Firebase:", error);
      return false;
    }
  };

  const saveTransactionToFirebase = async (
    transactionData: TransactionData
  ) => {
    try {
      await addDoc(collection(db, "transactions"), {
        ...transactionData,
        settings: settings,
        analytics: {
          clickCount: analytics.clickCount,
          executionTime: analytics.executionTime,
        },
        timestamp: serverTimestamp(),
      });
      console.log("Transação salva no Firebase com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao salvar transação no Firebase:", error);
      return false;
    }
  };

  const uploadAnalyticsToFirebase = async (
    clickCount: number,
    executionTime: number
  ): Promise<boolean> => {
    try {
      const dataToSend = {
        clickCount,
        executionTime,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "analytics"), dataToSend);
      console.log("Analytics enviados para o Firebase com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao enviar analytics para o Firebase:", error);
      return false;
    }
  };

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
          setAnalytics({
            ...parsedAnalytics,
            sessionCount: (parsedAnalytics.sessionCount || 0) + 1,
            currentSession: {
              startTime: Date.now(),
              endTime: null,
              screenFlow: ["AppStart"],
            },
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
    console.log("Incrementing click count");
    setAnalytics((prev) => {
      const newCount = (prev.clickCount || 0) + 1;
      console.log(
        `Previous clicks: ${prev.clickCount}, New count: ${newCount}`
      );
      return {
        ...prev,
        clickCount: newCount,
        lastAccessed: new Date().toISOString(),
      };
    });
  };

  const updateExecutionTime = (time: number) => {
    setAnalytics((prev) => ({
      ...prev,
      executionTime: prev.executionTime + time,
    }));
  };

  const startNewSession = () => {
    setAnalytics((prev) => ({
      ...prev,
      clickCount: 0,
      currentSession: {
        startTime: Date.now(),
        endTime: null,
        screenFlow: ["AppStart"],
      },
    }));
  };

  const recordScreenTransition = (screenName: string) => {
    setAnalytics((prev) => ({
      ...prev,
      currentSession: {
        ...prev.currentSession,
        screenFlow: [...prev.currentSession.screenFlow, screenName],
      },
    }));
  };

  const endCurrentSession = () => {
    const endTime = Date.now();
    setAnalytics((prev) => {
      const sessionDuration = (endTime - prev.currentSession.startTime) / 1000;
      return {
        ...prev,
        executionTime: sessionDuration,
        currentSession: {
          ...prev.currentSession,
          endTime,
        },
      };
    });
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
        return { filePath: fileUri, data: parsedData };
      }
      return null;
    } catch (error) {
      console.error("Error exporting analytics:", error);
      throw error;
    }
  };

  const exportCompleteSessionData = async () => {
    try {
      const analyticsData = await AsyncStorage.getItem("@analytics_data");
      if (analyticsData) {
        const parsed = JSON.parse(analyticsData);
        return {
          ...parsed,
          sessionDuration: parsed.currentSession.endTime
            ? (parsed.currentSession.endTime -
                parsed.currentSession.startTime) /
              1000
            : null,
          screenFlow: parsed.currentSession.screenFlow.join(" > "),
        };
      }
      return null;
    } catch (error) {
      console.error("Error exporting session data:", error);
      return null;
    }
  };

  const listSavedAnalytics = async (): Promise<string[]> => {
    try {
      const directory = FileSystem.documentDirectory;
      if (!directory) return [];
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
        primary: "#FFD700",
        background: "#121212",
        radioText: "#FFFFFF",
        radioButton: "#FFD700",
      }
    : defaultColors;

  const contextValue = useMemo(
    () => ({
      settings,
      colors,
      analytics,
      updateSettings,
      incrementClickCount,
      updateExecutionTime,
      exportAnalytics,
      listSavedAnalytics,
      clearAnalytics,
      startNewSession,
      recordScreenTransition,
      endCurrentSession,
      exportCompleteSessionData,
      uploadAnalyticsToFirebase,
      saveUserToFirebase,
      saveTransactionToFirebase,
    }),
    [settings, colors, analytics]
  );

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
        startNewSession,
        recordScreenTransition,
        endCurrentSession,
        exportCompleteSessionData,
        uploadAnalyticsToFirebase,
        saveUserToFirebase,
        saveTransactionToFirebase,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
