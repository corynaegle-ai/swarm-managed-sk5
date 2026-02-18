/**
 * Game Controller
 * Manages game flow, phase transitions, and bid collection
 */

import {
  GAME_PHASES,
  initializeGameState,
  isValidPhaseTransition,
  areAllBidsCollected,
  validateBidCollectionForScoring,
  updatePlayerBid,
  transitionGamePhase
} from '../utils/gameState.js';

export class GameController {
  constructor() {
    this.gameState = null;
    this.eventHandlers = {};
  }

  /**
   * Initialize a new game
   * @param {Array} players - Array of player objects
   */
  initializeGame(players) {
    if (!Array.isArray(players) || players.length === 0) {
      throw new Error('At least one player is required to initialize game');
    }
    
    this.gameState = initializeGameState(players);
    this.emit('gameInitialized', this.gameState);
    return this.gameState;
  }

  /**
   * Get current game state
   * @returns {Object} Current game state
   */
  getGameState() {
    return this.gameState;
  }

  /**
   * Advance game to next phase
   * @param {string} targetPhase - Target phase to advance to
   * @returns {Object} Updated game state
   */
  advancePhase(targetPhase) {
    if (!this.gameState) {
      throw new Error('Game must be initialized before advancing phases');
    }

    try {
      // Enforce bid collection completion before scoring
      if (targetPhase === GAME_PHASES.SCORING) {
        const validation = validateBidCollectionForScoring(this.gameState);
        if (!validation.success) {
          throw new Error(validation.message);
        }
      }

      this.gameState = transitionGamePhase(this.gameState, targetPhase);
      this.emit('phaseChanged', {
        previousPhase: this.gameState.phase,
        currentPhase: targetPhase,
        gameState: this.gameState
      });
      
      return this.gameState;
    } catch (error) {
      this.emit('error', {
        type: 'phase_transition_error',
        message: error.message,
        currentPhase: this.gameState.phase,
        targetPhase
      });
      throw error;
    }
  }

  /**
   * Start bid collection phase
   * @returns {Object} Updated game state
   */
  startBidCollection() {
    if (!this.gameState) {
      throw new Error('Game must be initialized before starting bid collection');
    }

    if (this.gameState.phase !== GAME_PHASES.DEALING) {
      throw new Error('Bid collection can only start after dealing phase');
    }

    this.gameState = transitionGamePhase(this.gameState, GAME_PHASES.BID_COLLECTION);
    this.emit('bidCollectionStarted', this.gameState);
    return this.gameState;
  }

  /**
   * Submit a player's bid
   * @param {string} playerId - Player ID
   * @param {number} bid - Bid amount
   * @returns {Object} Updated game state
   */
  submitBid(playerId, bid) {
    if (!this.gameState) {
      throw new Error('Game must be initialized before submitting bids');
    }

    if (this.gameState.phase !== GAME_PHASES.BID_COLLECTION) {
      throw new Error('Bids can only be submitted during bid collection phase');
    }

    if (typeof bid !== 'number' || bid < 0) {
      throw new Error('Bid must be a non-negative number');
    }

    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    if (player.hasBid) {
      throw new Error(`Player ${playerId} has already submitted a bid`);
    }

    try {
      this.gameState = updatePlayerBid(this.gameState, playerId, bid);
      
      this.emit('bidSubmitted', {
        playerId,
        bid,
        allBidsCollected: this.gameState.bidsCollected,
        gameState: this.gameState
      });

      // Auto-advance to playing phase when all bids are collected
      if (this.gameState.bidsCollected) {
        this.advancePhase(GAME_PHASES.PLAYING);
      }

      return this.gameState;
    } catch (error) {
      this.emit('error', {
        type: 'bid_submission_error',
        message: error.message,
        playerId,
        bid
      });
      throw error;
    }
  }

  /**
   * Check if all bids have been collected
   * @returns {boolean} Whether all bids are collected
   */
  areAllBidsCollected() {
    if (!this.gameState) {
      return false;
    }
    return areAllBidsCollected(this.gameState.players);
  }

  /**
   * Attempt to advance to scoring phase with validation
   * @returns {Object} Updated game state
   */
  advanceToScoring() {
    if (!this.gameState) {
      throw new Error('Game must be initialized before advancing to scoring');
    }

    // Enforce bid collection completion
    const validation = validateBidCollectionForScoring(this.gameState);
    if (!validation.success) {
      throw new Error(validation.message);
    }

    return this.advancePhase(GAME_PHASES.SCORING);
  }

  /**
   * Get bid collection status
   * @returns {Object} Bid collection status information
   */
  getBidCollectionStatus() {
    if (!this.gameState) {
      return {
        phase: null,
        bidsCollected: false,
        playerBids: [],
        missingBids: []
      };
    }

    const playerBids = this.gameState.players.map(player => ({
      playerId: player.id,
      hasBid: player.hasBid,
      bid: player.hasBid ? player.bid : null
    }));

    const missingBids = this.gameState.players
      .filter(player => !player.hasBid)
      .map(player => player.id);

    return {
      phase: this.gameState.phase,
      bidsCollected: this.gameState.bidsCollected,
      playerBids,
      missingBids
    };
  }

  /**
   * Register event handler
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  /**
   * Emit event to registered handlers
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Reset game state
   */
  reset() {
    this.gameState = null;
    this.emit('gameReset');
  }
}