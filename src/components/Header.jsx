import { View } from "react-native";

const Header = ({ children }) => {
  return (
    <View className="w-full z-10">
      {/* Contenedor principal del menú, con forma elíptica */}
      <View className="w-full h-20 flex justify-end items-center rounded-b-full bg-danish-red relative">
        {/* Contenedor de botones, posicionado sobre el borde */}
        <View className="absolute -bottom-6 flex-row justify-center w-full gap-4">
          {children}
        </View>
      </View>
    </View>
  );
};

export default Header;
