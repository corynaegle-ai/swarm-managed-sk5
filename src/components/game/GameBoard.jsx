import React, { useState } from 'react';
import BidCollection from './BidCollection';

const GameBoard = ({ gameState, players }) => {
  const [currentPhase, setCurrentPhase] = useState('bidding');
  
  // Handle bid submission from BidCollection component
  const handleBidsSubmit = async (bidData) => {
    try {
      console.log('Bids submitted:', bidData);
      // Here you would typically send the bid data to your game logic
      // For now, we'll just log it and move to next phase
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update game state or move to next phase
      setCurrentPhase('results');
      
    } catch (error) {
      console.error('Error processing bids:', error);
      throw error;
    }
  };
  
  return (
    <div className="game-board">
      <div className="game-board__header">
        <h1>Spades Game</h1>
        <div className="game-board__phase">
          Current Phase: {currentPhase}
        </div>
      </div>
      
      <div className="game-board__content">
        {currentPhase === 'bidding' && (
          <BidCollection 
            players={players}
            onBidsSubmit={handleBidsSubmit}
            gamePhase={currentPhase}
          />
        )}
        
        {currentPhase === 'results' && (
          <div className="game-board__results">
            <h2>Bidding Complete!</h2>
            <p>All players have submitted their bids. Game continues...</p>
            <button 
              onClick={() => setCurrentPhase('bidding')}
              className="game-board__reset-btn"
            >
              Start New Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;