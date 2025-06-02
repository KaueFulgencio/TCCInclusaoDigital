import React, { useState } from 'react';
import SelectTEDType from '../components/CAIXA/SelectTEDType';
import TEDForm from '../components/CAIXA/TEDForm';
import TEDConfirmation from '../components/CAIXA/TEDConfirmation';
import TEDSuccess from '../components/CAIXA/TEDSuccess';

export type TransferType = 'same' | 'third' | 'judicial';

interface TEDFormData {
  originAccount?: string;
  bank: string;
  accountType?: string;
  agency?: string;
  account?: string;
  digit?: string;
  personType?: string;
  name?: string;
  cpf?: string;
  value: string;
  purpose?: string;
  transferId?: string;
  history?: string;
  schedule: string;
  judicialId?: string;
  depositId?: string;
}

const TEDFlow = () => {
  const [step, setStep] = useState<'select' | 'form' | 'confirm' | 'success'>('select');
  const [transferType, setTransferType] = useState<TransferType | null>(null);
  const [formData, setFormData] = useState<TEDFormData | null>(null);

  const goToForm = (type: TransferType) => {
    setTransferType(type);
    setStep('form');
  };

  const handleFormSubmit = (data: TEDFormData) => {
    // Adiciona dados padrão conforme o tipo de TED
    const completeData = {
      ...data,
      originAccount: '1234-5', // Exemplo de conta de origem
      // Para TED mesma titularidade, preenche automaticamente alguns campos
      ...(transferType === 'same' && {
        name: 'KAUE MEDEIROS FULGENCIO',
        cpf: '494.827.158-61',
        personType: '01 - Pessoa Física'
      }),
      // Padroniza o campo de identificação judicial
      ...(transferType === 'judicial' && data.judicialId && {
        depositId: data.judicialId
      })
    };
    setFormData(completeData);
    setStep('confirm');
  };

  const handleConfirm = () => {
    // Aqui você faria a chamada API para executar a TED
    // Simulando sucesso:
    setStep('success');
  };

  const handleFinish = () => {
    // Resetar o fluxo
    setStep('select');
    setTransferType(null);
    setFormData(null);
  };

  switch (step) {
    case 'select':
      return <SelectTEDType onSelect={goToForm} />;
    case 'form':
      return (
        <TEDForm 
          type={transferType!} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setStep('select')} 
        />
      );
    case 'confirm':
      return (
        <TEDConfirmation 
          data={formData!} 
          type={transferType!}
          onBack={() => setStep('form')} 
          onConfirm={handleConfirm} 
        />
      );
    case 'success':
      return <TEDSuccess 
        data={formData!} 
        type={transferType!} // Adicionando o type aqui
        onContinue={handleFinish} 
      />;
    default:
      return null;
  }
};

export default TEDFlow;