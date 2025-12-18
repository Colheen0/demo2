import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserInfoProps {
  name: string;
  login: string;
}
export default function UserInfo({
  name, 
  login
}: UserInfoProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#3498db" />
        </View>
        <Text style={styles.headerTitle}>Informations du Compte</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="person-circle" size={20} color="#3498db" />
              <Text style={styles.label}>Nom Complet</Text>
            </View>
            <Text style={styles.value}>{name}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="mail" size={20} color="#3498db" />
              <Text style={styles.label}>Email</Text>
            </View>
            <Text style={[styles.value, styles.emailValue]}>{login}</Text>
          </View>
        </View>
      </View>

      {/* ... */}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={18} color="#e74c3c" />
          <Text style={styles.logoutButtonText}>Se Déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoGroup: {
    paddingVertical: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f8c8d",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2c3e50",
    flex: 1,
    textAlign: "right",
  },
  emailValue: {
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e6ed",
    marginVertical: 12,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statIconContainer2: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: "#e0e6ed",
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#fadbd8",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutButtonText: {
    color: "#e74c3c",
    fontSize: 14,
    fontWeight: "600",
  },
});
