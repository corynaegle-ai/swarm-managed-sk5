import React, { useState } from 'react';
import './PlayerSetup.css';

const PlayerSetup = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: '', isValid: false },
    { id: 2, name: '', isValid: false }
  ]);

  const isGameReady = () => {
    return players.length >= 2 && 
           players.length <= 8 && 
           players.every(p => p.isValid);
  };

  const handlePlayerNameChange = (id, name) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player.id === id 
          ? { ...player, name: name.trim(), isValid: name.trim().length > 0 }
          : player
      )
    );
  };

  const addPlayer = () => {
    if (players.length < 8) {
      const newId = Math.max(...players.map(p => p.id)) + 1;
      setPlayers([...players, { id: newId, name: '', isValid: false }]);
    }
  };

  const removePlayer = (id) => {
    if (players.length > 2) {
      setPlayers(players.filter(player => player.id !== id));
    }
  };

  const handleStartGame = () => {
    console.log('Starting game with players:', players.map(p => p.name));
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      <div className="players-list">
        {players.map((player) => (
          <div key={player.id} className="player-input-row">
            <input
              type="text"
              placeholder={`Player ${player.id} Name`}
              value={player.name}
              onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
              className={`player-input ${!player.isValid && player.name ? 'invalid' : ''}`}
            />
            {players.length > 2 && (
              <button 
                onClick={() => removePlayer(player.id)}
                className="remove-player-btn"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="setup-controls">
        {players.length < 8 && (
          <button onClick={addPlayer} className="add-player-btn">
            Add Player
          </button>
        )}
        
        <button 
          className="start-game-button"
          disabled={!isGameReady()}
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </div>
      
      <div className="player-count">
        Players: {players.length}/8 
        {!isGameReady() && players.length >= 2 && players.length <= 8 && (
          <span className="validation-hint">All player names must be valid</span>
        )}
      </div>
    </div>
  );
};

export default PlayerSetup;