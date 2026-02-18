import { GAME_PHASES, PHASE_TRANSITIONS, GAME_CONFIG } from '../types/gameFlow.js';

/**
 * GameFlow service for managing game rounds and phase transitions
 * Implements state machine pattern for phase management
 */
export class GameFlow {
  /**
   * Initialize GameFlow with default state
   */
  constructor() {
    this.currentRound = 1;
    this.currentPhase = GAME_PHASES.SETUP;
    this.isComplete = false;
    this.lastUpdated = new Date();
  }

  /**
   * Get the current round number
   * @returns {number} Current round (1-10)
   */
  getCurrentRound() {
    return this.currentRound;
  }

  /**
   * Get the current game phase
   * @returns {string} Current phase from GAME_PHASES
   */
  getCurrentPhase() {
    return this.currentPhase;
  }

  /**
   * Check if the game is complete
   * @returns {boolean} True if game is complete
   */
  isGameComplete() {
    return this.isComplete;
  }

  /**
   * Check if phase can be advanced from current state
   * @returns {boolean} True if phase can be advanced
   */
  canAdvancePhase() {
    if (this.isComplete) {
      return false;
    }

    const validTransitions = PHASE_TRANSITIONS[this.currentPhase];
    return validTransitions && validTransitions.length > 0;
  }

  /**
   * Advance to the next phase in the state machine
   * @returns {PhaseAdvanceResult} Result of the phase advancement
   */
  advancePhase() {
    if (this.isComplete) {
      return {
        success: false,
        newPhase: this.currentPhase,
        newRound: this.currentRound,
        error: 'Cannot advance phase: Game is already complete'
      };
    }

    if (!this.canAdvancePhase()) {
      return {
        success: false,
        newPhase: this.currentPhase,
        newRound: this.currentRound,
        error: `Cannot advance from phase: ${this.currentPhase}`
      };
    }

    const validTransitions = PHASE_TRANSITIONS[this.currentPhase];
    let nextPhase;
    let nextRound = this.currentRound;

    // Determine next phase based on current phase
    switch (this.currentPhase) {
      case GAME_PHASES.SETUP:
        nextPhase = GAME_PHASES.BIDDING;
        break;
      
      case GAME_PHASES.BIDDING:
        nextPhase = GAME_PHASES.SCORING;
        break;
      
      case GAME_PHASES.SCORING:
        if (this.currentRound >= GAME_CONFIG.MAX_ROUNDS) {
          nextPhase = GAME_PHASES.GAME_COMPLETE;
          this.isComplete = true;
        } else {
          nextPhase = GAME_PHASES.SETUP;
          nextRound = this.currentRound + 1;
        }
        break;
      
      default:
        return {
          success: false,
          newPhase: this.currentPhase,
          newRound: this.currentRound,
          error: `Invalid current phase: ${this.currentPhase}`
        };
    }

    // Validate the transition is allowed
    if (!validTransitions.includes(nextPhase)) {
      return {
        success: false,
        newPhase: this.currentPhase,
        newRound: this.currentRound,
        error: `Invalid transition from ${this.currentPhase} to ${nextPhase}`
      };
    }

    // Update state
    this.currentPhase = nextPhase;
    this.currentRound = nextRound;
    this.lastUpdated = new Date();

    return {
      success: true,
      newPhase: nextPhase,
      newRound: nextRound
    };
  }

  /**
   * Get complete game state
   * @returns {GameState} Current game state
   */
  getGameState() {
    return {
      currentRound: this.currentRound,
      currentPhase: this.currentPhase,
      isComplete: this.isComplete,
      lastUpdated: this.lastUpdated
    };
  }

  /**
   * Reset game to initial state
   */
  resetGame() {
    this.currentRound = 1;
    this.currentPhase = GAME_PHASES.SETUP;
    this.isComplete = false;
    this.lastUpdated = new Date();
  }

  /**
   * Validate current game state integrity
   * @returns {boolean} True if state is valid
   */
  validateState() {
    // Check round bounds
    if (this.currentRound < GAME_CONFIG.MIN_ROUNDS || 
        this.currentRound > GAME_CONFIG.MAX_ROUNDS) {
      return false;
    }

    // Check phase validity
    if (!Object.values(GAME_PHASES).includes(this.currentPhase)) {
      return false;
    }

    // Check completion state consistency
    if (this.isComplete && this.currentPhase !== GAME_PHASES.GAME_COMPLETE) {
      return false;
    }

    if (!this.isComplete && this.currentPhase === GAME_PHASES.GAME_COMPLETE) {
      return false;
    }

    return true;
  }
}

export default GameFlow;
