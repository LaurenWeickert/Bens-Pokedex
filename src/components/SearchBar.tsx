import React from 'react';
import { Search } from 'lucide-react';
import { usePokemonStore } from '../store/pokemonStore';

export const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm } = usePokemonStore();

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Pokémon by name or number..."
        className="w-full pl-12 pr-4 py-3 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
};