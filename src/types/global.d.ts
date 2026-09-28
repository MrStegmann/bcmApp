/// <reference types="nativewind/types" />

declare module "*.css";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

declare module "@expo/vector-icons" {
  export const FontAwesome6: any;
  export const Entypo: any;
  export const Ionicons: any;
  export const MaterialIcons: any;
  export const Feather: any;
  export const AntDesign: any;
}

declare module "@expo/vector-icons/*" {
  const icon: any;
  export default icon;
}
