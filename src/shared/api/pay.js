
import api from "./api";
import axios from 'axios';
import { useAuthStore } from "../stores/authStore";

export const payApi = {
  getAll: async () => {
    const response = await api.get("/payment/transactions");
    return response.data;
  },
   getOne: async (id) => {
    const response = await api.get(`/payment/transactions/${id}`);
    return response.data;
  },

 
};
