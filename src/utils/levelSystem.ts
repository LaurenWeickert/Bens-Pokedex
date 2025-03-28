// Level thresholds define the minimum points required for each level
export const LEVEL_THRESHOLDS: number[] = [];

// Generate 100 level thresholds with progressive scaling
// Level 1: 0 points
// Level 2: 20 points
// Each subsequent level requires more points than the previous
for (let i = 0; i < 100; i++) {
  if (i === 0) {
    LEVEL_THRESHOLDS.push(0); // Level 1 starts at 0 points
  } else if (i === 1) {
    LEVEL_THRESHOLDS.push(20); // Level 2 requires 20 points
  } else {
    // Progressive scaling formula:
    // For early levels (2-20): Linear growth
    // For mid levels (21-50): Moderate growth
    // For high levels (51-100): Steeper growth
    const previousThreshold = LEVEL_THRESHOLDS[i - 1];
    let increment;
    
    if (i < 20) {
      increment = 20 + (i * 2); // Linear growth: 20, 22, 24, 26...
    } else if (i < 50) {
      increment = 60 + (i * 3); // Moderate growth
    } else {
      increment = 150 + (i * 5); // Steeper growth for higher levels
    }
    
    LEVEL_THRESHOLDS.push(previousThreshold + increment);
  }
}

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

// Points per correct quiz answer
export const POINTS_PER_CORRECT_ANSWER = 5;

// Level titles - now with 100 levels
export const LEVEL_TITLES: string[] = [];

// Generate level titles
const generateLevelTitles = () => {
  const prefixes = [
    "Novice", "Beginner", "Enthusiast", "Collector", "Researcher", 
    "Ace", "Expert", "Master", "Champion", "Elite"
  ];
  
  const ranks = [
    "", "I", "II", "III", "IV", "V", 
    "VI", "VII", "VIII", "IX", "X"
  ];
  
  // Generate 100 level titles
  for (let i = 0; i < 100; i++) {
    const prefixIndex = Math.floor(i / 10);
    const rankIndex = i % 10;
    
    const prefix = prefixes[Math.min(prefixIndex, prefixes.length - 1)];
    const rank = ranks[rankIndex];
    
    if (i === 99) {
      // Special title for max level
      LEVEL_TITLES.push("Pokémon Master");
    } else {
      LEVEL_TITLES.push(`Pokémon ${prefix} ${rank}`.trim());
    }
  }
};

// Initialize level titles
generateLevelTitles();

// Get level title
export const getLevelTitle = (level: number): string => {
  const safeLevel = Math.min(Math.max(1, level), MAX_LEVEL);
  return LEVEL_TITLES[safeLevel - 1];
};
