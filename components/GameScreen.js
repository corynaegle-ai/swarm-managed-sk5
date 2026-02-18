import React, { useState } from 'react';
import PlayerSetup from './PlayerSetup';
import GameBoard from './GameBoard';
import './GameScreen.css';

const GameScreen = () => {
  const [gamePhase, setGamePhase] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);

  const handlePlayersCreated = async (playerData) => {
    try {
      setError(null);
      // Save players via API call
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save players');
      }
      
      const savedPlayers = await response.json();
      setPlayers(savedPlayers);
      setGamePhase('active');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackToSetup = () => {
    setGamePhase('setup');
    setError(null);
  };

  return (
    <div className="game-screen">
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {gamePhase === 'setup' && (
        <div className="setup-phase">
          <PlayerSetup onPlayersCreated={handlePlayersCreated} />
        </div>
      )}
      
      {gamePhase === 'active' && (
        <div className="active-game">
          <div className="game-header">
            <h2>Game in Progress</h2>
            <div className="players-display">
              <h3>Players:</h3>
              <ul>
                {players.map((player, index) => (
                  <li key={player.id || index}>
                    {player.name}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              className="back-to-setup-btn" 
              onClick={handleBackToSetup}
              disabled={false}
            >
              Back to Setup
            </button>
          </div>
          <GameBoard players={players} />
        </div>
      )}
    </div>
  );
};

export default GameScreen;