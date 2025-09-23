import React from "react";
import { ScrollView, View } from "react-native";

const Table = ({ header, body, footer }) => {
  return (
    <View className="w-full flex flex-col justify-center">
      {header && (
        <View className="w-full flex flex-row items-center border rounded-t-xl px-3 border-danish-light-gray py-2">
          {header}
        </View>
      )}
      {body && (
        <ScrollView
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
        >
          <View className="w-full flex flex-col items-center">{body}</View>
        </ScrollView>
      )}
      {footer && (
        <View className="w-full flex flex-row items-center border rounded-b-xl px-3 border-danish-light-gray py-2">
          {footer}
        </View>
      )}
    </View>
  );
};

export default Table;
