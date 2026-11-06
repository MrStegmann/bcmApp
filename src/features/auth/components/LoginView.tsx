import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useAuthStore } from "../store/useAuthStore";

export const LoginView: React.FC = () => {
  const {
    usernameInput,
    passwordInput,
    isSubmitting,
    validationError,
    apiError,
    setUsernameInput,
    setPasswordInput,
    login,
  } = useAuthStore();

  const handleLoginPress = () => {
    if (!isSubmitting) {
      login();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface"
      testID="login-view-container"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        className="px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-sm mx-auto">
          {/* Header Brand */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-2xl bg-surface-container-high border border-court-orange/30 items-center justify-center mb-4">
              <Feather name="shield" size={32} color="#F97316" />
            </View>
            <Text className="text-2xl font-black text-on-surface tracking-wider">
              BasketApp
            </Text>
            <Text className="text-sm text-slate-400 mt-1">
              Gestión y Estadísticas de Club
            </Text>
          </View>

          {/* API Error Alert Banner */}
          {apiError ? (
            <View
              className="mb-6 p-4 rounded-xl bg-error-container/40 border border-error/50 flex-row items-center"
              testID="login-api-error-banner"
            >
              <Feather name="alert-circle" size={20} color="#FFB4AB" />
              <Text
                className="text-error text-xs font-medium ml-3 flex-1"
                testID="login-api-error-text"
              >
                {apiError}
              </Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View className="space-y-4">
            {/* Username Input */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Usuario
              </Text>
              <View
                className={`flex-row items-center px-4 py-3 rounded-xl bg-surface-container-high border ${
                  validationError?.username ? "border-error" : "border-slate-border"
                }`}
              >
                <Feather name="user" size={18} color="#94A3B8" />
                <TextInput
                  className="flex-1 text-on-surface text-base ml-3"
                  placeholder="Introduce tu usuario"
                  placeholderTextColor="#64748B"
                  value={usernameInput}
                  onChangeText={setUsernameInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                  testID="login-username-input"
                />
              </View>
              {validationError?.username ? (
                <Text
                  className="text-error text-xs mt-1 ml-1"
                  testID="login-username-error"
                >
                  {validationError.username}
                </Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Contraseña
              </Text>
              <View
                className={`flex-row items-center px-4 py-3 rounded-xl bg-surface-container-high border ${
                  validationError?.password ? "border-error" : "border-slate-border"
                }`}
              >
                <Feather name="lock" size={18} color="#94A3B8" />
                <TextInput
                  className="flex-1 text-on-surface text-base ml-3"
                  placeholder="Introduce tu contraseña"
                  placeholderTextColor="#64748B"
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  secureTextEntry={true}
                  editable={!isSubmitting}
                  testID="login-password-input"
                />
              </View>
              {validationError?.password ? (
                <Text
                  className="text-error text-xs mt-1 ml-1"
                  testID="login-password-error"
                >
                  {validationError.password}
                </Text>
              ) : null}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleLoginPress}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl flex-row items-center justify-center ${
                isSubmitting ? "bg-court-orange/60" : "bg-court-orange active:bg-court-orange-dark"
              }`}
              testID="login-submit-button"
            >
              {isSubmitting ? (
                <ActivityIndicator
                  color="#ffffff"
                  testID="login-loading-indicator"
                  className="mr-2"
                />
              ) : (
                <Feather name="log-in" size={18} color="#ffffff" className="mr-2" />
              )}
              <Text className="text-white text-base font-bold ml-2">
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

