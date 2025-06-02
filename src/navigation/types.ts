import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type TransferData = {
  transferType: string;
  bank: string;
  account: string;
  value: string;
  recipientName?: string;
  recipientCPF?: string;
};

export type PixData = {
  value: string;
  pixKey: string;
  recipientName?: string;
};

export type RootStackParamList = {
  Home: undefined;
  Acessibilidade: undefined;
  AcessibilidadeHelp: undefined;
  TED: undefined;
  Pix: undefined;
  Confirmation: {
    transferData: TransferData;
    clickCount?: number;
    executionTime?: number;
  };
  PixConfirmation: { pixData: PixData };
  Success: {
    transferData: TransferData;
    clickCount: number;
    executionTime: number;
  };
  History: undefined;
  TEDFlow: undefined;
  SuccessCAIXA: undefined;
  PixCaixaHomeScreen: undefined;
  PixCaixaConfirmRecipientScreen: {
    clickCount: number;
    executionTime: number;
  };
  PixCaixaConfirmationScreen: {
    clickCount: number;
    executionTime: number;
  }
  PixCaixaPasswordScreen: {
    clickCount: number;
    executionTime: number;
  }
  PixCaixaConfirmDataScreen: {
    clickCount: number;
    executionTime: number;
  }
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

export type AcessibilidadeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Acessibilidade"
>;
export type AcessibilidadeHelpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AcessibilidadeHelp"
>;
export type TEDScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TED"
>;
export type PixScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Pix"
>;
export type ConfirmationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Confirmation"
>;
export type PixConfirmationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PixConfirmation"
>;
export type SuccessScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Success"
>;
export type HistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "History"
>;
export type TEDFlowNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TEDFlow"
>;
export type SuccessScreenCAIXANavigationProp = StackNavigationProp<
  RootStackParamList,
  "SuccessCAIXA"
>;
export type PixCaixaHomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PixCaixaHomeScreen"
  >;
export type PixCaixaConfirmRecipientScreenRouteProp = RouteProp<
  RootStackParamList,
  "PixCaixaConfirmRecipientScreen"
  >;
export type PixCaixaConfirmationScreenRouteProp = RouteProp<
  RootStackParamList,
  "PixCaixaConfirmationScreen"
  >;
export type PixCaixaPasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  "PixCaixaPasswordScreen"
  >;
export type PixCaixaConfirmDataScreenRouteProp = RouteProp<
  RootStackParamList,
  "PixCaixaConfirmDataScreen"
  >;


export type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;
export type AcessibilidadeScreenRouteProp = RouteProp<
  RootStackParamList,
  "Acessibilidade"
>;
export type AcessibilidadeHelpScreenRouteProp = RouteProp<
  RootStackParamList,
  "AcessibilidadeHelp"
>;
export type TEDScreenRouteProp = RouteProp<RootStackParamList, "TED">;
export type PixScreenRouteProp = RouteProp<RootStackParamList, "Pix">;
export type ConfirmationScreenRouteProp = RouteProp<
  RootStackParamList,
  "Confirmation"
>;
export type PixConfirmationScreenRouteProp = RouteProp<
  RootStackParamList,
  "PixConfirmation"
>;
export type SuccessScreenRouteProp = RouteProp<RootStackParamList, "Success">;
export type HistoryScreenRouteProp = RouteProp<RootStackParamList, "History">;
export type TEDFlowRouteProp = RouteProp<RootStackParamList, "TEDFlow">;
export type SuccessScreenCAIXARouteProp = RouteProp<
  RootStackParamList,
  "SuccessCAIXA"
>;
