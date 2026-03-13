import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  actType: 1,
  heroMethod: 1,
  navMethod: 1,
  selectedLang: "Russian",
  selectedDistance: "1km",
  selectedStatus: "active",
  // НОВЫЕ ПОЛЯ
  minRating: 1.0,
  maxRating: 10.0,

  setActType: (val) => set({ actType: val }),
  setHeroMethod: (val) => set({ heroMethod: val }),
  setNavMethod: (val) => set({ navMethod: val }),
  setSelectedLang: (val) => set({ selectedLang: val }),
  setSelectedDistance: (val) => set({ selectedDistance: val }),
  setSelectedStatus: (val) => set({ selectedStatus: val }),
  // НОВЫЕ ЭКШЕНЫ
  setMinRating: (val) => set({ minRating: val }),
  setMaxRating: (val) => set({ maxRating: val }),
  
  resetFilters: () => set({ 
    actType: 1, 
    heroMethod: 1, 
    navMethod: 1, 
    selectedLang: "English", 
    selectedDistance: "1km",
    selectedStatus: "active",
    minRating: 0, 
    maxRating: 10.0 
  }),
}));
