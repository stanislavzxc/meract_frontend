import api from "./api";
import axios from 'axios';
import { useAuthStore } from "../stores/authStore";

export const profileApi = {
  getProfile: async () => {
    const response = await api.get("/user/me");
    return response.data;
  },
   updateFullname: async (newfullname) => {
    const data = {
        fullName: newfullname,
    }
    const response = await api.post("/user/change-full-name", data);
    return response.data;
  },
   updateUsername: async (newusername) => {
    const data = {
        login: newusername,
    }
    const response = await api.post("/user/change-username", data);
    return response.data;
  },
   getTimezone: async () => {
    const response = await api.get("/user/time-zones");
    return response.data;
  },
  updateTimezone: async (zone) => {
    const response = await api.post(`/user/select-time-zone?zone=${zone}`);
    return response.data;
  },
   getNotice: async () => {
    const response = await api.get("/user/notification-settings");
    return response.data;
  },
  updateNotice: async (newdata) => {
    const data = {
        notifyAll: newdata.all,
        notifyActProgress: newdata.progress,
        notifyGuildInvites: newdata.guild,
        notifyChatMentions: newdata.mentions,
        notifyActStatusRealtime: newdata.updates
    }
    const response = await api.post("/user/notification-settings", data);
    return response.data;
  },

  deletePhoto: async () => {
    const response = await api.delete("/user/delete-avatar");
    return response.data;
  },
  

updateInfo: async (name, desc, avatarFile, coverFile, id) => {
    const token = useAuthStore.getState().getToken();
    const formData = new FormData();
    
    formData.append('name', name);
    formData.append('description', desc);

    // Отправляем толькоесли это действительно файл (объект File)
    // Если это строка (старый URL), серверу обновлять файл не нужно
    if (avatarFile instanceof File) {
        formData.append('photo', avatarFile);
    }
    if (coverFile instanceof File) {
        formData.append('cover', coverFile);
    }

    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/guild/id=${id}`, 
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



  
  getLangs: async () => {
    const response = await api.get(`/user/communication-languages`);
    return response.data;
  },
  getSelectedlang: async () => {
    const response = await api.get(`/user/my-languages`);
    return response.data;
  },
  updateLang: async (languages) => {
    const response = await api.post(`/user/update-languages`, languages);
    return response.data;
  },
  setCity: async () => {
    const response = await api.post(`user/set-city`);
    return response.data;
  }, 
  setCountry: async () => {
    const response = await api.post(`/user/set-country`);
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/user/get-user/${id}`);
    return response.data;
  },
  
};
