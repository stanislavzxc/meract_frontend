import api from "./api";

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
  sendMessage: async (id) => {
    const response = await api.get(`/chat/${id}/messages`);
    return response.data;
  },
};
