import React from 'react';
import './Score.css';

const Score = ({ gameData }) => {
  // Default values if gameData is not provided
  const {
    currentRound = 1,
    totalRounds = 10,
    scores = [],
    gameStatus = 'In Progress'
  } = gameData || {};

  // Calculate completion percentage
  const completionPercentage = totalRounds > 0 ? Math.round((currentRound / totalRounds) * 100) : 0;
  const isComplete = gameStatus === 'Complete' || currentRound >= totalRounds;

  return (
    <div className="score-container">
      {/* Game Progress Indicator Section */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>Game Progress</h3>
          <div className="round-info">
            <span className="current-round">Round {currentRound}</span>
            <span className="total-rounds">of {totalRounds}</span>
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="progress-percentage">{completionPercentage}%</span>
        </div>
        
        <div className="game-status">
          <span className={`status-indicator ${isComplete ? 'complete' : 'in-progress'}`}>
            {isComplete ? 'Complete' : 'In Progress'}
          </span>
        </div>
      </div>

      {/* Score Table Section */}
      <div className="score-table-section">
        <h3>Scores</h3>
        {scores && scores.length > 0 ? (
          <table className="score-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Score</th>
                <th>Round</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td>{score.player || `Player ${index + 1}`}</td>
                  <td>{score.value || 0}</td>
                  <td>{score.round || currentRound}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-scores">No scores available yet</p>
        )}
      </div>
    </div>
  );
};

export default Score;