'use client';

import { createContext, useContext, useState } from 'react';

interface BacteriaData {
  values: Record<string, number>;
  setValues: (values: Record<string, number>) => void;
}

const BacteriaContext = createContext<BacteriaData | undefined>(undefined);

export function BacteriaProvider({ children }: { children: React.ReactNode }) {
  const [values, setValues] = useState<Record<string, number>>({});

  return (
    <BacteriaContext.Provider value={{ values, setValues }}>
      {children}
    </BacteriaContext.Provider>
  );
}

export function useBacteria() {
  const context = useContext(BacteriaContext);
  if (!context) throw new Error('useBacteria must be used within BacteriaProvider');
  return context;
} 