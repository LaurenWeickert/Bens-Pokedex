import React, { useState } from 'react';
import { Heart, Info } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { usePokemonStore } from '../store/pokemonStore';
import { motion } from 'framer-motion';

interface PokemonCardProps {
  pokemon: Pokemon;
}

// Define type colors with proper type
type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' 
  | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying' 
  | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon' 
  | 'dark' | 'steel' | 'fairy';

const typeColors: Record<PokemonType, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-700',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-600',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { toggleFavorite, favorites, addDiscoveredPokemon } = usePokemonStore();
  const isFavorite = favorites.includes(pokemon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  const handleQuizClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Quiz functionality would be implemented here
    addDiscoveredPokemon(pokemon.id);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowDetails(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setShowDetails(true);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${pokemon.name}`}
    >
      <div className="relative">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default || ''}
          alt={`${pokemon.name} artwork`}
          className="w-full h-48 object-contain bg-gray-100"
          loading="lazy"
        />
        <button
          className={`absolute top-2 right-2 p-1 rounded-full ${
            isFavorite ? 'bg-red-100' : 'bg-gray-100'
          }`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
          aria-pressed={isFavorite}
        >
          <Heart
            className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
          <span className="text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>

        <div className="flex gap-2 mb-4">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                typeColors[type.type.name as PokemonType] || 'bg-gray-400'
              }`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
            onClick={handleQuizClick}
            aria-label={`Take a quiz about ${pokemon.name}`}
          >
            Take a quiz
          </button>
          <button
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
            aria-label={`View details for ${pokemon.name}`}
          >
            <Info className="w-4 h-4" /> Details
          </button>
        </div>
      </div>

      {showDetails && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowDetails(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${pokemon.name}-details-title`}
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id={`${pokemon.name}-details-title`} className="text-2xl font-bold capitalize">{pokemon.name}</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowDetails(false)}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <img
              src={pokemon.sprites.other['official-artwork'].front_default || ''}
              alt={`${pokemon.name} artwork`}
              className="w-full h-48 object-contain bg-gray-100 mb-4"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-gray-700">Height</h4>
                <p>{(pokemon.height / 10).toFixed(1)} m</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Weight</h4>
                <p>{(pokemon.weight / 10).toFixed(1)} kg</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Abilities</h4>
                <ul>
                  {pokemon.abilities.map((ability) => (
                    <li key={ability.ability.name} className="capitalize">
                      {ability.ability.name.replace('-', ' ')}
                      {ability.is_hidden && ' (Hidden)'}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Base Experience</h4>
                <p>{pokemon.base_experience}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Stats</h4>
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{stat.stat.name.replace('-', ' ')}</span>
                    <span>{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                      role="progressbar"
                      aria-valuenow={stat.base_stat}
                      aria-valuemin={0}
                      aria-valuemax={255}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};