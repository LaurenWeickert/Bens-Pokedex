import React, { useEffect, useState } from 'react';
import { X, Star, Swords, Shield, Heart, Zap, ChevronRight } from 'lucide-react';
import { Pokemon, EvolutionChain, PokemonSpecies } from '../types/pokemon';
import { motion, AnimatePresence } from 'framer-motion';

interface PokemonDetailsModalProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export const PokemonDetailsModal: React.FC<PokemonDetailsModalProps> = ({ pokemon, onClose }) => {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [moves, setMoves] = useState<{ name: string; level: number }[]>([]);

  const statIcons = {
    hp: <Heart className="w-4 h-4" />,
    attack: <Swords className="w-4 h-4" />,
    defense: <Shield className="w-4 h-4" />,
    'special-attack': <Star className="w-4 h-4" />,
    'special-defense': <Shield className="w-4 h-4" />,
    speed: <Zap className="w-4 h-4" />
  };

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        // First get the species data which contains the evolution chain URL
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData: PokemonSpecies = await speciesResponse.json();

        // Then fetch the evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData: EvolutionChain = await evolutionResponse.json();
        setEvolutionChain(evolutionData);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
      }
    };

    const fetchMoves = async () => {
      try {
        // Get moves directly from the pokemon data
        const movesList = pokemon.moves.map(moveData => ({
          name: moveData.move.name,
          // Default to level 1 if no level learning method is found
          level: 1
        }));
        
        setMoves(movesList.sort((a, b) => a.level - b.level));
      } catch (error) {
        console.error('Error processing moves:', error);
      }
    };

    fetchEvolutionChain();
    fetchMoves();
  }, [pokemon]);

  const renderEvolutionChain = () => {
    if (!evolutionChain) return null;

    const chain = evolutionChain.chain;
    return (
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex flex-col items-center">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getIdFromUrl(chain.species.url)}.png`}
            alt={chain.species.name}
            className="w-24 h-24 object-contain"
          />
          <span className="capitalize text-sm">{chain.species.name}</span>
        </div>
        {chain.evolves_to.map((evolution) => (
          <React.Fragment key={evolution.species.name}>
            <ChevronRight className="w-6 h-6 text-gray-400" />
            <div className="flex flex-col items-center">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getIdFromUrl(evolution.species.url)}.png`}
                alt={evolution.species.name}
                className="w-24 h-24 object-contain"
              />
              <span className="capitalize text-sm">{evolution.species.name}</span>
              <span className="text-xs text-gray-500">
                {evolution.evolution_details[0].min_level
                  ? `Level ${evolution.evolution_details[0].min_level}`
                  : evolution.evolution_details[0].item
                  ? `Use ${evolution.evolution_details[0].item.name}`
                  : 'Special condition'}
              </span>
            </div>
            {evolution.evolves_to.map((finalEvolution) => (
              <React.Fragment key={finalEvolution.species.name}>
                <ChevronRight className="w-6 h-6 text-gray-400" />
                <div className="flex flex-col items-center">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getIdFromUrl(finalEvolution.species.url)}.png`}
                    alt={finalEvolution.species.name}
                    className="w-24 h-24 object-contain"
                  />
                  <span className="capitalize text-sm">{finalEvolution.species.name}</span>
                  <span className="text-xs text-gray-500">
                    {finalEvolution.evolution_details[0].min_level
                      ? `Level ${finalEvolution.evolution_details[0].min_level}`
                      : finalEvolution.evolution_details[0].item
                      ? `Use ${finalEvolution.evolution_details[0].item.name}`
                      : 'Special condition'}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const getIdFromUrl = (url: string) => {
    const matches = url.match(/\/(\d+)\//);
    return matches ? matches[1] : '1';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default}
                  alt={pokemon.name}
                  className="w-full h-auto rounded-lg shadow-md bg-gray-50 p-4"
                />
              </div>

              <div className="md:w-1/2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Base Stats</h3>
                  <div className="space-y-2">
                    {pokemon.stats.map((stat) => (
                      <div key={stat.stat.name} className="flex items-center gap-2">
                        <span className="w-8">{statIcons[stat.stat.name as keyof typeof statIcons]}</span>
                        <span className="capitalize w-32">{stat.stat.name.replace('-', ' ')}:</span>
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                          />
                        </div>
                        <span className="w-12 text-right">{stat.base_stat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Abilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((ability) => (
                      <span
                        key={ability.ability.name}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full capitalize"
                      >
                        {ability.ability.name.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 mb-1">Height</h4>
                    <p className="text-lg font-semibold">{(pokemon.height / 10).toFixed(1)}m</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 mb-1">Weight</h4>
                    <p className="text-lg font-semibold">{(pokemon.weight / 10).toFixed(1)}kg</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Evolution Chain</h3>
              {renderEvolutionChain()}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Moves</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {moves.map((move) => (
                  <div
                    key={move.name}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                  >
                    <span className="capitalize">{move.name.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};