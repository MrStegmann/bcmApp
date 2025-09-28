import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useClubStore } from "../store/ClubStore";
import useDB from "../hooks/useDB";
import TopMenuEnums from "../Enums/TopMenuEnums";
import { useMenuStore } from "../store/MenuStore";

const PlayerCard = ({
  playerInf,
  onClose,
  clubResults,
  setClubResults,
  quarterSelected,
  onUpdate,
}) => {
  if (!playerInf) return null;
  const { PlayerStatsController } = useDB();
  const club = useClubStore((state) => state.club);
  const [minutes, setMinutes] = useState(playerInf.minutes || 0);
  const [pt, setPT] = useState({
    t1a: playerInf.t1a || 0,
    t1i: playerInf.t1i || 0,
    t2a: playerInf.t2a || 0,
    t2i: playerInf.t2i || 0,
    t3a: playerInf.t3a || 0,
    t3i: playerInf.t3i || 0,
  });
  const [dreb, setDReb] = useState(playerInf.dreb || 0);
  const [oreb, setOReb] = useState(playerInf.oreb || 0);
  const [asis, setAsis] = useState(playerInf.asis || 0);
  const [rec, setRec] = useState(playerInf.rec || 0);
  const [per, setPer] = useState(playerInf.per || 0);
  const [falt, setFalt] = useState(playerInf.falt || 0);

  const handleChangeFalt = (value) => {
    setClubResults({
      ...clubResults,
      [quarterSelected]: {
        ...clubResults[quarterSelected],
        falt:
          clubResults[quarterSelected].falt + value < 0
            ? 0
            : clubResults[quarterSelected].falt + value,
      },
    });
    setFalt((before) => (before + value < 0 ? 0 : before + value));
  };

  const handleChangePts = (key, index, value) => {
    if (["t1a", "t2a", "t3a"].includes(key)) {
      const points = value * index;
      setClubResults({
        ...clubResults,
        [quarterSelected]: {
          ...clubResults[quarterSelected],
          pts:
            clubResults[quarterSelected].pts + points < 0
              ? 0
              : clubResults[quarterSelected].pts + points,
        },
      });
      setPT({
        ...pt,
        [key]: pt[key] + value < 0 ? 0 : pt[key] + value,
        [`t${index}i`]:
          pt[`t${index}i`] + value < 0 ? 0 : pt[`t${index}i`] + value,
      });
    } else {
      setPT({ ...pt, [key]: pt[key] + value < 0 ? 0 : pt[key] + value });
    }
  };

  const handleUpdate = () => {
    PlayerStatsController.edit({
      id: playerInf.statId,
      game_id: club.id,
      player_id: playerInf.id,
      minutes: Number(minutes),
      t1a: Number(pt.t1a),
      t1i: Number(pt.t1i),
      t2a: Number(pt.t2a),
      t2i: Number(pt.t2i),
      t3a: Number(pt.t3a),
      t3i: Number(pt.t3i),
      dreb: Number(dreb),
      oreb: Number(oreb),
      asis: Number(asis),
      rec: Number(rec),
      per: Number(per),
      falt: Number(falt),
    });
    onUpdate();
  };

  const percent = {
    t1Per:
      pt.t1a === 0 && pt.t1i === 0
        ? 0
        : (Number(pt.t1a) / Number(pt.t1i)) * 100,
    t2Per:
      pt.t2a === 0 && pt.t2i === 0
        ? 0
        : (Number(pt.t2a) / Number(pt.t2i)) * 100,
    t3Per:
      pt.t3a === 0 && pt.t3i === 0
        ? 0
        : (Number(pt.t3a) / Number(pt.t3i)) * 100,
  };
  const pts = Number(pt.t1a) + Number(pt.t2a) * 2 + Number(pt.t3a) * 3;
  const val =
    Number(pt.t2a) +
    Number(pt.t3a) +
    Number(pt.t1a) +
    (Number(dreb) + Number(oreb)) +
    Number(asis) +
    Number(rec) -
    Number(per) -
    Number(falt) -
    (Number(pt.t2i) - Number(pt.t2a)) -
    (Number(pt.t3i) - Number(pt.t3a)) -
    (Number(pt.t1i) - Number(pt.t1a));

  return (
    <View
      className={`w-full flex flex-col border-2 shadow shadow-danish-red bg-danish-dark-gray border-danish-red rounded-xl p-2 my-2`}
    >
      <View className="w-full flex flex-row justify-between">
        <View className="w-1/3 flex flex-col px-2 items-center justify-center">
          <Text className="w-full text-danish-white text-center text-sm">
            {playerInf.number}{" "}
            {playerInf.first_name + " " + playerInf.last_name}
          </Text>
        </View>
        <View className="w-1/4 flex flex-row justify-between">
          <View className="w-1/2">
            <View className="w-full flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">PTS</Text>
              <Text className="text-danish-white text-sm text-center">{`${pts}`}</Text>
            </View>
          </View>
          <View className="w-1/2">
            <View className="w-full flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">Val</Text>
              <Text className="text-danish-white text-sm text-center">{`${val}`}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="w-full flex flex-row justify-between">
        <View className="w-2/3 flex flex-col">
          <View className="w-full flex flex-row justify-start">
            <View className="w-1/4 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">Mins</Text>
              <View className="w-full flex flex-row justify-center items-center">
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() =>
                    setMinutes((before) => (before - 1 < 0 ? 0 : before - 1))
                  }
                >
                  <Text className="text-danish-white text-sm">{"<"}</Text>
                </TouchableOpacity>
                <Text className="text-danish-white text-sm mx-1">{`${minutes}`}</Text>
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() => setMinutes((before) => before + 1)}
                >
                  <Text className="text-danish-white text-sm">{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="w-2/3 flex flex-col justify-center items-center">
              <Text className="font-bold text-xs text-danish-white">
                Faltas Personales
              </Text>
              <View className="w-full flex flex-row justify-center items-center gap-1 mt-1">
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() => handleChangeFalt(-1)}
                >
                  <Text className="text-danish-white text-sm">{"<"}</Text>
                </TouchableOpacity>
                <View
                  className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${falt > 0 && "bg-danish-gold"}`}
                />
                <View
                  className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${falt > 1 && "bg-danish-gold"}`}
                />
                <View
                  className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${falt > 2 && "bg-danish-gold"}`}
                />
                <View
                  className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${falt > 3 && "bg-danish-gold"}`}
                />
                <View
                  className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${falt > 4 && "bg-danish-gold"}`}
                />
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() => handleChangeFalt(1)}
                >
                  <Text className="text-danish-white text-sm">{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="w-full flex flex-col justify-center items-center">
            {[1, 2, 3].map((key) => (
              <View
                key={key}
                className="w-full flex flex-row justify-start items-center my-1"
              >
                <View className="w-1/4 flex flex-col justify-center items-center">
                  <Text className="text-danish-white text-sm">T{key}A</Text>
                  <View className="w-full flex flex-row justify-center items-center">
                    <TouchableOpacity
                      className="w-4 p-1 border border-danish-white rounded-lg"
                      onPress={() => handleChangePts(`t${key}a`, key, -1)}
                    >
                      <Text className="text-danish-white text-sm">{"<"}</Text>
                    </TouchableOpacity>
                    <Text className="text-danish-white text-sm mx-1">{`${pt[`t${key}a`]}`}</Text>
                    <TouchableOpacity
                      className="w-4 p-1 border border-danish-white rounded-lg"
                      onPress={() => handleChangePts(`t${key}a`, key, +1)}
                    >
                      <Text className="text-danish-white text-sm">{">"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="w-1/4 flex flex-col justify-center items-center">
                  <Text className="text-danish-white text-sm">T{key}I</Text>
                  <View className="w-full flex flex-row justify-center items-center">
                    <TouchableOpacity
                      className="w-4 p-1 border border-danish-white rounded-lg"
                      onPress={() => handleChangePts(`t${key}i`, key, -1)}
                    >
                      <Text className="text-danish-white text-sm">{"<"}</Text>
                    </TouchableOpacity>
                    <Text className="text-danish-white text-sm mx-1">{`${pt[`t${key}i`]}`}</Text>
                    <TouchableOpacity
                      className="w-4 p-1 border border-danish-white rounded-lg"
                      onPress={() => handleChangePts(`t${key}i`, key, +1)}
                    >
                      <Text className="text-danish-white text-sm">{">"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="w-1/4 flex flex-col justify-center items-center">
                  <Text className="text-danish-white text-sm">T{key}%</Text>
                  <View className="w-full flex flex-row justify-center items-center">
                    <Text className="text-danish-white text-sm">{`${percent[`t${key}Per`].toFixed(1) || 0}%`}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className="w-1/3 flex flex-col gap-2">
          <View className="w-full flex flex-row">
            <View className="w-1/2 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">OReb</Text>
              <View className="w-full flex flex-row justify-center items-center">
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() =>
                    setOReb((before) => (before - 1 < 0 ? 0 : before - 1))
                  }
                >
                  <Text className="text-danish-white text-sm">{"<"}</Text>
                </TouchableOpacity>
                <Text className="text-danish-white text-sm mx-1">{`${oreb}`}</Text>
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() => setOReb((before) => before + 1)}
                >
                  <Text className="text-danish-white text-sm">{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="w-1/2 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">DReb</Text>
              <View className="w-full flex flex-row justify-center items-center">
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() =>
                    setDReb((before) => (before - 1 < 0 ? 0 : before - 1))
                  }
                >
                  <Text className="text-danish-white text-sm">{"<"}</Text>
                </TouchableOpacity>
                <Text className="text-danish-white text-sm mx-1">{`${dreb}`}</Text>
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() => setDReb((before) => before + 1)}
                >
                  <Text className="text-danish-white text-sm">{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="w-full flex flex-row">
            <View className="w-1/2 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">Asis</Text>
              <View className="w-full flex flex-row justify-center items-center">
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() =>
                    setAsis((before) => (before - 1 < 0 ? 0 : before - 1))
                  }
                >
                  <Text className="text-danish-white text-sm">{"<"}</Text>
                </TouchableOpacity>
                <Text className="text-danish-white text-sm mx-1">{`${asis}`}</Text>
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() => setAsis((before) => before + 1)}
                >
                  <Text className="text-danish-white text-sm">{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="w-1/2 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">Rec</Text>
              <View className="w-full flex flex-row justify-center items-center">
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() =>
                    setRec((before) => (before - 1 < 0 ? 0 : before - 1))
                  }
                >
                  <Text className="text-danish-white text-sm">{"<"}</Text>
                </TouchableOpacity>
                <Text className="text-danish-white text-sm mx-1">{`${rec}`}</Text>
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() => setRec((before) => before + 1)}
                >
                  <Text className="text-danish-white text-sm">{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="w-full flex flex-row justify-center items-center">
            <View className="w-1/2 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">Per</Text>
              <View className="w-full flex flex-row justify-center items-center">
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() =>
                    setPer((before) => (before - 1 < 0 ? 0 : before - 1))
                  }
                >
                  <Text className="text-danish-white text-sm">{"<"}</Text>
                </TouchableOpacity>
                <Text className="text-danish-white text-sm mx-1">{`${per}`}</Text>
                <TouchableOpacity
                  className="w-4 p-1 border border-danish-white rounded-lg"
                  onPress={() => setPer((before) => before + 1)}
                >
                  <Text className="text-danish-white text-sm">{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="w-full flex flex-row justify-between items-center px-5 mt-5">
        <TouchableOpacity
          className="px-4 py-2 border-danish-red border-2 bg-danish-dark-gray shadow-inner shadow-danish-red rounded-lg"
          onPress={handleUpdate}
        >
          <Text className="text-danish-white">Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 border-danish-white border-2 bg-danish-dark-gray shadow-inner shadow-danish-white rounded-lg"
          onPress={onClose}
        >
          <Text className="text-danish-white">Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const GameResults = ({
  data,
  club,
  quarterSelected,
  setQuarterSelected,
  clubResults,
  setOpponentResults,
  opponentResults,
}) => {
  const [totalResult, setTotalResult] = useState(0);
  const [totalOpponentResult, setTotalOpponentResult] = useState(0);

  useEffect(() => {
    setTotalOpponentResult(
      opponentResults.c1.pts +
        opponentResults.c2.pts +
        opponentResults.c3.pts +
        opponentResults.c4.pts +
        opponentResults.extra.pts
    );
  }, [opponentResults]);

  useEffect(() => {
    setTotalResult(
      clubResults.c1.pts +
        clubResults.c2.pts +
        clubResults.c3.pts +
        clubResults.c4.pts +
        clubResults.extra.pts
    );
  }, [clubResults]);

  const handleChangePts = (pts) => {
    setOpponentResults({
      ...opponentResults,
      [quarterSelected]: {
        ...opponentResults[quarterSelected],
        pts: opponentResults[quarterSelected].pts + pts,
      },
    });
  };
  const handleChangeFalt = (falt) => {
    setOpponentResults({
      ...opponentResults,
      [quarterSelected]: {
        ...opponentResults[quarterSelected],
        falt: opponentResults[quarterSelected].falt + falt,
      },
    });
  };

  return (
    <View className="mb-2 bg-danish-dark-gray shadow-danish-red border-2 border-danish-red rounded-lg p-4 shadow">
      <Text className="text-center text-xs text-danish-white mb-2">
        Jornada {data.round} - {data.date}
      </Text>
      <View className="flex flex-row justify-between items-center w-full">
        <Text className="text-center font-bold text-danish-white text-sm w-1/3">
          {club.name}
        </Text>
        <Text className="mx-2 font-bold text-danish-white text-sm">vs</Text>
        <Text className="text-center font-bold text-danish-white text-sm w-1/3">
          {data.opponent}
        </Text>
      </View>
      {["c1", "c2", "c3", "c4", "extra"].map((quarter) => (
        <View
          key={quarter}
          className="w-full my-1 border-b border-danish-white"
        >
          <TouchableOpacity
            className="flex-row justify-between items-center py-1 w-full"
            onPress={() => setQuarterSelected(quarter)}
          >
            <View className="w-1/3 flex justify-center items-center">
              <Text className="text-center font-bold text-sm text-danish-white w-12 px-1 rounded-lg">
                {`${clubResults[quarter].pts}`}
              </Text>
            </View>
            <Text className="text-center font-bold text-sm text-danish-white uppercase w-12">
              {quarter}
            </Text>
            <View className="w-1/3 flex justify-center items-center">
              <Text className="text-center font-bold text-sm text-danish-white w-12 px-1 rounded-lg">
                {`${opponentResults[quarter].pts}`}
              </Text>
            </View>
          </TouchableOpacity>
          {quarterSelected === quarter && (
            <View className="w-full flex flex-row justify-between items-center mb-5 mt-2">
              <View className="w-1/2 flex flex-col">
                <View className="w-2/3 flex flex-col justify-center items-center">
                  <Text className="font-bold text-xs text-danish-white">
                    Faltas de Equipo
                  </Text>
                  <View className="w-full flex flex-row justify-center items-center gap-1 mt-2">
                    <View
                      className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${clubResults[quarter].falt > 0 && "bg-danish-gold"}`}
                    />
                    <View
                      className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${clubResults[quarter].falt > 1 && "bg-danish-gold"}`}
                    />
                    <View
                      className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${clubResults[quarter].falt > 2 && "bg-danish-gold"}`}
                    />
                    <View
                      className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${clubResults[quarter].falt > 3 && "bg-danish-gold"}`}
                    />
                  </View>
                </View>
              </View>
              <View className="w-1/2 flex flex-col gap-2 pl-2">
                <View className="w-full flex flex-row justify-between items-center">
                  <Text className="font-bold text-xs text-danish-white">
                    PTS
                  </Text>
                  <View className="w-3/4 flex flex-col gap-2">
                    <View className="w-full flex flex-row justify-end gap-2">
                      <TouchableOpacity
                        onPress={() => handleChangePts(-1)}
                        className="w-8 p-1 border border-danish-white rounded-lg"
                      >
                        <Text className="text-center font-bold text-xs text-danish-white">
                          -1
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleChangePts(-2)}
                        className="w-8 p-1 border border-danish-white rounded-lg"
                      >
                        <Text className="text-center font-bold text-xs text-danish-white">
                          -2
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleChangePts(-3)}
                        className="w-8 p-1 border border-danish-white rounded-lg"
                      >
                        <Text className="text-center font-bold text-xs text-danish-white">
                          -3
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="w-full flex flex-row justify-end gap-2">
                      <TouchableOpacity
                        onPress={() => handleChangePts(1)}
                        className="w-8 p-1 border border-danish-white rounded-lg"
                      >
                        <Text className="text-center font-bold text-xs text-danish-white">
                          +1
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleChangePts(2)}
                        className="w-8 p-1 border border-danish-white rounded-lg"
                      >
                        <Text className="text-center font-bold text-xs text-danish-white">
                          +2
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleChangePts(3)}
                        className="w-8 p-1 border border-danish-white rounded-lg"
                      >
                        <Text className="text-center font-bold text-xs text-danish-white">
                          +3
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View className="w-full flex flex-row justify-between items-center">
                  <Text className="font-bold text-xs text-danish-white">
                    F. Equipo
                  </Text>
                  <View className="w-3/4 flex flex-row justify-end items-center gap-1">
                    <TouchableOpacity
                      onPress={() => handleChangeFalt(-1)}
                      className="w-8 p-1 border border-danish-white rounded-lg"
                    >
                      <Text className="text-center font-bold text-xs text-danish-white">
                        -1
                      </Text>
                    </TouchableOpacity>

                    <View
                      className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${opponentResults[quarter].falt > 0 && "bg-danish-gold"}`}
                    />
                    <View
                      className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${opponentResults[quarter].falt > 1 && "bg-danish-gold"}`}
                    />
                    <View
                      className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${opponentResults[quarter].falt > 2 && "bg-danish-gold"}`}
                    />
                    <View
                      className={`w-2 h-6 border border-danish-dark-gray bg-danish-light-gray rounded-lg ${opponentResults[quarter].falt > 3 && "bg-danish-gold"}`}
                    />
                    <TouchableOpacity
                      onPress={() => handleChangeFalt(1)}
                      className="w-8 p-1 border border-danish-white rounded-lg"
                    >
                      <Text className="text-center font-bold text-xs text-danish-white">
                        +1
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      ))}
      <TouchableOpacity
        onPress={() => setQuarterSelected("")}
        className="flex-row justify-between items-center pt-2 mt-2"
      >
        <Text className="flex-1 text-center font-bold text-sm text-danish-white">
          {`${totalResult}`}
        </Text>
        <Text className="flex-1 text-center font-bold text-sm text-danish-white">
          Total
        </Text>
        <Text className="flex-1 text-center font-bold text-sm text-danish-white">
          {`${totalOpponentResult}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const GameDetail = ({ data, onUpdateResults, onReturn }) => {
  if (!data) return;
  const [quarterSelected, setQuarterSelected] = useState("c1");
  const [clubResults, setClubResults] = useState({
    c1: { pts: 0, falt: 0 },
    c2: { pts: 0, falt: 0 },
    c3: { pts: 0, falt: 0 },
    c4: { pts: 0, falt: 0 },
    extra: { pts: 0, falt: 0 },
  });
  const [opponentResults, setOpponentResults] = useState({
    c1: { pts: 0, falt: 0 },
    c2: { pts: 0, falt: 0 },
    c3: { pts: 0, falt: 0 },
    c4: { pts: 0, falt: 0 },
    extra: { pts: 0, falt: 0 },
  });

  const [players_stats, setPlayers_Stats] = useState([]);
  const [calledup, setCalleup] = useState([]);
  const [playerDetails, setPlayerDetails] = useState(null);

  const { PlayerController, GameController } = useDB();

  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    if (data) {
      setClubResults({
        c1: { pts: data.result_c1 || 0, falt: data.falts_c1 || 0 },
        c2: { pts: data.result_c2 || 0, falt: data.falts_c2 || 0 },
        c3: { pts: data.result_c3 || 0, falt: data.falts_c3 || 0 },
        c4: { pts: data.result_c4 || 0, falt: data.falts_c4 || 0 },
        extra: { pts: data.result_extra || 0, falt: data.falts_extra || 0 },
      });
      setOpponentResults({
        c1: {
          pts: data.result_c1_opponent || 0,
          falt: data.falts_c1_opponent || 0,
        },
        c2: {
          pts: data.result_c2_opponent || 0,
          falt: data.falts_c2_opponent || 0,
        },
        c3: {
          pts: data.result_c3_opponent || 0,
          falt: data.falts_c3_opponent || 0,
        },
        c4: {
          pts: data.result_c4_opponent || 0,
          falt: data.falts_c4_opponent || 0,
        },
        extra: {
          pts: data.result_extra_opponent || 0,
          falt: data.falts_extra_opponent || 0,
        },
      });
    }
    const getCalledUp = async () => {
      const RESULT_CALLEDUP = await GameController.loadCalledup(data.id);
      setCalleup(RESULT_CALLEDUP.map((res) => res.player_id));
    };
    getCalledUp();
  }, [data]);

  useEffect(() => {
    if (calledup.length > 0) getPlayerStats();
  }, [calledup]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTopMenu([
        {
          id: TopMenuEnums.SAVE,
          name: "Guardar",
          onPress: () => handleSaveResults(),
          icon: TopMenuEnums.SAVE,
        },
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: onReturn,
          icon: TopMenuEnums.GO_BACK,
        },
      ]);
    }, 25);
    return () => clearTimeout(timeout);
  }, [clubResults, opponentResults]);

  const getPlayerStats = async () => {
    setPlayerDetails(null);
    const array = [];
    for (const playerId of calledup) {
      const RESULT_PLAYERS_STATES = await PlayerController.loadPlayerStats(
        playerId,
        data.id
      );
      array.push(RESULT_PLAYERS_STATES);
    }
    setPlayers_Stats(array);
  };

  const handleSaveResults = async () => {
    await onUpdateResults({
      id: data.id,
      team_id: club.id,
      opponent: data.opponent,
      round: data.round,
      date: data.date,
      result_c1_opponent: opponentResults.c1.pts,
      result_c2_opponent: opponentResults.c2.pts,
      result_c3_opponent: opponentResults.c3.pts,
      result_c4_opponent: opponentResults.c4.pts,
      result_extra_opponent: opponentResults.extra.pts,
      falts_c1_opponent: opponentResults.c1.falt,
      falts_c2_opponent: opponentResults.c2.falt,
      falts_c3_opponent: opponentResults.c3.falt,
      falts_c4_opponent: opponentResults.c4.falt,
      falts_extra_opponent: opponentResults.extra.falt,
      result_c1: clubResults.c1.pts,
      result_c2: clubResults.c2.pts,
      result_c3: clubResults.c3.pts,
      result_c4: clubResults.c4.pts,
      result_extra: clubResults.extra.pts,
      falts_c1: clubResults.c1.falt,
      falts_c2: clubResults.c2.falt,
      falts_c3: clubResults.c3.falt,
      falts_c4: clubResults.c4.falt,
      falts_extra: clubResults.extra.falt,
    });
  };

  return (
    <View className="flex-1 px-2 h-full w-full">
      <GameResults
        data={data}
        club={club}
        clubResults={clubResults}
        setOpponentResults={setOpponentResults}
        opponentResults={opponentResults}
        quarterSelected={quarterSelected}
        setQuarterSelected={setQuarterSelected}
      />

      {/* Sección de la tabla de estadísticas */}
      <View className="w-full my-2">
        {!playerDetails ? (
          <View className="w-full flex flex-row flex-wrap justify-between items-center gap-2">
            {players_stats
              .sort((a, b) => a.number - b.number)
              .map((ps) => {
                return (
                  <TouchableOpacity
                    key={ps.id}
                    onPress={() => setPlayerDetails(ps)}
                    className="hover:bg-danish-red active:bg-danish-red"
                  >
                    <View
                      className={`border border-danish-red rounded-lg w-28 p-2 ${playerDetails?.id === ps.id && "bg-danish-red"}`}
                    >
                      <Text className="text-xs text-danish-white text-center">
                        {ps.number} {ps.first_name + " " + ps.last_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        ) : (
          <PlayerCard
            playerInf={playerDetails}
            onClose={() => setPlayerDetails(null)}
            clubResults={clubResults}
            setClubResults={setClubResults}
            quarterSelected={quarterSelected}
            onUpdate={() => getPlayerStats()}
          />
        )}
      </View>
    </View>
  );
};

export default GameDetail;
