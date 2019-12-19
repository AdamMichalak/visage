import {
  EventEmitterContext,
  useEventEmitterInstance,
} from '@byteclaw/use-event-emitter';
import { UniqueIdContextProvider } from '@byteclaw/use-unique-id';
import { DesignSystem as BaseDesignSystem, Theme } from '@byteclaw/visage-core';
import React, { FunctionComponent, ReactNode, useState } from 'react';
import { styleGenerator } from './emotionStyleGenerator';
import { GlobalReset } from './GlobalReset';
import { LayerManager } from './components/LayerManager';
import { ToastManager } from './components/Toast';
import { VisageFaces } from './faces';

export interface DesignSystemProps {
  children?: ReactNode;
  /**
   * Sets the default zIndex (default is 1)
   */
  defaultZIndex?: number;
  faces?: VisageFaces;
  /** Default breakpoint */
  is?: number;
  theme: Theme;
}

const DesignSystem: FunctionComponent<DesignSystemProps> = ({
  defaultZIndex = 1,
  children,
  faces,
  is = 0,
  theme,
}) => {
  const [idContextValue] = useState(0);
  const toastEventEmitter = useEventEmitterInstance();

  return (
    <BaseDesignSystem
      is={is}
      faces={faces}
      styleGenerator={styleGenerator}
      theme={theme}
    >
      <UniqueIdContextProvider id={idContextValue}>
        <LayerManager increaseBy={defaultZIndex}>
          <>
            <GlobalReset />
            <EventEmitterContext.Provider value={toastEventEmitter}>
              <ToastManager />
              {children}
            </EventEmitterContext.Provider>
          </>
        </LayerManager>
      </UniqueIdContextProvider>
    </BaseDesignSystem>
  );
};

export { DesignSystem };
