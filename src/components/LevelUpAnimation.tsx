import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePokemonStore } from '../store/pokemonStore';
import { getLevelTitle, calculateLevel } from '../utils/levelSystem';
import { FaStar } from 'react-icons/fa';

interface PokemonStoreState {
  showLevelUpAnimation: boolean;
  setShowLevelUpAnimation: (show: boolean) => void;
  previousLevel: number;
  userPoints: number;
  theme: 'light' | 'dark';
}

export const LevelUpAnimation: React.FC = () => {
  const { 
    showLevelUpAnimation, 
    setShowLevelUpAnimation, 
    previousLevel, 
    userPoints,
    theme
  } = usePokemonStore() as PokemonStoreState;
  
  const isDark = theme === 'dark';
  
  // Calculate the new level
  const newLevel = calculateLevel(userPoints);
  
  // Close the animation after 5 seconds
  useEffect(() => {
    if (showLevelUpAnimation) {
      const timer = setTimeout(() => {
        setShowLevelUpAnimation(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showLevelUpAnimation, setShowLevelUpAnimation]);
  
  return (
    <AnimatePresence>
      {showLevelUpAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowLevelUpAnimation(false)}
        >
          <motion.div
            initial={{ scale: 0.5, y: 100 }}
            animate={{ 
              scale: 1, 
              y: 0,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 15 
              } 
            }}
            exit={{ scale: 0.5, y: 100 }}
            className={`relative p-8 rounded-2xl shadow-2xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } max-w-md w-full mx-4 text-center overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated stars in background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 - 50 + "%", 
                    y: Math.random() * 100 + 100 + "%",
                    opacity: 0
                  }}
                  animate={{ 
                    y: Math.random() * -200 - 100 + "%",
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    transition: { 
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }
                  }}
                  className="absolute text-yellow-400"
                >
                  <FaStar size={Math.random() * 20 + 10} />
                </motion.div>
              ))}
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  transition: { delay: 0.3, duration: 0.5 }
                }}
                className="mx-auto mb-4 w-32 h-32 flex items-center justify-center"
              >
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-indigo-700 border-4 border-indigo-500' : 'bg-blue-500 border-4 border-blue-300'
                } text-white text-4xl font-extrabold shadow-lg`}>
                  {newLevel}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1.5, 1],
                      transition: { delay: 0.8, duration: 0.5 }
                    }}
                    className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md border-2 border-yellow-200"
                  >
                    ⭐
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.6 }
                }}
                className={`text-3xl font-extrabold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                Level Up!
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.8 }
                }}
                className={`text-lg font-medium mb-6 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <p>You've reached</p>
                <p className={`text-xl font-bold ${
                  isDark ? 'text-indigo-300' : 'text-blue-600'
                }`}>
                  {getLevelTitle(newLevel)}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { delay: 1 }
                }}
                className={`flex justify-center gap-2 mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <span>Level {previousLevel}</span>
                <span className={isDark ? 'text-indigo-400' : 'text-blue-500'}>→</span>
                <span className={isDark ? 'text-indigo-300 font-bold' : 'text-blue-600 font-bold'}>
                  Level {newLevel}
                </span>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 1.2 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLevelUpAnimation(false)}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isDark 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } transition-colors shadow-md`}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
