import React, { useState } from 'react';
import '../styles/PlayerSetup.css';

const PlayerSetup = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: '' },
    { id: 2, name: '' }
  ]);

  const handlePlayerNameChange = (id, name) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === id ? { ...player, name } : player
      )
    );
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      {players.map(player => (
        <div key={player.id} className="player-input-group">
          <input
            type="text"
            placeholder={`Player ${player.id} name`}
            value={player.name}
            onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
            className="player-name-input"
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerSetup;