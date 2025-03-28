import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import Fuse from 'fuse.js';
import { Pokemon, PokemonListResponse } from './types/pokemon';
import { PokemonCard } from './components/PokemonCard';
import { SearchBar } from './components/SearchBar';
import { TypeFilter } from './components/TypeFilter';
import { UserProgress } from './components/UserProgress';
import { usePokemonStore } from './store/pokemonStore';
import { Loader2 } from 'lucide-react';

const POKEMON_PER_PAGE = 20;
const TOTAL_POKEMON = 151; // Limiting to Gen 1 for better performance

function App() {
  const [page, setPage] = useState<number>(1);
  const { searchTerm, selectedTypes } = usePokemonStore();

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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Pokédex</h1>
        
        <UserProgress />

        <div className="flex flex-col items-center mb-8">
          <SearchBar />
          <TypeFilter />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Error loading Pokémon data: {error?.message || 'Please try again later.'}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedPokemon?.map((p) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>

            {filteredPokemon && filteredPokemon.length > 0 ? (
              <div className="flex justify-center mt-8 gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                No Pokémon found matching your search criteria
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;