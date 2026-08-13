import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TeamSchema, TeamInput } from '../schemas/team.schema';
import { teamService } from '../controllers/TeamService';
import { Team } from '../models/Team';
import { z } from 'zod';

export default function TeamForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const { team } = (route.params as { team?: Team }) || {};
  
  const [name, setName] = useState(team?.name || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setError(null);
      
      // Validate
      const validatedData = TeamSchema.parse({
        id: team?.id,
        name,
        wins: team?.wins || 0,
        losses: team?.losses || 0,
        totalPlayers: team?.totalPlayers || 0,
      });

      setIsSubmitting(true);
      
      if (team?.id) {
        await teamService.updateTeam(team.id, { name: validatedData.name });
      } else {
        await teamService.createTeam({ name: validatedData.name });
      }

      navigation.goBack();
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError((e as any).errors[0].message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{team ? 'Edit Team' : 'Add New Team'}</Text>
      
      <View style={styles.body}>
        <Text style={styles.label}>Team Name</Text>
        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter team name"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>{team ? 'Save' : 'Create'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  body: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A0C0E4',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
