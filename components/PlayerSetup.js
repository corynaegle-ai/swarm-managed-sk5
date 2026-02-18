import React, { useState } from 'react';
import '../styles/PlayerSetup.css';

const PlayerSetup = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: '' },
    { id: 2, name: '' }
  ]);

  const addPlayer = () => {
    if (players.length < 8) {
      const newId = Math.max(...players.map(p => p.id)) + 1;
      setPlayers([...players, { id: newId, name: '' }]);
    }
  };

  const removePlayer = (playerId) => {
    if (players.length > 2) {
      setPlayers(players.filter(player => player.id !== playerId));
    }
  };

  const updatePlayerName = (playerId, newName) => {
    setPlayers(players.map(player => 
      player.id === playerId ? { ...player, name: newName } : player
    ));
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      
      <div className="player-inputs">
        {players.map((player, index) => (
          <div key={player.id} className="player-input-group">
            <label htmlFor={`player-${player.id}`}>
              Player {index + 1}:
            </label>
            <input
              id={`player-${player.id}`}
              type="text"
              value={player.name}
              onChange={(e) => updatePlayerName(player.id, e.target.value)}
              placeholder={`Enter Player ${index + 1} name`}
              className="player-name-input"
            />
            {players.length > 2 && (
              <button
                type="button"
                onClick={() => removePlayer(player.id)}
                className="remove-player-btn"
                aria-label={`Remove Player ${index + 1}`}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPlayer}
        disabled={players.length >= 8}
        className={`add-player-btn ${players.length >= 8 ? 'disabled' : ''}`}
      >
        Add Player
      </button>
      
      <div className="player-count">
        Players: {players.length} / 8
      </div>
    </div>
  );
};

export default PlayerSetup;