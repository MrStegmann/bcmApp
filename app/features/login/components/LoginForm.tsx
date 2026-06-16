import React, { useMemo } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { LoginFormValues, LoginSubmitHandler } from "../types";
import { validateLoginForm } from "../utils/validation";
import { loginFormStyles as styles } from "../css/styles";

type LoginFormProps = {
  onSubmit: LoginSubmitHandler;
  isLoading?: boolean;
};

const INITIAL_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: INITIAL_VALUES,
  });

  const disabled = useMemo(() => isLoading, [isLoading]);

  const onSubmitForm = async (values: LoginFormValues) => {
    const nextErrors = validateLoginForm(values);

    if (nextErrors.email) {
      setError("email", {
        type: "manual",
        message: nextErrors.email,
      });
    }

    if (nextErrors.password) {
      setError("password", {
        type: "manual",
        message: nextErrors.password,
      });
    }

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    await onSubmit({
      email: values.email.trim(),
      password: values.password,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Iniciar sesión
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => {
                onChange(text);
                if (errors.email) {
                  clearErrors("email");
                }
              }}
              placeholder="tuemail@dominio.com"
              placeholderTextColor="#9CA3AF"
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={value}
              accessibilityLabel="Campo de entrada de correo electrónico"
              accessibilityHint="Ingresa tu correo electrónico registrado"
            />
          )}
        />
        {errors.email ? (
          <Text style={styles.errorText} accessibilityRole="alert">
            {errors.email.message}
          </Text>
        ) : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => {
                onChange(text);
                if (errors.password) {
                  clearErrors("password");
                }
              }}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={[styles.input, errors.password ? styles.inputError : null]}
              value={value}
              accessibilityLabel="Campo de entrada de contraseña"
              accessibilityHint="Ingresa tu contraseña de forma segura"
            />
          )}
        />
        {errors.password ? (
          <Text style={styles.errorText} accessibilityRole="alert">
            {errors.password.message}
          </Text>
        ) : null}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          accessibilityHint="Toca para iniciar sesión con tus credenciales"
          disabled={disabled}
          onPress={handleSubmit(onSubmitForm)}
          style={({ pressed }) => [
            styles.button,
            disabled ? styles.buttonDisabled : null,
            pressed && !disabled ? styles.buttonActive : null,
          ]}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
