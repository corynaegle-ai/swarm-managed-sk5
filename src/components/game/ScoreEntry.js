import React, { useState, useEffect } from 'react';
import './../../styles/components/ScoreEntry.css';
import { gameService } from '../../services/gameService';

const ScoreEntry = ({ gameId, players, tricksData, bonusData, onScoreSubmit, onCancel }) => {
  const [calculatedScores, setCalculatedScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate preview scores whenever tricks or bonus data changes
  useEffect(() => {
    if (tricksData && bonusData) {
      const scores = calculatePreviewScores();
      setCalculatedScores(scores);
    }
  }, [tricksData, bonusData]);

  const calculatePreviewScores = () => {
    const scores = {};
    
    players.forEach(player => {
      const playerId = player.id;
      const tricks = tricksData[playerId] || 0;
      const bonus = bonusData[playerId] || 0;
      
      // Basic scoring logic: 10 points per trick + bonus points
      const baseScore = tricks * 10;
      const totalScore = baseScore + bonus;
      
      scores[playerId] = {
        tricks,
        bonus,
        baseScore,
        totalScore
      };
    });
    
    return scores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!calculatedScores || Object.keys(calculatedScores).length === 0) {
      setError('No scores calculated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const scoresData = {
        gameId,
        roundScores: calculatedScores
      };
      
      const response = await gameService.submitScores(gameId, scoresData);
      onScoreSubmit(response);
    } catch (err) {
      setError(err.message || 'Failed to submit scores');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="score-entry">
      <div className="score-entry-header">
        <h3>Score Entry</h3>
      </div>

      {error && (
        <div className="score-entry-error">
          {error}
        </div>
      )}

      {/* Score Preview Section */}
      <div className="score-preview">
        <h4>Calculated Scores Preview</h4>
        <div className="score-preview-table">
          <div className="score-preview-header">
            <span>Player</span>
            <span>Tricks</span>
            <span>Bonus</span>
            <span>Base Score</span>
            <span>Total Score</span>
          </div>
          {players.map(player => {
            const playerScore = calculatedScores[player.id] || {};
            return (
              <div key={player.id} className="score-preview-row">
                <span className="player-name">{player.name}</span>
                <span className="tricks-count">{playerScore.tricks || 0}</span>
                <span className="bonus-points">{playerScore.bonus || 0}</span>
                <span className="base-score">{playerScore.baseScore || 0}</span>
                <span className="total-score">{playerScore.totalScore || 0}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="score-entry-actions">
        <button 
          type="button" 
          className="btn btn-cancel"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-submit"
          onClick={handleSubmit}
          disabled={loading || !calculatedScores || Object.keys(calculatedScores).length === 0}
        >
          {loading ? 'Submitting...' : 'Submit Scores'}
        </button>
      </div>
    </div>
  );
};

export default ScoreEntry;