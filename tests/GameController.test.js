/**
 * Tests for GameController
 */

import { GameController } from '../src/controllers/GameController.js';
import { GAME_PHASES } from '../src/utils/gameState.js';

describe('GameController', () => {
  let controller;
  const mockPlayers = [
    { id: 'player1', name: 'Alice' },
    { id: 'player2', name: 'Bob' }
  ];

  beforeEach(() => {
    controller = new GameController();
  });

  describe('Bid Collection Phase', () => {
    beforeEach(() => {
      controller.initializeGame(mockPlayers);
      controller.advancePhase(GAME_PHASES.DEALING);
      controller.startBidCollection();
    });

    test('should require bid collection phase before scoring', () => {
      // Try to advance to scoring without collecting bids
      expect(() => {
        controller.advanceToScoring();
      }).toThrow('Cannot advance to scoring without collecting all bids');
    });

    test('should collect bids and track completion', () => {
      // Submit first bid
      controller.submitBid('player1', 3);
      expect(controller.areAllBidsCollected()).toBe(false);
      
      // Submit second bid
      controller.submitBid('player2', 2);
      expect(controller.areAllBidsCollected()).toBe(true);
      expect(controller.getGameState().phase).toBe(GAME_PHASES.PLAYING);
    });

    test('should allow advancing to scoring after all bids collected', () => {
      // Collect all bids
      controller.submitBid('player1', 3);
      controller.submitBid('player2', 2);
      
      // Should now be able to advance to scoring
      const gameState = controller.advanceToScoring();
      expect(gameState.phase).toBe(GAME_PHASES.SCORING);
    });

    test('should prevent duplicate bid submissions', () => {
      controller.submitBid('player1', 3);
      
      expect(() => {
        controller.submitBid('player1', 2);
      }).toThrow('Player player1 has already submitted a bid');
    });
  });

  describe('Phase Transitions', () => {
    test('should enforce proper phase order', () => {
      controller.initializeGame(mockPlayers);
      
      // Should not skip bid collection phase
      controller.advancePhase(GAME_PHASES.DEALING);
      
      expect(() => {
        controller.advancePhase(GAME_PHASES.PLAYING);
      }).toThrow('Invalid phase transition');
      
      // Should go through bid collection
      controller.advancePhase(GAME_PHASES.BID_COLLECTION);
      controller.submitBid('player1', 3);
      controller.submitBid('player2', 2);
      
      // Now should be in playing phase
      expect(controller.getGameState().phase).toBe(GAME_PHASES.PLAYING);
    });
  });

  describe('Bid Collection Status', () => {
    test('should track bid collection status accurately', () => {
      controller.initializeGame(mockPlayers);
      controller.advancePhase(GAME_PHASES.DEALING);
      controller.startBidCollection();
      
      let status = controller.getBidCollectionStatus();
      expect(status.bidsCollected).toBe(false);
      expect(status.missingBids).toEqual(['player1', 'player2']);
      
      controller.submitBid('player1', 3);
      status = controller.getBidCollectionStatus();
      expect(status.missingBids).toEqual(['player2']);
      
      controller.submitBid('player2', 2);
      status = controller.getBidCollectionStatus();
      expect(status.bidsCollected).toBe(true);
      expect(status.missingBids).toEqual([]);
    });
  });
});