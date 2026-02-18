import { useState, useEffect, useRef } from 'react';

const useGameFlow = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState('bidding');
  const [gameComplete, setGameComplete] = useState(false);
  const timerRef = useRef(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handle automatic phase progression with 3-second timer
  useEffect(() => {
    if (gameComplete) return;

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set timer for automatic progression
    timerRef.current = setTimeout(() => {
      advancePhase();
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentPhase, currentRound, gameComplete]);

  // Function to advance through phases: bidding → playing → scoring → next round's bidding
  const advancePhase = () => {
    if (gameComplete) return;

    switch (currentPhase) {
      case 'bidding':
        setCurrentPhase('playing');
        break;
      case 'playing':
        setCurrentPhase('scoring');
        break;
      case 'scoring':
        // After scoring, move to next round
        const nextRound = currentRound + 1;
        if (nextRound > 10) {
          setGameComplete(true);
        } else {
          setCurrentRound(nextRound);
          setCurrentPhase('bidding');
        }
        break;
      default:
        break;
    }
  };

  return {
    currentRound,
    currentPhase,
    gameComplete,
    advancePhase
  };
};

export default useGameFlow;