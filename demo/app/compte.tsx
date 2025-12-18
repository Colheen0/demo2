import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import UserInfo from "@/components/infos"; // Assure-toi que le chemin est bon
import { api } from "../api";

// Types de réponse API
interface UserApiResponse {
  user?: { name: string; login: string };
}

export default function Compte() {
  const [user, setUser] = useState<{ name: string; login: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // On récupère les infos via la route sécurisée /me
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

  // Pendant le chargement, on affiche un petit rond qui tourne
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // Si pas d'utilisateur trouvé (ou erreur), on ne retourne rien ou un message
  if (!user) return null;

  // On affiche le composant Info en lui passant les données
  return (
    <UserInfo
      name={user.name}
      login={user.login}
    />
  );
}