import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateStreakPoints, MAX_STREAK_POINTS, calculateLevel } from '../utils/levelSystem';

interface PokemonStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  setSelectedTypes: (types: string[]) => void;
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
  // Track completed quizzes
  completedQuizzes: number[];
  markQuizCompleted: (pokemonId: number) => void;
  isQuizCompleted: (pokemonId: number) => boolean;
  // Level up animation
  showLevelUpAnimation: boolean;
  setShowLevelUpAnimation: (show: boolean) => void;
  previousLevel: number;
  // Theme preference
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const usePokemonStore = create<PokemonStore>(
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
      setSelectedTypes: (types: string[]) => set({ selectedTypes: types }),
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

          // Get current level before adding points
          const currentLevel = calculateLevel(state.userPoints);

          if (state.lastLoginDate === yesterday) {
            // Calculate streak points with the cap
            const streakPoints = calculateStreakPoints(state.dailyStreak);
            
            const newPoints = state.userPoints + streakPoints;
            const newLevel = calculateLevel(newPoints);
            
            return {
              dailyStreak: state.dailyStreak + 1,
              lastLoginDate: today,
              userPoints: newPoints,
              showLevelUpAnimation: newLevel > currentLevel,
              previousLevel: currentLevel
            };
          } else if (state.lastLoginDate !== today) {
            // First day or streak broken, award 5 points
            const newPoints = state.userPoints + 5;
            const newLevel = calculateLevel(newPoints);
            
            return {
              dailyStreak: 1,
              lastLoginDate: today,
              userPoints: newPoints,
              showLevelUpAnimation: newLevel > currentLevel,
              previousLevel: currentLevel
            };
          }
          return state;
        }),
      quizAnswers: {},
      setQuizAnswer: (questionId: string, correct: boolean) =>
        set((state) => ({
          quizAnswers: { ...state.quizAnswers, [questionId]: correct },
        })),
      // Track completed quizzes
      completedQuizzes: [],
      markQuizCompleted: (pokemonId: number) =>
        set((state) => ({
          completedQuizzes: state.completedQuizzes.includes(pokemonId)
            ? state.completedQuizzes
            : [...state.completedQuizzes, pokemonId],
        })),
      isQuizCompleted: (pokemonId: number) => {
        return get().completedQuizzes.includes(pokemonId);
      },
      // Level up animation
      showLevelUpAnimation: false,
      setShowLevelUpAnimation: (show: boolean) => 
        set({ showLevelUpAnimation: show }),
      previousLevel: 1,
      // Theme preference
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'pokemon-store',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    }
  )
);