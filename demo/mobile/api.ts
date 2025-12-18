import { create } from 'apisauce';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = 'http://172.20.10.3:3000';

export const api = create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.addAsyncRequestTransform(async (request) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    request.headers = request.headers || {};
    
    request.headers["Authorization"] = `Bearer ${token}`;
  }
});