import React, { useState } from 'react';
import '../../styles/components/ScoreEntry.css';

const ScoreEntry = ({ players = [], onScoreSubmit, onCancel }) => {
  const [scores, setScores] = useState(
    players.reduce((acc, player) => ({ ...acc, [player.id]: 0 }), {})
  );
  const [errors, setErrors] = useState({});

  const handleScoreChange = (playerId, value) => {
    const numValue = parseInt(value) || 0;
    setScores(prev => ({ ...prev, [playerId]: numValue }));
    
    // Clear error for this player if they now have a valid score
    if (errors[playerId] && numValue >= 0) {
      setErrors(prev => ({ ...prev, [playerId]: null }));
    }
  };

  const validateScores = () => {
    const newErrors = {};
    let isValid = true;

    players.forEach(player => {
      const score = scores[player.id];
      if (score === undefined || score < 0) {
        newErrors[player.id] = 'Score must be 0 or greater';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateScores()) {
      onScoreSubmit(scores);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="score-entry-overlay">
      <div className="score-entry-modal">
        <h3>Enter Round Scores</h3>
        
        <form onSubmit={handleSubmit} className="score-entry-form">
          {players.map(player => (
            <div key={player.id} className="player-score-input">
              <label htmlFor={`score-${player.id}`}>
                {player.name}:
              </label>
              <input
                id={`score-${player.id}`}
                type="number"
                min="0"
                value={scores[player.id] || ''}
                onChange={(e) => handleScoreChange(player.id, e.target.value)}
                className={errors[player.id] ? 'error' : ''}
                placeholder="0"
              />
              {errors[player.id] && (
                <span className="error-message">{errors[player.id]}</span>
              )}
            </div>
          ))}
          
          <div className="score-entry-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit Scores
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreEntry;