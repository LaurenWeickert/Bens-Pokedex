# Pokédex App

A modern, interactive Pokédex built with React, TypeScript, and Tailwind CSS. This application allows users to explore Pokémon, their stats, abilities, and more using data from the PokeAPI.

![Pokédex App Screenshot](https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&q=80&w=1200)

## Features

- 🔍 Search Pokémon by name or number with fuzzy search
- 🏷️ Filter Pokémon by type
- ❤️ Favorite your preferred Pokémon
- 📊 View detailed Pokémon statistics
- 🎮 Take quizzes about Pokémon
- 🏆 Earn points and badges through gamification
- 📱 Responsive design for all devices
- ♿ Improved accessibility with ARIA attributes and keyboard navigation

## Tech Stack

- React 18.3
- TypeScript 5.5
- Tailwind CSS 3.4
- React Query for efficient data fetching and caching
- Framer Motion for smooth animations
- Zustand for state management with persistence
- Fuse.js for fuzzy search capabilities
- Lucide React for beautiful icons

## Recent Improvements

- ⚡ Optimized data fetching with batched API requests
- 🛡️ Enhanced error handling throughout the application
- 🔒 Improved type safety with proper TypeScript annotations
- 🧩 Better state management with optimized Zustand store
- 📦 Custom type declarations for external libraries
- 🖥️ Responsive UI with improved user experience
- 🔄 Implemented daily streak feature for user engagement
- 🎯 Added gamification elements (points, badges, discoveries)

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/pokedex-app.git
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser (or the port shown in your terminal)

### Troubleshooting

If you encounter any issues during installation or startup:

- **Missing dependencies**: Make sure all dependencies are installed by running `npm install`
- **Port conflicts**: The development server will automatically try different ports if the default one is in use
- **TypeScript errors**: The application includes custom type declarations in `src/types/declarations.d.ts` to handle third-party libraries
- **API rate limiting**: The application uses batched requests to avoid hitting PokeAPI rate limits, but you may still encounter issues if making too many requests

## Project Structure

```
src/
├── components/        # React components
├── store/             # Zustand store
├── types/             # TypeScript types and declarations
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Components

- **PokemonCard**: Displays individual Pokémon with basic information and interactive elements
- **SearchBar**: Enables fuzzy searching for Pokémon by name or ID
- **TypeFilter**: Allows filtering Pokémon by their types
- **UserProgress**: Shows user points, badges, and daily streak

## State Management

The application uses Zustand for state management with persistence, handling:
- Search terms and type filters
- Favorite Pokémon collection
- User progress tracking (points, badges, streaks)
- Discovered Pokémon and quiz answers

## Performance Optimizations

- Batched API requests to reduce network overhead
- Memoized components and calculations to prevent unnecessary re-renders
- Lazy loading of images for faster initial load
- Efficient pagination to handle large datasets
- Proper React Query configuration with stale time and retry logic

## Local Development

When developing locally:

1. **Hot Module Replacement**: Changes to your code will be reflected immediately in the browser
2. **TypeScript Checking**: The TypeScript compiler will check your code for errors as you write
3. **Custom Type Declarations**: If you add new third-party libraries, you may need to add type declarations in `src/types/declarations.d.ts`
4. **State Persistence**: User data is persisted in localStorage, clear it if you need to reset the application state
5. **API Caching**: React Query caches API responses, which speeds up development but may require cache invalidation when testing certain features

## API Integration

This project uses the [PokeAPI](https://pokeapi.co/) to fetch Pokémon data, including:
- Basic Pokémon information
- Stats and abilities
- Types and characteristics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing the Pokémon data
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [React Query](https://tanstack.com/query/latest) for data fetching
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Fuse.js](https://fusejs.io/) for fuzzy search capabilities