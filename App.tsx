/**
 * Simple Strength - React Native Fitness App
 * @format
 */

import type React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <HomeScreen />
    </SafeAreaProvider>
  );
}

export default App;
