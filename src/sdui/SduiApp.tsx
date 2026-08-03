import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SduiActionProvider, type SduiActionHandlers } from './ActionContext';
import { SduiRenderer } from './SduiRenderer';
import { fetchScreen } from './source';
import { useSduiTheme } from './theme';
import type { SduiScreenSchema } from './types';

// Registers the component vocabulary. Must run before anything renders.
import './components';

/**
 * Hosts one server-described screen at a time: fetches the payload, owns the
 * loading/error states, and turns JSON actions into real navigation.
 */
export function SduiApp({ initialScreen = 'home' }: { initialScreen?: string }) {
  const theme = useSduiTheme();
  const insets = useSafeAreaInsets();

  const [stack, setStack] = useState<string[]>([initialScreen]);
  const [schema, setSchema] = useState<SduiScreenSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({
    topNav: 'all',
    bottomNav: 'home',
  });

  const screenId = stack[stack.length - 1];

  const load = useCallback(async (id: string) => {
    setSchema(null);
    setError(null);
    try {
      setSchema(await fetchScreen(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this screen');
    }
  }, []);

  useEffect(() => {
    load(screenId);
  }, [load, screenId]);

  const goBack = useCallback(() => {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [goBack, stack.length]);

  const handlers = useMemo<Partial<SduiActionHandlers>>(
    () => ({
      navigate: to => setStack(prev => [...prev, to]),
      openUrl: url => {
        Linking.openURL(url).catch(() => {});
      },
      select: (group, value) =>
        setSelections(prev => ({ ...prev, [group]: value })),
      track: (event, params) => {
        if (__DEV__) {
          console.log('[sdui] track', event, params ?? {});
        }
      },
    }),
    [],
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.brand} />
      {/* The brand band runs under the status bar, so the inset is painted. */}
      <View style={{ height: insets.top, backgroundColor: theme.brand }} />

      {stack.length > 1 && (
        <TouchableOpacity
          testID="sdui-back"
          onPress={goBack}
          style={[styles.backBar, { backgroundColor: theme.brand }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.backText, { color: theme.onBrand }]}>‹ Back</Text>
        </TouchableOpacity>
      )}

      <SduiActionProvider handlers={handlers} selections={selections}>
        <View style={[styles.body, { paddingBottom: insets.bottom }]}>
          {error ? (
            <SduiError message={error} onRetry={() => load(screenId)} />
          ) : schema ? (
            <SduiRenderer node={schema} />
          ) : (
            <View testID="sdui-loading" style={styles.center}>
              <ActivityIndicator color={theme.brand} />
            </View>
          )}
        </View>
      </SduiActionProvider>
    </View>
  );
}

function SduiError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const theme = useSduiTheme();
  return (
    <View testID="sdui-error" style={styles.center}>
      <Text style={[styles.errorTitle, { color: theme.text }]}>
        This screen is unavailable
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        {message}
      </Text>
      <TouchableOpacity
        testID="sdui-retry"
        onPress={onRetry}
        style={[styles.retry, { backgroundColor: theme.brand }]}
        activeOpacity={0.85}
      >
        <Text style={[styles.retryText, { color: theme.onBrand }]}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  backBar: { paddingHorizontal: 16, paddingBottom: 4 },
  backText: { fontSize: 15, fontWeight: '600' },
  errorTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  errorBody: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
  retry: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
  },
  retryText: { fontSize: 14, fontWeight: '700' },
});
