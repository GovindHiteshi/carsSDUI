/**
 * Server-driven UI shell.
 *
 * The app no longer contains any screen layout. Everything below the provider
 * is described by a JSON payload (today from src/sdui/schemas/screens.json,
 * tomorrow from an API — see src/sdui/source.ts).
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SduiApp } from './src/sdui/SduiApp';

function App() {
  return (
    <SafeAreaProvider>
      <SduiApp initialScreen="home" />
    </SafeAreaProvider>
  );
}

export default App;
