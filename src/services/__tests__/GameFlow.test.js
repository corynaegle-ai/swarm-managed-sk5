import { GameFlow } from '../GameFlow.js';
import { GAME_PHASES, GAME_CONFIG } from '../../types/gameFlow.js';

describe('GameFlow', () => {
  let gameFlow;

  beforeEach(() => {
    gameFlow = new GameFlow();
  });

  describe('initialization', () => {
    test('should start with default state', () => {
      expect(gameFlow.getCurrentRound()).toBe(1);
      expect(gameFlow.getCurrentPhase()).toBe(GAME_PHASES.SETUP);
      expect(gameFlow.isGameComplete()).toBe(false);
    });
  });

  describe('getCurrentRound', () => {
    test('should return current round number', () => {
      expect(gameFlow.getCurrentRound()).toBe(1);
    });
  });

  describe('getCurrentPhase', () => {
    test('should return current phase', () => {
      expect(gameFlow.getCurrentPhase()).toBe(GAME_PHASES.SETUP);
    });
  });

  describe('isGameComplete', () => {
    test('should return false initially', () => {
      expect(gameFlow.isGameComplete()).toBe(false);
    });

    test('should return true when game is complete', () => {
      // Advance to round 10 scoring phase
      gameFlow.currentRound = 10;
      gameFlow.currentPhase = GAME_PHASES.SCORING;
      
      const result = gameFlow.advancePhase();
      expect(result.success).toBe(true);
      expect(gameFlow.isGameComplete()).toBe(true);
    });
  });

  describe('canAdvancePhase', () => {
    test('should return true for valid transitions', () => {
      expect(gameFlow.canAdvancePhase()).toBe(true);
    });

    test('should return false when game is complete', () => {
      gameFlow.isComplete = true;
      gameFlow.currentPhase = GAME_PHASES.GAME_COMPLETE;
      expect(gameFlow.canAdvancePhase()).toBe(false);
    });
  });

  describe('advancePhase', () => {
    test('should advance from setup to bidding', () => {
      const result = gameFlow.advancePhase();
      
      expect(result.success).toBe(true);
      expect(result.newPhase).toBe(GAME_PHASES.BIDDING);
      expect(result.newRound).toBe(1);
      expect(gameFlow.getCurrentPhase()).toBe(GAME_PHASES.BIDDING);
    });

    test('should advance from bidding to scoring', () => {
      gameFlow.currentPhase = GAME_PHASES.BIDDING;
      
      const result = gameFlow.advancePhase();
      
      expect(result.success).toBe(true);
      expect(result.newPhase).toBe(GAME_PHASES.SCORING);
      expect(result.newRound).toBe(1);
    });

    test('should advance from scoring to next round setup', () => {
      gameFlow.currentPhase = GAME_PHASES.SCORING;
      
      const result = gameFlow.advancePhase();
      
      expect(result.success).toBe(true);
      expect(result.newPhase).toBe(GAME_PHASES.SETUP);
      expect(result.newRound).toBe(2);
    });

    test('should complete game after round 10 scoring', () => {
      gameFlow.currentRound = 10;
      gameFlow.currentPhase = GAME_PHASES.SCORING;
      
      const result = gameFlow.advancePhase();
      
      expect(result.success).toBe(true);
      expect(result.newPhase).toBe(GAME_PHASES.GAME_COMPLETE);
      expect(result.newRound).toBe(10);
      expect(gameFlow.isGameComplete()).toBe(true);
    });

    test('should prevent advancement when game is complete', () => {
      gameFlow.isComplete = true;
      gameFlow.currentPhase = GAME_PHASES.GAME_COMPLETE;
      
      const result = gameFlow.advancePhase();
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Game is already complete');
    });
  });

  describe('10-round game progression', () => {
    test('should progress through all 10 rounds', () => {
      // Test complete game progression
      for (let round = 1; round <= GAME_CONFIG.MAX_ROUNDS; round++) {
        expect(gameFlow.getCurrentRound()).toBe(round);
        
        // Setup -> Bidding
        expect(gameFlow.getCurrentPhase()).toBe(GAME_PHASES.SETUP);
        let result = gameFlow.advancePhase();
        expect(result.success).toBe(true);
        
        // Bidding -> Scoring
        expect(gameFlow.getCurrentPhase()).toBe(GAME_PHASES.BIDDING);
        result = gameFlow.advancePhase();
        expect(result.success).toBe(true);
        
        // Scoring -> Setup (next round) or Game Complete
        expect(gameFlow.getCurrentPhase()).toBe(GAME_PHASES.SCORING);
        result = gameFlow.advancePhase();
        expect(result.success).toBe(true);
        
        if (round === GAME_CONFIG.MAX_ROUNDS) {
          expect(gameFlow.getCurrentPhase()).toBe(GAME_PHASES.GAME_COMPLETE);
          expect(gameFlow.isGameComplete()).toBe(true);
        } else {
          expect(gameFlow.getCurrentPhase()).toBe(GAME_PHASES.SETUP);
          expect(gameFlow.isGameComplete()).toBe(false);
        }
      }
    });
  });

  describe('invalid phase navigation prevention', () => {
    test('should prevent invalid phase transitions', () => {
      gameFlow.currentPhase = GAME_PHASES.GAME_COMPLETE;
      
      const result = gameFlow.advancePhase();
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('state validation', () => {
    test('should validate correct state', () => {
      expect(gameFlow.validateState()).toBe(true);
    });

    test('should invalidate incorrect round bounds', () => {
      gameFlow.currentRound = 0;
      expect(gameFlow.validateState()).toBe(false);
      
      gameFlow.currentRound = 11;
      expect(gameFlow.validateState()).toBe(false);
    });
  });

  describe('resetGame', () => {
    test('should reset to initial state', () => {
      gameFlow.currentRound = 5;
      gameFlow.currentPhase = GAME_PHASES.SCORING;
      gameFlow.isComplete = true;
      
      gameFlow.resetGame();
      
      expect(gameFlow.getCurrentRound()).toBe(1);
      expect(gameFlow.getCurrentPhase()).toBe(GAME_PHASES.SETUP);
      expect(gameFlow.isGameComplete()).toBe(false);
    });
  });
});
