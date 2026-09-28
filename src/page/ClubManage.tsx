import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import ClubForm from "../components/ClubForm";
import ClubList from "../components/ClubList";
import ClubProfile from "./ClubProfile";
import Header from "../components/Header";
import BottomNavBar from "../components/BottomNavBar";
import Alerts from "../components/Alerts";

import { useClubStore } from "../store/ClubStore";
import { useMenuStore, BottomMenuItem } from "../store/MenuStore";
import { TopMenuEnums } from "../types/enums";
import useDB from "../hooks/useDB";
import { Team } from "../types/database";

const ClubManage: React.FC = () => {
  const { TeamController } = useDB();
  const {
    club,
    teamsList,
    setClub,
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
  } = useClubStore();

  const setHeaderTitle = useMenuStore((state) => state.setHeaderTitle);
  const setBottomMenu = useMenuStore((state) => state.setBottomMenu);
  const setActiveTab = useMenuStore((state) => state.setActiveTab);

  const [createMode, setCreateMode] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const loadData = useCallback(async () => {
    if (TeamController?.load) {
      await TeamController.load();
    }
    await fetchTeams();
  }, [TeamController, fetchTeams]);

  useEffect(() => {
    setClub(null);
    loadData();
  }, []);

  useEffect(() => {
    if (club) return;

    if (createMode) {
      setHeaderTitle("Crear Nuevo Equipo");
      setActiveTab(TopMenuEnums.ADD_NEW_TEAM);
      const items: BottomMenuItem[] = [
        {
          id: TopMenuEnums.GO_BACK,
          label: "Volver",
          iconName: "arrow-left",
          iconFamily: "Feather",
          onPress: () => setCreateMode(false),
        },
      ];
      setBottomMenu(items);
    } else if (editingTeam) {
      setHeaderTitle("Editar Equipo");
      setActiveTab(TopMenuEnums.EDIT_TEAM);
      const items: BottomMenuItem[] = [
        {
          id: TopMenuEnums.GO_BACK,
          label: "Volver",
          iconName: "arrow-left",
          iconFamily: "Feather",
          onPress: () => setEditingTeam(null),
        },
      ];
      setBottomMenu(items);
    } else {
      setHeaderTitle("Gestión de Equipos");
      setActiveTab(TopMenuEnums.MAIN);
      const items: BottomMenuItem[] = [
        {
          id: TopMenuEnums.ADD_NEW_TEAM,
          label: "Añadir Equipo",
          iconName: "plus-circle",
          iconFamily: "Feather",
          onPress: () => setCreateMode(true),
        },
      ];
      setBottomMenu(items);
    }
  }, [createMode, editingTeam, club, setHeaderTitle, setBottomMenu, setActiveTab]);

  const handleAddClub = useCallback(async (data: { name: string; category?: string }) => {
    if (TeamController?.add) {
      await TeamController.add(data.name);
    }
    await createTeam({ name: data.name, category: data.category });
    setCreateMode(false);
    await loadData();
  }, [TeamController, createTeam, loadData]);

  const handleUpdateClub = useCallback(async (data: { name: string; category?: string; id?: number }) => {
    if (data.id) {
      if (TeamController?.edit) {
        await TeamController.edit(data.id, data.name);
      }
      await updateTeam(data.id, { name: data.name, category: data.category });
    }
    setEditingTeam(null);
    await loadData();
  }, [TeamController, updateTeam, loadData]);

  const handleDeleteClub = useCallback(async (teamOrId: Team | number) => {
    const id = typeof teamOrId === "number" ? teamOrId : teamOrId.id;
    if (TeamController?.remove) {
      await TeamController.remove(id);
    }
    await deleteTeam(id);
    await loadData();
  }, [TeamController, deleteTeam, loadData]);

  const handleSelectTeam = useCallback((selected: Team) => {
    setClub(selected);
  }, [setClub]);

  const handleReturnClubManage = useCallback(() => {
    setClub(null);
  }, [setClub]);

  const handleEditTeamTrigger = useCallback((selected: Team) => {
    setEditingTeam(selected);
  }, []);

  return (
    <View className="w-full h-full flex flex-col justify-between bg-gray-900 relative">
      <Alerts />

      <Header />

      <View className="flex-1 w-full py-2 bg-gray-900">
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={130}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {club ? (
            <ClubProfile
              handleReturn={handleReturnClubManage}
              handleUpdate={handleUpdateClub}
            />
          ) : (
            <>
              {createMode || editingTeam ? (
                <View className="w-full justify-center items-center flex mt-5 px-4">
                  <ClubForm
                    onSubmit={editingTeam ? handleUpdateClub : handleAddClub}
                    initialData={editingTeam}
                    clubData={editingTeam || undefined}
                    onCancel={() => {
                      setCreateMode(false);
                      setEditingTeam(null);
                    }}
                  />
                </View>
              ) : (
                <View className="w-full flex-1 justify-start items-center flex mt-5">
                  <ClubList
                    teams={teamsList}
                    onSelectTeam={handleSelectTeam}
                    onSelect={handleSelectTeam}
                    onEditTeam={handleEditTeamTrigger}
                    onDeleteTeam={handleDeleteClub}
                    onDelete={handleDeleteClub}
                    onCreateTeam={() => setCreateMode(true)}
                  />
                </View>
              )}
            </>
          )}
        </KeyboardAwareScrollView>
      </View>

      <BottomNavBar />
    </View>
  );
};

export default ClubManage;
