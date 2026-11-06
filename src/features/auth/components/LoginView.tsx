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
    rememberMe,
    isBiometricAvailable,
    isSubmitting,
    validationError,
    apiError,
    setUsernameInput,
    setPasswordInput,
    setRememberMe,
    clearErrors,
    login,
    loginWithBiometrics,
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
              className="mb-6 p-4 rounded-xl bg-error-container/40 border border-error/50 flex-row items-center justify-between"
              testID="login-api-error-banner"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <Feather name="alert-circle" size={20} color="#FFB4AB" />
                <Text
                  className="text-error text-xs font-medium ml-3 flex-1"
                  testID="login-api-error-text"
                >
                  {apiError}
                </Text>
              </View>
              <TouchableOpacity
                onPress={clearErrors}
                testID="login-api-error-dismiss"
                accessibilityLabel="Cerrar error"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={18} color="#FFB4AB" />
              </TouchableOpacity>
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

            {/* Remember Me Option */}
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              disabled={isSubmitting}
              className="flex-row items-center mb-6 py-1"
              testID="login-remember-me-toggle"
              activeOpacity={0.7}
            >
              <View
                className={`w-5 h-5 rounded-md border items-center justify-center mr-3 ${
                  rememberMe
                    ? "bg-court-orange border-court-orange"
                    : "bg-surface-container-high border-slate-border"
                }`}
              >
                {rememberMe && <Feather name="check" size={14} color="#ffffff" />}
              </View>
              <Text className="text-slate-300 text-sm font-medium">
                Recordar credenciales
              </Text>
            </TouchableOpacity>

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

            {/* Biometric Fast-Login Button */}
            {isBiometricAvailable ? (
              <TouchableOpacity
                onPress={() => {
                  if (!isSubmitting) {
                    loginWithBiometrics();
                  }
                }}
                disabled={isSubmitting}
                className="w-full mt-3 py-3.5 rounded-xl border border-court-orange/40 bg-surface-container-high active:bg-slate-dark flex-row items-center justify-center"
                testID="login-biometric-button"
              >
                <Feather name="shield" size={18} color="#F97316" />
                <Text className="text-court-orange font-bold text-sm ml-2">
                  Iniciar con biometría
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

