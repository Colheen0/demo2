import { create } from 'apisauce';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = 'http://172.20.10.3:3000';

export const api = create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- LE CODE À AJOUTER ---

// On crée un "Async Transform" : 
// À chaque fois que tu appelles api.get ou api.post, ce code s'exécute d'abord
api.addAsyncRequestTransform(async (request) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    // On s'assure que les headers existent, sinon on crée un objet vide
    request.headers = request.headers || {};
    
    // On ajoute le token
    request.headers["Authorization"] = `Bearer ${token}`;
  }
});