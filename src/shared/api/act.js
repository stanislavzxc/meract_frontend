import api from "./api";
import axios from 'axios';
import { useAuthStore } from "../stores/authStore";
export const actApi = {
  getAllActs: async () => {
    const response = await api.get("/act/get-acts");
    return response.data;
  },
 getAct: async (id) => {
    const response = await api.get(`/act/find-by-id/${id}`);
    return response.data;
  },
// В файле shared/api/act.js
// В файле shared/api/act.js
createAct: async (name, desc, photoFile) => {
  const formData = new FormData();
  
  // Только поля из документации
  formData.append('title', String(name || '')); 
  formData.append('description', String(desc || ''));
  formData.append('sequelId', '1'); 
  formData.append('teams', JSON.stringify([])); 
  
  // Фото
  if (photoFile instanceof File) {
    formData.append('photo', photoFile);
  }

  const response = await api.post("/act/create-act", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
}



};
