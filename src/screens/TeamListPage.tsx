import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';

import TeamCard from '../components/TeamCard';
import DeleteModal from '../components/DeleteModal';
import { teamService } from '../controllers/TeamService';
import { Team } from '../models/Team';

type RootStackParamList = {
  TeamListPage: undefined;
  TeamForm: { team?: Team };
  TeamManagerPage: { teamId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeamListPage'>;

export default function TeamListPage() {
  const navigation = useNavigation<NavigationProp>();
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTeams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTeams();
    }, [])
  );

  const handleEditTeam = (team: Team) => {
    navigation.navigate('TeamForm', { team });
  };

  const handleOpenDelete = (team: Team) => {
    setTeamToDelete(team);
    setDeleteModalVisible(true);
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete?.id) return;
    try {
      setIsDeleting(true);
      await teamService.deleteTeam(teamToDelete.id);
      await loadTeams();
      setDeleteModalVisible(false);
      setTeamToDelete(null);
    } catch (e) {
      // Could set a specific error for deletion failure
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const navigateToManager = (teamId: string) => {
    navigation.navigate('TeamManagerPage', { teamId });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Your Team to Manage</Text>
      
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTeams}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!error && teams.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No teams created</Text>
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item: Team) => item.id}
          renderItem={({ item }: { item: Team }) => (
            <TeamCard 
              team={item} 
              onPress={() => navigateToManager(item.id)} 
              onEdit={() => handleEditTeam(item)}
              onDelete={() => handleOpenDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => navigation.navigate('TeamForm', {})}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <DeleteModal 
        visible={deleteModalVisible}
        title={`Delete ${teamToDelete?.name}?`}
        isDeleting={isDeleting}
        onCancel={() => {
          setDeleteModalVisible(false);
          setTeamToDelete(null);
        }}
        onDelete={handleDeleteTeam}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: '#FFCCCC',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#D8000C',
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  retryText: {
    color: '#D8000C',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80, // for floating button
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
