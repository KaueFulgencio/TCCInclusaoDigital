import React, { useState } from "react";
import SelectTEDType from "../components/CAIXA/SelectTEDType";
import TEDForm from "../components/CAIXA/TEDForm";
import TEDConfirmation from "../components/CAIXA/TEDConfirmation";
import TEDSuccess from "../components/CAIXA/TEDSuccess";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { TEDFlowNavigationProp } from "../navigation/types";

export type TransferType = "same" | "third" | "judicial";

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

const uploadAnalyticsToFirebase = async (
  clickCount: number,
  executionTime: number
): Promise<boolean> => {
  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds - Math.floor(seconds)) * 1000);

    return `${mins} min ${secs} s`;
  }

  try {
    const dataToSend = {
      clickCount,
      executionTime,
      executionTimeFormatted: formatDuration(executionTime),
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "dados app caixa - ted"), dataToSend);
    console.log("Analytics enviados para o Firebase com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao enviar analytics para o Firebase:", error);
    return false;
  }
};

const TEDFlow = () => {
  const [step, setStep] = useState<"select" | "form" | "confirm" | "success">(
    "select"
  );
  const [transferType, setTransferType] = useState<TransferType | null>(null);
  const [formData, setFormData] = useState<TEDFormData | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [durationInSeconds, setDurationInSeconds] = useState<number>(0);
  const navigation = useNavigation<TEDFlowNavigationProp>();

  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      console.log(`Clique #${newCount}`);
      return newCount;
    });
  };

  const goToForm = (type: TransferType) => {
    handleClick();
    setTransferType(type);
    setStep("form");
  };

  const handleFormSubmit = (data: TEDFormData) => {
    handleClick();
    const completeData = {
      ...data,
      originAccount: "1234-5",
      ...(transferType === "same" && {
        name: "KAUE MEDEIROS FULGENCIO",
        cpf: "494.827.158-61",
        personType: "01 - Pessoa Física",
      }),
      ...(transferType === "judicial" &&
        data.judicialId && {
          depositId: data.judicialId,
        }),
    };
    setFormData(completeData);
    setStep("confirm");
  };

  const handleConfirm = () => {
    handleClick();
    setStep("success");
  };

  const handleFinish = async () => {
    handleClick();

    const newClickCount = clickCount + 1;

    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;

    console.log("----- Dados do Fluxo TED -----");
    console.log(`Total de cliques: ${clickCount}`);
    console.log(
      `Tempo total do fluxo: ${durationInSeconds.toFixed(2)} segundos`
    );
    console.log(`Horário atual: ${new Date().toLocaleString()}`);
    console.log("------------------------------");

    await uploadAnalyticsToFirebase(newClickCount, durationInSeconds);

    setStep("select");
    setTransferType(null);
    setFormData(null);
    setStartTime(Date.now());
    setClickCount(0);
    setDurationInSeconds(durationInSeconds);

    navigation.navigate("Home");
  };

  switch (step) {
    case "select":
      return (
        <SelectTEDType
          onSelect={goToForm}
          clickCount={clickCount}
          onClick={handleClick}
        />
      );
    case "form":
      return (
        <TEDForm
          type={transferType!}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            handleClick();
            setStep("select");
          }}
          initialClickCount={clickCount}
          onClickCountChange={setClickCount}
        />
      );
    case "confirm":
      return (
        <TEDConfirmation
          data={formData!}
          type={transferType!}
          onBack={() => {
            handleClick();
            setStep("form");
          }}
          onConfirm={() => handleConfirm()}
          clickCount={clickCount}
        />
      );
    case "success":
      return (
        <TEDSuccess
          data={formData!}
          type={transferType!}
          onContinue={handleFinish}
          clickCount={clickCount}
          executionTime={durationInSeconds}
        />
      );
    default:
      return null;
  }
};

export default TEDFlow;
