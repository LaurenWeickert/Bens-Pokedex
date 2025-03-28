import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { usePokemonStore } from '../store/pokemonStore';
import { Combobox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface PokemonStoreState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  theme: 'light' | 'dark';
}

// Mock data for suggestions - in a real app, this would come from your store or API
const pokemonSuggestions = [
  'Pikachu', 'Charizard', 'Bulbasaur', 'Squirtle', 'Jigglypuff',
  'Mewtwo', 'Eevee', 'Snorlax', 'Gengar', 'Gyarados'
];

export const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm, theme } = usePokemonStore() as PokemonStoreState;
  const [query, setQuery] = useState(searchTerm);
  
  const isDark = theme === 'dark';
  
  const filteredPokemon = query === ''
    ? pokemonSuggestions
    : pokemonSuggestions.filter((pokemon) =>
        pokemon.toLowerCase().includes(query.toLowerCase())
      );

  const handleChange = (selected: string) => {
    setSearchTerm(selected);
    setQuery(selected);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchTerm('');
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className={`text-center mb-3 ${isDark ? 'text-yellow-300' : 'text-blue-600'}`}>
        <h2 className="text-xl font-bold">Find Your Favorite Pokémon!</h2>
      </div>
      <Combobox value={searchTerm} onChange={handleChange}>
        <div className="relative">
          <div className="relative w-full">
            <Combobox.Input
              className={`w-full pl-14 pr-12 py-4 rounded-2xl ${
                isDark 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-yellow-400 border-2 border-gray-600' 
                  : 'bg-white text-gray-900 focus:ring-blue-400 border-2 border-blue-200'
              } shadow-lg focus:outline-none focus:ring-4 text-base font-medium transition-all duration-300`}
              placeholder="Type a Pokémon name or number..."
              onChange={handleInputChange}
              value={query}
            />
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-yellow-300' : 'text-blue-500'
            } w-7 h-7 animate-pulse`}>
              <Search className="w-full h-full" />
            </div>
            
            {query && (
              <button 
                onClick={clearSearch}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white bg-gray-600 hover:bg-gray-500' 
                    : 'text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300'
                } transition-colors p-1 rounded-full`}
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            afterLeave={() => setQuery(query)}
          >
            <Combobox.Options className={`absolute mt-2 max-h-60 w-full overflow-auto rounded-xl ${
              isDark 
                ? 'bg-gray-800 ring-gray-700 border-2 border-gray-700' 
                : 'bg-white ring-black border-2 border-blue-100'
            } py-2 shadow-xl ring-1 ring-opacity-5 focus:outline-none z-10`}>
              {filteredPokemon.length === 0 && query !== '' ? (
                <div className={`relative cursor-default select-none py-3 px-4 text-center ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span className="font-medium">Oops!</span> No Pokémon found with that name.
                </div>
              ) : (
                filteredPokemon.map((pokemon) => (
                  <Combobox.Option
                    key={pokemon}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-3 pl-12 pr-4 ${
                        active
                          ? isDark 
                            ? 'bg-indigo-800 text-white' 
                            : 'bg-blue-100 text-blue-900'
                          : isDark 
                            ? 'text-gray-300' 
                            : 'text-gray-900'
                      } font-medium rounded-lg mx-1 transition-colors duration-150`
                    }
                    value={pokemon}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-bold' : 'font-medium'
                          }`}
                        >
                          {pokemon}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active 
                                ? isDark ? 'text-yellow-300' : 'text-blue-600' 
                                : isDark ? 'text-yellow-400' : 'text-blue-500'
                            }`}
                          >
                            <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <div className={`text-center mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Try searching for your favorite Pokémon!
      </div>
    </div>
  );
};