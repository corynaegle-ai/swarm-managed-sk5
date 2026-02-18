/**
 * Tests for game state utilities
 */

import {
  GAME_PHASES,
  initializeGameState,
  isValidPhaseTransition,
  areAllBidsCollected,
  validateBidCollectionForScoring,
  updatePlayerBid,
  transitionGamePhase
} from '../src/utils/gameState.js';

describe('Game State Utilities', () => {
  const mockPlayers = [
    { id: 'player1', name: 'Alice' },
    { id: 'player2', name: 'Bob' }
  ];

  describe('initializeGameState', () => {
    test('should initialize game state with proper structure', () => {
      const gameState = initializeGameState(mockPlayers);
      
      expect(gameState.phase).toBe(GAME_PHASES.SETUP);
      expect(gameState.players).toHaveLength(2);
      expect(gameState.players[0]).toHaveProperty('bid', null);
      expect(gameState.players[0]).toHaveProperty('hasBid', false);
      expect(gameState.bidsCollected).toBe(false);
    });
  });

  describe('isValidPhaseTransition', () => {
    test('should allow valid transitions', () => {
      expect(isValidPhaseTransition(GAME_PHASES.DEALING, GAME_PHASES.BID_COLLECTION)).toBe(true);
      expect(isValidPhaseTransition(GAME_PHASES.BID_COLLECTION, GAME_PHASES.PLAYING)).toBe(true);
      expect(isValidPhaseTransition(GAME_PHASES.PLAYING, GAME_PHASES.SCORING)).toBe(true);
    });

    test('should reject invalid transitions', () => {
      expect(isValidPhaseTransition(GAME_PHASES.SETUP, GAME_PHASES.SCORING)).toBe(false);
      expect(isValidPhaseTransition(GAME_PHASES.BID_COLLECTION, GAME_PHASES.SCORING)).toBe(false);
    });
  });

  describe('areAllBidsCollected', () => {
    test('should return true when all players have bids', () => {
      const players = [
        { id: 'p1', hasBid: true, bid: 3 },
        { id: 'p2', hasBid: true, bid: 2 }
      ];
      expect(areAllBidsCollected(players)).toBe(true);
    });

    test('should return false when some players missing bids', () => {
      const players = [
        { id: 'p1', hasBid: true, bid: 3 },
        { id: 'p2', hasBid: false, bid: null }
      ];
      expect(areAllBidsCollected(players)).toBe(false);
    });
  });

  describe('validateBidCollectionForScoring', () => {
    test('should validate successful bid collection', () => {
      const gameState = {
        phase: GAME_PHASES.PLAYING,
        bidsCollected: true,
        players: [
          { id: 'p1', hasBid: true, bid: 3 },
          { id: 'p2', hasBid: true, bid: 2 }
        ]
      };
      
      const result = validateBidCollectionForScoring(gameState);
      expect(result.success).toBe(true);
    });

    test('should reject when bids not collected', () => {
      const gameState = {
        phase: GAME_PHASES.PLAYING,
        bidsCollected: false,
        players: [
          { id: 'p1', hasBid: false, bid: null },
          { id: 'p2', hasBid: true, bid: 2 }
        ]
      };
      
      const result = validateBidCollectionForScoring(gameState);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Cannot advance to scoring without collecting all bids');
    });
  });
});