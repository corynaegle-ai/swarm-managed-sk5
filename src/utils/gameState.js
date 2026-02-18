/**
 * Game State Management Utilities
 * Handles game phases, transitions, and state validation
 */

// Game phases enum
export const GAME_PHASES = {
  SETUP: 'setup',
  DEALING: 'dealing',
  BID_COLLECTION: 'bid_collection',
  PLAYING: 'playing',
  SCORING: 'scoring',
  FINISHED: 'finished'
};

// Valid phase transitions
const VALID_TRANSITIONS = {
  [GAME_PHASES.SETUP]: [GAME_PHASES.DEALING],
  [GAME_PHASES.DEALING]: [GAME_PHASES.BID_COLLECTION],
  [GAME_PHASES.BID_COLLECTION]: [GAME_PHASES.PLAYING],
  [GAME_PHASES.PLAYING]: [GAME_PHASES.SCORING],
  [GAME_PHASES.SCORING]: [GAME_PHASES.DEALING, GAME_PHASES.FINISHED],
  [GAME_PHASES.FINISHED]: [GAME_PHASES.SETUP]
};

/**
 * Initialize game state
 * @param {Array} players - Array of player objects
 * @returns {Object} Initial game state
 */
export function initializeGameState(players = []) {
  return {
    phase: GAME_PHASES.SETUP,
    players: players.map(player => ({
      ...player,
      bid: null,
      hasBid: false
    })),
    bidsCollected: false,
    round: 0,
    scores: {}
  };
}

/**
 * Validate if phase transition is allowed
 * @param {string} currentPhase - Current game phase
 * @param {string} targetPhase - Target phase to transition to
 * @returns {boolean} Whether transition is valid
 */
export function isValidPhaseTransition(currentPhase, targetPhase) {
  if (!currentPhase || !targetPhase) {
    throw new Error('Both current and target phases must be provided');
  }
  
  if (!Object.values(GAME_PHASES).includes(currentPhase)) {
    throw new Error(`Invalid current phase: ${currentPhase}`);
  }
  
  if (!Object.values(GAME_PHASES).includes(targetPhase)) {
    throw new Error(`Invalid target phase: ${targetPhase}`);
  }
  
  const allowedTransitions = VALID_TRANSITIONS[currentPhase] || [];
  return allowedTransitions.includes(targetPhase);
}

/**
 * Check if all players have submitted bids
 * @param {Array} players - Array of player objects
 * @returns {boolean} Whether all bids are collected
 */
export function areAllBidsCollected(players) {
  if (!Array.isArray(players) || players.length === 0) {
    return false;
  }
  
  return players.every(player => player.hasBid === true && player.bid !== null);
}

/**
 * Validate bid collection completion before advancing to scoring
 * @param {Object} gameState - Current game state
 * @returns {Object} Validation result with success flag and message
 */
export function validateBidCollectionForScoring(gameState) {
  if (!gameState) {
    return {
      success: false,
      message: 'Game state is required'
    };
  }
  
  if (gameState.phase !== GAME_PHASES.PLAYING) {
    return {
      success: false,
      message: 'Can only advance to scoring from playing phase'
    };
  }
  
  if (!gameState.bidsCollected) {
    return {
      success: false,
      message: 'Cannot advance to scoring without collecting all bids first'
    };
  }
  
  if (!areAllBidsCollected(gameState.players)) {
    return {
      success: false,
      message: 'All players must submit bids before scoring'
    };
  }
  
  return {
    success: true,
    message: 'Ready to advance to scoring'
  };
}

/**
 * Update player bid
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player ID
 * @param {number} bid - Bid value
 * @returns {Object} Updated game state
 */
export function updatePlayerBid(gameState, playerId, bid) {
  if (gameState.phase !== GAME_PHASES.BID_COLLECTION) {
    throw new Error('Bids can only be updated during bid collection phase');
  }
  
  const updatedPlayers = gameState.players.map(player => {
    if (player.id === playerId) {
      return {
        ...player,
        bid: bid,
        hasBid: true
      };
    }
    return player;
  });
  
  const bidsCollected = areAllBidsCollected(updatedPlayers);
  
  return {
    ...gameState,
    players: updatedPlayers,
    bidsCollected
  };
}

/**
 * Transition game state to next phase
 * @param {Object} gameState - Current game state
 * @param {string} targetPhase - Target phase
 * @returns {Object} Updated game state or error
 */
export function transitionGamePhase(gameState, targetPhase) {
  if (!isValidPhaseTransition(gameState.phase, targetPhase)) {
    throw new Error(`Invalid phase transition from ${gameState.phase} to ${targetPhase}`);
  }
  
  // Special validation for advancing to scoring
  if (targetPhase === GAME_PHASES.SCORING) {
    const validation = validateBidCollectionForScoring(gameState);
    if (!validation.success) {
      throw new Error(validation.message);
    }
  }
  
  return {
    ...gameState,
    phase: targetPhase
  };
}