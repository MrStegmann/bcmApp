import { View } from "react-native";

const Header = ({ children }) => {
  return (
    <View className="w-full z-10">
      {/* Contenedor principal del menú, con forma elíptica */}
      <View className="w-full h-20 flex justify-end items-center rounded-b-full shadow-2xl shadow-red-900">
        <View className="w-full h-full flex justify-end items-center rounded-b-full bg-danish-dark-gray shadow-inner shadow-red-900 relative">
          <View className="absolute -bottom-6 flex-row justify-center w-full gap-3">
            {children}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;
