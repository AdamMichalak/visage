import React, { createContext, ReactNode, useContext } from 'react';

export const LayerManagerContext = createContext(0);

interface LayerManagerProps {
  children: ReactNode;
}

export function LayerManager({ children }: LayerManagerProps) {
  const currentZIndex = useContext(LayerManagerContext);

  return (
    <LayerManagerContext.Provider value={currentZIndex + 1}>
      {children}
    </LayerManagerContext.Provider>
  );
}