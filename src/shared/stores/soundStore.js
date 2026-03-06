import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSoundStore = create(
  persist(
    (set, get) => ({
      soundStates: {},

      toggleSound: (id) => {
        const currentStates = get().soundStates;
        set({
          soundStates: {
            ...currentStates,
            [id]: !currentStates[id] 
          }
        });
      },

      isSoundEnabled: (id) => !!get().soundStates[id]
    }),
    {
      name: 'acts-sound-settings',
    }
  )
);
