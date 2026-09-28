import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

import { useClubStore } from "../store/ClubStore";
import MonthEnums from "../Enums/MonthEnums";
import useDB from "../hooks/useDB";

const months = Object.keys(MonthEnums);

interface CalendarProps {
  onReturn?: () => void;
}

const Calendar: React.FC<CalendarProps> = () => {
  const { FeesController } = useDB();
  const [playersFee, setPlayersFee] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[new Date().getMonth()] || months[0]
  );

  const club = useClubStore((state) => state.club);

  useEffect(() => {
    getPlayersFeeTable();
  }, [selectedMonth, club]);

  const getPlayersFeeTable = async () => {
    if (club?.id) {
      const list = await FeesController.loadFeesByGame(club.id);
      setPlayersFee(list);
    }
  };

  const switchPaidMonth = async (fee: any, state: boolean) => {
    await FeesController.toggle(fee.id, state);
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
              className={`border border-danish-red rounded-lg w-28 p-2 ${selectedMonth === month ? "bg-danish-red" : ""}`}
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
            {playersFee.length ? (
              playersFee
                .filter((fees) => fees.month && fees.month.includes(selectedMonth))
                .map((fees) => (
                  <TouchableOpacity
                    onPress={() => switchPaidMonth(fees, !fees.paid)}
                    key={fees.id}
                    className={`w-28 h-28 flex flex-col bg-danish-dark-gray justify-center border rounded-lg p-2 shadow-lg ${fees.paid ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"} hover:bg-danish-red active:bg-danish-red`}
                  >
                    <Text className="text-xs text-center text-danish-white">
                      {(fees.firstName || fees.first_name || "") + " " + (fees.lastName || fees.last_name || "")}
                    </Text>
                    <View className="w-full flex-1 flex justify-center items-center">
                      {fees.paid ? (
                        <Entypo name="check" size={18} color="gold" />
                      ) : (
                        <Entypo name="cross" size={18} color="red" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))
            ) : (
              <Text className="text-danish-white font-bold">
                Aun no tienes ningún jugador registrado
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Calendar;
