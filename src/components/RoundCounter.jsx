import React from 'react';
import { useGameFlow } from '../hooks/useGameFlow';
import './RoundCounter.css';

const RoundCounter = () => {
  const { currentRound, currentPhase } = useGameFlow();

  // Capitalize first letter of phase
  const capitalizedPhase = currentPhase ? 
    currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1) : '';

  return (
    <div className="round-counter">
      <div className="round-info">
        <span className="round-number">Round {currentRound}</span>
        <span className="phase-separator"> - </span>
        <span className={`phase-indicator phase-${currentPhase}`}>
          {capitalizedPhase}
        </span>
      </div>
    </div>
  );
};

export default RoundCounter;