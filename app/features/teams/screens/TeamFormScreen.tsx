import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppRoutes, AppStackParamList } from "../../../navigation/types";
import { createTeam, updateTeam } from "../api";
import { getTeamsErrorMessage } from "../errors";
import { getUsers } from "../../users/api/userApi";
import { User } from "../../users/types";
import MultiUserSelector from "../components/MultiUserSelector";
import { teamFormScreenStyles as styles } from "../css/styles";

type TeamFormScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.TeamForm
>;

const TeamFormScreen = ({ navigation, route }: TeamFormScreenProps) => {
  const editingTeam = route.params?.team;
  const isEdit = Boolean(editingTeam);
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState(editingTeam?.name ?? "");
  const [category, setCategory] = useState(editingTeam?.category ?? "");
  const [coachId, setCoachId] = useState(editingTeam?.coachId ?? "");
  const [assistantCoachIds, setAssistantCoachIds] = useState<string[]>(
    editingTeam?.assistantCoachIds ?? [],
  );
  const [assistantCoachSearch, setAssistantCoachSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [staffIds, setStaffIds] = useState<string[]>(
    editingTeam?.staffIds ?? [],
  );
  const [competition, setCompetition] = useState(
    editingTeam?.competition ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStaffUsers, setIsLoadingStaffUsers] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    category?: string;
    coachId?: string;
    competition?: string;
    submit?: string;
  }>({});

  useEffect(() => {
    const loadStaffUsers = async () => {
      setIsLoadingStaffUsers(true);

      try {
        const users = await getUsers();
        setUsers(users);
      } catch (error) {
        console.warn("No se pudieron cargar los usuarios staff", error);
      } finally {
        setIsLoadingStaffUsers(false);
      }
    };

    void loadStaffUsers();
  }, []);

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return "Guardando...";
    }

    return isEdit ? "Guardar" : "Crear";
  }, [isEdit, isSubmitting]);

  const clearFieldError = (
    field: "name" | "category" | "coachId" | "competition",
  ) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const nextErrors: {
      name?: string;
      category?: string;
      coachId?: string;
      competition?: string;
    } = {};

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedCoachId = coachId.trim();
    const trimmedCompetition = competition.trim();

    if (!trimmedName) {
      nextErrors.name = "El nombre es obligatorio";
    }

    if (!trimmedCategory) {
      nextErrors.category = "La categoría es obligatoria";
    }

    if (!trimmedCompetition) {
      nextErrors.competition = "La competición es obligatoria";
    }

    if (!trimmedCoachId) {
      nextErrors.coachId = "El ID del coach es obligatorio";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = {
      name: trimmedName,
      category: trimmedCategory,
      coachId: trimmedCoachId,
      assistantCoachIds,
      staffIds,
      competition: trimmedCompetition,
    };

    setIsSubmitting(true);

    try {
      if (isEdit && editingTeam?.id) {
        await updateTeam(editingTeam.id, payload);
      } else {
        await createTeam(payload);
      }

      navigation.goBack();
    } catch (error) {
      console.warn("No se pudo guardar el equipo", error);
      setErrors((prev) => ({
        ...prev,
        submit: getTeamsErrorMessage(
          error,
          "No se pudo guardar el equipo. Intentalo de nuevo.",
        ),
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            onChangeText={(text) => {
              setName(text);
              clearFieldError("name");
            }}
            placeholder="Nombre del equipo"
            style={[styles.input, errors.name ? styles.inputError : null]}
            value={name}
          />
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Competiciones</Text>
          <TextInput
            onChangeText={setCompetition}
            placeholder="Senior Provincial Masculino, U16 Regional Femenino, etc."
            style={styles.input}
            value={competition}
          />
          {errors.competition ? (
            <Text style={styles.errorText}>{errors.competition}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Categoría</Text>
          <TextInput
            onChangeText={(text) => {
              setCategory(text);
              clearFieldError("category");
            }}
            placeholder="U16, Senior, etc."
            style={[styles.input, errors.category ? styles.inputError : null]}
            value={category}
          />
          {errors.category ? (
            <Text style={styles.errorText}>{errors.category}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Entrenador Principal</Text>
          <View
            style={[
              styles.roleSelectContainer,
              errors.coachId ? styles.inputError : null,
            ]}
          >
            {users
              .filter((u) => !["staff", "coachassistant"].includes(u.role))
              .filter((u) => assistantCoachIds.every((id) => id !== u.id))
              .map((user) => {
                const selected = user.id === coachId;

                return (
                  <Pressable
                    key={user.id}
                    onPress={() => {
                      if (user.id === coachId) {
                        setCoachId("");
                      } else {
                        setCoachId(user.id);
                      }
                      clearFieldError("coachId");
                    }}
                    style={[
                      styles.roleOption,
                      selected ? styles.roleOptionSelected : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        selected ? styles.roleOptionTextSelected : null,
                      ]}
                    >
                      {user.name}
                    </Text>
                  </Pressable>
                );
              })}
          </View>
          {isLoadingStaffUsers ? (
            <Text style={styles.helperText}>Cargando usuarios staff...</Text>
          ) : null}
          {!isLoadingStaffUsers &&
          users
            .filter((u) => !["staff", "coachassistant"].includes(u.role))
            .filter((u) => assistantCoachIds.every((id) => id !== u.id))
            .length === 0 ? (
            <Text style={styles.helperText}>
              No hay usuarios staff disponibles.
            </Text>
          ) : null}
          {errors.coachId ? (
            <Text style={styles.errorText}>{errors.coachId}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <MultiUserSelector
            label="Segundo Entrenador"
            users={users
              .filter((u) => u.role !== "staff")
              .filter((u) => u.id !== coachId)}
            selectedIds={assistantCoachIds}
            onChange={setAssistantCoachIds}
            searchValue={assistantCoachSearch}
            onSearchChange={setAssistantCoachSearch}
            placeholder="Buscar segundo entrenador por nombre o email"
            getUserLabel={(user) => user.name}
          />
        </View>

        <View style={styles.fieldGroup}>
          <MultiUserSelector
            label="Delegados"
            users={users.filter((u) => u.role === "staff")}
            selectedIds={staffIds}
            onChange={setStaffIds}
            searchValue={staffSearch}
            onSearchChange={setStaffSearch}
            placeholder="Buscar delegado por nombre o email"
            getUserLabel={(user) => user.name}
          />
        </View>

        {errors.submit ? (
          <Text style={styles.errorText}>{errors.submit}</Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>

          <Pressable
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={[
              styles.primaryButton,
              isSubmitting ? styles.disabledButton : null,
            ]}
          >
            <Text style={styles.primaryButtonText}>{submitLabel}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export { TeamFormScreen };
