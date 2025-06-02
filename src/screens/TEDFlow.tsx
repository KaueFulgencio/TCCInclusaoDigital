import React, { useState } from 'react';
import SelectTEDType from '../components/CAIXA/SelectTEDType';
import TEDForm from '../components/CAIXA/TEDForm';
import TEDConfirmation from '../components/CAIXA/TEDConfirmation';
import TEDSuccess from '../components/CAIXA/TEDSuccess';

export type TransferType = 'same' | 'third' | 'judicial';

const TEDFlow = () => {
  const [step, setStep] = useState<'select' | 'form' | 'confirm' | 'success'>('select');
  const [transferType, setTransferType] = useState<TransferType | null>(null);
  const [formData, setFormData] = useState<any>({});

  const goToForm = (type: TransferType) => {
    setTransferType(type);
    setStep('form');
  };

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('success');
  };

  switch (step) {
    case 'select':
      return <SelectTEDType onSelect={goToForm} />;
    case 'form':
      return <TEDForm type={transferType!} onSubmit={handleFormSubmit} onCancel={() => setStep('select')} />;
    case 'confirm':
      return <TEDConfirmation data={formData} onBack={() => setStep('form')} onConfirm={handleConfirm} type={'same'} />;
    case 'success':
      return <TEDSuccess data={formData} onContinue={function (): void {
        throw new Error('Function not implemented.');
      } } />;
    default:
      return null;
  }
};

export default TEDFlow;
