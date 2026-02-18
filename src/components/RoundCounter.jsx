import React from 'react';
import './RoundCounter.css';

const RoundCounter = ({ currentRound, totalRounds = 13 }) => {
  const progress = (currentRound / totalRounds) * 100;

  return (
    <div className="round-counter">
      <div className="round-display">
        <span className="round-label">Round</span>
        <span className="round-number">{currentRound}</span>
        <span className="round-total">of {totalRounds}</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RoundCounter;