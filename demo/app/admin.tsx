import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";
import InfoAdmin from "@/components/info_admin";

// Types
interface User {
  _id: string;
  name: string;
  login: string;
}

// L'ID DE L'ADMIN (À protéger absolument)
const ADMIN_ID = "6941549dda1971a5fab7a3f6";

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/user/all_users");
      const data = response.data as { users?: User[] };

      if (response.ok && data.users) {
        setUsers(data.users);
      } else {
        Alert.alert("Erreur", "Impossible de récupérer les utilisateurs");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  const handleDeleteUser = async (id: string) => {
    
    // 1. Sécurité admin : on peut pas supprimer l'admin principal 
    if (id === ADMIN_ID) {
        Alert.alert(
            "Action Interdite", 
            "Impossible de supprimer le compte Administrateur principal !"
        );
        return;
    }

    // 2. Si ce n'est pas l'admin, on continue vers la confirmation normale
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cet utilisateur ? Cette action effacera aussi toutes ses tâches et listes.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await api.delete(`/user/delete_user/${id}`);
              
              if (response.ok) {
                setUsers(users.filter(u => u._id !== id));
                Alert.alert("Succès", "Utilisateur supprimé");
              } else {
                Alert.alert("Erreur", "Suppression impossible");
              }
            } catch {
              Alert.alert("Erreur", "Problème serveur");
            }
          }
        }
      ]
    );
  };

  const handleUpdateUser = async (id: string, field: "name" | "login", value: string) => {
    // Optionnel : Tu peux aussi empêcher de modifier le login de l'admin ici si tu veux
    if (id === ADMIN_ID && field === "login") {
         Alert.alert("Info", "Le login Admin ne peut pas être modifié ici par sécurité.");
         return;
    }

    try {
      const body = field === "name" ? { new_name: value } : { new_login: value };
      const response = await api.put(`/user/${id}`, body);

      if (response.ok) {
        setUsers(users.map(u => 
          u._id === id ? { ...u, [field]: value } : u
        ));
      } else {
        Alert.alert("Erreur", "Mise à jour refusée");
      }
    } catch {
      Alert.alert("Erreur", "Mise à jour impossible");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panneau Admin</Text>
          <Text style={styles.headerSubtitle}>{users.length} utilisateur(s) inscrit(s)</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {users.length === 0 ? (
          <Text style={styles.emptyText}>Aucun utilisateur trouvé.</Text>
        ) : (
          users.map((user) => (
            <InfoAdmin
              key={user._id}
              name={user.name}
              email={user.login}
              onUpdateName={(newName) => handleUpdateUser(user._id, "name", newName)}
              onUpdateEmail={(newEmail) => handleUpdateUser(user._id, "login", newEmail)}
              onDeleteUser={() => handleDeleteUser(user._id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e0e6ed", marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#2c3e50" },
  headerSubtitle: { fontSize: 14, color: "#7f8c8d" },
  logoutButton: { padding: 8, backgroundColor: "#fadbd8", borderRadius: 8 },
  scrollContent: { paddingBottom: 40 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#95a5a6", fontSize: 16 },
});