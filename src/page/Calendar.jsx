import React, { useEffect, useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useClubStore } from "../store/ClubStore";
import MonthEnums from "../Enums/MonthEnums";
import useDB from "../hooks/useDB";

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
    <View className="flex-1 w-full h-full justify-start items-center">
      <Text className="w-full text-center text-2xl font-bold mb-5">Cuotas</Text>
      <View className="w-1/2 border-2 border-danish-gold rounded-lg mb-5">
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={{
            width: "100%",
            height: 50,
            fontWeight: "bold",
            textAlign: "center",
            color: "#C60C30",
          }}
          itemStyle={{
            textAlign: "center",
          }}
        >
          {months.map((month) => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
      </View>

      <View className="flex flex-row w-full justify-center items-center">
        <View className="w-52 border border-danish-gold bg-danish-red px-5 py-3">
          <Text className="text-center text-danish-white">Jugador</Text>
        </View>
        <View className="w-36 border border-danish-gold bg-danish-red px-5 py-3">
          <Text className="text-center text-danish-white">{selectedMonth}</Text>
        </View>
      </View>

      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
        <View className="flex flex-col w-full justify-center items-center">
          {playersFee
            .filter((fees) => fees.month.includes(selectedMonth))
            .map((fees) => (
              <View key={fees.id} className="w-full flex flex-row">
                <View className="w-52  border border-danish-gold bg-danish-red px-5 py-3 flex justify-center items-center">
                  <Text className="text-center text-danish-white">
                    {fees.first_name + " " + fees.last_name}
                  </Text>
                </View>
                <View className="w-36 border border-danish-gold bg-danish-red px-5 py-3 flex justify-center items-center">
                  <Switch
                    value={Boolean(fees.paid)}
                    onValueChange={(state) => switchPaidMonth(fees, state)}
                  />
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Calendar;
