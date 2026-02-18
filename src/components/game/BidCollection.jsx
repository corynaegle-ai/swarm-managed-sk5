import React, { useState, useEffect } from 'react';
import './BidCollection.css';

const BidCollection = ({ gameState, onBidsSubmit }) => {
  const [bids, setBids] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Initialize bids for all players
  useEffect(() => {
    if (gameState?.players) {
      const initialBids = {};
      gameState.players.forEach(player => {
        initialBids[player.id] = '';
      });
      setBids(initialBids);
    }
  }, [gameState?.players]);

  // Validate bids whenever they change
  useEffect(() => {
    validateBids();
  }, [bids, gameState]);

  const validateBids = () => {
    const newErrors = {};
    let valid = true;

    // Check each player's bid
    Object.entries(bids).forEach(([playerId, bid]) => {
      const bidValue = parseInt(bid, 10);
      
      // Check if bid is empty
      if (bid === '') {
        newErrors[playerId] = 'Bid is required';
        valid = false;
        return;
      }

      // Check if bid is a valid number
      if (isNaN(bidValue) || bidValue < 0) {
        newErrors[playerId] = 'Bid must be 0 or a positive integer';
        valid = false;
        return;
      }

      // Check if bid is an integer
      if (bidValue !== parseFloat(bid)) {
        newErrors[playerId] = 'Bid must be a whole number';
        valid = false;
        return;
      }
    });

    // Check total bids constraint (cannot equal hand count)
    if (valid && gameState?.handCount) {
      const totalBids = Object.values(bids).reduce((sum, bid) => {
        const bidValue = parseInt(bid, 10);
        return sum + (isNaN(bidValue) ? 0 : bidValue);
      }, 0);

      if (totalBids === gameState.handCount) {
        // Add error to the last player (or first available)
        const playerIds = Object.keys(bids);
        if (playerIds.length > 0) {
          const lastPlayerId = playerIds[playerIds.length - 1];
          newErrors[lastPlayerId] = `Total bids cannot equal ${gameState.handCount} (hand count)`;
          valid = false;
        }
      }
    }

    setErrors(newErrors);
    setIsValid(valid && Object.keys(bids).length > 0);
  };

  const handleBidChange = (playerId, value) => {
    setBids(prev => ({
      ...prev,
      [playerId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid && onBidsSubmit) {
      const processedBids = {};
      Object.entries(bids).forEach(([playerId, bid]) => {
        processedBids[playerId] = parseInt(bid, 10);
      });
      onBidsSubmit(processedBids);
    }
  };

  const getPlayerName = (playerId) => {
    const player = gameState?.players?.find(p => p.id === playerId);
    return player?.name || `Player ${playerId}`;
  };

  if (!gameState?.players || gameState.players.length === 0) {
    return <div className="bid-collection-loading">Loading players...</div>;
  }

  return (
    <div className="bid-collection">
      <h3 className="bid-collection-title">Enter Your Bids</h3>
      <p className="bid-collection-info">
        Hand Count: <strong>{gameState.handCount || 0}</strong>
        <br />
        <em>Total bids cannot equal the hand count</em>
      </p>
      
      <form onSubmit={handleSubmit} className="bid-form">
        <div className="bid-inputs">
          {gameState.players.map(player => (
            <div key={player.id} className="bid-input-group">
              <label htmlFor={`bid-${player.id}`} className="bid-label">
                {getPlayerName(player.id)}
              </label>
              <input
                id={`bid-${player.id}`}
                type="number"
                min="0"
                step="1"
                value={bids[player.id] || ''}
                onChange={(e) => handleBidChange(player.id, e.target.value)}
                className={`bid-input ${errors[player.id] ? 'bid-input-error' : ''}`}
                placeholder="0"
              />
              {errors[player.id] && (
                <div className="bid-error-message">
                  {errors[player.id]}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button 
          type="submit" 
          className={`bid-submit-button ${!isValid ? 'bid-submit-disabled' : ''}`}
          disabled={!isValid}
        >
          Submit Bids
        </button>
      </form>
    </div>
  );
};

export default BidCollection;