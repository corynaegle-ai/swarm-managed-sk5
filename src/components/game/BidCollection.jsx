import React, { useState } from 'react';
import './BidCollection.css';

const BidCollection = ({ gameState, onBidsSubmit }) => {
  return (
    <div className="bid-collection">
      <div className="round-info">
        <h3>Round {gameState?.currentRound || 0}</h3>
        <p>Hands this round: {gameState?.handsThisRound || 0}</p>
      </div>
    </div>
  );
};

export default BidCollection;