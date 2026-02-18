import React from 'react';
import './Score.css';

const Score = ({ gameState }) => {
  // Handle undefined or empty gameState
  if (!gameState || !gameState.players || !gameState.rounds) {
    return (
      <div className="score-container">
        <p>No game data available</p>
      </div>
    );
  }

  const { players, rounds } = gameState;
  
  // Handle empty players or rounds arrays
  if (players.length === 0) {
    return (
      <div className="score-container">
        <p>No players in the game</p>
      </div>
    );
  }

  // Calculate total score for each player
  const calculateTotal = (player) => {
    if (!player.scores || !Array.isArray(player.scores)) return 0;
    return player.scores.reduce((sum, score) => sum + (score || 0), 0);
  };

  return (
    <div className="score-container">
      <table className="score-table">
        <thead>
          <tr>
            <th>Player</th>
            {rounds.map((round, index) => (
              <th key={`round-${index}`}>Round {index + 1}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, playerIndex) => (
            <tr key={`player-${playerIndex}`}>
              <td className="player-name">{player.name || `Player ${playerIndex + 1}`}</td>
              {rounds.map((round, roundIndex) => (
                <td key={`score-${playerIndex}-${roundIndex}`} className="score-cell">
                  {player.scores && player.scores[roundIndex] !== undefined 
                    ? player.scores[roundIndex] 
                    : '-'
                  }
                </td>
              ))}
              <td className="total-score">{calculateTotal(player)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Score;