import React, { useState, useEffect } from 'react';
import Score from './Score';
import './Game.css';

const Game = () => {
  const [gameState, setGameState] = useState({
    currentRound: 1,
    totalRounds: 5,
    players: [
      { id: 1, name: 'Player 1', scores: [] },
      { id: 2, name: 'Player 2', scores: [] }
    ],
    isGameActive: false,
    winner: null
  });

  const [currentScores, setCurrentScores] = useState({});

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isGameActive: true,
      currentRound: 1,
      players: prev.players.map(player => ({ ...player, scores: [] }))
    }));
    setCurrentScores({});
  };

  const submitRoundScores = () => {
    const updatedPlayers = gameState.players.map(player => ({
      ...player,
      scores: [...player.scores, currentScores[player.id] || 0]
    }));

    const newRound = gameState.currentRound + 1;
    const isGameOver = newRound > gameState.totalRounds;

    let winner = null;
    if (isGameOver) {
      const playerTotals = updatedPlayers.map(player => ({
        ...player,
        total: player.scores.reduce((sum, score) => sum + score, 0)
      }));
      winner = playerTotals.reduce((prev, current) => 
        prev.total > current.total ? prev : current
      );
    }

    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentRound: newRound,
      isGameActive: !isGameOver,
      winner
    });

    setCurrentScores({});
  };

  const updatePlayerScore = (playerId, score) => {
    setCurrentScores(prev => ({
      ...prev,
      [playerId]: parseInt(score) || 0
    }));
  };

  const resetGame = () => {
    setGameState({
      currentRound: 1,
      totalRounds: 5,
      players: [
        { id: 1, name: 'Player 1', scores: [] },
        { id: 2, name: 'Player 2', scores: [] }
      ],
      isGameActive: false,
      winner: null
    });
    setCurrentScores({});
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Score Keeper Game</h1>
        {!gameState.isGameActive && !gameState.winner && (
          <button onClick={startGame} className="start-btn">
            Start New Game
          </button>
        )}
        {gameState.winner && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Winner: {gameState.winner.name}</p>
            <button onClick={resetGame} className="reset-btn">
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="game-content">
        <div className="game-main">
          {gameState.isGameActive && (
            <div className="round-section">
              <h2>Round {gameState.currentRound} of {gameState.totalRounds}</h2>
              <div className="score-inputs">
                {gameState.players.map(player => (
                  <div key={player.id} className="player-input">
                    <label>{player.name}:</label>
                    <input
                      type="number"
                      value={currentScores[player.id] || ''}
                      onChange={(e) => updatePlayerScore(player.id, e.target.value)}
                      placeholder="Enter score"
                    />
                  </div>
                ))}
              </div>
              <button 
                onClick={submitRoundScores}
                className="submit-btn"
                disabled={gameState.players.some(p => !currentScores[p.id] && currentScores[p.id] !== 0)}
              >
                Submit Round Scores
              </button>
            </div>
          )}
        </div>

        <div className="game-sidebar">
          <Score gameState={gameState} />
        </div>
      </div>
    </div>
  );
};

export default Game;