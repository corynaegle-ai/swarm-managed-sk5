import React, { useState, useEffect } from 'react';
import ScoreEntry from './ScoreEntry';

const GameBoard = ({ players = [], gameConfig = {}, onGameStateUpdate }) => {
  const [gameState, setGameState] = useState({
    currentRound: 1,
    scores: players.reduce((acc, player) => ({ ...acc, [player.id]: 0 }), {}),
    isRoundComplete: false
  });
  const [showScoreEntry, setShowScoreEntry] = useState(false);

  // Handle round completion
  const handleRoundEnd = () => {
    setShowScoreEntry(true);
    setGameState(prev => ({ ...prev, isRoundComplete: true }));
  };

  // Handle score submission
  const handleScoreSubmit = (roundScores) => {
    try {
      const updatedScores = { ...gameState.scores };
      Object.keys(roundScores).forEach(playerId => {
        updatedScores[playerId] = (updatedScores[playerId] || 0) + roundScores[playerId];
      });

      const newGameState = {
        ...gameState,
        scores: updatedScores,
        currentRound: gameState.currentRound + 1,
        isRoundComplete: false
      };

      setGameState(newGameState);
      setShowScoreEntry(false);
      
      // Notify parent component of state update
      if (onGameStateUpdate) {
        onGameStateUpdate(newGameState);
      }
    } catch (error) {
      console.error('Error submitting scores:', error);
    }
  };

  // Handle score entry cancellation
  const handleScoreCancel = () => {
    setShowScoreEntry(false);
    setGameState(prev => ({ ...prev, isRoundComplete: false }));
  };

  // Simulate round completion for demo purposes
  const completeRound = () => {
    handleRoundEnd();
  };

  return (
    <div className="game-board">
      <div className="game-header">
        <h2>Round {gameState.currentRound}</h2>
        <div className="scores">
          {players.map(player => (
            <div key={player.id} className="player-score">
              <span>{player.name}: {gameState.scores[player.id] || 0}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="game-content">
        <p>Game board content goes here...</p>
        <button 
          onClick={completeRound}
          disabled={gameState.isRoundComplete}
          className="complete-round-btn"
        >
          Complete Round
        </button>
      </div>

      {showScoreEntry && (
        <ScoreEntry 
          players={players}
          onScoreSubmit={handleScoreSubmit}
          onCancel={handleScoreCancel}
        />
      )}
    </div>
  );
};

export default GameBoard;