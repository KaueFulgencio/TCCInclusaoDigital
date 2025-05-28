// src/navigation/types.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type TransferData = {
  transferType: string;
  bank: string;
  account: string;
  value: string;
  recipientName?: string;
  recipientCPF?: string;
};

export type RootStackParamList = {
  Home: undefined;
  Acessibilidade: undefined;
  TED: undefined;
  Confirmation: { transferData: TransferData };
  Success: undefined; 
  // outras rotas 
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type AcessibilidadeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Acessibilidade'>;
export type TEDScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TED'>;
export type ConfirmationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Confirmation'>;
export type SuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Success'>;

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type AcessibilidadeScreenRouteProp = RouteProp<RootStackParamList, 'Acessibilidade'>;
export type TEDScreenRouteProp = RouteProp<RootStackParamList, 'TED'>;
export type ConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'Confirmation'>;
export type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'Success'>;