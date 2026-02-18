import React from 'react';

const GameComplete = () => {
  const handleNewGame = () => {
    // Placeholder for new game logic
    window.location.reload();
  };

  return (
    <div className="game-complete">
      <div className="completion-card">
        <h1>🎉 Game Complete! 🎉</h1>
        <div className="final-scores">
          <h2>Final Scores</h2>
          <div className="score-list">
            <div className="score-item">
              <span className="player-name">Player 1:</span>
              <span className="player-score">450 points</span>
            </div>
            <div className="score-item">
              <span className="player-name">Player 2:</span>
              <span className="player-score">380 points</span>
            </div>
            <div className="score-item">
              <span className="player-name">Player 3:</span>
              <span className="player-score">420 points</span>
            </div>
            <div className="score-item">
              <span className="player-name">Player 4:</span>
              <span className="player-score">390 points</span>
            </div>
          </div>
        </div>
        <div className="winner-announcement">
          <h2>🏆 Player 1 Wins! 🏆</h2>
        </div>
        <button onClick={handleNewGame} className="new-game-button">
          Start New Game
        </button>
      </div>
      
      <style jsx>{`
        .game-complete {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        
        .completion-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
        }
        
        .completion-card h1 {
          color: #333;
          margin-bottom: 30px;
          font-size: 2.5rem;
        }
        
        .final-scores h2 {
          color: #555;
          margin-bottom: 20px;
        }
        
        .score-list {
          margin-bottom: 30px;
        }
        
        .score-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        
        .player-name {
          font-weight: bold;
          color: #666;
        }
        
        .player-score {
          color: #333;
          font-weight: bold;
        }
        
        .winner-announcement {
          margin: 30px 0;
          padding: 20px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          border-radius: 10px;
        }
        
        .winner-announcement h2 {
          margin: 0;
          color: #fff;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .new-game-button {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .new-game-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 600px) {
          .completion-card {
            padding: 20px;
          }
          
          .completion-card h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GameComplete;