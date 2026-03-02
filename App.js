import "./index.css";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/components/nav/RootStack";

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
