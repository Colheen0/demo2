import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ListItemProps {
  id?: string;
  name: string;
  onPress?: () => void;
  onDelete?: () => void;
  onUpdate?: (newName: string) => void; // Ajout de la prop onUpdate
}

export default function ListItem({ id, name, onPress, onDelete, onUpdate }: ListItemProps) {
  // États pour gérer l'édition (comme dans Task.tsx)
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  // Sauvegarder les modifications
  const handleSaveEdit = () => {
    if (editedName.trim() !== "") {
      onUpdate?.(editedName.trim());
      setIsEditing(false);
    }
  };

  // Annuler les modifications
  const handleCancelEdit = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* Condition : Mode Édition OU Mode Affichage */}
      {isEditing ? (
        <View style={styles.container}>
          <TextInput
            style={styles.editInput}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Nom de la liste"
            autoFocus={true}
          />
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleSaveEdit}
            >
              <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleCancelEdit}
            >
              <Ionicons name="close-circle" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.container}
          onPress={onPress} // Clic simple = Navigation
          onLongPress={() => setIsEditing(true)} // Appui long = Édition
          activeOpacity={0.7}
        >
          <View style={styles.bubble}>
            <View style={styles.content}>
              <Ionicons name="list" size={24} color="#fff" style={styles.icon} />
              <Text style={styles.title}>{name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.chevron} />
          </View>
        </TouchableOpacity>
      )}
      
      {/* On cache le bouton supprimer pendant l'édition pour garder l'interface propre */}
      {!isEditing && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={18} color="#e74c3c" />
          <Text style={styles.deleteText}>Supprimer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  container: {
    marginBottom: 8,
  },
  bubble: {
    backgroundColor: "#3498db",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  chevron: {
    marginLeft: 12,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fadbd8",
    gap: 6,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e74c3c",
  },
  // --- Nouveaux styles pour l'édition (copiés de Task.tsx) ---
  editInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 14, // Un peu plus grand pour matcher la bulle
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginBottom: 8,
  },
  actionButton: {
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2, // Petit effet d'ombre pour les boutons
  },
});