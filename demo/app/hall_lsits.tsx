import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ListItem from "@/components/lists";
import { api } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface List {
  id: string;
  name: string;
}

export default function HallLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserIdAndLists = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        setUserId(id);
        fetchLists(id);
      }
    };
    fetchUserIdAndLists();
  }, []);

  const fetchLists = async (id: string) => {
    try {
      const response = await api.post("/list/list", { user: id });
      const data = response.data as { lists?: any[] };
      if (response.ok && data.lists) {
        setLists(data.lists.map(l => ({ id: l._id, name: l.name })));
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible de charger les listes");
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      await api.post("/list/delete_list", { _id: id });
      setLists(lists.filter(list => list.id !== id));
    } catch {
      Alert.alert("Erreur", "Suppression impossible");
    }
  };

  const handleAddList = async () => {
    try {
      const response = await api.post("/list/ajout_list", { name: "Nouvelle liste", user: userId });
      const data = response.data as { list?: any };
      if (response.ok && data.list) {
        setLists([...lists, { id: data.list._id, name: data.list.name }]);
      }
    } catch {
      Alert.alert("Erreur", "Ajout impossible");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => router.push('/compte')} style={styles.accountIcon}>
          <Ionicons name="person-circle-outline" size={32} color="#2c3e50" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Mes Listes</Text>
          <Text style={styles.subtitle}>{lists.length} liste(s)</Text>
        </View>

        <View style={styles.content}>
          {lists.length > 0 ? (
            lists.map((list) => (
              <ListItem
                key={list.id}
                id={list.id}
                name={list.name}
                onPress={() => {
                  router.push({ pathname: '/list', params: { id: list.id, name: list.name } });
                }}
                onDelete={() => handleDeleteList(list.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="list" size={64} color="#bdc3c7" />
              <Text style={styles.emptyText}>Aucune liste pour le moment</Text>
              <Text style={styles.emptySubtext}>Créez une liste pour commencer</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddList}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  content: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#95a5a6",
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  accountIcon: {
    marginLeft: 8,
  },
});