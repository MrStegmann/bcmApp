import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTeamStore } from "../../store/TeamStore";
import SelectInput from "../../framework/SelectInput";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigation } from "@react-navigation/native";
import { useStaffStore } from "../../store/StaffStore";
import { errorAlert, infoAlert } from "../../helpers/AlertHelper";

const TeamForm = ({ route }) => {
  const { onGoBack, team } = route.params;
  const [name, setName] = useState(team ? team.name : "");
  const [coach, setCoach] = useState(team ? team.coach : null);
  const [assistantCoach, setAssistantCoach] = useState(
    team ? team.assistantCoach : null,
  );

  const [staffs, setStaffs] = useState([]);

  const navigation = useNavigation();

  const saveTeam = useTeamStore((state) => state.saveTeam);
  const loading = useTeamStore((state) => state.loading);
  const fetchStaffs = useStaffStore((state) => state.fetchStaffs);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchStaff = async () => {
      if (user.token) {
        try {
          const staffs = await fetchStaffs(user.club.id);
          setStaffs(
            staffs.map((staff) => ({
              label: `${staff.name} ${staff.lastname}`,
              value: staff.id,
            })),
          );
        } catch (error) {
          setStaffs([]);
          errorAlert(error.message);
        }
      }
    };
    fetchStaff();
  }, []);

  const selectCoach = (value) => {
    if (!value) return;
    const selected = staffs.find((s) => s.value === value);
    setCoach({ id: selected.value });
  };

  const selectAssistantCoach = (value) => {
    if (!value) return;
    const selected = staffs.find((s) => s.value === value);
    setAssistantCoach({ id: selected.value });
  };

  const submit = async () => {
    if (name === "") {
      return errorAlert("El nombre del equipo es obligatorio");
    }
    const teamData = {
      ...(team?.id != null && { id: team?.id }),
      name,
      coach,
      assistantCoach,
      club: user.club,
    };
    try {
      await saveTeam(teamData);
      reset();
      navigation.goBack();
      onGoBack();
      infoAlert("Equipo guardado exitosamente");
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const reset = () => {
    setName("");
    setCoach(null);
    setAssistantCoach(null);
  };
  return (
    <View className="w-full flex-1 flex flex-col items-center px-5">
      <View className="w-full flex flex-col mt-5 border-b pb-5">
        <TextInput
          placeholder="Name"
          onChangeText={(value) => setName(value)}
          value={name}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />
        <SelectInput
          defaultOption={
            coach ? staffs.find((s) => s.value === coach.id) : null
          }
          options={staffs}
          cb={selectCoach}
        />
        <SelectInput
          defaultOption={
            assistantCoach
              ? staffs.find((s) => s.value === assistantCoach.id)
              : null
          }
          options={staffs}
          cb={selectAssistantCoach}
        />
      </View>

      <View className="w-full flex flex-row justify-between items-center mt-5">
        <TouchableOpacity
          className="p-4 border rounded-full w-full flex flex-row justify-center items-center bg-gray-200"
          onPress={submit}
        >
          <Text className="font-bold">{loading ? "Creando..." : "Crear"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TeamForm;
