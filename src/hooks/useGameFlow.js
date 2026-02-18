import { useState, useEffect, useCallback } from 'react';

export const useGameFlow = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [gameComplete, setGameComplete] = useState(false);
  const [scores, setScores] = useState({
    player: 0,
    computer: 0
  });

  const nextRound = useCallback(() => {
    if (currentRound < 10) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameComplete(true);
    }
  }, [currentRound]);

  const updateScores = useCallback((playerScore, computerScore) => {
    setScores(prev => ({
      player: prev.player + playerScore,
      computer: prev.computer + computerScore
    }));
  }, []);

  const resetGame = useCallback(() => {
    setCurrentRound(1);
    setGameComplete(false);
    setScores({
      player: 0,
      computer: 0
    });
  }, []);

  useEffect(() => {
    if (currentRound > 10) {
      setGameComplete(true);
    }
  }, [currentRound]);

  return {
    currentRound,
    gameComplete,
    scores,
    nextRound,
    updateScores,
    resetGame
  };
};