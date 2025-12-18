import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { api } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginResponse = {
  ok: boolean;
  token?: string;
  message?: string;
  data?: {
    _id: string;
  };
};

// L'ID de l'administrateur
const ADMIN_ID = "6941549dda1971a5fab7a3f6";

export default function FormIn() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Vérification automatique du token au démarrage
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("userId");

        if (token && storedUserId) {
          // CONDITION ADMIN AU DÉMARRAGE
          if (storedUserId === ADMIN_ID) {
            router.replace('/admin');
          } else {
            router.replace('/hall_lsits');
          }
        } else {
          setIsCheckingAuth(false);
        }
      } catch (e) {
        setIsCheckingAuth(false);
      }
    };
    checkToken();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post("/user/signin", { login, password });
      const data = response.data as LoginResponse;
      
      if (response.ok && data?.ok && data.token && data.data && data.data._id) {
        const userId = data.data._id;

        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("token", data.token);
        
        // CONDITION ADMIN À LA CONNEXION
        if (userId === ADMIN_ID) {
            router.replace('/admin'); // Redirection vers admin.tsx
        } else {
            router.replace('/hall_lsits');
        }
        
      } else {
        alert(data?.message || "Identifiants invalides");
      }
    } catch {
      alert("Erreur réseau ou serveur");
    }
    setLoading(false);
  };

  // 2. Écran d'attente
  if (isCheckingAuth) {
    return <View style={{ flex: 1, backgroundColor: "#f8f9fa" }} />;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre email"
              placeholderTextColor="#999"
              value={login}
              onChangeText={setLogin}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}> Pas de compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.link}>inscription</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 20, paddingVertical: 40 },
  header: { marginBottom: 40, alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#7f8c8d" },
  formContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 24, elevation: 5 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#2c3e50", marginBottom: 8 },
  input: { borderWidth: 1.5, borderColor: "#e0e6ed", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#2c3e50", backgroundColor: "#f8f9fa" },
  button: { backgroundColor: "#3498db", borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 24 },
  buttonDisabled: { backgroundColor: "#bdc3c7" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
  footerText: { color: "#7f8c8d", fontSize: 14 },
  link: { color: "#3498db", fontSize: 14, fontWeight: "600" },
});