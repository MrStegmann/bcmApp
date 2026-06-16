import React, { useMemo } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  View,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { createPlayer, updatePlayer } from "../api/playersApi";
import { useAppAlert, usePlatformDatePickerInput } from "../../../shared";
import { AppRoutes, AppStackParamList } from "../../../navigation";
import {
  getPlayersErrorMessage,
  PLAYER_ERRORS,
  PLAYER_ERROR_TITLES,
} from "../errors";
import { useTeamStore } from "../../teams";
import { playerFormScreenStyles as styles } from "../css/styles";

type PlayerFormScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.PlayerForm
>;

type PlayerFormValues = {
  firstName: string;
  lastName: string;
  birthday: Date;
  nationality: string;
  phoneNumber: string;
  email: string;
  jerseyName: string;
  jerseyNumber: string;
  isActive: boolean;
};

const PlayerFormScreen = ({ navigation, route }: PlayerFormScreenProps) => {
  const editingPlayer = route.params?.player;
  const isEdit = Boolean(editingPlayer);
  const { showError } = useAppAlert();
  const team = useTeamStore((state) => state.team);
  const teamId = editingPlayer?.teamId || team?.id || "";

  const { control, handleSubmit, formState, watch, setValue } =
    useForm<PlayerFormValues>({
      defaultValues: {
        firstName: editingPlayer?.firstName || "",
        lastName: editingPlayer?.lastName || "",
        birthday: editingPlayer?.birthday
          ? new Date(editingPlayer.birthday)
          : new Date(),
        nationality: editingPlayer?.nationality || "",
        phoneNumber: editingPlayer?.phoneNumber || "",
        email: editingPlayer?.email || "",
        jerseyName: editingPlayer?.jerseyName || "",
        jerseyNumber: editingPlayer?.jerseyNumber
          ? String(editingPlayer.jerseyNumber)
          : "",
        isActive: editingPlayer?.isActive || false,
      },
    });

  const birthday = watch("birthday");

  const birthdayInput = usePlatformDatePickerInput({
    value: birthday,
    onChange: (date) => {
      setValue("birthday", date, { shouldDirty: true, shouldTouch: true });
    },
  });

  const isSubmitting = formState.isSubmitting;

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return "Guardando...";
    }

    return isEdit ? "Guardar" : "Crear";
  }, [isEdit, isSubmitting]);

  const onSubmit = async (values: PlayerFormValues) => {
    const nextErrors: {
      firstName?: string;
      lastName?: string;
      birthday?: string;
      nationality?: string;
      phoneNumber?: string;
      email?: string;
      jerseyNumber?: string;
      isActive?: string;
    } = {};

    const trimmedFirstName = values.firstName.trim();
    const trimmedLastName = values.lastName.trim();
    const trimmedNationality = values.nationality.trim();
    const trimmedPhoneNumber = values.phoneNumber.trim();
    const trimmedEmail = values.email.trim();
    const trimmedJerseyName = values.jerseyName.trim();
    const jerseyNumber = Number(values.jerseyNumber);
    const birthday = values.birthday;
    const isActive = values.isActive;

    if (!trimmedFirstName) {
      nextErrors.firstName = PLAYER_ERRORS.FIRST_NAME_REQUIRED;
    }
    if (!trimmedLastName) {
      nextErrors.lastName = PLAYER_ERRORS.LAST_NAME_REQUIRED;
    }

    if (!birthday || Number.isNaN(new Date(birthday).getTime())) {
      nextErrors.birthday = PLAYER_ERRORS.BIRTHDAY_REQUIRED;
    }

    if (jerseyNumber <= 0) {
      nextErrors.jerseyNumber = PLAYER_ERRORS.JERSEY_NUMBER_INVALID;
    }

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = {
      teamId,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      birthday: birthday,
      nationality: trimmedNationality,
      phoneNumber: trimmedPhoneNumber,
      email: trimmedEmail,
      jerseyName: trimmedJerseyName,
      jerseyNumber,
      isActive,
    };

    try {
      if (isEdit && editingPlayer?.id) {
        await updatePlayer(editingPlayer.id, payload);
      } else {
        await createPlayer(payload);
      }

      navigation.goBack();
    } catch (error) {
      const errorMessage = getPlayersErrorMessage(
        error,
        PLAYER_ERRORS.SAVE_FALLBACK,
      );
      showError(PLAYER_ERROR_TITLES.SAVE, errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <Controller
        control={control}
        name="firstName"
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
        name="lastName"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Fecha de nacimiento</Text>
      {birthdayInput.isWeb ? (
        <TextInput
          style={styles.input}
          value={birthdayInput.webValue}
          onChangeText={birthdayInput.onWebChange}
          placeholder="dd-mm-yyyy"
        />
      ) : (
        <>
          <Pressable
            style={styles.input}
            onPress={birthdayInput.openNativePicker}
          >
            <Text style={styles.dateText}>{birthdayInput.displayValue}</Text>
          </Pressable>
          {birthdayInput.showNativePicker ? (
            <DateTimePicker {...birthdayInput.nativePickerProps} />
          ) : null}
        </>
      )}

      <Text style={styles.label}>Nacionalidad</Text>
      <Controller
        control={control}
        name="nationality"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Teléfono</Text>
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Nombre Equipación</Text>
      <Controller
        control={control}
        name="jerseyName"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Dorsal</Text>
      <Controller
        control={control}
        name="jerseyNumber"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            keyboardType="numeric"
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Activo</Text>
      <Controller
        control={control}
        name="isActive"
        render={({ field: { value, onChange } }) => (
          <Pressable style={styles.input} onPress={() => onChange(!value)}>
            <Text style={styles.dateText}>{value ? "Sí" : "No"}</Text>
          </Pressable>
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

export { PlayerFormScreen };
