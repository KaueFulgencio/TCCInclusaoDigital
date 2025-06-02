import React, { createContext, useContext, useState } from 'react';

type ClickContextType = {
  totalClicks: number;
  incrementClicks: () => void;
};

const ClickContext = createContext<ClickContextType>({
  totalClicks: 0,
  incrementClicks: () => {},
});

export const useClickTracker = () => useContext(ClickContext);

export const ClickProvider = ({ children }: { children: React.ReactNode }) => {
  const [totalClicks, setTotalClicks] = useState(0);

  const incrementClicks = () => setTotalClicks(prev => prev + 1);

  return (
    <ClickContext.Provider value={{ totalClicks, incrementClicks }}>
      {children}
    </ClickContext.Provider>
  );
};
