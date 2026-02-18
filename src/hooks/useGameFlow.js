import { useState, useCallback, useEffect } from 'react';

const PHASES = ['bidding', 'playing', 'scoring'];
const TOTAL_ROUNDS = 13;

export const useGameFlow = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState('bidding');
  const [gameComplete, setGameComplete] = useState(false);
  const [phaseHistory, setPhaseHistory] = useState([]);

  // Check if game should be complete
  useEffect(() => {
    if (currentRound > TOTAL_ROUNDS) {
      setGameComplete(true);
    }
  }, [currentRound]);

  const getCurrentPhaseIndex = useCallback(() => {
    return PHASES.indexOf(currentPhase);
  }, [currentPhase]);

  const canAdvance = useCallback(() => {
    if (gameComplete) return false;
    
    // Always allow advancement within phases
    const phaseIndex = getCurrentPhaseIndex();
    return phaseIndex >= 0 && (phaseIndex < PHASES.length - 1 || currentRound < TOTAL_ROUNDS);
  }, [currentPhase, currentRound, gameComplete, getCurrentPhaseIndex]);

  const canGoBack = useCallback(() => {
    if (gameComplete) return false;
    
    // Can go back if not in first phase of first round
    const phaseIndex = getCurrentPhaseIndex();
    return !(currentRound === 1 && phaseIndex === 0) && phaseHistory.length > 0;
  }, [currentPhase, currentRound, gameComplete, getCurrentPhaseIndex, phaseHistory]);

  const nextPhase = useCallback(() => {
    if (!canAdvance()) return;

    // Save current state to history
    setPhaseHistory(prev => [...prev, { round: currentRound, phase: currentPhase }]);

    const phaseIndex = getCurrentPhaseIndex();
    
    if (phaseIndex < PHASES.length - 1) {
      // Move to next phase in current round
      setCurrentPhase(PHASES[phaseIndex + 1]);
    } else {
      // Move to next round, reset to bidding phase
      setCurrentRound(prev => prev + 1);
      setCurrentPhase('bidding');
    }
  }, [canAdvance, currentRound, currentPhase, getCurrentPhaseIndex]);

  const previousPhase = useCallback(() => {
    if (!canGoBack() || phaseHistory.length === 0) return;

    // Get the last state from history
    const lastState = phaseHistory[phaseHistory.length - 1];
    
    // Remove the last state from history
    setPhaseHistory(prev => prev.slice(0, -1));
    
    // Restore the previous state
    setCurrentRound(lastState.round);
    setCurrentPhase(lastState.phase);
  }, [canGoBack, phaseHistory]);

  const resetGame = useCallback(() => {
    setCurrentRound(1);
    setCurrentPhase('bidding');
    setGameComplete(false);
    setPhaseHistory([]);
  }, []);

  const jumpToPhase = useCallback((round, phase) => {
    if (round < 1 || round > TOTAL_ROUNDS || !PHASES.includes(phase)) {
      console.warn('Invalid round or phase provided to jumpToPhase');
      return false;
    }

    // Save current state to history before jumping
    setPhaseHistory(prev => [...prev, { round: currentRound, phase: currentPhase }]);
    
    setCurrentRound(round);
    setCurrentPhase(phase);
    return true;
  }, [currentRound, currentPhase]);

  const getGameProgress = useCallback(() => {
    const totalPhases = TOTAL_ROUNDS * PHASES.length;
    const completedPhases = (currentRound - 1) * PHASES.length + getCurrentPhaseIndex();
    return Math.min((completedPhases / totalPhases) * 100, 100);
  }, [currentRound, getCurrentPhaseIndex]);

  return {
    // State
    currentRound,
    currentPhase,
    gameComplete,
    
    // Navigation
    nextPhase,
    previousPhase,
    canAdvance,
    canGoBack,
    
    // Utilities
    resetGame,
    jumpToPhase,
    getGameProgress,
    
    // Constants
    totalRounds: TOTAL_ROUNDS,
    phases: PHASES
  };
};