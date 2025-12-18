import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ListItem from "@/components/lists";
import { api } from "../api";
import { useRouter } from "expo-router";

interface List {
  id: string;
  name: string;
}

export default function HallLists() {
  const [lists, setLists] = useState<List[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await api.get("/list/my-lists"); 
      const data = response.data as { lists?: any[] };
      
      if (response.ok && data.lists) {
        setLists(data.lists.map(l => ({ id: l._id, name: l.name })));
      } else {
        console.log("Erreur API:", response.data);
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible de charger les listes", e as any);
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      const response = await api.post("/list/delete_list", { _id: id });
      
      if (response.ok) {
        setLists(lists.filter(list => list.id !== id));
      } else {
        Alert.alert("Erreur", "Suppression non autorisée");
      }
    } catch {
      Alert.alert("Erreur", "Suppression impossible");
    }
  };

  // --- NOUVELLE FONCTION POUR MODIFIER ---
  const handleUpdateList = async (id: string, newName: string) => {
    try {
      const response = await api.patch("/list/update_list", { 
        _id: id, 
        new_name: newName 
      });
      
      const data = response.data as { updatedList?: any };

      if (response.ok && data.updatedList) {
        // Mise à jour locale de la liste pour un affichage instantané
        setLists(lists.map(list => 
          list.id === id ? { ...list, name: data.updatedList.name } : list
        ));
      }
    } catch {
      Alert.alert("Erreur", "Mise à jour impossible");
    }
  };

  const handleAddList = async () => {
    try {
      const response = await api.post("/list/ajout_list", { name: "Nouvelle liste" });
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
                // Suppression
                onDelete={() => handleDeleteList(list.id)}
                // Modification (Appui Long géré dans ListItem)
                onUpdate={(newName) => handleUpdateList(list.id, newName)}
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
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollView: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#2c3e50", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#7f8c8d" },
  content: { paddingTop: 8, paddingBottom: 100 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 80 },
  emptyText: { fontSize: 16, fontWeight: "600", color: "#2c3e50", marginTop: 16 },
  emptySubtext: { fontSize: 14, color: "#95a5a6", marginTop: 8 },
  fab: { position: "absolute", bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: "#27ae60", justifyContent: "center", alignItems: "center", elevation: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 },
  accountIcon: { marginLeft: 8 },
});