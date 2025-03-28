import React, { useState } from 'react';
import { Pokemon } from '../types/pokemon';
import { Heart, Info, Star } from 'lucide-react';
import { FaGamepad } from 'react-icons/fa';
import { usePokemonStore } from '../store/pokemonStore';
import { typeColors } from '../utils/typeColors';
import { QuizModal } from './QuizModal';

interface PokemonCardProps {
  pokemon: Pokemon;
}

interface PokemonStoreState {
  theme: 'light' | 'dark';
  toggleFavorite: (id: number) => void;
  favorites: number[];
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const { theme, toggleFavorite, favorites } = usePokemonStore() as PokemonStoreState;
  
  const isDark = theme === 'dark';
  const isFavorite = favorites?.includes(pokemon.id);
  const mainType = pokemon.types[0].type.name;
  
  // Format the ID with leading zeros (e.g., #001, #025)
  const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;
  
  // Capitalize the first letter of the name
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  // Get the background color based on the Pokémon's primary type
  const typeColor = typeColors[mainType] || '#A8A878'; // Default to normal type color
  
  // Calculate stats total for the stat bar
  const statsTotal = pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  const maxPossibleTotal = 600; // Approximate max for Gen 1 Pokémon
  const statPercentage = Math.min(100, (statsTotal / maxPossibleTotal) * 100);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 transform ${
        isHovered ? 'scale-105' : ''
      } ${
        isDark ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-xl'
      } hover:shadow-2xl`}
      style={{
        border: `3px solid ${typeColor}`,
        boxShadow: isHovered ? `0 10px 25px -5px ${typeColor}80` : '',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top color bar based on Pokémon type */}
      <div 
        className="h-3 w-full"
        style={{ backgroundColor: typeColor }}
      />
      
      {/* Card Header with ID and Name */}
      <div className="flex justify-between items-center p-3">
        <span className={`font-mono font-bold text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {formattedId}
        </span>
        <button
          onClick={() => toggleFavorite(pokemon.id)}
          className={`p-1 rounded-full transition-colors ${
            isFavorite
              ? 'text-red-500 hover:text-red-600'
              : isDark
                ? 'text-gray-400 hover:text-red-400'
                : 'text-gray-400 hover:text-red-400'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      {/* Pokémon Image with Background */}
      <div className="relative flex justify-center items-center p-4">
        <div 
          className="absolute inset-0 opacity-10 rounded-full m-4"
          style={{ backgroundColor: typeColor }}
        />
        <img
          src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className={`w-36 h-36 object-contain z-10 transition-transform duration-500 ${
            isHovered ? 'scale-110 animate-pulse' : ''
          }`}
          loading="lazy"
        />
      </div>
      
      {/* Pokémon Name */}
      <div className="text-center px-3 pb-2">
        <h2 className={`text-xl font-extrabold ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          {capitalizedName}
        </h2>
      </div>
      
      {/* Type Badges */}
      <div className="flex justify-center gap-2 px-3 pb-3">
        {pokemon.types.map((typeInfo) => (
          <span
            key={typeInfo.type.name}
            className="px-3 py-1 rounded-full text-white text-xs font-bold"
            style={{ backgroundColor: typeColors[typeInfo.type.name] || '#A8A878' }}
          >
            {typeInfo.type.name.toUpperCase()}
          </span>
        ))}
      </div>
      
      {/* Stats Bar */}
      <div className="px-3 pb-3">
        <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="h-2.5 rounded-full" 
            style={{ 
              width: `${statPercentage}%`,
              backgroundColor: typeColor
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Power</span>
          <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {statsTotal}
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 divide-x divide-y">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center justify-center py-3 ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-blue-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
          } transition-colors`}
        >
          <Info className="w-5 h-5 mr-2" />
          <span className="font-medium">Info</span>
        </button>
        <button
          onClick={() => setShowQuiz(true)}
          className={`flex items-center justify-center py-3 ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-purple-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
          } transition-colors`}
        >
          <FaGamepad className="w-5 h-5 mr-2" />
          <span className="font-medium">Quiz</span>
        </button>
      </div>
      
      {/* Details Panel (shown when Info is clicked) */}
      {showDetails && (
        <div className={`p-4 ${
          isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
        }`}>
          <h3 className="font-bold mb-2 flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-400" />
            Pokémon Stats
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p><span className="font-semibold">Height:</span> {pokemon.height / 10}m</p>
              <p><span className="font-semibold">Weight:</span> {pokemon.weight / 10}kg</p>
            </div>
            <div>
              <p><span className="font-semibold">Base XP:</span> {pokemon.base_experience}</p>
              <p><span className="font-semibold">Abilities:</span> {pokemon.abilities[0]?.ability.name}</p>
            </div>
          </div>
          <div className="mt-2">
            <h4 className="font-semibold mb-1">Base Stats:</h4>
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className="mb-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>{stat.stat.name.replace('-', ' ').toUpperCase()}</span>
                  <span>{stat.base_stat}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5 dark:bg-gray-600">
                  <div 
                    className="h-1.5 rounded-full" 
                    style={{ 
                      width: `${(stat.base_stat / 255) * 100}%`,
                      backgroundColor: typeColor
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal 
          pokemon={pokemon} 
          onClose={() => setShowQuiz(false)} 
        />
      )}
    </div>
  );
};