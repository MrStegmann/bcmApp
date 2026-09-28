import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import ClubForm from "../components/ClubForm";
import ClubList from "../components/ClubList";
import ClubProfile from "./ClubProfile";
import Header from "../components/Header";
import Alerts from "../components/Alerts";

import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import { Team, NewTeam } from "../types/database";

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

  const { topMenuItems, setTopMenu } = useMenuStore();

  const [createMode, setCreateMode] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  useEffect(() => {
    // Start with no team selected so app enters at ClubList
    setClub(null);
    loadData();
  }, []);

  const loadData = async () => {
    if (TeamController?.load) {
      await TeamController.load();
    }
    await fetchTeams();
  };

  useEffect(() => {
    if (club) return;

    if (createMode || editingTeam) {
      setTopMenu([
        {
          id: TopMenuEnums.MANAGE,
          name: "Volver",
          onPress: () => {
            setCreateMode(false);
            setEditingTeam(null);
          },
          children: () => <Entypo name="back" size={18} color="white" />,
        },
      ]);
    } else {
      setTopMenu([
        {
          id: TopMenuEnums.MANAGE,
          name: "Añadir Equipo",
          onPress: () => {
            setCreateMode(true);
          },
          children: () => (
            <MaterialIcons name="add-moderator" size={18} color="white" />
          ),
        },
      ]);
    }
  }, [createMode, editingTeam, club, setTopMenu]);

  const handleAddClub = async (data: { name: string; category?: string }) => {
    if (TeamController?.add) {
      await TeamController.add(data.name);
    }
    await createTeam({ name: data.name, category: data.category });
    setCreateMode(false);
    await loadData();
  };

  const handleUpdateClub = async (data: { name: string; category?: string; id?: number }) => {
    if (data.id) {
      if (TeamController?.edit) {
        await TeamController.edit(data.id, data.name);
      }
      await updateTeam(data.id, { name: data.name, category: data.category });
    }
    setEditingTeam(null);
    await loadData();
  };

  const handleDeleteClub = async (teamOrId: Team | number) => {
    const id = typeof teamOrId === "number" ? teamOrId : teamOrId.id;
    if (TeamController?.remove) {
      await TeamController.remove(id);
    }
    await deleteTeam(id);
    await loadData();
  };

  const handleSelectTeam = (selected: Team) => {
    setClub(selected);
  };

  const handleReturnClubManage = () => {
    setClub(null);
  };

  const handleEditTeamTrigger = (selected: Team) => {
    setEditingTeam(selected);
  };

  return (
    <View className="w-full h-full flex flex-col relative bg-gray-900">
      <Alerts />

      <Header>
        {topMenuItems.map((menu) => (
          <TouchableOpacity
            key={String(menu.id)}
            className="w-12 h-12 border-2 bg-danish-red border-danish-dark-gray shadow shadow-black rounded-full flex items-center justify-center active:bg-danish-light-gray z-50"
            onPress={menu.onPress}
            testID="header-menu-button"
          >
            {typeof menu.children === "function" ? menu.children() : menu.children}
          </TouchableOpacity>
        ))}
      </Header>

      <View className="w-full border-b h-[82%] py-2 border-danish-red shadow shadow-danish-red bg-gray-900 mt-10 z-0">
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
    </View>
  );
};

export default ClubManage;
