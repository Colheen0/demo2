import React, { useEffect, useState } from "react";
import UserInfo from "@/components/infos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";

// Types de réponses API
interface UserApiResponse {
  user?: { name: string; login: string };
}


export default function Compte() {
  const [user, setUser] = useState<{ name: string; login: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;
      // Récupérer l'utilisateur
      const resUser = await api.post("/user/get", { _id: userId });
      const userData = resUser.data as UserApiResponse;
      if (resUser.ok && userData.user) {
        setUser({ name: userData.user.name, login: userData.user.login });
      }
    };
    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <UserInfo
      name={user.name}
      login={user.login}
    />
  );
}