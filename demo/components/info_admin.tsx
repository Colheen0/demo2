import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AdminBubbleProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}

function AdminBubble({ icon, label, value, onSave }: AdminBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    if (editedValue.trim() !== "") {
      onSave(editedValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={styles.bubbleEdit}>
        <TextInput
          style={styles.input}
          value={editedValue}
          onChangeText={setEditedValue}
          placeholder={`Modifier ${label}`}
          autoFocus
          onSubmitEditing={handleSave}
        />
        <View style={styles.editActions}>
          <TouchableOpacity onPress={handleSave} style={styles.actionBtn}>
            <Ionicons name="checkmark-circle" size={28} color="#27ae60" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={styles.actionBtn}>
            <Ionicons name="close-circle" size={28} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.bubble}
        activeOpacity={0.8}
        onLongPress={() => setIsEditing(true)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#3498db" />
        </View>
        <Text style={styles.bubbleText}>{value}</Text>
        <Ionicons name="pencil" size={16} color="#bdc3c7" />
      </TouchableOpacity>
    </View>
  );
}

// --- COMPOSANT PRINCIPAL ---

interface InfoAdminProps {
  name: string;
  email: string;
  onUpdateName: (newName: string) => void;
  onUpdateEmail: (newEmail: string) => void;
  onDeleteUser: () => void;
}

export default function InfoAdmin({ 
  name, 
  email, 
  onUpdateName, 
  onUpdateEmail, 
  onDeleteUser 
}: InfoAdminProps) {

  return (
    <View style={styles.container}>
      
      {/* En-tête de la carte utilisateur */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#fff" />
        </View>
        
        {/* J'ai regroupé le titre et le sous-titre dans une View pour qu'ils soient l'un sous l'autre */}
        <View>
          <Text style={styles.headerTitle}>Gestion Utilisateur</Text>
          <Text style={styles.headerSubtitle}>Maintenir une info pour modifier</Text>
        </View>
      </View>

      {/* Liste des champs modifiables */}
      <View style={styles.fieldsContainer}>
        <AdminBubble 
          icon="person" 
          label="Nom de l'utilisateur"
          value={name} 
          onSave={onUpdateName} 
        />

        <AdminBubble 
          icon="mail" 
          label="Email de connexion"
          value={email} 
          onSave={onUpdateEmail} 
        />
      </View>

      {/* Bouton de suppression */}
      <TouchableOpacity style={styles.deleteButton} onPress={onDeleteUser}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.deleteText}>Supprimer cet utilisateur</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
    paddingBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 2, // Petit espace entre le titre et le sous-titre
  },
  fieldsContainer: {
    marginBottom: 20,
    gap: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7f8c8d",
    marginBottom: 6,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  bubbleText: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
  },
  bubbleEdit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: "#3498db",
    marginTop: 22,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    padding: 4,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  deleteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});