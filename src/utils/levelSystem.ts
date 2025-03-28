// Level thresholds define the minimum points required for each level
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1350,   // Level 7
  1750,   // Level 8
  2200,   // Level 9
  2700    // Level 10
];

// Maximum level in the game
export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

// Calculate level based on points
export const calculateLevel = (points: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Calculate points needed for next level
export const pointsToNextLevel = (points: number): number => {
  const currentLevel = calculateLevel(points);
  
  // If at max level, return 0
  if (currentLevel >= MAX_LEVEL) {
    return 0;
  }
  
  const nextLevelThreshold = LEVEL_THRESHOLDS[currentLevel];
  return nextLevelThreshold - points;
};

// Calculate progress percentage to next level
export const progressToNextLevel = (points: number): number => {
  const currentLevel = calculateLevel(points);
  
  // If at max level, return 100%
  if (currentLevel >= MAX_LEVEL) {
    return 100;
  }
  
  const currentLevelThreshold = LEVEL_THRESHOLDS[currentLevel - 1];
  const nextLevelThreshold = LEVEL_THRESHOLDS[currentLevel];
  const levelRange = nextLevelThreshold - currentLevelThreshold;
  const pointsIntoLevel = points - currentLevelThreshold;
  
  return Math.round((pointsIntoLevel / levelRange) * 100);
};

// Maximum points from a daily streak
export const MAX_STREAK_POINTS = 25;

// Calculate streak points with a cap
export const calculateStreakPoints = (streakDays: number): number => {
  return Math.min(MAX_STREAK_POINTS, (streakDays + 1) * 5);
};

// Level titles
export const LEVEL_TITLES = [
  "Pokémon Novice",       // Level 1
  "Pokémon Beginner",     // Level 2
  "Pokémon Enthusiast",   // Level 3
  "Pokémon Collector",    // Level 4
  "Pokémon Researcher",   // Level 5
  "Pokémon Ace Trainer",  // Level 6
  "Pokémon Expert",       // Level 7
  "Pokémon Master",       // Level 8
  "Pokémon Champion",     // Level 9
  "Pokémon Legend"        // Level 10
];

// Get level title
export const getLevelTitle = (level: number): string => {
  const safeLevel = Math.min(Math.max(1, level), MAX_LEVEL);
  return LEVEL_TITLES[safeLevel - 1];
};
