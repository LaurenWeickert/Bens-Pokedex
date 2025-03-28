import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy } from 'lucide-react';
import { BsCircleFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { usePokemonStore } from '../store/pokemonStore';
import ConfettiGenerator from 'confetti-js';
import { Pokemon, PokemonSpecies, EvolutionChain } from '../types/pokemon';
import { typeWeaknesses } from '../utils/typeWeaknesses';
import { calculateLevel, POINTS_PER_CORRECT_ANSWER } from '../utils/levelSystem';

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
  updateQuizScore: (pokemonId: number, score: number) => void;
  getQuizScore: (pokemonId: number) => number;
  markQuestionAnswered: (questionId: string, correct: boolean) => void;
  isQuestionAnsweredCorrectly: (questionId: string) => boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({ onClose, pokemon }) => {
  const { 
    addPoints, 
    addBadge, 
    isQuizCompleted, 
    markQuizCompleted,
    userPoints,
    setShowLevelUpAnimation,
    previousLevel,
    updateQuizScore,
    getQuizScore,
    markQuestionAnswered,
    isQuestionAnsweredCorrectly,
    theme
  } = usePokemonStore() as PokemonStoreState;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [previousBestScore, setPreviousBestScore] = useState(0);
  const [improvedScore, setImprovedScore] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  
  const isDark = theme === 'dark';

  const getPokemonWeaknesses = () => {
    const weaknesses = new Set<string>();
    pokemon.types.forEach(type => {
      const typeWeakness = typeWeaknesses[type.type.name.toLowerCase()];
      if (typeWeakness) {
        typeWeakness.forEach(w => weaknesses.add(w));
      }
    });
    return Array.from(weaknesses);
  };

  const questions = [
    {
      question: `What is ${pokemon.name}'s primary type?`,
      options: ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'].sort(() => Math.random() - 0.5).slice(0, 3).concat([pokemon.types[0].type.name]),
      correct: pokemon.types[0].type.name
    },
    {
      question: `Which of these moves is ${pokemon.name} likely to learn?`,
      options: ['Hyper Beam', 'Thunderbolt', 'Solar Beam', 'Earthquake'].sort(() => Math.random() - 0.5),
      correct: (() => {
        const type = pokemon.types[0].type.name.toLowerCase();
        switch (type) {
          case 'normal': return 'Hyper Beam';
          case 'electric': return 'Thunderbolt';
          case 'grass': return 'Solar Beam';
          case 'ground': return 'Earthquake';
          default: return ['Hyper Beam', 'Thunderbolt', 'Solar Beam', 'Earthquake'][Math.floor(Math.random() * 4)];
        }
      })()
    },
    {
      question: `What is ${pokemon.name}'s height?`,
      options: [
        `${(pokemon.height * 0.7).toFixed(1)} m`,
        `${(pokemon.height * 0.1).toFixed(1)} m`,
        `${(pokemon.height * 0.4).toFixed(1)} m`,
        `${(pokemon.height * 1.3).toFixed(1)} m`
      ],
      correct: `${(pokemon.height * 0.1).toFixed(1)} m`
    },
    {
      question: `What is ${pokemon.name}'s weight?`,
      options: [
        `${(pokemon.weight * 0.7).toFixed(1)} kg`,
        `${(pokemon.weight * 0.1).toFixed(1)} kg`,
        `${(pokemon.weight * 0.4).toFixed(1)} kg`,
        `${(pokemon.weight * 1.3).toFixed(1)} kg`
      ],
      correct: `${(pokemon.weight * 0.1).toFixed(1)} kg`
    },
    {
      question: `Which of these is a weakness of ${pokemon.name}?`,
      options: (() => {
        const allTypes = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
        const weaknesses = getPokemonWeaknesses();
        const correctAnswer = weaknesses.length > 0 ? weaknesses[Math.floor(Math.random() * weaknesses.length)] : allTypes[Math.floor(Math.random() * allTypes.length)];
        
        // Get non-weakness types
        const nonWeaknesses = allTypes.filter(type => !weaknesses.includes(type));
        
        // Get 3 random non-weakness types
        const randomNonWeaknesses = nonWeaknesses.sort(() => Math.random() - 0.5).slice(0, 3);
        
        // Combine with the correct answer and shuffle
        return [...randomNonWeaknesses, correctAnswer].sort(() => Math.random() - 0.5);
      })(),
      correct: (() => {
        const weaknesses = getPokemonWeaknesses();
        return weaknesses.length > 0 ? weaknesses[Math.floor(Math.random() * weaknesses.length)] : 'None';
      })()
    }
  ].sort(() => Math.random() - 0.5);

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
    // Get previous best score for this Pokémon
    const bestScore = getQuizScore(pokemon.id);
    setPreviousBestScore(bestScore);
  }, [pokemon.id, getQuizScore]);

  useEffect(() => {
    if (showResults && score === questions.length) {
      const confettiSettings = { target: 'confetti-canvas', max: 80 };
      const confettiInstance = new ConfettiGenerator(confettiSettings);
      confettiInstance.render();

      return () => confettiInstance.clear();
    }
  }, [showResults, score, questions.length]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      
      // Create a unique question ID
      const questionId = `${pokemon.id}-${currentQuestion}`;
      
      // Check if this question has been answered correctly before
      if (!isQuestionAnsweredCorrectly(questionId)) {
        // Award points for the correct answer (only once)
        const currentLevel = calculateLevel(userPoints);
        addPoints(POINTS_PER_CORRECT_ANSWER);
        setEarnedPoints(prev => prev + POINTS_PER_CORRECT_ANSWER);
        
        // Mark this question as answered correctly
        markQuestionAnswered(questionId, true);
        
        // Check if level increased
        const newLevel = calculateLevel(userPoints + POINTS_PER_CORRECT_ANSWER);
        if (newLevel > currentLevel) {
          setShowLevelUpAnimation(true);
        }
      } else {
        // Question already answered correctly before, no points
        markQuestionAnswered(questionId, true);
      }
    } else {
      // Mark incorrect answer
      const questionId = `${pokemon.id}-${currentQuestion}`;
      markQuestionAnswered(questionId, false);
    }

    setAnswers(prev => [...prev, isCorrect]);

    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowResults(true);
        
        // Update the quiz score if improved
        if (score + (isCorrect ? 1 : 0) > previousBestScore) {
          updateQuizScore(pokemon.id, score + (isCorrect ? 1 : 0));
          setImprovedScore(true);
        }
        
        // Award badge only for perfect score
        if (score + (isCorrect ? 1 : 0) === questions.length) {
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
        className="bg-white rounded-xl shadow-xl w-full relative flex flex-col overflow-hidden"
        style={{ 
          maxWidth: '500px',
          maxHeight: 'calc(100vh - 2rem)',
          height: 'auto'
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col h-full max-h-[calc(100vh-2rem)] overflow-hidden">
          {/* Header - Sticky */}
          {!showResults && (
            <div className={`flex items-center justify-between p-6 pb-2 sticky top-0 ${isDark ? 'bg-gray-800' : 'bg-white'} z-10 shadow-sm`}>
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
          )}

          {/* Scrollable Content */}
          <div className="p-6 pt-2 overflow-y-auto flex-1 scrollbar-thin">
            {!showResults ? (
              <>
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
                          : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      } ${selectedAnswer !== null && option === questions[currentQuestion].correct ? 'bg-green-100' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Trophy className={`w-16 h-16 mx-auto mb-4 ${score === questions.length ? 'text-yellow-400' : 'text-gray-400'}`} />
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
                
                {/* Previous best score */}
                {previousBestScore > 0 && (
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Previous best: {previousBestScore} out of {questions.length}
                    {improvedScore && " - New high score!"}
                  </p>
                )}
                
                {/* Points earned */}
                {earnedPoints > 0 && (
                  <div className="bg-blue-100 text-blue-700 p-4 rounded-lg mb-4">
                    You earned {earnedPoints} points from this quiz!
                  </div>
                )}
                
                {/* Badge earned */}
                {score === questions.length ? (
                  <div className="bg-purple-100 text-purple-700 p-4 rounded-lg mb-4">
                    🎉 Congratulations! You've earned the "{pokemon.name} Master" badge!
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-700 p-4 rounded-lg mb-4">
                    Get a perfect score to earn the "{pokemon.name} Master" badge!
                  </div>
                )}
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setCurrentQuestion(0);
                      setScore(0);
                      setAnswers([]);
                      setShowResults(false);
                      setEarnedPoints(0);
                    }}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};