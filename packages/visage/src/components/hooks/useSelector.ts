import { Dispatch, useCallback, useReducer, useRef } from 'react';
import { getNextIndexFromCycle } from '../shared';

export type SelectorAction<TValue extends any> =
  | { type: 'Unknown' }
  | { type: 'InputChange'; value: string }
  | { type: 'MenuOpen' }
  | { type: 'MenuClose' }
  | { type: 'MenuToggle' }
  | { type: 'SetBusy'; isBusy: boolean }
  | { type: 'SetCurrentFocusedOption' }
  | { type: 'SetOptionFocusByOffset'; offset: number }
  | { type: 'SetOptionFocusByIndex'; index: number }
  | { type: 'SetOptionFocusToFirstOption' }
  | { type: 'SetOptionFocusToLastOption' }
  | { type: 'SetOptions'; options: TValue[] }
  | { type: 'Reset' }
  | { type: 'SetValue'; value: TValue | null }
  | { type: 'SetValueByIndex'; index: number };

export interface SelectorState<TValue extends any> {
  defaultValue: TValue | null;
  focusedIndex: number;
  inputValue: string;
  isBusy: boolean;
  isOpen: boolean;
  options: any[];
  optionToString: (option: TValue) => string;
  valueToString: (option: TValue) => string;
  value: TValue | null;
  invokedBy: SelectorAction<TValue>;
}

interface InitSelectReducerOptions<TValue extends any> {
  defaultValue?: TValue;
  optionToString?: (option: TValue) => string;
  valueToString?: (option: TValue) => string;
  value?: TValue;
}

function initSelectorReducer({
  defaultValue = null,
  optionToString,
  valueToString,
  value = null,
}: InitSelectReducerOptions<any>): SelectorState<any> {
  const val = value || defaultValue;
  const optToString = optionToString || (option => `${option}`);

  return {
    defaultValue,
    focusedIndex: -1,
    inputValue: val == null ? '' : optToString(val),
    isBusy: false,
    isOpen: false,
    options: [],
    optionToString: optToString,
    valueToString: valueToString || optToString,
    value: val,
    invokedBy: { type: 'Unknown' },
  };
}

function selectorReducer(
  state: SelectorState<any>,
  action: SelectorAction<any>,
): SelectorState<any> {
  let changes: Partial<SelectorState<any>> = {
    invokedBy: action,
  };

  // change events to interactive and non interactive and use them accordingly to busy state
  if (!state.isBusy) {
    // if selector is busy, it ignores all changes until it's not busy
    switch (action.type) {
      case 'InputChange': {
        changes = {
          ...changes,
          inputValue: action.value,
        };
        break;
      }
    }

    // following are possible only if menu is open
    if (state.isOpen) {
      switch (action.type) {
        case 'SetOptionFocusByIndex': {
          const optionsSize = state.options.length;

          if (
            optionsSize > 0 &&
            action.index < optionsSize &&
            action.index >= 0
          ) {
            changes = { ...changes, focusedIndex: action.index };
          }
          break;
        }
        case 'SetOptionFocusByOffset': {
          const lastIndex = state.options.length - 1;

          changes = {
            ...changes,
            focusedIndex: getNextIndexFromCycle(
              state.focusedIndex,
              action.offset,
              lastIndex,
            ),
          };

          break;
        }
        case 'SetOptionFocusToFirstOption': {
          if (state.options.length > 0) {
            changes = { ...changes, focusedIndex: 0 };
          }
          break;
        }
        case 'SetOptionFocusToLastOption': {
          if (state.options.length > 0) {
            changes = { ...changes, focusedIndex: state.options.length - 1 };
          }
          break;
        }
      }
    }
  }

  switch (action.type) {
    case 'MenuToggle':
    case 'MenuClose':
    case 'MenuOpen': {
      changes = {
        ...changes,
        isOpen:
          action.type === 'MenuToggle'
            ? !state.isOpen
            : action.type === 'MenuOpen',
        focusedIndex: -1,
      };
      break;
    }
    case 'Reset': {
      changes = {
        ...changes,
        isBusy: false,
        isOpen: false,
        focusedIndex: -1,
        options: [],
        inputValue: state.defaultValue
          ? state.valueToString(state.defaultValue)
          : '',
        value: state.defaultValue,
      };
      break;
    }
    case 'SetBusy': {
      changes = { ...changes, isBusy: action.isBusy };
      break;
    }
    case 'SetOptions': {
      changes = { ...changes, focusedIndex: -1, options: action.options };
      break;
    }
    case 'SetCurrentFocusedOption': {
      if (state.focusedIndex !== -1 && state.options[state.focusedIndex]) {
        const value = state.options[state.focusedIndex];

        changes = { inputValue: state.valueToString(value), value };
      }
      break;
    }
    case 'SetValueByIndex': {
      const value = state.options[action.index];

      if (value) {
        changes = {
          ...changes,
          inputValue: state.valueToString(value),
          value,
        };
      }
      break;
    }
    case 'SetValue': {
      changes = {
        ...changes,
        inputValue:
          action.value == null ? '' : state.valueToString(action.value),
        value: action.value,
      };
      break;
    }
  }

  return {
    ...state,
    ...changes,
  };
}

export type SelectorReducerEnhancer<TValue extends any> = (
  currentState: SelectorState<TValue>,
  nextState: SelectorState<TValue>,
) => SelectorState<TValue>;

export type SelectorStateChangeListener<TValue extends any> = (
  previousState: SelectorState<TValue>,
  currentState: SelectorState<TValue>,
  dispatch: Dispatch<SelectorAction<TValue>>,
) => void;

export interface SelectorOptions<TValue extends any> {
  defaultValue?: TValue;
  enhanceReducer?: SelectorReducerEnhancer<TValue>;
  onChange?: (option: any | null) => void;
  onInputValueChange?: (inputValue: string) => void;
  onStateChange?: SelectorStateChangeListener<TValue>;
  optionToString?: (option: any) => string;
  value?: any;
  valueToString?: (option: any) => string;
}

export function useSelector<TValue extends any = string>({
  defaultValue,
  enhanceReducer,
  onInputValueChange,
  onChange,
  onStateChange,
  optionToString,
  value,
  valueToString,
}: SelectorOptions<TValue>): [
  SelectorState<TValue>,
  Dispatch<SelectorAction<TValue>>,
] {
  const reducer = useCallback(
    (
      state: SelectorState<TValue>,
      action: SelectorAction<TValue>,
    ): SelectorState<TValue> => {
      const nextState = selectorReducer(state, action);

      return enhanceReducer ? enhanceReducer(state, nextState) : nextState;
    },
    [enhanceReducer],
  );
  const [state, dispatch] = useReducer(
    reducer,
    { defaultValue, optionToString, value, valueToString },
    initSelectorReducer,
  );
  const previousState = useRef(state);
  const previousOuterValue = useRef(value);

  if (previousState.current !== state) {
    // call on state change if state has changed
    // eslint-disable-next-line no-unused-expressions
    onStateChange && onStateChange(previousState.current, state, dispatch);

    // call onInputValueChange only if action used to change it is InputChange
    if (
      // state.invokedBy.type === 'InputChange' &&
      previousState.current.inputValue !== state.inputValue
    ) {
      // eslint-disable-next-line no-unused-expressions
      onInputValueChange && onInputValueChange(state.inputValue);
    }

    // call onChange if selection changed
    if (previousState.current.value !== state.value && state.value !== value) {
      // eslint-disable-next-line no-unused-expressions
      onChange && onChange(state.value);
    }

    previousState.current = state;
  } else if (previousOuterValue.current !== value) {
    // if outer value changed (controlled component), set the value to this value
    dispatch({ type: 'SetValue', value });
  }

  return [state, dispatch];
}