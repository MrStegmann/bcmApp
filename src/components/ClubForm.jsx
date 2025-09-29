import { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";
import Input from "../framework/Input";
import { evalue } from "../helpers/evalue";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";

export default function ClubForm({ onSubmit, clubData, onReturn }) {
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const [name, setName] = useState("");
  const [wrongName, setWrongName] = useState("");

  const [options, setOptions] = useState({
    showFees: true,
  });

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
  }, [name, options]);

  useEffect(() => {
    if (clubData?.id) {
      setName(clubData.name);
      const dataOptions = clubData.options.split(";");
      for (const option of dataOptions) {
        const [key, value] = option.split(":");
        if (key && value) {
          setOptions({ ...options, [key]: evalue(value) });
        }
      }
    }
  }, []);

  useEffect(() => {
    setWrongName("");
  }, [name]);

  const handleSubmit = () => {
    if (name.trim() === "")
      return setWrongName("Debes introducir un nombre para el equipo");

    const str = Object.entries(options)
      .map(([key, value]) => `${key}:${value}`)
      .join(";");

    onSubmit({
      ...(clubData?.id != null && { id: clubData?.id }),
      name: name.trim(),
      options: str,
    });
    setName("");
    setOptions({ showFees: true });
  };

  return (
    <View className="w-full h-full px-2 gap-5">
      <Input
        placeholder="Nombre del Equipo"
        value={name}
        onChange={setName}
        wrongMsg={wrongName}
      />

      {clubData && (
        <View className="w-full flex flex-row gap-5 items-center px-2">
          <Text className="text-danish-white">Mostrar Cuotas</Text>
          <Switch
            value={options.showFees}
            onValueChange={(state) =>
              setOptions({ ...options, showFees: state })
            }
          />
        </View>
      )}
    </View>
  );
}
