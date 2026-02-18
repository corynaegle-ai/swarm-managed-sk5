import React, { useState, useEffect } from 'react';
import ScoreEntry from './ScoreEntry';

const GameBoard = ({ gameId, players, onGameUpdate }) => {
  const [showScoreEntry, setShowScoreEntry] = useState(false);
  const [tricksData, setTricksData] = useState({});
  const [bonusData, setBonusData] = useState({});

  // Initialize empty tricks and bonus data for all players
  useEffect(() => {
    if (players && players.length > 0) {
      const initialTricks = {};
      const initialBonus = {};
      players.forEach(player => {
        initialTricks[player.id] = 0;
        initialBonus[player.id] = 0;
      });
      setTricksData(initialTricks);
      setBonusData(initialBonus);
    }
  }, [players]);

  const handleShowScoreEntry = () => {
    setShowScoreEntry(true);
  };

  const handleScoreSubmit = (response) => {
    setShowScoreEntry(false);
    if (onGameUpdate) {
      onGameUpdate(response);
    }
  };

  const handleScoreCancel = () => {
    setShowScoreEntry(false);
  };

  return (
    <div className="game-board">
      <div className="game-board-header">
        <h2>Game Board</h2>
        <button 
          className="btn btn-primary"
          onClick={handleShowScoreEntry}
        >
          Enter Scores
        </button>
      </div>

      {showScoreEntry && (
        <ScoreEntry
          gameId={gameId}
          players={players}
          tricksData={tricksData}
          bonusData={bonusData}
          onScoreSubmit={handleScoreSubmit}
          onCancel={handleScoreCancel}
        />
      )}

      <div className="players-list">
        <h3>Players</h3>
        <ul>
          {players && players.map(player => (
            <li key={player.id}>
              {player.name} - Score: {player.score || 0}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameBoard;