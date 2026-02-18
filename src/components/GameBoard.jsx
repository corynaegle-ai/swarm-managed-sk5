import React from 'react';
import { useGameFlow } from '../hooks/useGameFlow';
import RoundCounter from './RoundCounter';
import GameComplete from './GameComplete';
import './GameBoard.css';

const GameBoard = () => {
  const { 
    currentRound, 
    currentPhase, 
    gameComplete, 
    nextPhase, 
    previousPhase,
    canAdvance,
    canGoBack
  } = useGameFlow();

  if (gameComplete) {
    return <GameComplete />;
  }

  const handleBidSubmit = (bidAmount) => {
    // Placeholder for bid logic
    console.log('Bid submitted:', bidAmount);
    if (canAdvance()) {
      nextPhase();
    }
  };

  const handleCardPlay = (card) => {
    // Placeholder for card play logic
    console.log('Card played:', card);
    if (canAdvance()) {
      nextPhase();
    }
  };

  const renderBiddingUI = () => {
    if (currentPhase !== 'bidding') return null;

    return (
      <div className="bidding-ui phase-content">
        <h3>Bidding Phase</h3>
        <div className="bid-controls">
          <button 
            onClick={() => handleBidSubmit(0)}
            className="bid-button"
          >
            Pass (0)
          </button>
          <button 
            onClick={() => handleBidSubmit(1)}
            className="bid-button"
          >
            Bid 1
          </button>
          <button 
            onClick={() => handleBidSubmit(2)}
            className="bid-button"
          >
            Bid 2
          </button>
          <button 
            onClick={() => handleBidSubmit(3)}
            className="bid-button"
          >
            Bid 3
          </button>
        </div>
      </div>
    );
  };

  const renderPlayingUI = () => {
    if (currentPhase !== 'playing') return null;

    const sampleCards = ['♠️A', '♥️K', '♦️Q', '♣️J'];

    return (
      <div className="playing-ui phase-content">
        <h3>Playing Phase</h3>
        <div className="card-hand">
          {sampleCards.map((card, index) => (
            <button
              key={index}
              onClick={() => handleCardPlay(card)}
              className="card-button"
            >
              {card}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderScoringUI = () => {
    if (currentPhase !== 'scoring') return null;

    return (
      <div className="scoring-ui phase-content">
        <h3>Scoring Phase</h3>
        <div className="score-display">
          <p>Round {currentRound} Complete!</p>
          <p>Calculating scores...</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`game-board phase-${currentPhase}`}>
      <div className="game-header">
        <h1>Spades Game</h1>
        <RoundCounter currentRound={currentRound} />
      </div>

      <div className="phase-indicator">
        <h2>Current Phase: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}</h2>
      </div>

      <div className="game-content">
        {renderBiddingUI()}
        {renderPlayingUI()}
        {renderScoringUI()}
      </div>

      <div className="game-controls">
        <button 
          onClick={previousPhase}
          disabled={!canGoBack()}
          className="nav-button"
        >
          Previous Phase
        </button>
        <button 
          onClick={nextPhase}
          disabled={!canAdvance()}
          className="nav-button"
        >
          Next Phase
        </button>
      </div>
    </div>
  );
};

export default GameBoard;