import React, { useState } from 'react';
import '../styles/PlayerSetup.css';

const PlayerSetup = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: '', isValid: false },
    { id: 2, name: '', isValid: false }
  ]);

  const validatePlayerName = (name) => {
    return name.trim().length > 0;
  };

  const handlePlayerNameChange = (playerId, newName) => {
    const isValid = validatePlayerName(newName);
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player.id === playerId 
          ? { ...player, name: newName, isValid }
          : player
      )
    );
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      {players.map(player => (
        <div key={player.id} className="player-input-container">
          <label htmlFor={`player-${player.id}`}>
            Player {player.id} Name:
          </label>
          <input
            id={`player-${player.id}`}
            type="text"
            value={player.name}
            onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
            className={`player-input${player.isValid ? ' valid' : ' invalid'}`}
            placeholder="Enter player name"
          />
          {!player.isValid && (
            <div className="error-message">
              Player name is required
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlayerSetup;