import React, { useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FaTrophy, FaFire, FaSearch, FaMedal, FaStar, FaBolt } from 'react-icons/fa';
import { usePokemonStore } from '../store/pokemonStore';
import { 
  calculateLevel, 
  progressToNextLevel, 
  pointsToNextLevel, 
  LEVEL_THRESHOLDS,
  getLevelTitle,
  MAX_LEVEL
} from '../utils/levelSystem';

interface PokemonStoreState {
  userPoints: number;
  dailyStreak: number;
  discoveredPokemon: number[];
  badges: string[];
  updateDailyStreak: () => void;
  theme: 'light' | 'dark';
}

export const UserProgress: React.FC = () => {
  const { 
    userPoints, 
    dailyStreak, 
    discoveredPokemon, 
    badges, 
    updateDailyStreak,
    theme
  } = usePokemonStore() as PokemonStoreState;

  const isDark = theme === 'dark';

  // Update daily streak when component mounts
  useEffect(() => {
    updateDailyStreak();
  }, [updateDailyStreak]);

  // Calculate level based on points using the new level system
  const level = calculateLevel(userPoints);
  const progress = progressToNextLevel(userPoints);
  const pointsNeeded = pointsToNextLevel(userPoints);
  const levelTitle = getLevelTitle(level);

  // Calculate overall progress towards max level (level 100)
  const overallProgressPercent = (level / MAX_LEVEL) * 100;

  return (
    <div className={`mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <Tab.Group>
        <Tab.List className={`flex space-x-1 rounded-xl p-1 ${isDark ? 'bg-gray-700' : 'bg-blue-100'} shadow-lg`}>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-bold leading-5 transition-all
              ${
                selected
                  ? `${isDark ? 'bg-blue-700 text-white shadow-md' : 'bg-white text-blue-700 shadow-md'} transform scale-105`
                  : `${isDark ? 'text-gray-300 hover:bg-gray-600' : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'}`
              }`
            }
          >
            <span className="flex items-center justify-center">
              <FaTrophy className="mr-2" />
              My Progress
            </span>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-bold leading-5 transition-all
              ${
                selected
                  ? `${isDark ? 'bg-blue-700 text-white shadow-md' : 'bg-white text-blue-700 shadow-md'} transform scale-105`
                  : `${isDark ? 'text-gray-300 hover:bg-gray-600' : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'}`
              }`
            }
          >
            <span className="flex items-center justify-center">
              <FaMedal className="mr-2" />
              Badges
            </span>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-3">
          <Tab.Panel className={`rounded-xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            {/* Level Display */}
            <div className={`mb-6 text-center ${isDark ? 'bg-indigo-900/50' : 'bg-blue-100'} rounded-xl p-4 shadow-inner`}>
              <div className="relative inline-block">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-indigo-700' : 'bg-blue-500'
                } text-white text-3xl font-extrabold shadow-lg border-4 ${
                  isDark ? 'border-indigo-500' : 'border-blue-300'
                }`}>
                  {level}
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md border-2 border-yellow-200 animate-pulse">
                  ⭐
                </div>
              </div>
              <h2 className={`mt-2 text-xl font-extrabold ${isDark ? 'text-indigo-300' : 'text-blue-700'}`}>
                {levelTitle}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Keep exploring to level up!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Points */}
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                isDark ? 'bg-gradient-to-br from-yellow-900 to-yellow-800' : 'bg-gradient-to-br from-yellow-100 to-yellow-200'
              } shadow-md hover:shadow-lg transition-shadow`}>
                <div className={`p-3 rounded-full ${
                  isDark ? 'bg-yellow-700' : 'bg-yellow-300'
                } shadow-inner`}>
                  <FaStar className={`w-6 h-6 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Points</h3>
                  <p className={`text-2xl font-extrabold ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>{userPoints}</p>
                </div>
              </div>

              {/* Badges */}
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                isDark ? 'bg-gradient-to-br from-purple-900 to-purple-800' : 'bg-gradient-to-br from-purple-100 to-purple-200'
              } shadow-md hover:shadow-lg transition-shadow`}>
                <div className={`p-3 rounded-full ${
                  isDark ? 'bg-purple-700' : 'bg-purple-300'
                } shadow-inner`}>
                  <FaMedal className={`w-6 h-6 ${isDark ? 'text-purple-300' : 'text-purple-700'}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Badges</h3>
                  <p className={`text-2xl font-extrabold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{badges.length}</p>
                </div>
              </div>

              {/* Daily Streak */}
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                isDark ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-gradient-to-br from-red-100 to-red-200'
              } shadow-md hover:shadow-lg transition-shadow`}>
                <div className={`p-3 rounded-full ${
                  isDark ? 'bg-red-700' : 'bg-red-300'
                } shadow-inner`}>
                  <FaBolt className={`w-6 h-6 ${isDark ? 'text-red-300' : 'text-red-700'}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Daily Streak</h3>
                  <p className={`text-2xl font-extrabold ${isDark ? 'text-red-300' : 'text-red-700'}`}>{dailyStreak}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-bold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  Level {level}
                </span>
                {level < LEVEL_THRESHOLDS.length && (
                  <span className={`text-sm font-bold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    Level {level + 1}
                  </span>
                )}
              </div>
              <div className={`w-full h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full shadow-inner overflow-hidden`}>
                <div
                  className={`h-4 rounded-full ${
                    isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  } relative`}
                  style={{ width: `${progress}%` }}
                >
                  {/* Add animated sparkles to the progress bar */}
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute top-0 h-full w-1 bg-white/30 animate-pulse"
                      style={{ 
                        left: `${i * 20}%`, 
                        animationDelay: `${i * 0.2}s`,
                        opacity: Math.random() * 0.7 + 0.3
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-1 text-center">
                {level < LEVEL_THRESHOLDS.length ? (
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {pointsNeeded} points to next level
                  </span>
                ) : (
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Maximum level reached!
                  </span>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>Level 1</span>
                <span className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>Level 100</span>
              </div>
              <div className={`w-full h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full shadow-inner overflow-hidden`}>
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 relative"
                  style={{ width: `${overallProgressPercent}%` }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="w-full h-full bg-white/20" 
                         style={{ 
                           backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                           backgroundSize: '200% 100%',
                           animation: 'shimmer 2s infinite linear'
                         }} />
                  </div>
                </div>
              </div>
              <div className="mt-1 text-center">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Level {level} of 100 ({Math.round(overallProgressPercent)}% complete)
                </span>
              </div>
            </div>

            {/* Daily Check-in */}
            <div className={`mt-6 p-4 rounded-xl ${
              isDark ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-100 to-indigo-100'
            } flex items-center justify-between shadow-lg border ${
              isDark ? 'border-blue-800' : 'border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  isDark ? 'bg-blue-700' : 'bg-blue-300'
                } shadow-inner`}>
                  <FaFire className={`w-6 h-6 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Daily Check-in</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Come back tomorrow for more points! <span className="text-lg">🎁</span>
                  </p>
                </div>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              } shadow-lg text-xl font-bold`}>
                ✓
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className={`rounded-xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            {badges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl ${
                      isDark 
                        ? `bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-700` 
                        : `bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200`
                    } flex flex-col items-center shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300`}
                  >
                    <div className={`p-4 rounded-full ${
                      isDark ? 'bg-purple-700' : 'bg-purple-300'
                    } mb-3 shadow-inner`}>
                      <FaMedal className={`w-8 h-8 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} />
                    </div>
                    <h3 className={`font-bold text-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{badge}</h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Earned Badge</p>
                  </div>
                ))
              }
              </div>
            ) : (
              <div className={`p-8 text-center rounded-xl ${
                isDark ? 'bg-indigo-900/30' : 'bg-indigo-50'
              } shadow-inner border ${
                isDark ? 'border-indigo-800' : 'border-indigo-100'
              }`}>
                <div className="inline-block p-6 rounded-full bg-gray-200/20 mb-4">
                  <FaMedal className={`w-12 h-12 ${isDark ? 'text-gray-500' : 'text-gray-400'} opacity-50`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  No badges earned yet!
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Complete quizzes and discover more Pokémon to earn awesome badges.
                </p>
                <button className={`mt-4 px-6 py-2 rounded-full font-bold text-white ${
                  isDark ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-400'
                } transition-colors shadow-md hover:shadow-lg`}>
                  Start a Quiz
                </button>
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};