import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TaskItem from "@/components/task";
import { useLocalSearchParams } from "expo-router";
import { api } from "../api";

// Types de réponses API
interface TasksApiResponse {
  tasks?: any[];
}
interface TaskApiResponse {
  task?: any;
  updatedTask?: any;
}

export default function List() {
  const { id: listId, name: listName } = useLocalSearchParams<{ id: string; name: string }>();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!listId) return;
      const response = await api.post("/task/tasks_by_list", { listId });
      const data = response.data as TasksApiResponse;
      if (response.ok && data.tasks) {
        setTasks(data.tasks.map((t: any) => ({ id: t._id, name: t.name, completer: t.completer })));
      }
    };
    fetchTasks();
  }, [listId]);

  const handleToggleTask = async (id: string, completer: boolean) => {
    const response = await api.patch("/task/update_task", { _id: id, completer });
    const data = response.data as TaskApiResponse;
    if (response.ok && data.updatedTask) {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completer: data.updatedTask.completer } : task
      ));
    }
  };

  const handleUpdateTask = async (id: string, newName: string) => {
    const response = await api.patch("/task/update_task", { _id: id, new_name: newName });
    const data = response.data as TaskApiResponse;
    if (response.ok && data.updatedTask) {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, name: data.updatedTask.name } : task
      ));
    }
  };

  const handleAddTask = async () => {
    if (!listId) return;
    const response = await api.post("/task/ajout_task", { name: "Nouvelle tâche", listId });
    const data = response.data as TaskApiResponse;
    if (response.ok && data.task) {
      setTasks([...tasks, { id: data.task._id, name: data.task.name, completer: data.task.completer }]);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const response = await api.post("/task/delete_task", { _id: id });
    if (response.ok) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const completedCount = tasks.filter(t => t.completer).length;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#3498db" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{listName}</Text>
            <Text style={styles.subtitle}>
              {completedCount}/{tasks.length} tâche(s) complétée(s)
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.content}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                name={task.name}
                completer={task.completer}
                onToggle={(completer) => handleToggleTask(task.id, completer)}
                onUpdate={(newName) => handleUpdateTask(task.id, newName)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={64} color="#bdc3c7" />
              <Text style={styles.emptyText}>Aucune tâche pour le moment</Text>
              <Text style={styles.emptySubtext}>Créez une tâche pour commencer</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e6ed",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e6ed",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#27ae60",
    borderRadius: 3,
  },
  content: {
    paddingVertical: 16,
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
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
