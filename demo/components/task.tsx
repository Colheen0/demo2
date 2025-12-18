import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TaskItemProps {
  id?: string;
  name: string;
  completer?: boolean;
  onToggle?: (completer: boolean) => void;
  onUpdate?: (newName: string) => void;
  onDelete?: () => void;
}

export default function TaskItem({ 
  id, 
  name, 
  completer = false, 
  onToggle, 
  onUpdate,
  onDelete 
}: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(completer);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleToggle = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    onToggle?.(newState);
  };

  const handleSaveEdit = () => {
    if (editedName.trim() !== "") {
      onUpdate?.(editedName.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Nom de la tâche"
            autoFocus={true}
          />
        ) : (
          <TouchableOpacity 
            style={styles.bubble}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
              {name}
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.checkbox,
                isCompleted && styles.checkboxCompleted
              ]}
              onPress={handleToggle}
              activeOpacity={0.7}
            >
              {isCompleted && (
                <Ionicons name="checkmark" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleSaveEdit}
            >
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCancelEdit}
            >
              <Ionicons name="close-circle" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!isEditing && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={16} color="#e74c3c" />
          <Text style={styles.deleteText}>Supprimer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  container: {
    marginBottom: 6,
  },
  bubble: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#e0e6ed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
    flex: 1,
  },
  titleCompleted: {
    color: "#95a5a6",
    textDecorationLine: "line-through",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#3498db",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  checkboxCompleted: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  editInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
    marginBottom: 8,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    padding: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fadbd8",
    gap: 4,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e74c3c",
  },
});
