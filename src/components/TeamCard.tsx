import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Team } from '../models/Team';
import Icon from 'react-native-vector-icons/Feather';

interface TeamCardProps {
  team: Team;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TeamCard({ team, onPress, onEdit, onDelete }: TeamCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.column1}>
        <Text style={styles.teamName}>{team.name}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>{team.wins}W - {team.losses}L</Text>
          <Text style={styles.statsText}>{team.totalPlayers} Players</Text>
        </View>
      </View>
      <View style={styles.column2}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Icon name="edit-2" size={20} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Icon name="trash-2" size={20} color="#E02020" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  column1: {
    flex: 1,
    justifyContent: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  column2: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  actionButton: {
    padding: 5,
  },
});
