import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { Text, View } from "react-native";

import PlayerList from "./PlayerList";
import Calendar from "./Calendar";
import TrainingList from "./TrainingList";
import GameList from "./GameList";

import { useClubStore } from "../store/ClubStore";
import { useMenuStore, BottomMenuItem } from "../store/MenuStore";
import { TopMenuEnums } from "../types/enums";
import useDB from "../hooks/useDB";

interface ClubProfileProps {
  handleReturn: () => void;
  handleUpdate?: (data: { id: number; name: string }) => void;
}

const getTabTitle = (option: TopMenuEnums, clubName?: string): string => {
  switch (option) {
    case TopMenuEnums.PLAYERS:
      return "Plantilla de Jugadores";
    case TopMenuEnums.GAMES:
      return "Partidos";
    case TopMenuEnums.TRAININGS:
      return "Entrenamientos";
    case TopMenuEnums.CALENDAR:
      return "Calendario de Cuotas";
    case TopMenuEnums.MAIN:
    default:
      return clubName ? `Equipo: ${clubName}` : "Panel del Equipo";
  }
};

const ClubProfile: React.FC<ClubProfileProps> = memo(({ handleReturn }) => {
  const { GameController } = useDB();
  const [option, setOption] = useState<TopMenuEnums>(TopMenuEnums.MAIN);
  const [, setGamesResults] = useState<any[]>([]);

  const club = useClubStore((state) => state.club);

  const setHeaderTitle = useMenuStore((state) => state.setHeaderTitle);
  const setActiveTab = useMenuStore((state) => state.setActiveTab);
  const setBottomMenu = useMenuStore((state) => state.setBottomMenu);

  const handleReturnRef = useRef(handleReturn);
  useEffect(() => {
    handleReturnRef.current = handleReturn;
  }, [handleReturn]);

  const handleSelectTab = useCallback((targetTab: TopMenuEnums) => {
    setOption(targetTab);
  }, []);

  const handleReturnToMain = useCallback(() => {
    setOption(TopMenuEnums.MAIN);
  }, []);

  useEffect(() => {
    if (club?.id) {
      GameController.getAll(club.id).then((res) => setGamesResults(res));
    }
  }, [club]);

  useEffect(() => {
    setActiveTab(option);
    setHeaderTitle(getTabTitle(option, club?.name));

    const bottomItems: BottomMenuItem[] = [
      {
        id: TopMenuEnums.PLAYERS,
        label: "Plantilla",
        iconName: "users",
        iconFamily: "Entypo",
        onPress: () => handleSelectTab(TopMenuEnums.PLAYERS),
      },
      {
        id: TopMenuEnums.GAMES,
        label: "Partidos",
        iconName: "basketball-hoop-outline",
        iconFamily: "MaterialCommunityIcons",
        onPress: () => handleSelectTab(TopMenuEnums.GAMES),
      },
      {
        id: TopMenuEnums.TRAININGS,
        label: "Entrenamientos",
        iconName: "clipboard-notes",
        iconFamily: "Foundation",
        onPress: () => handleSelectTab(TopMenuEnums.TRAININGS),
      },
      {
        id: TopMenuEnums.CALENDAR,
        label: "Cuotas",
        iconName: "calendar",
        iconFamily: "Entypo",
        onPress: () => handleSelectTab(TopMenuEnums.CALENDAR),
      },
      {
        id: TopMenuEnums.GO_BACK,
        label: "Volver",
        iconName: "door-open",
        iconFamily: "FontAwesome5",
        onPress: () => handleReturnRef.current(),
      },
    ];

    setBottomMenu(bottomItems);
  }, [option, club?.name, handleSelectTab, setActiveTab, setHeaderTitle, setBottomMenu]);

  return (
    <View className="w-full h-full flex flex-col justify-center items-center">
      {option === TopMenuEnums.MAIN && (
        <View className="w-full flex flex-col justify-center items-center">
          <View className="relative w-full flex flex-col justify-center items-center mt-3 mb-10 px-4">
            <Text className="text-center text-3xl font-bold text-danish-white mb-2">
              {club?.name}
            </Text>
            {club?.category ? (
              <Text className="text-center text-lg text-danish-red font-semibold mb-4">
                {club.category}
              </Text>
            ) : null}
            <Text className="text-gray-400 text-base text-center">
              Selecciona una opción del menú inferior para gestionar la plantilla, partidos, entrenamientos o cuotas.
            </Text>
          </View>
        </View>
      )}

      {option === TopMenuEnums.PLAYERS && (
        <PlayerList onReturn={handleReturnToMain} />
      )}
      {option === TopMenuEnums.CALENDAR && (
        <Calendar onReturn={handleReturnToMain} />
      )}
      {option === TopMenuEnums.TRAININGS && (
        <TrainingList onReturn={handleReturnToMain} />
      )}
      {option === TopMenuEnums.GAMES && (
        <GameList onReturn={handleReturnToMain} />
      )}
    </View>
  );
});

export default ClubProfile;
