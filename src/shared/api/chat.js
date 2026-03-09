import api from "./api";
import axios from 'axios';
import { useAuthStore } from "../stores/authStore";

export const chatApi = {
  getAll: async () => {
    const response = await api.get("/chat");
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.post(`/chat/direct/${id}`);
    return response.data;
  },
   createChat: async (id) => {
    id = 2;
    const response = await api.post(`/chat/direct/${id}`);
    return response.data;
  },
    getMessages: async (id) => {
    const response = await api.get(`/chat/${id}/messages`);
    return response.data;
  },
 sendMessage: async (id, text, replyToId, forwardedFromId, file) => {
    const token = useAuthStore.getState().getToken();
    const formData = new FormData();
    

    if (text) formData.append('text', text);
    
   
    if (Number.isInteger(replyToId)) formData.append('replyToId', replyToId);
    if (Number.isInteger(forwardedFromId)) formData.append('forwardedFromId', forwardedFromId);
    
    
    if (file && file instanceof File) {
        formData.append('file', file);
    }

    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/${id}/messages`, 
        formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data', 
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        }
    );

    return response.data;
},
deleteMessage: async (messageId) => {
    const response = await api.delete(`/chat/messages/${messageId}`);
    return response.data;
  },
  deleteChat: async (chatId) => {
    const response = await api.delete(`/chat/${chatId}`);
    return response.data;
  },
   muteChat: async (chatId) => {
    const response = await api.patch(`/chat/${chatId}/mute`);
    return response.data;
  },
  
};
