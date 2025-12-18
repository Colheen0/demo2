import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import UserInfo from "@/components/infos"; 
import { api } from "../api";

// Types de réponse API
interface UserApiResponse {
  user?: { name: string; login: string };
}

export default function Compte() {
  const [user, setUser] = useState<{ name: string; login: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me");
        const data = response.data as UserApiResponse;

        if (response.ok && data.user) {
          setUser({ name: data.user.name, login: data.user.login });
        }
      } catch (e) {
        console.log("Erreur chargement profil", e as any);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color="#3498db" />
        </TouchableOpacity>
      </View>

      <UserInfo
        name={user.name}
        login={user.login}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 50, 
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#f8f9fa", 
    zIndex: 1, 
  },
  backButton: {
    alignSelf: 'flex-start', 
    padding: 4,
  }
});