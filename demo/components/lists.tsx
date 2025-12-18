import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ListItemProps {
  id?: string;
  name: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function ListItem({ id, name, onPress, onDelete }: ListItemProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={styles.container}
        onPress={onPress}
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
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Ionicons name="trash" size={18} color="#e74c3c" />
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
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
});
