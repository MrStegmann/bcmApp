import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import StorageEnums from "../Enums/StorageEnums";

const checkKeyStore = (key) =>
  new Promise((res, rej) => {
    if (Object.keys(StorageEnums).includes(key)) {
      res(true);
    } else {
      rej(false);
    }
  });

export const useLocalStore = create((get) => ({
  storeData: async (key, value) => {
    if (checkKeyStore(key)) {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } else {
      throw new Error("Llave no válido. Por favor, introduce una llave válida");
    }
  },
  getData: async (key) => {
    if (checkKeyStore(key)) {
      const value = await AsyncStorage.getItem(key);
      if (!value) return value;
      return JSON.parse(value);
    } else {
      throw new Error("Llave no válido. Por favor, introduce una llave válida");
    }
  },
  removeData: async (key) => {
    if (checkKeyStore(key)) {
      await AsyncStorage.removeItem(key);
    } else {
      throw new Error("Llave no válido. Por favor, introduce una llave válida");
    }
  },
}));
