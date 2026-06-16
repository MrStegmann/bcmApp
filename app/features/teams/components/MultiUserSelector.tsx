import React, { useMemo } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { User } from "../../users/types";
import { multiUserSelectorStyles as styles } from "../css/styles";

interface MultiUserSelectorProps {
  label: string;
  users: User[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  getUserLabel?: (user: User) => string;
  errorText?: string;
}

const MultiUserSelector: React.FC<MultiUserSelectorProps> = ({
  label,
  users,
  selectedIds,
  onChange,
  searchValue,
  onSearchChange,
  placeholder,
  getUserLabel = (user) => user.name,
  errorText,
}) => {
  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [searchValue, users]);

  const removeId = (id: string) => {
    onChange(selectedIds.filter((item) => item !== id));
  };

  const toggleId = (id: string) => {
    if (selectedIds.includes(id)) {
      removeId(id);
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        onChangeText={onSearchChange}
        placeholder={placeholder}
        style={styles.input}
        value={searchValue}
      />
      <View style={styles.selectedItemsContainer}>
        {selectedIds.map((id) => {
          const user = users.find((u) => u.id === id);
          return (
            <Pressable
              key={id}
              onPress={() => removeId(id)}
              style={[styles.roleOption, styles.roleOptionSelected]}
            >
              <Text
                style={[styles.roleOptionText, styles.roleOptionTextSelected]}
              >
                {user ? getUserLabel(user) : id} x
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.roleSelectContainer}>
        {filteredUsers.map((user) => {
          const selected = selectedIds.includes(user.id);
          return (
            <Pressable
              key={user.id}
              onPress={() => toggleId(user.id)}
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
                {getUserLabel(user)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {filteredUsers.length === 0 ? (
        <Text style={styles.helperText}>
          No hay resultados para la búsqueda actual.
        </Text>
      ) : null}
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
};

export default MultiUserSelector;
