import apiClient from "../../../config/apiClient";
import { useAuthStore } from "../../login/store/authStore";
import {
  ItemsDeleteError,
  ItemsFetchError,
  ItemsSaveError,
} from "../errors/ItemErrors";
import { Item } from "../types";

export type CreateItemPayload = {
  name: string;
  role: string;
};

export type UpdateItemPayload = Partial<CreateItemPayload>;

const MOCK_ITEMS: Item[] = [
  // Eliminar. Usar endpoint real de la feature
  { id: "1", name: "Mock User 1", role: "Admin" },
  { id: "2", name: "Mock User 2", role: "Editor" },
  { id: "3", name: "Mock User 3", role: "Viewer" },
];

const getAuthHeaders = () => {
  const token = useAuthStore.getState().auth?.token;

  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getItems = async (): Promise<Item[]> => {
  try {
    await new Promise((resolve) => {
      console.log("Simulando llamada a endpoint real de la feature...");
      setTimeout(resolve, 1000);
    });
    const response = { data: MOCK_ITEMS };
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new ItemsFetchError(error.message);
    }

    throw new ItemsFetchError();
  }
};

export const createItem = async (payload: CreateItemPayload): Promise<Item> => {
  try {
    await new Promise((resolve) => {
      console.log("Simulando llamada a endpoint real de la feature...");
      setTimeout(resolve, 1000);
    });
    MOCK_ITEMS.push({
      id: (MOCK_ITEMS.length + 1).toString(),
      name: payload.name,
      role: payload.role,
    });
    const response = { data: MOCK_ITEMS[MOCK_ITEMS.length - 1] };
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new ItemsSaveError(error.message);
    }

    throw new ItemsSaveError();
  }
};

export const updateItem = async (
  id: string,
  payload: UpdateItemPayload,
): Promise<Item> => {
  try {
    await new Promise((resolve) => {
      console.log("Simulando llamada a endpoint real de la feature...");
      setTimeout(resolve, 1000);
    });
    const itemIndex = MOCK_ITEMS.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      throw new Error("Item no encontrado");
    }
    MOCK_ITEMS[itemIndex] = {
      ...MOCK_ITEMS[itemIndex],
      ...payload,
    };
    const response = { data: MOCK_ITEMS[itemIndex] };
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new ItemsSaveError(error.message);
    }

    throw new ItemsSaveError();
  }
};

export const deleteItem = async (id: string): Promise<void> => {
  try {
    await new Promise((resolve) => {
      console.log("Simulando llamada a endpoint real de la feature...");
      setTimeout(resolve, 1000);
    });
    const itemIndex = MOCK_ITEMS.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      throw new Error("Item no encontrado");
    }
    MOCK_ITEMS.splice(itemIndex, 1);
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new ItemsDeleteError(error.message);
    }

    throw new ItemsDeleteError();
  }
};
