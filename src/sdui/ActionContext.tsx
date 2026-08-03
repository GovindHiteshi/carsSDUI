import React, { createContext, useContext, useMemo } from 'react';
import type { SduiAction } from './types';

/**
 * JSON cannot carry functions, so every interaction arrives as a plain action
 * object. The app resolves it here — this is the only place server-described
 * behaviour turns into real side effects.
 */
export interface SduiActionHandlers {
  navigate: (to: string, params?: Record<string, unknown>) => void;
  openUrl: (url: string) => void;
  select: (group: string, value: string) => void;
  track: (event: string, params?: Record<string, unknown>) => void;
}

interface SduiActionContextValue {
  dispatch: (action?: SduiAction) => void;
  /** Current value per `select` group, so tabs can render a selected state. */
  selections: Record<string, string>;
}

const noop = () => {};

const SduiActionContext = createContext<SduiActionContextValue>({
  dispatch: noop,
  selections: {},
});

export function SduiActionProvider({
  handlers,
  selections = {},
  children,
}: {
  handlers: Partial<SduiActionHandlers>;
  selections?: Record<string, string>;
  children: React.ReactNode;
}) {
  const value = useMemo<SduiActionContextValue>(() => {
    const dispatch = (action?: SduiAction) => {
      if (!action) {
        return;
      }
      switch (action.kind) {
        case 'navigate':
          handlers.navigate?.(action.to, action.params);
          break;
        case 'openUrl':
          handlers.openUrl?.(action.url);
          break;
        case 'select':
          handlers.select?.(action.group, action.value);
          break;
        case 'track':
          handlers.track?.(action.event, action.params);
          break;
        case 'noop':
          break;
        default:
          // An action kind this binary predates. Ignore rather than crash.
          if (__DEV__) {
            console.warn('[sdui] unknown action', action);
          }
      }
    };
    return { dispatch, selections };
  }, [handlers, selections]);

  return (
    <SduiActionContext.Provider value={value}>
      {children}
    </SduiActionContext.Provider>
  );
}

export function useSduiActions() {
  return useContext(SduiActionContext);
}
