import React from 'react';
import { useGameFlow } from '../hooks/useGameFlow';

const GameComplete = () => {
  const { gameComplete, scores, resetGame } = useGameFlow();

  if (!gameComplete) return null;

  const winner = scores.player > scores.computer ? 'Player' : 
                 scores.computer > scores.player ? 'Computer' : 'Tie';

  return (
    <div className="game-complete-modal">
      <div className="modal-overlay" onClick={resetGame}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="confetti-animation">🎉</div>
          <h1 className="celebration-title">Game Complete!</h1>
          <div className="final-scores">
            <h2>Final Scores</h2>
            <div className="score-display">
              <div className="score-item">
                <span className="score-label">Player:</span>
                <span className="score-value">{scores.player}</span>
              </div>
              <div className="score-item">
                <span className="score-label">Computer:</span>
                <span className="score-value">{scores.computer}</span>
              </div>
            </div>
            <div className="winner-announcement">
              {winner === 'Tie' ? 'It\'s a Tie!' : `${winner} Wins!`}
            </div>
          </div>
          <button className="play-again-btn" onClick={resetGame}>
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComplete;