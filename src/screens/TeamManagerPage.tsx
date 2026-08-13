import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TeamManagerPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { teamId } = route.params as { teamId: string };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manager Page</Text>
      <Text style={styles.subtitle}>Managing Team ID: {teamId}</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Teams</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
