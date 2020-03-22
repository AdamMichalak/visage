import React, { useMemo } from 'react';
import { useDesignSystem } from './useDesignSystem';

interface StateBreakpointAction {
  type: 'SET_BREAKPOINT';
  index: number;
  matches: boolean;
}

interface BreakPointManagerState {
  matches: boolean[];
  viewport: number;
}

function init({
  defaultBreakpoint,
  breakpoints,
}: {
  defaultBreakpoint: number;
  breakpoints: string[];
}): BreakPointManagerState {
  const matches = breakpoints.map(() => false);
  matches[defaultBreakpoint] = true;

  return {
    matches,
    viewport: matches.lastIndexOf(true),
  };
}

function reducer(
  previousState: BreakPointManagerState,
  action: StateBreakpointAction,
) {
  if (action.type === 'SET_BREAKPOINT') {
    const matches = previousState.matches.slice();
    matches[action.index] = action.matches;

    return {
      matches,
      viewport: matches.lastIndexOf(true),
    };
  }

  throw new Error('Unknown action');
}

export function useBreakpointManager(
  defaultBreakpoint: number,
  breakpoints: string[],
): [number, (breakpoint: number, matches?: boolean) => void] {
  const [state, dispatch] = React.useReducer(
    reducer,
    { defaultBreakpoint, breakpoints },
    init,
  );
  const setBreakpoint = React.useCallback(
    (index: number, matches: boolean = true) => {
      dispatch({ type: 'SET_BREAKPOINT', index, matches });
    },
    [dispatch],
  );

  return [state.viewport, setBreakpoint];
}

export function useBreakpoint({
  gte,
  is,
  lte,
  not,
}: {
  gte?: number;
  is?: number | number[];
  lte?: number;
  not?: number | number[];
}): boolean {
  const visage = useDesignSystem();

  return useMemo(() => {
    // now check the breakpoints, basically start with more precise breakpoints
    let isMatch = false;

    if (is != null) {
      isMatch =
        is === visage.breakpoint ||
        (Array.isArray(is) && is.indexOf(visage.breakpoint) !== -1);
    } else if (not != null) {
      isMatch = Array.isArray(not)
        ? not.indexOf(visage.breakpoint) === -1
        : not !== visage.breakpoint;
    } else if (gte != null) {
      isMatch = visage.breakpoint >= gte;
    } else if (lte != null) {
      isMatch = visage.breakpoint <= lte;
    }

    return isMatch;
  }, [visage, gte, is, lte, not]);
}