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
import { createGame, updateGame } from "../api";
import { GameFormValues } from "../types";
import { getGamesErrorMessage } from "../errors";
import { useAppAlert, usePlatformDatePickerInput } from "../../../shared";
import { gameFormScreenStyles as styles } from "../css/styles";
import { AppStackParamList, AppRoutes } from "../../../navigation/types";
import { useTeamStore } from "../../teams";
import DateTimePicker from "@react-native-community/datetimepicker";


type GamesFormScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.GameForm
>;

const GameFormScreen = ({ navigation, route }: GamesFormScreenProps) => {
  const teamId = useTeamStore(state => state.team).id;
  const { showError } = useAppAlert();
  const editingGame = route.params?.game;
  const isEdit = Boolean(editingGame);

  const { control, handleSubmit, formState, watch, setValue } =
    useForm<GameFormValues>({
      defaultValues: {
        game: editingGame || undefined,
      },
    });

  const isSubmitting = formState.isSubmitting;

  const dateInput = usePlatformDatePickerInput({
    value: watch("game.date"),
    onChange: (date) => {
      setValue("game.date", date, { shouldDirty: true, shouldTouch: true });
    },
  });

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return "Guardando...";
    }

    return isEdit ? "Guardar" : "Crear";
  }, [isEdit, isSubmitting]);

  const onSubmit = async (values: GameFormValues) => {
    const nextErrors: {
      rival?: string;
      round?: string;
      date?: string;
      location?: string;
    } = {};

    const trimmedRival = values.game?.rival.trim();
    const trimmedRound = values.game?.round.trim();
    const trimmedLocation = values.game?.location.trim();

    if (!trimmedRival) {
      nextErrors.rival = "El rival es requerido";
    }
    if (!trimmedRound) {
      nextErrors.round = "La jornada es requerida";
    }
    if (!trimmedLocation) {
      nextErrors.location = "La ubicación es requerida";
    }
    if (!values.game?.date) {
      nextErrors.date = "La fecha es requerida";
    }

    const payload = {
      teamId,
      rival: trimmedRival,
      round: trimmedRound,
      date: values.game?.date,
      location: trimmedLocation,
      isPlayed: values.game?.isPlayed || false,
      teamScore: values.game?.teamScore || 0,
      rivalScore: values.game?.rivalScore || 0,
      periods: []
    };

    try {
      if (isEdit && editingGame?.id) {
        await updateGame(editingGame.id, payload);
      } else {
        await createGame(payload);
      }

      navigation.goBack();
    } catch (error) {
      const errorMessage = getGamesErrorMessage(
        error,
        "No se pudo guardar el game. Intentalo de nuevo.",
      );
      showError("Error al guardar", errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Rival</Text>
      <Controller
        control={control}
        name="game.rival"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Jornada</Text>
      <Controller
        control={control}
        name="game.round"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Ubicación</Text>
      <Controller
        control={control}
        name="game.location"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Fecha</Text>
      {dateInput.isWeb ? (
        <TextInput
          style={styles.input}
          value={dateInput.webValue}
          onChangeText={dateInput.onWebChange}
          placeholder="dd-mm-yyyy"
        />
      ) : (
        <>
          <Pressable
            style={styles.input}
            onPress={dateInput.openNativePicker}
          >
            <Text style={styles.dateText}>{dateInput.displayValue}</Text>
          </Pressable>
          {dateInput.showNativePicker ? (
            <DateTimePicker {...dateInput.nativePickerProps} />
          ) : null}
        </>
      )}

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

export { GameFormScreen };
