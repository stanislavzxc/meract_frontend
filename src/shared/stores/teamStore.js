// stores/teamStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

const useTeamStore = create(
  persist(
    (set, get) => ({
      // Массив всех команд
      teams: [],
      
      // Текущая выбранная команда для редактирования
      currentTeamId: null,
      
      // Состояния для текущей команды (для обратной совместимости)
      heroes: [],
      navigators: [],
      agents: [],
      teamName: '',
      
      // Состояния для чекбоксов текущей команды
      isHeroRecruitmentOpen: false,
      isNavigatorRecruitmentOpen: false,
      
      // Данные для полей ввода текущей команды
      heroVotingStartTime: '10:30',
      heroVotingStartDate: '2026-02-13',
      heroVotingHours: 24,
      navigatorVotingStartTime: '10:30',
      navigatorVotingStartDate: '2026-02-13',
      navigatorVotingHours: 24,

      // Получить все команды
      getTeams: () => get().teams,

      // Получить команду по ID
      getTeamById: (teamId) => {
        return get().teams.find(team => team.id === teamId);
      },

      // Проверка на дубликат имени
      isTeamNameDuplicate: (name, excludeTeamId = null) => {
        if (!name || name.trim() === '') return false;
        return get().teams.some(team => 
          team.name.toLowerCase() === name.toLowerCase() && 
          team.id !== excludeTeamId
        );
      },

      // Создать новую команду
      createNewTeam: () => {
        const newTeamId = Date.now().toString();
        set({ 
          currentTeamId: newTeamId,
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
        });
        return newTeamId;
      },

      // Загрузить команду для редактирования
      loadTeamForEditing: (teamId) => {
        const team = get().teams.find(t => t.id === teamId);
        if (team) {
          set({
            currentTeamId: team.id,
            heroes: team.heroes || [],
            navigators: team.navigators || [],
            agents: team.agents || [],
            teamName: team.name || '',
            isHeroRecruitmentOpen: team.isHeroRecruitmentOpen || false,
            isNavigatorRecruitmentOpen: team.isNavigatorRecruitmentOpen || false,
            heroVotingStartTime: team.heroVotingStartTime || '10:30',
            heroVotingStartDate: team.heroVotingStartDate || '2026-02-13',
            heroVotingHours: team.heroVotingHours || 24,
            navigatorVotingStartTime: team.navigatorVotingStartTime || '10:30',
            navigatorVotingStartDate: team.navigatorVotingStartDate || '2026-02-13',
            navigatorVotingHours: team.navigatorVotingHours || 24,
          });
        }
      },

      // Сохранить текущую команду
      saveCurrentTeam: () => {
        const state = get();
        
        // Проверяем, что имя команды не пустое
        if (!state.teamName || state.teamName.trim() === '') {
          toast.error('Team name is required');
          return null;
        }

        // Проверяем на дубликат имени
        if (state.isTeamNameDuplicate(state.teamName, state.currentTeamId)) {
          toast.error('A team with this name already exists');
          return null;
        }

        const teamData = {
          id: state.currentTeamId || Date.now().toString(),
          name: state.teamName,
          heroes: [...state.heroes],
          navigators: [...state.navigators],
          agents: [...state.agents],
          isHeroRecruitmentOpen: state.isHeroRecruitmentOpen,
          isNavigatorRecruitmentOpen: state.isNavigatorRecruitmentOpen,
          heroVotingStartTime: state.heroVotingStartTime,
          heroVotingStartDate: state.heroVotingStartDate,
          heroVotingHours: state.heroVotingHours,
          navigatorVotingStartTime: state.navigatorVotingStartTime,
          navigatorVotingStartDate: state.navigatorVotingStartDate,
          navigatorVotingHours: state.navigatorVotingHours,
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          // Обновляем или добавляем команду
          const existingTeamIndex = state.teams.findIndex(t => t.id === teamData.id);
          let updatedTeams;
          
          if (existingTeamIndex >= 0) {
            // Обновляем существующую команду
            updatedTeams = [...state.teams];
            updatedTeams[existingTeamIndex] = teamData;
          } else {
            // Добавляем новую команду
            updatedTeams = [...state.teams, teamData];
          }

          return { teams: updatedTeams };
        });

        return teamData;
      },

      // Удалить команду
      deleteTeam: (teamId) => {
        set((state) => {
          // Если удаляем текущую команду, сбрасываем текущую
          if (state.currentTeamId === teamId) {
            state.currentTeamId = null;
          }
          return {
            teams: state.teams.filter(team => team.id !== teamId)
          };
        });
        toast.success('Team deleted successfully');
      },

      // Добавляем недостающую функцию setTeamData
      setTeamData: (data) => {
        set({
          teamName: data.name || '',
          heroes: data.heroes || [],
          navigators: data.navigators || [],
          agents: data.agents || [],
          isHeroRecruitmentOpen: data.isHeroRecruitmentOpen || false,
          isNavigatorRecruitmentOpen: data.isNavigatorRecruitmentOpen || false,
          heroVotingStartTime: data.heroVotingStartTime || '10:30',
          heroVotingStartDate: data.heroVotingStartDate || '2026-02-13',
          heroVotingHours: data.heroVotingHours || 24,
          navigatorVotingStartTime: data.navigatorVotingStartTime || '10:30',
          navigatorVotingStartDate: data.navigatorVotingStartDate || '2026-02-13',
          navigatorVotingHours: data.navigatorVotingHours || 24,
        });
      },

      // Actions для team
      setTeamName: (name) => set({ teamName: name }),
      
      // Actions для участников
      addHero: (hero) => set((state) => {
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
      
      // Очистка текущей команды
      resetCurrentTeam: () => set({
        currentTeamId: null,
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
    }),
    {
      name: 'team-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useTeamStore;