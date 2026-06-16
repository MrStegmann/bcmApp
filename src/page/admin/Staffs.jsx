import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native-web";
import { useAuthStore } from "../../store/AuthStore";
import { useStaffStore } from "../../store/StaffStore";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import StaffItem from "../../components/staff/StaffItem";
import { delAlert, errorAlert } from "../../helpers/AlertHelper";
import PathEnums from "../../Enums/PathEnums";

const Staffs = () => {
  const [staffs, setStaffs] = useState([]);
  const user = useAuthStore((state) => state.user);
  const fetchStaffs = useStaffStore((state) => state.fetchStaffs);
  const deleteStaff = useStaffStore((state) => state.deleteStaff);
  const loading = useStaffStore((state) => state.loading);

  const navigation = useNavigation();

  useEffect(() => {
    loadStaffs();
  }, []);

  const loadStaffs = async () => {
    try {
      const result = await fetchStaffs(user.club.id);
      if (result.length === 0) {
        setStaffs([]);
        return;
      }

      setStaffs(result.filter((s) => s.id !== user.id));
    } catch (error) {
      setStaffs([]);
      errorAlert(error.message);
    }
  };

  const handleDeleteStaff = (staff) => {
    delAlert(staff.name, async () => {
      try {
        await deleteStaff(staff.id);
        loadStaffs();
      } catch (error) {
        errorAlert(error.message);
      }
    });
  };

  return (
    <View className="w-full flex-1 flex flex-col justify-center items-center px-5 gap-5">
      <View className="w-full flex flex-row justify-center items-center mt-5">
        <TouchableOpacity
          className="p-4 border rounded-full self-end"
          onPress={() =>
            navigation.navigate(PathEnums.STAFFFORM, { onGoBack: loadStaffs })
          }
        >
          <Entypo name="add-user" size={18} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={staffs}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <StaffItem
                staff={item}
                onDelete={handleDeleteStaff}
                onEdit={() =>
                  navigation.navigate(PathEnums.STAFFFORM, {
                    staff: item,
                    onGoBack: loadStaffs,
                  })
                }
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Staffs;
