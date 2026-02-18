import React, { useState } from 'react';
import Score from './Score';

const Game = () => {
  const [gameState, setGameState] = useState({
    players: [
      { id: 1, name: 'Player 1', score: 0 },
      { id: 2, name: 'Player 2', score: 0 },
      { id: 3, name: 'Player 3', score: 0 },
      { id: 4, name: 'Player 4', score: 0 }
    ],
    currentRound: 1,
    totalRounds: 5
  });

  const updatePlayerScore = (playerId, points) => {
    setGameState(prevState => ({
      ...prevState,
      players: prevState.players.map(player =>
        player.id === playerId
          ? { ...player, score: player.score + points }
          : player
      )
    }));
  };

  const nextRound = () => {
    setGameState(prevState => ({
      ...prevState,
      currentRound: Math.min(prevState.currentRound + 1, prevState.totalRounds)
    }));
  };

  const resetGame = () => {
    setGameState(prevState => ({
      ...prevState,
      players: prevState.players.map(player => ({ ...player, score: 0 })),
      currentRound: 1
    }));
  };

  return (
    <div className="game-container" style={{ display: 'flex', height: '100vh' }}>>
      <div className="game-main" style={{ flex: 1, padding: '20px' }}>>
        <h1>Game Interface</h1>
        <div className="game-controls">
          <p>Round {gameState.currentRound} of {gameState.totalRounds}</p>
          <div className="player-actions" style={{ marginBottom: '20px' }}>>
            {gameState.players.map(player => (
              <div key={player.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>>
                <span>{player.name} (Score: {player.score})</span>
                <div style={{ marginTop: '5px' }}>>
                  <button 
                    onClick={() => updatePlayerScore(player.id, 10)}
                    style={{ margin: '0 5px', padding: '5px 10px' }}
                  >
                    +10
                  </button>
                  <button 
                    onClick={() => updatePlayerScore(player.id, 25)}
                    style={{ margin: '0 5px', padding: '5px 10px' }}
                  >
                    +25
                  </button>
                  <button 
                    onClick={() => updatePlayerScore(player.id, 50)}
                    style={{ margin: '0 5px', padding: '5px 10px' }}
                  >
                    +50
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="game-buttons">
            <button 
              onClick={nextRound} 
              disabled={gameState.currentRound >= gameState.totalRounds}
              style={{ margin: '0 10px', padding: '10px 20px' }}
            >
              Next Round
            </button>
            <button 
              onClick={resetGame}
              style={{ margin: '0 10px', padding: '10px 20px' }}
            >
              Reset Game
            </button>
          </div>
        </div>
      </div>
      <div className="score-sidebar" style={{ width: '300px', borderLeft: '1px solid #ccc', padding: '20px' }}>>
        <Score 
          players={gameState.players}
          currentRound={gameState.currentRound}
          totalRounds={gameState.totalRounds}
        />
      </div>
    </div>
  );
};

export default Game;