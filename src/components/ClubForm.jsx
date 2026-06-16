import { useEffect, useState } from "react";
import { View } from "react-native-web";
import Input from "../framework/Input";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";

export default function ClubForm({ onSubmit, clubData, onReturn }) {
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const [name, setName] = useState("");
  const [wrongName, setWrongName] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTopMenu([
        {
          id: TopMenuEnums.SAVE,
          name: "Guardar",
          onPress: () => handleSubmit(),
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
  }, [name]);

  useEffect(() => {
    if (clubData?.id) {
      setName(clubData.name);
    }
  }, []);

  useEffect(() => {
    setWrongName("");
  }, [name]);

  const handleSubmit = () => {
    if (name.trim() === "")
      return setWrongName("Debes introducir un nombre para el equipo");

    onSubmit({
      ...(clubData?.id != null && { id: clubData?.id }),
      name: name.trim(),
    });
    setName("");
  };

  return (
    <View className="w-full flex-1 h-full px-2 gap-5">
      <Input
        placeholder="Nombre del Equipo"
        value={name}
        onChange={setName}
        wrongMsg={wrongName}
      />
    </View>
  );
}
