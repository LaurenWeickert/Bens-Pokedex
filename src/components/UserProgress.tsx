import React, { useEffect } from 'react';
import { Trophy, Flame, Star, Medal } from 'lucide-react';
import { usePokemonStore } from '../store/pokemonStore';
import { motion } from 'framer-motion';

export const UserProgress: React.FC = () => {
  const {
    userPoints,
    dailyStreak,
    discoveredPokemon,
    badges,
    updateDailyStreak,
  } = usePokemonStore();

  useEffect(() => {
    updateDailyStreak();
  }, []);

  const progressPercentage = (discoveredPokemon.length / 151) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-400" />
          <div>
            <h3 className="font-semibold">Points</h3>
            <p className="text-2xl font-bold text-yellow-500">{userPoints}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-500" />
          <div>
            <h3 className="font-semibold">Daily Streak</h3>
            <p className="text-2xl font-bold text-orange-500">{dailyStreak} days</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-blue-500" />
          <div>
            <h3 className="font-semibold">Discovered</h3>
            <p className="text-2xl font-bold text-blue-500">
              {discoveredPokemon.length}/151
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Medal className="w-8 h-8 text-purple-500" />
          <div>
            <h3 className="font-semibold">Badges</h3>
            <p className="text-2xl font-bold text-purple-500">{badges.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {badges.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Earned Badges</h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};