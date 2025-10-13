import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function AuthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please sign in to continue</Text>
      <Text style={styles.subtitle}>Authentication coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});