import { useEffect, useState } from "react";
import { View } from "react-native";
import ClubForm from "../components/ClubForm";
import ClubList from "../components/ClubList";
import ClubProfile from "./ClubProfile";
import { useClubStore } from "../store/ClubStore";
import Header from "../components/Header";
import Alerts from "../components/Alerts";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ClubManage = () => {
  const { TeamController } = useDB();
  const [clubs, setClubs] = useState([]);
  const [createMode, setCreateMode] = useState(false);
  const setClub = useClubStore((state) => state.setClub);
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (club) return;
    if (!createMode) {
      setTopMenu([
        {
          id: TopMenuEnums.ADD_NEW_TEAM,
          name: "Añadir Equipo",
          onPress: () => setCreateMode(true),
          icon: TopMenuEnums.ADD_NEW_TEAM,
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
          icon: TopMenuEnums.ADD_NEW_TEAM,
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
    setClubs(await TeamController.load());
  };

  const handleAddClub = async (data) => {
    await TeamController.add(data.name);
    setCreateMode(false);
    getData();
  };

  const handleUpdateClub = async (data) => {
    await TeamController.edit(data);
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
    <View className="w-full flex-1 flex flex-col relative bg-gray-900">
      <Alerts />

      <Header />
      <View className="w-full flex-1 bg-gray-900">
        <View className="w-full h-full mt-10">
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
                    <ClubForm
                      onSubmit={handleAddClub}
                      onReturn={() => setCreateMode(false)}
                    />
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
      <View className="w-full h-14 mt-12 border-t border-danish-red" />
    </View>
  );
};
export default ClubManage;
