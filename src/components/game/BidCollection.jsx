import React, { useState, useEffect } from 'react';
import './BidCollection.css';

const BidCollection = ({ players, onBidsSubmit, gamePhase }) => {
  const [bids, setBids] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize bids state when players change
  useEffect(() => {
    const initialBids = {};
    players.forEach(player => {
      initialBids[player.id] = bids[player.id] || '';
    });
    setBids(initialBids);
  }, [players]);

  // Handle bid input changes
  const handleBidChange = (playerId, value) => {
    setBids(prev => ({
      ...prev,
      [playerId]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[playerId]) {
      setErrors(prev => ({
        ...prev,
        [playerId]: null
      }));
    }
  };

  // Validate bid data
  const validateBids = () => {
    const newErrors = {};
    let isValid = true;

    players.forEach(player => {
      const bid = bids[player.id];
      if (!bid || bid.trim() === '') {
        newErrors[player.id] = 'Bid is required';
        isValid = false;
      } else if (isNaN(bid) || parseInt(bid) < 0) {
        newErrors[player.id] = 'Bid must be a valid non-negative number';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateBids()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert bids to proper format
      const bidData = {};
      Object.keys(bids).forEach(playerId => {
        bidData[playerId] = parseInt(bids[playerId]);
      });

      await onBidsSubmit(bidData);
      
      // Clear form after successful submission
      setBids({});
      setSubmissionComplete(true);
      
      // Reset completion state after a delay
      setTimeout(() => {
        setSubmissionComplete(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting bids:', error);
      // Handle submission error if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate completion progress
  const getCompletionProgress = () => {
    const completedBids = Object.values(bids).filter(bid => 
      bid && bid.toString().trim() !== ''
    ).length;
    return {
      completed: completedBids,
      total: players.length
    };
  };

  const progress = getCompletionProgress();
  const isFormComplete = progress.completed === progress.total;

  if (submissionComplete) {
    return (
      <div className="bid-collection bid-collection--success">
        <div className="bid-collection__success-message">
          <h3>Bids submitted successfully!</h3>
          <p>All {players.length} players have submitted their bids.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bid-collection">
      <div className="bid-collection__header">
        <h2>Collect Player Bids</h2>
        <div className="bid-collection__progress">
          <span className="bid-collection__progress-text">
            {progress.completed} of {progress.total} players have bid
          </span>
          <div className="bid-collection__progress-bar">
            <div 
              className="bid-collection__progress-fill"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bid-collection__form">
        <div className="bid-collection__players">
          {players.map(player => (
            <div 
              key={player.id} 
              className={`bid-collection__player ${
                errors[player.id] ? 'bid-collection__player--error' : ''
              } ${
                bids[player.id] && bids[player.id].toString().trim() !== '' 
                  ? 'bid-collection__player--complete' 
                  : 'bid-collection__player--incomplete'
              }`}
            >
              <label className="bid-collection__label">
                {player.name}
              </label>
              <input
                type="number"
                min="0"
                value={bids[player.id] || ''}
                onChange={(e) => handleBidChange(player.id, e.target.value)}
                className="bid-collection__input"
                placeholder="Enter bid..."
                disabled={isSubmitting}
              />
              {errors[player.id] && (
                <span className="bid-collection__error">
                  {errors[player.id]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="bid-collection__actions">
          <button
            type="submit"
            disabled={isSubmitting || !isFormComplete}
            className={`bid-collection__submit ${
              isFormComplete ? 'bid-collection__submit--ready' : 'bid-collection__submit--incomplete'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit All Bids'}
          </button>
          
          {!isFormComplete && (
            <p className="bid-collection__incomplete-message">
              Please complete all bid entries before submitting.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BidCollection;