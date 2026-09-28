import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DeleteModal from "../framework/DeleteModal";
import { Team } from "../types/database";

export interface ClubListProps {
  teams?: Team[];
  clubs?: Team[];
  onSelectTeam?: (team: Team) => void;
  onSelect?: (team: Team) => void;
  onEditTeam?: (team: Team) => void;
  onDeleteTeam?: (team: Team) => void;
  onDelete?: (teamId: number) => void;
  onCreateTeam?: () => void;
}

interface TeamCardProps {
  team: Team;
  onSelect: (team: Team) => void;
  onEdit?: (team: Team) => void;
  onDelete: (team: Team) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onSelect, onEdit, onDelete }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(team)}
      className="my-2 w-full active:opacity-80"
      testID={`team-card-${team.id}`}
    >
      <View className="w-full h-20 flex-row bg-danish-dark-gray rounded-xl justify-between items-center px-5 border-2 border-danish-red shadow-lg shadow-black">
        <View className="flex-col">
          <Text className="text-danish-white text-xl font-bold">{team.name}</Text>
          {team.category ? (
            <Text className="text-gray-400 text-sm">{team.category}</Text>
          ) : null}
        </View>

        <View className="flex-row items-center space-x-3">
          {onEdit ? (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onEdit(team);
              }}
              className="p-2"
              testID={`edit-team-${team.id}`}
            >
              <Feather name="edit-2" size={20} color="#3b82f6" />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete(team);
            }}
            className="p-2"
            testID={`delete-team-${team.id}`}
          >
            <Feather name="trash-2" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ClubList({
  teams,
  clubs,
  onSelectTeam,
  onSelect,
  onEditTeam,
  onDeleteTeam,
  onDelete,
  onCreateTeam,
}: ClubListProps) {
  const teamList = teams ?? clubs ?? [];
  const handleSelect = onSelectTeam ?? onSelect ?? (() => {});
  const handleDelete = onDeleteTeam ?? ((team: Team) => onDelete?.(team.id));

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Team | null>(null);

  const handleOpenDeleteModal = (team: Team) => {
    setItemToDelete(team);
    setModalVisible(true);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete);
    }
    setModalVisible(false);
    setItemToDelete(null);
  };

  return (
    <View className="w-full h-full px-4">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar el club ${itemToDelete?.name || ""}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />

      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {teamList.length > 0 ? (
          teamList.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onSelect={handleSelect}
              onEdit={onEditTeam}
              onDelete={handleOpenDeleteModal}
            />
          ))
        ) : (
          <View className="py-12 items-center justify-center bg-gray-800/60 rounded-2xl border border-dashed border-gray-700 p-6 mt-4">
            <MaterialIcons name="sports-basketball" size={48} color="#9ca3af" />
            <Text className="text-center font-bold text-danish-white text-lg mt-3">
              No hay ningún equipo registrado
            </Text>
            <Text className="text-center text-gray-400 text-sm mt-1 mb-5">
              Crea tu primer equipo para comenzar a gestionar plantilla y partidos.
            </Text>
            {onCreateTeam ? (
              <TouchableOpacity
                onPress={onCreateTeam}
                className="bg-danish-red px-5 py-3 rounded-xl flex-row items-center space-x-2 active:bg-red-700"
              >
                <MaterialIcons name="add" size={20} color="white" />
                <Text className="text-white font-bold text-base">Crear Equipo</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
