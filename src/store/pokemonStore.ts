import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PokemonStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  // Gamification features
  discoveredPokemon: number[];
  addDiscoveredPokemon: (id: number) => void;
  userPoints: number;
  addPoints: (points: number) => void;
  badges: string[];
  addBadge: (badge: string) => void;
  dailyStreak: number;
  lastLoginDate: string;
  updateDailyStreak: () => void;
  quizAnswers: Record<string, boolean>;
  setQuizAnswer: (questionId: string, correct: boolean) => void;
}

export const usePokemonStore = create<PokemonStore>()(
  persist(
    (set, get) => ({
      searchTerm: '',
      setSearchTerm: (term: string) => set({ searchTerm: term }),
      selectedTypes: [],
      toggleType: (type: string) =>
        set((state) => ({
          selectedTypes: state.selectedTypes.includes(type)
            ? state.selectedTypes.filter((t) => t !== type)
            : [...state.selectedTypes, type],
        })),
      favorites: [],
      toggleFavorite: (id: number) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((fid) => fid !== id)
            : [...state.favorites, id],
        })),
      // Gamification state
      discoveredPokemon: [],
      addDiscoveredPokemon: (id: number) =>
        set((state) => {
          // Only add points if this Pokémon hasn't been discovered yet
          if (!state.discoveredPokemon.includes(id)) {
            return {
              discoveredPokemon: [...state.discoveredPokemon, id],
              userPoints: state.userPoints + 10, // Points for discovering new Pokémon
            };
          }
          return { discoveredPokemon: [...state.discoveredPokemon, id] };
        }),
      userPoints: 0,
      addPoints: (points: number) =>
        set((state) => ({
          userPoints: state.userPoints + points,
        })),
      badges: [],
      addBadge: (badge: string) =>
        set((state) => {
          // Only add the badge if it doesn't already exist
          if (!state.badges.includes(badge)) {
            return {
              badges: [...state.badges, badge],
            };
          }
          return state;
        }),
      dailyStreak: 0,
      lastLoginDate: '',
      updateDailyStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split('T')[0];

          if (state.lastLoginDate === yesterday) {
            return {
              dailyStreak: state.dailyStreak + 1,
              lastLoginDate: today,
              userPoints: state.userPoints + (state.dailyStreak + 1) * 5, // Bonus points for streak
            };
          } else if (state.lastLoginDate !== today) {
            return {
              dailyStreak: 1,
              lastLoginDate: today,
              userPoints: state.userPoints + 5,
            };
          }
          return state;
        }),
      quizAnswers: {},
      setQuizAnswer: (questionId: string, correct: boolean) =>
        set((state) => ({
          quizAnswers: { ...state.quizAnswers, [questionId]: correct },
          userPoints: correct ? state.userPoints + 20 : state.userPoints,
        })),
    }),
    {
      name: 'pokemon-store',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    }
  )
);