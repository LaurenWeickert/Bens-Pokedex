export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
  species: {
    url: string;
  };
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface EvolutionChain {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: {
      species: {
        name: string;
        url: string;
      };
      evolution_details: {
        min_level: number;
        trigger: {
          name: string;
        };
        item?: {
          name: string;
        };
      }[];
      evolves_to: {
        species: {
          name: string;
          url: string;
        };
        evolution_details: {
          min_level: number;
          trigger: {
            name: string;
          };
          item?: {
            name: string;
          };
        }[];
      }[];
    }[];
  };
}

export interface PokemonSpecies {
  evolution_chain: {
    url: string;
  };
}