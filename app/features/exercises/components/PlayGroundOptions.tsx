import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePlaygroundStore } from "../store/usePlaygroundStore";
import { useAuthStore } from "../../login/store/authStore";
import { createExercise, updateExercise } from "../api/exerciseApi";
import { Activity, Category, Exercise, GamePhase, Type } from "../types";
import { playGroundOptionsStyles as styles } from "../css/styles";

const CATEGORIES: Category[] = [
  "Babybasket",
  "Prebenjamín",
  "Benjamín",
  "Alevín",
  "Infantil",
  "Cadete",
  "Juvenil",
  "Senior",
  "SUB-22"
];

const TYPES: Type[] = ["Tactic", "Technical", "Cooperative"];

const GAME_PHASES: GamePhase[] = ["Attack", "Defense", "Transition"];

const ACTIVITIES: Activity[] = [
  "Tiro",
  "Pases",
  "Dribbling",
  "Closeout",
  "Bloqueos",
  "Rebote",
  "Defensa 1v1",
  "Ayudas"
];

const Chip = ({ label, isSelected, onPress }: { label: string; isSelected: boolean; onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.chip, isSelected && styles.chipSelected]}
    onPress={onPress}
  >
    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const PlayGroundOptions = () => {
  const isOptionsOpen = usePlaygroundStore((state) => state.isOptionsOpen);
  const setOptionsOpen = usePlaygroundStore((state) => state.setOptionsOpen);
  const exerciseDetails = usePlaygroundStore((state) => state.exerciseDetails);
  const updateExerciseDetails = usePlaygroundStore((state) => state.updateExerciseDetails);

  const { boards, objects, lines, currentBoardIndex } = usePlaygroundStore();
  const auth = useAuthStore((state) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation();

  if (!isOptionsOpen) return null;

  const handleSave = async () => {
    if (!exerciseDetails.name) {
      Alert.alert("Error", "El nombre del ejercicio es obligatorio.");
      return;
    }

    let finalBoards = [...boards];
    if (finalBoards.length === 0) {
      finalBoards = [{
        id: "0",
        index: 0,
        objects: objects,
        lines: lines
      }];
    } else {
      finalBoards[currentBoardIndex] = {
        ...finalBoards[currentBoardIndex],
        objects,
        lines
      };
    }

    const payload = {
      userId: auth?.id || "unknown_user",
      name: exerciseDetails.name,
      description: exerciseDetails.description,
      alternatives: exerciseDetails.alternatives,
      category: exerciseDetails.category as Category[],
      type: exerciseDetails.type as Type[],
      gamePhase: exerciseDetails.gamePhase as GamePhase[],
      activities: exerciseDetails.activities as Activity[],
      likes: 0,
      coachBoard: finalBoards,
    };

    try {
      setIsSaving(true);
      
      if (exerciseDetails.id) {
        // Edit existing exercise
        await updateExercise(exerciseDetails.id, payload);
        Alert.alert("Éxito", "Ejercicio actualizado correctamente.");
      } else {
        // Create new exercise
        await createExercise(payload);
        Alert.alert("Éxito", "Ejercicio guardado correctamente.");
      }
      
      setOptionsOpen(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar el ejercicio:", error);
      Alert.alert("Error", "Hubo un problema al guardar el ejercicio.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleArrayItem = (key: keyof Pick<Exercise, "category" | "type" | "gamePhase" | "activities">, value: string) => {
    const currentArray = (exerciseDetails[key] as string[]) || [];
    if (currentArray.includes(value)) {
      updateExerciseDetails({ [key]: currentArray.filter(item => item !== value) });
    } else {
      updateExerciseDetails({ [key]: [...currentArray, value] });
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isOptionsOpen}
      animationType="fade"
      onRequestClose={() => setOptionsOpen(false)}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setOptionsOpen(false)}
          />
        </BlurView>

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{exerciseDetails.id ? "Editar Ejercicio" : "Nuevo Ejercicio"}</Text>
            <TouchableOpacity onPress={() => setOptionsOpen(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>

            {/* Nombre */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nombre del ejercicio <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Rueda de pases"
                value={exerciseDetails.name}
                onChangeText={(text) => updateExerciseDetails({ name: text })}
              />
            </View>

            {/* Descripción */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Explica cómo se desarrolla el ejercicio..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={exerciseDetails.description}
                onChangeText={(text) => updateExerciseDetails({ description: text })}
              />
            </View>

            {/* Alternativas */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Alternativas / Variaciones</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Añade variantes (ej: usar la mano débil)..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={exerciseDetails.alternatives}
                onChangeText={(text) => updateExerciseDetails({ alternatives: text })}
              />
            </View>

            {/* Categorías */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Categorías</Text>
              <View style={styles.chipContainer}>
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    isSelected={(exerciseDetails.category || []).includes(cat as Category)}
                    onPress={() => toggleArrayItem("category", cat)}
                  />
                ))}
              </View>
            </View>

            {/* Enfoque */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Tipo de Enfoque</Text>
              <View style={styles.chipContainer}>
                {TYPES.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    isSelected={(exerciseDetails.type || []).includes(type as Type)}
                    onPress={() => toggleArrayItem("type", type)}
                  />
                ))}
              </View>
            </View>

            {/* Fase de Juego */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Fases de Juego</Text>
              <View style={styles.chipContainer}>
                {GAME_PHASES.map((phase) => (
                  <Chip
                    key={phase}
                    label={phase}
                    isSelected={(exerciseDetails.gamePhase || []).includes(phase as GamePhase)}
                    onPress={() => toggleArrayItem("gamePhase", phase)}
                  />
                ))}
              </View>
            </View>

            {/* Actividades */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>¿Qué se está trabajando?</Text>
              <View style={styles.chipContainer}>
                {ACTIVITIES.map((act) => (
                  <Chip
                    key={act}
                    label={act}
                    isSelected={(exerciseDetails.activities || []).includes(act as Activity)}
                    onPress={() => toggleArrayItem("activities", act)}
                  />
                ))}
              </View>
            </View>

            {/* Botón de Guardar */}
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>Guardar Ejercicio</Text>
                </>
              )}
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

