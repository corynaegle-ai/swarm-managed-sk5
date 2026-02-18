import React from 'react';
import { useGameFlow } from '../hooks/useGameFlow';

const RoundCounter = () => {
  const { currentRound } = useGameFlow();

  return (
    <div className="round-counter">
      <h2>Round {currentRound} of 10</h2>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentRound / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RoundCounter;