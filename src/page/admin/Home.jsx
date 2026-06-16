import React, { useEffect } from "react";
import { Text, View } from "react-native-web";
import { useAuthStore } from "../../store/AuthStore";

const Home = () => {
  const user = useAuthStore((state) => state.user);
  useEffect(() => {}, [user]);
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
