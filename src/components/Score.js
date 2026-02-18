import React from 'react';
import './Score.css';

const Score = ({ players, gameComplete }) => {
  // Sort players by total score in descending order for rankings
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  const getOrdinalSuffix = (position) => {
    const lastDigit = position % 10;
    const lastTwoDigits = position % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return 'th';
    }
    
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  if (gameComplete) {
    return (
      <div className="score-container">
        <h2>Final Rankings</h2>
        <div className="rankings">
          {sortedPlayers.map((player, index) => {
            const position = index + 1;
            const isWinner = position === 1;
            
            return (
              <div 
                key={player.id || player.name} 
                className={`ranking-item ${isWinner ? 'winner' : ''}`}
              >
                <div className="position">
                  {position}{getOrdinalSuffix(position)}
                  {isWinner && <span className="trophy">🏆</span>}
                </div>
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  <span className="final-score">{player.score} points</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Regular score display during game
  return (
    <div className="score-container">
      <h2>Current Scores</h2>
      <div className="current-scores">
        {players.map((player) => (
          <div key={player.id || player.name} className="score-item">
            <span className="player-name">{player.name}</span>
            <span className="current-score">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Score;