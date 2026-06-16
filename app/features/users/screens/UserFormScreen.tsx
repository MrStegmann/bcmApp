import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppRoutes, AppStackParamList } from "../../../navigation/types";
import { createUser, updateUser } from "../api/userApi";
import { UserRole } from "../types";
import { getUsersErrorMessage } from "../errors";
import { userFormScreenStyles as styles } from "../css/styles";

type UserFormScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.UserForm
>;

const ROLE_OPTIONS: Array<{ label: string; value: UserRole }> = [
  { label: "Admin", value: "admin" },
  { label: "Admin Assistant", value: "adminassistant" },
  { label: "Coach", value: "coach" },
  { label: "Coach Assistant", value: "coachassistant" },
  { label: "Staff", value: "staff" },
];

const isUserRole = (value: string | undefined): value is UserRole => {
  return ROLE_OPTIONS.some((option) => option.value === value);
};

const UserFormScreen = ({ navigation, route }: UserFormScreenProps) => {
  const editingUser = route.params?.user;
  const isEdit = Boolean(editingUser);

  const [name, setName] = useState(editingUser?.name ?? "");
  const [email, setEmail] = useState(editingUser?.email ?? "");
  const [role, setRole] = useState<UserRole | undefined>(() => {
    return isUserRole(editingUser?.role) ? editingUser.role : undefined;
  });
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    role?: string;
    password?: string;
    submit?: string;
  }>({});

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return "Guardando...";
    }

    return isEdit ? "Guardar" : "Crear";
  }, [isEdit, isSubmitting]);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const generated = Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");

    setPassword(generated);
    setIsPasswordVisible(true);

    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async () => {
    const nextErrors: {
      name?: string;
      email?: string;
      role?: string;
      password?: string;
    } = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      nextErrors.name = "El nombre es obligatorio";
    }

    if (!trimmedEmail) {
      nextErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(trimmedEmail)) {
      nextErrors.email = "El email no tiene un formato valido";
    }

    if (!role) {
      nextErrors.role = "El rol es obligatorio";
    }

    if (!isEdit && !trimmedPassword) {
      nextErrors.password = "La password es obligatoria";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const selectedRole = role;

    if (!selectedRole) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit && editingUser?.id) {
        await updateUser(editingUser.id, {
          name: trimmedName,
          email: trimmedEmail,
          role: selectedRole,
          ...(trimmedPassword ? { password: trimmedPassword } : {}),
        });
      } else {
        await createUser({
          name: trimmedName,
          email: trimmedEmail,
          role: selectedRole,
          password: trimmedPassword,
        });
      }

      navigation.goBack();
    } catch (error) {
      console.warn("No se pudo guardar el usuario", error);
      setErrors((prev) => ({
        ...prev,
        submit: getUsersErrorMessage(
          error,
          "No se pudo guardar el usuario. Intentalo de nuevo.",
        ),
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            placeholder="Nombre completo"
            style={[styles.input, errors.name ? styles.inputError : null]}
            value={name}
            accessibilityLabel="Campo de nombre completo"
            accessibilityHint="Ingresa el nombre completo del usuario"
          />
          {errors.name ? (
            <Text style={styles.errorText} accessibilityRole="alert">{errors.name}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Rol</Text>
          <View
            style={[
              styles.roleSelectContainer,
              errors.role ? styles.inputError : null,
            ]}
            accessibilityRole="radiogroup"
          >
            {ROLE_OPTIONS.map((option) => {
              const selected = option.value === role;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    setRole(option.value);
                    if (errors.role) {
                      setErrors((prev) => ({ ...prev, role: undefined }));
                    }
                  }}
                  style={({ pressed }) => [
                    styles.roleOption,
                    selected ? styles.roleOptionSelected : null,
                    pressed && !selected ? { opacity: 0.7 } : null
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={`Rol ${option.label}`}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      selected ? styles.roleOptionTextSelected : null,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.role ? (
            <Text style={styles.errorText} accessibilityRole="alert">{errors.role}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder="usuario@email.com"
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={email}
            accessibilityLabel="Campo de correo electrónico"
            accessibilityHint="Ingresa un correo electrónico válido"
          />
          {errors.email ? (
            <Text style={styles.errorText} accessibilityRole="alert">{errors.email}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder={isEdit ? "Dejar vacio para no cambiar" : "Password"}
            secureTextEntry={!isPasswordVisible}
            style={[styles.input, errors.password ? styles.inputError : null]}
            value={password}
            accessibilityLabel="Campo de contraseña"
            accessibilityHint={isEdit ? "Opcional. Ingresa una nueva contraseña o déjalo vacío para no cambiarla" : "Ingresa la contraseña del nuevo usuario"}
          />

          <View style={styles.passwordActions}>
            <Pressable
              onPress={generatePassword}
              style={({ pressed }) => [
                styles.inlineSecondaryButton,
                pressed ? { opacity: 0.7 } : null
              ]}
              accessibilityRole="button"
              accessibilityLabel="Generar contraseña automáticamente"
            >
              <Text style={styles.inlineSecondaryButtonText}>Autogenerar</Text>
            </Pressable>

            <Pressable
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              style={({ pressed }) => [
                styles.inlineSecondaryButton,
                pressed ? { opacity: 0.7 } : null
              ]}
              accessibilityRole="button"
              accessibilityLabel={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <Text style={styles.inlineSecondaryButtonText}>
                {isPasswordVisible ? "Ocultar" : "Mostrar"}
              </Text>
            </Pressable>
          </View>

          {errors.password ? (
            <Text style={styles.errorText} accessibilityRole="alert">{errors.password}</Text>
          ) : null}
        </View>

        {errors.submit ? (
          <Text style={styles.errorText} accessibilityRole="alert">{errors.submit}</Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed ? { opacity: 0.7 } : null
            ]}
            accessibilityRole="button"
            accessibilityLabel="Cancelar cambios y volver atrás"
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>

          <Pressable
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.primaryButton,
              isSubmitting ? styles.disabledButton : null,
              pressed && !isSubmitting ? { opacity: 0.8 } : null
            ]}
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            accessibilityLabel={isEdit ? "Guardar cambios del usuario" : "Crear nuevo usuario"}
          >
            <Text style={styles.primaryButtonText}>{submitLabel}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export { UserFormScreen };
