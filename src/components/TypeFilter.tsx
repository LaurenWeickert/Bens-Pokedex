import React from 'react';
import { usePokemonStore } from '../store/pokemonStore';

const types = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const typeColors = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export const TypeFilter: React.FC = () => {
  const { selectedTypes, toggleType } = usePokemonStore();

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => toggleType(type)}
          className={`
            ${typeColors[type as keyof typeof typeColors]} 
            ${selectedTypes.includes(type) ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
            text-white px-4 py-1 rounded-full text-sm capitalize transition-all
            hover:opacity-90
          `}
        >
          {type}
        </button>
      ))}
    </div>
  );
};