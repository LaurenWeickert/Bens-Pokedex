import React, { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';
import { BsCircleFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { usePokemonStore } from '../store/pokemonStore';
import ConfettiGenerator from 'confetti-js';
import { Pokemon, PokemonSpecies, EvolutionChain } from '../types/pokemon';
import { typeWeaknesses } from '../utils/typeWeaknesses';
import { calculateLevel } from '../utils/levelSystem';

interface QuizModalProps {
  onClose: () => void;
  pokemon: Pokemon;
}

interface PokemonStoreState {
  theme: 'light' | 'dark';
  addPoints: (points: number) => void;
  addBadge: (badge: string) => void;
  isQuizCompleted: (pokemonId: number) => boolean;
  markQuizCompleted: (pokemonId: number) => void;
  userPoints: number;
  setShowLevelUpAnimation: (show: boolean) => void;
  previousLevel: number;
}

export const QuizModal: React.FC<QuizModalProps> = ({ onClose, pokemon }) => {
  const { 
    addPoints, 
    addBadge, 
    isQuizCompleted, 
    markQuizCompleted,
    userPoints,
    setShowLevelUpAnimation,
    previousLevel
  } = usePokemonStore() as PokemonStoreState;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [quizAlreadyCompleted, setQuizAlreadyCompleted] = useState(false);

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData: PokemonSpecies = await speciesResponse.json();
        
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData: EvolutionChain = await evolutionResponse.json();
        setEvolutionChain(evolutionData);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
      }
    };

    fetchEvolutionChain();
  }, [pokemon]);

  useEffect(() => {
    // Check if this quiz has already been completed
    setQuizAlreadyCompleted(isQuizCompleted(pokemon.id));
  }, [pokemon.id, isQuizCompleted]);

  useEffect(() => {
    if (showResults && score > 3) {
      const confettiSettings = { target: 'confetti-canvas', max: 80 };
      const confettiInstance = new ConfettiGenerator(confettiSettings);
      confettiInstance.render();

      return () => confettiInstance.clear();
    }
  }, [showResults, score]);

  const getPokemonWeaknesses = () => {
    const weaknesses = new Set<string>();
    pokemon.types.forEach((type) => {
      typeWeaknesses[type.type.name as keyof typeof typeWeaknesses]?.forEach(weakness => {
        weaknesses.add(weakness);
      });
    });
    return Array.from(weaknesses);
  };

  const getEvolutionChainString = () => {
    if (!evolutionChain) return `${pokemon.name} (No evolution data)`;

    const chain = evolutionChain.chain;
    const first = chain.species.name;
    const second = chain.evolves_to[0]?.species.name;
    const third = chain.evolves_to[0]?.evolves_to[0]?.species.name;

    if (!second) return `${first} (No evolution)`;
    if (!third) return `${first} → ${second}`;
    return `${first} → ${second} → ${third}`;
  };

  const generateEvolutionOptions = () => {
    if (!evolutionChain) return [];

    const chain = evolutionChain.chain;
    const first = chain.species.name;
    const second = chain.evolves_to[0]?.species.name;
    const third = chain.evolves_to[0]?.evolves_to[0]?.species.name;

    const correctChain = getEvolutionChainString();
    
    // Generate incorrect but plausible evolution chains
    const options = [
      correctChain,
      second ? `${second} → ${first}` : `${first} (Solo)`,
      third ? `${first} → ${third}` : `${first} → Unknown`,
      second && third ? `${second} → ${third}` : `${first} → Mystery`
    ];

    return options.sort(() => Math.random() - 0.5);
  };

  const questions = [
    {
      question: `What type(s) is ${pokemon.name}?`,
      options: [
        pokemon.types.map(t => t.type.name).join('/'),
        'Fire/Flying',
        'Water/Psychic',
        'Ground/Rock'
      ].sort(() => Math.random() - 0.5),
      correct: pokemon.types.map(t => t.type.name).join('/')
    },
    {
      question: `What is ${pokemon.name}'s main weakness?`,
      options: [
        ...getPokemonWeaknesses(),
        'None of these'
      ].slice(0, 4),
      correct: getPokemonWeaknesses()[0]
    },
    {
      question: `Which of these moves can ${pokemon.name} learn?`,
      options: pokemon.moves.slice(0, 3).map(m => m.move.name)
        .concat(['None of these'])
        .sort(() => Math.random() - 0.5),
      correct: pokemon.moves[0].move.name
    },
    {
      question: `What is the correct evolution chain for ${pokemon.name}?`,
      options: generateEvolutionOptions(),
      correct: getEvolutionChainString()
    }
  ];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswers(prev => [...prev, isCorrect]);

    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowResults(true);
        // Only award points and badges if this is the first time completing the quiz
        if (score >= 3 && !quizAlreadyCompleted) {
          // Store current level before adding points
          const currentLevel = calculateLevel(userPoints);
          
          // Award points
          addPoints(20);
          
          // Check if level increased
          const newLevel = calculateLevel(userPoints + 20);
          if (newLevel > currentLevel) {
            setShowLevelUpAnimation(true);
          }
          
          addBadge(`${pokemon.name} Master`);
          markQuizCompleted(pokemon.id);
        }
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-hidden">
      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-50"></canvas>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full relative max-h-[90vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
          {!showResults ? (
            <>
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pt-2 pb-4 z-[5]">
                <h2 className="text-2xl font-bold">
                  Question {currentQuestion + 1} of {questions.length}
                </h2>
                <div className="flex gap-2">
                  {answers.map((correct, index) => (
                    <BsCircleFill
                      key={index}
                      className={`w-6 h-6 ${
                        correct ? 'text-green-500' : 'text-red-500'
                      }`}
                    />
                  ))}
                  {Array(questions.length - answers.length)
                    .fill(null)
                    .map((_, index) => (
                      <BsCircleFill
                        key={`empty-${index}`}
                        className="w-6 h-6 text-gray-300"
                      />
                    ))}
                </div>
              </div>
              <p className="text-lg mb-4">{questions[currentQuestion].question}</p>
              <div className="space-y-3 pb-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedAnswer === option
                        ? option === questions[currentQuestion].correct
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } ${selectedAnswer !== null && option === questions[currentQuestion].correct ? 'bg-green-100' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${score > 3 ? 'text-yellow-400' : 'text-gray-400'}`} />
              <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
              <div className="flex justify-center gap-2 mb-4">
                {answers.map((correct, index) => (
                  <BsCircleFill
                    key={index}
                    className={`w-6 h-6 ${
                      correct ? 'text-green-500' : 'text-red-500'
                    }`}
                  />
                ))}
              </div>
              <p className="text-lg mb-4">You scored {score} out of {questions.length}</p>
              {score > 3 && !quizAlreadyCompleted ? (
                <div className="bg-purple-100 text-purple-700 p-4 rounded-lg mb-4">
                  🎉 Congratulations! You've earned the "{pokemon.name} Master" badge!
                </div>
              ) : score > 3 && quizAlreadyCompleted ? (
                <div className="bg-gray-100 text-gray-700 p-4 rounded-lg mb-4">
                  You've already earned the "{pokemon.name} Master" badge!
                </div>
              ) : null}
              <button
                onClick={onClose}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};