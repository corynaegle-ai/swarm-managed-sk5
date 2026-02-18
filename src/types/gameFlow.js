/**
 * Game flow types and constants
 */

/**
 * Game phases enum
 * @readonly
 * @enum {string}
 */
export const GAME_PHASES = {
  SETUP: 'setup',
  BIDDING: 'bidding',
  SCORING: 'scoring',
  GAME_COMPLETE: 'game_complete'
};

/**
 * Valid phase transitions
 * @readonly
 * @type {Object<string, string[]>}
 */
export const PHASE_TRANSITIONS = {
  [GAME_PHASES.SETUP]: [GAME_PHASES.BIDDING],
  [GAME_PHASES.BIDDING]: [GAME_PHASES.SCORING],
  [GAME_PHASES.SCORING]: [GAME_PHASES.SETUP, GAME_PHASES.GAME_COMPLETE],
  [GAME_PHASES.GAME_COMPLETE]: []
};

/**
 * Game configuration constants
 */
export const GAME_CONFIG = {
  MAX_ROUNDS: 10,
  MIN_ROUNDS: 1
};

/**
 * Game state type definition
 * @typedef {Object} GameState
 * @property {number} currentRound - Current round number (1-10)
 * @property {string} currentPhase - Current game phase
 * @property {boolean} isComplete - Whether the game is complete
 * @property {Date} lastUpdated - Timestamp of last state change
 */

/**
 * Phase advance result type
 * @typedef {Object} PhaseAdvanceResult
 * @property {boolean} success - Whether the advance was successful
 * @property {string} newPhase - The new phase after advancement
 * @property {number} newRound - The new round after advancement
 * @property {string} [error] - Error message if unsuccessful
 */
