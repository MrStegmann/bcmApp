import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { View } from "react-native";

import PlayerList from "./PlayerList";
import GameList from "./GameList";
import { HomeView } from "../features/home-view";
import { MatchDetailView } from "../features/match-detail";

import { useClubStore } from "../store/ClubStore";
import { useMenuStore, BottomMenuItem } from "../store/MenuStore";
import { TopMenuEnums } from "../types/enums";
import useDB from "../hooks/useDB";
import { Game } from "../types/database";

interface ClubProfileProps {
  handleReturn: () => void;
  handleUpdate?: (data: { id: number; name: string }) => void;
}

const getTabTitle = (
  option: TopMenuEnums,
  clubName?: string,
  selectedMatch?: Game | null
): string => {
  if (selectedMatch) {
    return "Detalle del Partido";
  }
  switch (option) {
    case TopMenuEnums.PLAYERS:
      return "Plantilla de Jugadores";
    case TopMenuEnums.GAMES:
      return "Partidos";
    case TopMenuEnums.MAIN:
    default:
      return clubName ? `${clubName}` : "Panel del Equipo";
  }
};

const ClubProfile: React.FC<ClubProfileProps> = memo(({ handleReturn }) => {
  const { GameController } = useDB();
  const [option, setOption] = useState<TopMenuEnums>(TopMenuEnums.MAIN);
  const [, setGamesResults] = useState<any[]>([]);
  const [matchDetailGame, setMatchDetailGame] = useState<Game | null>(null);

  const club = useClubStore((state) => state.club);

  const setHeaderTitle = useMenuStore((state) => state.setHeaderTitle);
  const setActiveTab = useMenuStore((state) => state.setActiveTab);
  const setBottomMenu = useMenuStore((state) => state.setBottomMenu);

  const handleReturnRef = useRef(handleReturn);
  useEffect(() => {
    handleReturnRef.current = handleReturn;
  }, [handleReturn]);

  const handleSelectTab = useCallback((targetTab: TopMenuEnums) => {
    setMatchDetailGame(null);
    setOption(targetTab);
  }, []);

  const handleReturnToMain = useCallback(() => {
    setMatchDetailGame(null);
    setOption(TopMenuEnums.MAIN);
  }, []);

  const handleSelectMatchForDetail = useCallback((match: Game) => {
    setMatchDetailGame(match);
  }, []);

  const handleCloseMatchDetail = useCallback(() => {
    setMatchDetailGame(null);
  }, []);

  useEffect(() => {
    if (club?.id) {
      GameController.getAll(club.id).then((res) => setGamesResults(res));
    }
  }, [club]);

  useEffect(() => {
    setActiveTab(option);
    setHeaderTitle(getTabTitle(option, club?.name, matchDetailGame));

    const bottomItems: BottomMenuItem[] = [
      {
        id: TopMenuEnums.MAIN,
        label: "Inicio",
        iconName: "home",
        iconFamily: "Feather",
        onPress: handleReturnToMain,
      },
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
        id: TopMenuEnums.GO_BACK,
        label: "Volver",
        iconName: "door-open",
        iconFamily: "FontAwesome5",
        onPress: () => {
          if (matchDetailGame) {
            handleCloseMatchDetail();
          } else {
            handleReturnRef.current();
          }
        },
      },
    ];

    setBottomMenu(bottomItems);
  }, [
    option,
    club?.name,
    matchDetailGame,
    handleSelectTab,
    handleReturnToMain,
    handleCloseMatchDetail,
    setActiveTab,
    setHeaderTitle,
    setBottomMenu,
  ]);

  return (
    <View className="w-full h-full flex flex-col justify-center items-center bg-surface">
      {matchDetailGame ? (
        <MatchDetailView
          match={matchDetailGame}
          onReturn={handleCloseMatchDetail}
          onMatchUpdated={(updated) => {
            setMatchDetailGame(updated);
          }}
        />
      ) : (
        <>
          {option === TopMenuEnums.MAIN && (
            <HomeView
              teamId={club?.id}
              onSelectMatch={handleSelectMatchForDetail}
              onNavigateToGames={() => handleSelectTab(TopMenuEnums.GAMES)}
            />
          )}

          {option === TopMenuEnums.PLAYERS && (
            <PlayerList onReturn={handleReturnToMain} />
          )}
          {option === TopMenuEnums.GAMES && (
            <GameList onReturn={handleReturnToMain} />
          )}
        </>
      )}
    </View>
  );
});

export default ClubProfile;
