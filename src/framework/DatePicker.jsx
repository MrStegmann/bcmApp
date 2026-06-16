import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, View, Platform, TouchableOpacity } from "react-native-web";

const DatePicker = ({ value, onChange }) => {
  //   const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShowPicker(false);

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  return (
    <View className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5">
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text>{formatDate(value)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DatePicker;
