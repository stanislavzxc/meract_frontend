import api from "./api";
import axios from 'axios';
import { useAuthStore } from "../stores/authStore";

export const noticeApi = {
  getNotifications: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },
}