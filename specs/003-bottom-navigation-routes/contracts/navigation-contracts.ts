import { TopMenuEnums } from "../../../src/types/enums";

/**
 * Bottom Navigation Item Contract
 */
export interface BottomMenuItem {
  id: TopMenuEnums;
  label: string;
  iconName: string;
  iconFamily?: "Entypo" | "Feather" | "MaterialIcons" | "Foundation" | "MaterialCommunityIcons" | "FontAwesome5";
  onPress: () => void;
  testID?: string;
}

/**
 * Bottom Navigation Bar Props Contract
 */
export interface BottomNavBarProps {
  items: BottomMenuItem[];
  activeTab: TopMenuEnums;
}

/**
 * Header Component Props Contract
 */
export interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}
