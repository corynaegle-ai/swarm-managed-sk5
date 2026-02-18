import React, { useState } from 'react';
import '../styles/PlayerSetup.css';

const PlayerSetup = () => {
  // Initialize players with touched state to track user interaction
  const [players, setPlayers] = useState([
    { id: 1, name: '', isValid: false, touched: false },
    { id: 2, name: '', isValid: false, touched: false }
  ]);

  // Validate player name - checks trimmed length
  const validatePlayerName = (name) => {
    return name.trim().length > 0;
  };

  // Handle input changes with validation
  const handleInputChange = (playerId, value) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId
          ? {
              ...player,
              name: value,
              isValid: validatePlayerName(value),
              touched: true // Mark as touched when user types
            }
          : player
      )
    );
  };

  // Handle input blur to mark as touched
  const handleInputBlur = (playerId) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId
          ? { ...player, touched: true }
          : player
      )
    );
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      {players.map((player) => {
        // Only show validation styling and errors after user interaction
        const showValidation = player.touched;
        const inputClassName = `player-input${
          showValidation
            ? player.isValid
              ? ' valid'
              : ' invalid'
            : ''
        }`;

        return (
          <div key={player.id} className="player-input-container">
            <label htmlFor={`player-${player.id}`}>
              Player {player.id} Name:
            </label>
            <input
              id={`player-${player.id}`}
              type="text"
              value={player.name}
              onChange={(e) => handleInputChange(player.id, e.target.value)}
              onBlur={() => handleInputBlur(player.id)}
              className={inputClassName}
              placeholder={`Enter Player ${player.id} name`}
            />
            {/* Only show error message if touched and invalid */}
            {showValidation && !player.isValid && (
              <div className="error-message">
                Player name is required
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerSetup;