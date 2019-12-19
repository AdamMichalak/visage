import {
  EventEmitterContext,
  useEventEmitterInstance,
} from '@byteclaw/use-event-emitter';
import { UniqueIdContextProvider } from '@byteclaw/use-unique-id';
import {
  DesignSystem as BaseDesignSystem,
  Theme,
  useBreakpointManager,
} from '@byteclaw/visage-core';
import React, { ReactNode, useState } from 'react';
import { useBreakpointDetection } from './hooks';
import { styleGenerator } from './emotionStyleGenerator';
import { GlobalReset } from './GlobalReset';
import { LayerManager } from './components/LayerManager';
import { ToastManager } from './components/Toast';
import { VisageFaces } from './faces';

const MOBILE_BP = `only screen`; // 40em
const TABLET_BP = `screen and (min-width: ${641 / 16}em)`; // 40.0625em
const DESKTOP_BP = `screen and (min-width: ${1025 / 16}em)`; // 64.036em

const defaultBreakpoints = [MOBILE_BP, TABLET_BP, DESKTOP_BP];

export interface ResponsiveDesignSystemProps {
  /**
   * Css media query conditions orders from smallest to largest
   * e.g. ['only screen', 'screen and (min-width: 1024px)']
   */
  breakpoints?: string[];
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

export function ResponsiveDesignSystem({
  breakpoints = defaultBreakpoints,
  children,
  defaultZIndex = 10,
  faces,
  is = 0,
  theme,
}: ResponsiveDesignSystemProps) {
  const [idContextValue] = useState(0);
  const toastEventEmitter = useEventEmitterInstance();
  const [breakpoint, setBreakpoint] = useBreakpointManager(is, breakpoints);
  useBreakpointDetection(breakpoints, setBreakpoint);

  return (
    <BaseDesignSystem
      is={breakpoint}
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
}
