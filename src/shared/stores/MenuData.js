// import { create } from 'zustand';
// import { profileApi } from '../api/profile';
// export const useUserStore = create((set, get) => ({
//     username: 'loading',
//     fullname: 'loading',
//     userimg: null,
//     isLoaded: false,

//     fetchProfile: async () => {
//         if (get().isLoaded) return; 

//         try {
//             const guildData = await profileApi.getProfile();
//             if (guildData) {
//                 set({
//                     username: guildData.login,
//                     fullname: guildData.fullName,
//                     userimg: guildData.avatarUrl,
//                     isLoaded: true
//                 });
//             }
//         } catch (error) {
//             console.error("Ошибка при загрузке профиля:", error);
//             set({ username: 'Error', fullname: 'Error', isLoaded: false });
//         }
//     },

//     clearUser: () => set({ 
//         username: 'loading', 
//         fullname: 'loading', 
//         userimg: null, 
//         isLoaded: false 
//     })
// }));
