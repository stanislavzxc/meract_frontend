import api from "./api";

export const rankApi = {
  getHeroes: async () => {
    const response = await api.get("/rank/leaderboard/heroes");
    return response.data;
  },
   getInitiators: async () => {
    const response = await api.get("/rank/leaderboard/initiators");
    return response.data;
  },
   getNavigators: async () => {
    const response = await api.get("/rank/leaderboard/navigators");
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/user/get-user/${userId}`);
    return response.data;
  },
};
