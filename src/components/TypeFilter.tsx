import React, { useState } from 'react';
import { usePokemonStore } from '../store/pokemonStore';
import { typeColors } from '../utils/typeColors';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface PokemonStoreState {
  selectedTypes: string[];
  toggleType: (type: string) => void;
  setSelectedTypes: (types: string[]) => void;
  theme: 'light' | 'dark';
}

const types = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

// Simple icons for each type - these could be replaced with actual SVG icons
const typeIcons: Record<string, string> = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '👊',
  poison: '☠️',
  ground: '🌍',
  flying: '🦅',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌑',
  steel: '⚙️',
  fairy: '✨',
};

export const TypeFilter: React.FC = () => {
  const { selectedTypes, toggleType, setSelectedTypes, theme } = usePokemonStore() as PokemonStoreState;
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeChange = (type: string) => {
    if (type === 'all') {
      setSelectedTypes([]);
    } else {
      toggleType(type);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleShowAllTypes = () => {
    setSelectedTypes([]);
    setIsExpanded(true);
  };

  // Get the most popular types to show when collapsed
  const popularTypes = ['fire', 'water', 'electric', 'grass', 'psychic', 'dragon'];
  const displayTypes = isExpanded ? types : popularTypes;

  return (
    <div className={`p-4 ${isDark ? 'text-white' : 'text-gray-900'} mt-4 rounded-xl ${
      isDark ? 'bg-gray-800/50' : 'bg-white/80'
    } shadow-lg transition-all duration-300`} data-component-name="TypeFilter">
      <div className="mb-4 flex justify-between items-center">
        <h3 
          className={`text-xl font-extrabold ${isDark ? 'text-yellow-300' : 'text-blue-600'} flex items-center cursor-pointer`}
          onClick={toggleExpand}
        >
          <span className="mr-2 text-2xl">{isExpanded ? '📂' : '📁'}</span>
          Filter by Type
          {isExpanded ? 
            <FaChevronUp className="ml-2 w-5 h-5" /> : 
            <FaChevronDown className="ml-2 w-5 h-5" />
          }
        </h3>
        <button
          onClick={handleShowAllTypes}
          className={`text-sm font-bold ${
            isDark 
              ? 'bg-indigo-700 text-white hover:bg-indigo-600' 
              : 'bg-blue-500 text-white hover:bg-blue-400'
          } px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0`}
          aria-label="Clear all filters"
        >
          Show All Types
        </button>
      </div>
      
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 transition-all duration-500 ${
        isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-24 opacity-100'
      } overflow-hidden`}>
        {displayTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);
          const typeColor = typeColors[type as keyof typeof typeColors] || '#A8A878';
          
          return (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`
                relative overflow-hidden rounded-xl text-white py-3 px-3 text-sm font-bold capitalize transition-all
                cursor-pointer hover:opacity-90 flex flex-col items-center justify-center
                ${isSelected ? 'ring-4 ring-offset-2 transform scale-105' : 'hover:scale-105'}
                shadow-lg
              `}
              style={{
                backgroundColor: typeColor,
                boxShadow: isSelected ? `0 10px 15px -3px ${typeColor}80` : '',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
              <span className="text-2xl mb-1">{typeIcons[type]}</span>
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              {isSelected && (
                <span className="absolute top-1 right-1 bg-white text-xs text-black rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {!isExpanded && displayTypes.length < types.length && (
        <button 
          onClick={toggleExpand}
          className={`w-full mt-2 py-2 rounded-lg text-sm font-bold flex items-center justify-center ${
            isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          } transition-colors shadow-md`}
        >
          <span>Show {types.length - displayTypes.length} more types</span>
          <FaChevronDown className="ml-1 w-4 h-4" />
        </button>
      )}
      
      {selectedTypes.length > 0 && (
        <div className={`mt-5 p-4 rounded-xl ${
          isDark ? 'bg-gray-700/80 text-gray-200' : 'bg-blue-50 text-blue-800'
        } shadow-lg backdrop-blur-sm border ${
          isDark ? 'border-gray-600' : 'border-blue-200'
        }`}>
          <div className="flex items-center">
            <span className="text-xl mr-2">
              {selectedTypes.length === 1 ? typeIcons[selectedTypes[0]] : '🎮'}
            </span>
            <p className="font-bold">
              {selectedTypes.length === 1
                ? `Showing ${selectedTypes[0].charAt(0).toUpperCase() + selectedTypes[0].slice(1)} type Pokémon`
                : `Showing Pokémon with ${selectedTypes.length} selected types`}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedTypes.map(type => (
              <span 
                key={type}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: typeColors[type as keyof typeof typeColors] || '#A8A878' }}
              >
                {typeIcons[type]} {type}
                <button 
                  onClick={() => toggleType(type)}
                  className="ml-1 bg-white/30 rounded-full w-4 h-4 flex items-center justify-center hover:bg-white/50"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};