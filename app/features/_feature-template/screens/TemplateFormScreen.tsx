import React, { useMemo, useState } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  View,
  Pressable,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createItem, updateItem } from "../api";
import { Item, ItemFormValues } from "../types";
import { getItemsErrorMessage } from "../errors";
import { useAppAlert } from "../../../shared";
import { templateFormScreenStyles as styles } from "../css/styles";

const MockAppRoutes = {
  // Eliminar
  Items: "Items",
  ItemForm: "ItemForm",
  ItemDetail: "ItemDetail",
} as const;

type MockAppStackParamList = {
  // Eliminar
  [MockAppRoutes.Items]: undefined;
  [MockAppRoutes.ItemForm]: { item: Item | undefined };
  [MockAppRoutes.ItemDetail]: { item: Item };
};

type ItemsListScreenProps = NativeStackScreenProps<
  MockAppStackParamList, // Sustituir por el tipo real de la navegación de la feature
  typeof MockAppRoutes.ItemForm // Sustituir por la ruta real de la feature
>;

const ItemFormScreen = ({ navigation, route }: ItemsListScreenProps) => {
  const { showError } = useAppAlert();
  const editingItem = route.params?.item; // Sustituir por el parámetro real que se pasa para editar en la feature
  const isEdit = Boolean(editingItem);

  const { control, handleSubmit, formState, watch, setValue } =
    useForm<ItemFormValues>({
      defaultValues: {
        name: editingItem?.name || "",
        role: editingItem?.role || "",
      },
    });

  const isSubmitting = formState.isSubmitting;

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return "Guardando...";
    }

    return isEdit ? "Guardar" : "Crear";
  }, [isEdit, isSubmitting]);

  const onSubmit = async (values: ItemFormValues) => {
    const nextErrors: {
      name?: string;
      role?: string;
    } = {};

    const trimmedName = values.name.trim();
    const trimmedRole = values.role.trim();

    if (!trimmedName) {
      nextErrors.name = "El nombre es requerido";
    }
    if (!trimmedRole) {
      nextErrors.role = "El rol es requerido";
    }

    const payload = {
      name: trimmedName,
      role: trimmedRole,
    };

    try {
      if (isEdit && editingItem?.id) {
        await updateItem(editingItem.id, payload);
      } else {
        await createItem(payload);
      }

      navigation.goBack();
    } catch (error) {
      const errorMessage = getItemsErrorMessage(
        error,
        "No se pudo guardar el item. Intentalo de nuevo.",
      );
      showError("Error al guardar", errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Apellido</Text>
      <Controller
        control={control}
        name="role"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <View style={styles.actions}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </Pressable>

        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          style={[
            styles.primaryButton,
            isSubmitting ? styles.disabledButton : null,
          ]}
        >
          <Text style={styles.primaryButtonText}>{submitLabel}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export { ItemFormScreen };
