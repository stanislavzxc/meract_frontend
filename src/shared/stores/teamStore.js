// stores/teamStore.js
import { create } from 'zustand';

const useTeamStore = create((set) => ({
  // Состояния для участников
  heroes: [],
  navigators: [],
  agents: [],
  teamName: '',
  
  // Состояния для чекбоксов
  isHeroRecruitmentOpen: false,
  isNavigatorRecruitmentOpen: false,
  
  // Данные для полей ввода (hero)
  heroVotingStartTime: '10:30',
  heroVotingStartDate: '2026-02-13',
  heroVotingHours: 24,
  
  // Данные для полей ввода (navigator)
  navigatorVotingStartTime: '10:30',
  navigatorVotingStartDate: '2026-02-13',
  navigatorVotingHours: 24,

  // Actions для team
  setTeamName: (name) => set({ teamName: name }),
  
  // Actions для участников
  addHero: (hero) => set((state) => {
    // Проверяем, нет ли уже такого героя
    const exists = state.heroes.some(h => h.id === hero.id);
    if (exists) return state;
    return { heroes: [...state.heroes, hero] };
  }),
  
  addNavigator: (navigator) => set((state) => {
    const exists = state.navigators.some(n => n.id === navigator.id);
    if (exists) return state;
    return { navigators: [...state.navigators, navigator] };
  }),
  
  addAgent: (agent) => set((state) => {
    const exists = state.agents.some(a => a.id === agent.id);
    if (exists) return state;
    return { agents: [...state.agents, agent] };
  }),
  
  removeMember: (type, id) => set((state) => {
    switch(type) {
      case 'hero': return { heroes: state.heroes.filter(m => m.id !== id) };
      case 'navigator': return { navigators: state.navigators.filter(m => m.id !== id) };
      case 'agent': return { agents: state.agents.filter(m => m.id !== id) };
      default: return state;
    }
  }),
  
  // Actions для чекбоксов
  setHeroRecruitment: (value) => set({ isHeroRecruitmentOpen: value }),
  setNavigatorRecruitment: (value) => set({ isNavigatorRecruitmentOpen: value }),
  
  // Actions для полей ввода hero
  setHeroVotingTime: (time) => set({ heroVotingStartTime: time }),
  setHeroVotingDate: (date) => set({ heroVotingStartDate: date }),
  setHeroVotingHours: (hours) => set({ heroVotingHours: hours }),
  
  // Actions для полей ввода navigator
  setNavigatorVotingTime: (time) => set({ navigatorVotingStartTime: time }),
  setNavigatorVotingDate: (date) => set({ navigatorVotingStartDate: date }),
  setNavigatorVotingHours: (hours) => set({ navigatorVotingHours: hours }),
  
  // Очистка всех данных
  resetTeam: () => set({
    heroes: [],
    navigators: [],
    agents: [],
    teamName: '',
    isHeroRecruitmentOpen: false,
    isNavigatorRecruitmentOpen: false,
    heroVotingStartTime: '10:30',
    heroVotingStartDate: '2026-02-13',
    heroVotingHours: 24,
    navigatorVotingStartTime: '10:30',
    navigatorVotingStartDate: '2026-02-13',
    navigatorVotingHours: 24,
  }),
}));

export default useTeamStore;