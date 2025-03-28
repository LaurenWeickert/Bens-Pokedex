import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from 'react-query';
import Fuse from 'fuse.js';
import { Pokemon, PokemonListResponse } from './types/pokemon';
import { PokemonCard } from './components/PokemonCard';
import { SearchBar } from './components/SearchBar';
import { TypeFilter } from './components/TypeFilter';
import { UserProgress } from './components/UserProgress';
import { ThemeToggle } from './components/ThemeToggle';
import { LevelUpAnimation } from './components/LevelUpAnimation';
import { usePokemonStore } from './store/pokemonStore';
import { Loader2 } from 'lucide-react';

const POKEMON_PER_PAGE = 20;
const TOTAL_POKEMON = 151; // Limiting to Gen 1 for better performance

// Define the PokemonStore state interface
interface PokemonStoreState {
  searchTerm: string;
  selectedTypes: string[];
  theme: 'light' | 'dark';
}

function App() {
  const [page, setPage] = useState<number>(1);
  const { searchTerm, selectedTypes, theme } = usePokemonStore() as PokemonStoreState;

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const fetchAllPokemon = async (): Promise<Pokemon[]> => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PokemonListResponse = await response.json();
      
      // Use batched fetching to improve performance
      const pokemonDetails: Pokemon[] = [];
      const batchSize = 20; // Process in batches of 20
      
      for (let i = 0; i < data.results.length; i += batchSize) {
        const batch = data.results.slice(i, i + batchSize);
        const batchPromises = batch.map(async (pokemon) => {
          try {
            const res = await fetch(pokemon.url);
            if (!res.ok) {
              throw new Error(`Failed to fetch ${pokemon.name}: ${res.status}`);
            }
            return res.json();
          } catch (error) {
            console.error(`Error fetching ${pokemon.name}:`, error);
            return null; // Return null for failed fetches
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        pokemonDetails.push(...batchResults.filter(Boolean) as Pokemon[]); // Filter out nulls
      }

      return pokemonDetails;
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      throw error;
    }
  };

  const { data: allPokemon, isLoading, isError, error } = useQuery<Pokemon[], Error>(
    'pokemon',
    fetchAllPokemon,
    {
      staleTime: 3600000, // 1 hour instead of Infinity
      cacheTime: Infinity,
      retry: 3,
      onError: (err: Error) => console.error("Query error:", err)
    }
  );

  // Create Fuse instance for fuzzy search
  const fuse = useMemo(() => {
    if (!allPokemon) return null;
    return new Fuse(allPokemon, {
      keys: ['name', 'id'],
      threshold: 0.4, // Lower threshold means more strict matching
      ignoreLocation: true,
      includeScore: true,
    });
  }, [allPokemon]);

  const filteredPokemon = useMemo(() => {
    if (!allPokemon) return [];

    let results = allPokemon;

    // Apply fuzzy search if there's a search term
    if (searchTerm && fuse) {
      const fuseResults = fuse.search(searchTerm);
      results = fuseResults.map(result => result.item);
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      results = results.filter(p =>
        p.types.some(t => selectedTypes.includes(t.type.name))
      );
    }

    return results;
  }, [allPokemon, searchTerm, selectedTypes, fuse]);

  const paginatedPokemon = filteredPokemon?.slice(
    (page - 1) * POKEMON_PER_PAGE,
    page * POKEMON_PER_PAGE
  );

  const totalPages = Math.ceil((filteredPokemon?.length || 0) / POKEMON_PER_PAGE);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-blue-50 to-indigo-100'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-6">
        <div className={`flex justify-between items-center mb-6 ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'} p-4 rounded-2xl shadow-lg backdrop-blur-sm`}>
          <div className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
              alt="Pokéball" 
              className="w-10 h-10 mr-3 animate-bounce" 
            />
            <h1 className={`text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-blue-600'}`}>
              <span className="text-red-500">Ben's </span>Pokédex
            </h1>
          </div>
          <ThemeToggle />
        </div>
        
        <UserProgress />

        <div className={`mb-8 ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} rounded-2xl shadow-xl p-5 backdrop-blur-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'}`}>
          <SearchBar />
          <TypeFilter />
        </div>

        {isLoading ? (
          <div className={`flex flex-col justify-center items-center h-64 ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'} rounded-2xl shadow-lg p-8 backdrop-blur-sm`}>
            <Loader2 className={`w-12 h-12 animate-spin ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mb-4`} />
            <p className={`text-lg font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
              Loading Pokémon...
            </p>
          </div>
        ) : isError ? (
          <div className={`text-center p-8 ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'} rounded-2xl shadow-lg backdrop-blur-sm`}>
            <div className="text-red-500 text-xl mb-3">Oops! Something went wrong</div>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Error loading Pokémon data: {error?.message || 'Please try again later.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 auto-rows-auto">
              {paginatedPokemon?.map((p) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>

            {filteredPokemon && filteredPokemon.length > 0 ? (
              <div className="flex flex-wrap justify-center mt-8 gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-5 py-3 ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} text-white rounded-xl disabled:opacity-50 transition-all font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:hover:transform-none`}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span className={`flex items-center px-5 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-600'}`}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-5 py-3 ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} text-white rounded-xl disabled:opacity-50 transition-all font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:hover:transform-none`}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            ) : (
              <div className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-8 p-8 ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} rounded-2xl shadow-lg backdrop-blur-sm`}>
                <img 
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" 
                  alt="Psyduck" 
                  className="w-24 h-24 mx-auto mb-4" 
                />
                <p className="text-xl font-bold mb-2">No Pokémon found!</p>
                <p>Try changing your search or filters to find some Pokémon.</p>
              </div>
            )}
          </>
        )}
        
        <footer className={`mt-12 text-center py-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
          <p>Made with ❤️ for Pokémon trainers of all ages!</p>
        </footer>
      </div>
      {/* Level Up Animation */}
      <LevelUpAnimation />
    </div>
  );
}

export default App;