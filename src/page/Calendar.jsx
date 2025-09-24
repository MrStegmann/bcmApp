import React, { useEffect, useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useClubStore } from "../store/ClubStore";
import MonthEnums from "../Enums/MonthEnums";
import useDB from "../hooks/useDB";
import Entypo from "@expo/vector-icons/Entypo";

const months = Object.keys(MonthEnums);

const Calendar = () => {
  const { FeesController } = useDB();
  const [playersFee, setPlayersFee] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );

  const club = useClubStore((state) => state.club);

  useEffect(() => {
    getPlayersFeeTable();
  }, [selectedMonth]);

  const getPlayersFeeTable = async () => {
    FeesController.loadFeesByGame(club.id, setPlayersFee);
  };

  const switchPaidMonth = async (fee, state) => {
    await FeesController.edit(
      fee.id,
      fee.team_id,
      fee.player_id,
      fee.season,
      fee.month,
      state,
      fee.team_id
    );
    getPlayersFeeTable();
  };

  return (
    <View className="w-full h-full flex flex-col justify-start items-center px-2">
      <Text className="w-full text-center text-xl text-danish-white font-bold mb-5">
        Cuotas
      </Text>
      <View className="w-full flex flex-row flex-wrap gap-2 justify-center items-center">
        {months.map((month) => (
          <TouchableOpacity
            key={month}
            onPress={() => setSelectedMonth(month)}
            className="hover:bg-danish-red active:bg-danish-red"
          >
            <View
              className={`border border-danish-red rounded-lg w-28 p-2 ${selectedMonth === month && "bg-danish-red"}`}
            >
              <Text className="text-xs text-danish-white text-center">
                {month}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="w-full text-center text-xl text-danish-white font-bold mt-5 mb-2">
        Jugadores
      </Text>
      <View className="w-full flex-1">
        <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
          <View className="w-full flex-1 flex flex-row flex-wrap gap-4 mt-5 justify-center items-center">
            {playersFee
              .filter((fees) => fees.month.includes(selectedMonth))
              .map((fees) => (
                <TouchableOpacity
                  onPress={() => switchPaidMonth(fees, !fees.paid)}
                  key={fees.id}
                  className={`w-28 h-28 flex flex-col bg-danish-dark-gray justify-center border rounded-lg p-2 shadow-lg ${fees.paid ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"} hover:bg-danish-red active:bg-danish-red`}
                >
                  <Text className="text-xs text-center text-danish-white">
                    {fees.first_name + " " + fees.last_name}
                  </Text>
                  <View className="w-full flex-1 flex justify-center items-center">
                    {fees.paid ? (
                      <Entypo name="check" size={18} color="gold" />
                    ) : (
                      <Entypo name="cross" size={18} color="red" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Calendar;
