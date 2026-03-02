import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toolbar from "./Toolbar";
import Playbook from "./Playbook";
import { usePlaybookStore } from "../../store/PlaybookStore";
import TokenEnums from "../../Enums/TokenEnums";
import Options from "./Options";
import { errorAlert, infoAlert } from "../../helpers/AlertHelper";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const ExercicesForm = ({ route }) => {
  const { onGoBack, exercice } = route.params;
  const [showOptions, setShowOptions] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flags, setFlags] = useState("");

  const [indexStage, setIndexStage] = useState(1);
  const [players, setPlayers] = useState([]); // Contendrá tanto ofensivos como defensivos
  const [items, setItems] = useState([]); // Contendrá bolas, conos y otros objetos
  const [lines, setLines] = useState([]);

  const [stages, setStages] = useState([]);

  const setSelectedObject = usePlaybookStore(
    (state) => state.setSelectedObject,
  );
  const selectedObject = usePlaybookStore((state) => state.selectedObject);
  const savePlaybook = usePlaybookStore((state) => state.savePlaybook);
  const halfCourt = usePlaybookStore((state) => state.halfCourt);

  const navigation = useNavigation();

  useEffect(() => {
    const newStages = [...stages];

    newStages[indexStage - 1] = {
      index: indexStage,
      players,
      items,
      lines,
    };
    setStages(newStages);
  }, [players, items, lines]);

  useEffect(() => {
    if (stages.length === 0) {
      setStages([
        {
          index: indexStage,
          players: [],
          items: [],
          lines: [],
        },
      ]);
    } else {
      const stage = stages[indexStage - 1];

      if (stage) {
        setPlayers(stage.players);
        setItems(stage.items);
        setLines(stage.lines);
      }
    }
  }, [indexStage]);

  const handleSubmit = async () => {
    try {
      await savePlaybook({
        title,
        description,
        flags,
        stages,
        halfCourt,
      });

      navigation.goBack();
      onGoBack();
      infoAlert("Ejercicio guardado correctamente");
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const deleteToken = () => {
    if (!selectedObject) return;
    if (
      [TokenEnums.OFFENSIVE, TokenEnums.DEFENSIVE].includes(selectedObject.type)
    ) {
      setPlayers((prev) => prev.filter((p) => p.id !== selectedObject.id));
    }
    if (
      [TokenEnums.BALL, TokenEnums.CONE, TokenEnums.HAND_BY_HAND].includes(
        selectedObject.type,
      )
    ) {
      setItems((prev) => prev.filter((i) => i.id !== selectedObject.id));
    }
    if (
      [
        TokenEnums.MOVEMENT_LINE,
        TokenEnums.PASS_LINE,
        TokenEnums.DRIBBLING_LINE,
        TokenEnums.BLOCK_LINE,
      ].includes(selectedObject.type)
    ) {
      setLines((prev) => prev.filter((l) => l.id !== selectedObject.id));
    }
    setSelectedObject(null);
  };

  const handleAddNewStage = () => {
    const newIndex = indexStage + 1;
    setStages((prev) => [
      ...prev,
      {
        index: newIndex,
        players: players.map((p) => ({
          ...p,
          id: Date.now().toString() + p.id,
        })),
        items: items.map((i) => ({ ...i, id: Date.now().toString() + i.id })),
        lines: lines.map((l) => ({ ...l, id: Date.now().toString() + l.id })),
      },
    ]);
    setIndexStage(newIndex);
  };

  const handleRemoveCurrentStage = () => {
    if (stages.length === 1) {
      setStages([]);
      setIndexStage(1);
      setPlayers([]);
      setItems([]);
      setLines([]);
      return;
    }
    const newStages = stages.filter((s) => s.index !== indexStage);
    setStages(newStages);
    if (indexStage > 1) {
      setIndexStage(indexStage - 1);
    } else {
      setIndexStage(1);
    }
  };

  return (
    <View className="flex-1 w-full flex-row">
      {showOptions ? (
        <Options
          flags={flags}
          setFlags={setFlags}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />
      ) : (
        <View className="flex-1 bg-gray-400">
          <View className="w-full flex flex-row justify-center items-center gap-x-4 pt-2">
            <TouchableOpacity
              onPress={() =>
                setIndexStage(indexStage - 1 < 1 ? 1 : indexStage - 1)
              }
            >
              <Entypo name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text>
              {indexStage}/{stages.length}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setIndexStage(
                  indexStage + 1 > stages.length
                    ? stages.length
                    : indexStage + 1,
                )
              }
            >
              <Entypo name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Playbook
            players={players}
            items={items}
            lines={lines}
            setPlayers={setPlayers}
            setItems={setItems}
            setLines={setLines}
          />
        </View>
      )}
      <Toolbar
        onDelete={deleteToken}
        setShowOptions={setShowOptions}
        showOptions={showOptions}
        onRemoveStage={handleRemoveCurrentStage}
        onAddStage={handleAddNewStage}
        onSave={handleSubmit}
      />
    </View>
  );
};

export default ExercicesForm;
