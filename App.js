import "./index.css";
import { NavigationContainer } from "@react-navigation/native";
import { AppStackNavigator } from "./app/navigation";

export default function App() {
  return (
    <NavigationContainer>
      <AppStackNavigator />
    </NavigationContainer>
  );
}
