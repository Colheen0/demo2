import { create } from 'apisauce';

const API_BASE_URL = 'http://172.20.10.3:3000';

export const api = create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
