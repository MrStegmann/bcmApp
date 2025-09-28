import { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import ClubForm from "../components/ClubForm";
import ClubList from "../components/ClubList";
import ClubProfile from "./ClubProfile";
import { useClubStore } from "../store/ClubStore";
import Header from "../components/Header";
import Alerts from "../components/Alerts";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ClubManage = () => {
  const { TeamController } = useDB();
  const [clubs, setClubs] = useState([]);
  const [createMode, setCreateMode] = useState(false);
  const setClub = useClubStore((state) => state.setClub);
  const club = useClubStore((state) => state.club);
  const topMenu = useMenuStore((state) => state.topMenu);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (club) return;
    if (createMode) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setCreateMode(false),
          children: () => <Entypo name="back" size={18} color="white" />,
        },
      ]);
    } else {
      setTopMenu([
        {
          id: TopMenuEnums.ADD_NEW_TEAM,
          name: "Añadir Equipo",
          onPress: () => setCreateMode(true),
          children: () => (
            <MaterialIcons name="add-moderator" size={18} color="white" />
          ),
        },
      ]);
    }
  }, [createMode]);

  useEffect(() => {
    if (!club) {
      setTopMenu([
        {
          id: TopMenuEnums.ADD_NEW_TEAM,
          name: "Añadir Equipo",
          onPress: () => setCreateMode(true),
          children: () => (
            <MaterialIcons name="add-moderator" size={18} color="white" />
          ),
        },
      ]);
    }
  }, [club]);

  useEffect(() => {
    if (club?.id) {
      setClub(clubs.find((t) => t.id === club.id));
    }
  }, [clubs]);

  const getData = async () => {
    TeamController.load(setClubs);
  };

  const handleAddClub = async (data) => {
    await TeamController.add(data.name);
    setCreateMode(false);
    getData();
  };

  const handleUpdateClub = async (data) => {
    await TeamController.edit(data.id, data.name);
    getData();
  };

  const handleDeleteClub = async (id) => {
    await TeamController.remove(id);
    getData();
  };

  const handleSelectClub = (club) => {
    setClub(club);
  };

  const handleReturnClubManage = () => {
    setClub(null);
  };

  return (
    <View className="w-full h-full flex flex-col relative bg-gray-900">
      <Alerts />

      <Header>
        {topMenu.map((menu) => (
          <TouchableOpacity
            key={menu.id}
            className="w-12 h-12 border-2 bg-danish-red border-danish-dark-gray shadow shadow-black rounded-full flex items-center justify-center active:bg-danish-light-gray"
            onPress={menu.onPress}
          >
            {menu.children()}
          </TouchableOpacity>
        ))}
      </Header>
      <View className="w-full border-b h-[82%] py-2 border-danish-red shadow shadow-danish-red bg-gray-900 mt-10">
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={130}
          keyboardShouldPersistTaps="handled"
        >
          {club && (
            <ClubProfile
              handleReturn={handleReturnClubManage}
              handleUpdate={handleUpdateClub}
            />
          )}
          {!club && (
            <>
              {createMode ? (
                <View className="w-full h-full justify-center items-center flex mt-5">
                  <ClubForm onSubmit={handleAddClub} />
                </View>
              ) : (
                <View className="w-full h-full justify-center items-center flex mt-5">
                  <ClubList
                    clubs={clubs}
                    onSelect={handleSelectClub}
                    onDelete={handleDeleteClub}
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
