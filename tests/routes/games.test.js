const request = require('supertest');
const express = require('express');
const gamesRouter = require('../../src/routes/games');
const GameFlow = require('../../src/services/GameFlow');

// Mock GameFlow service
jest.mock('../../src/services/GameFlow');

const app = express();
app.use(express.json());
app.use('/api/games', gamesRouter);

describe('Games Router - Game Flow Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/games/:id/status', () => {
    it('should return current game state', async () => {
      const mockGameState = {
        gameId: 1,
        phase: 'planning',
        round: 1,
        status: 'active',
        players: ['player1', 'player2'],
        currentPlayer: 'player1'
      };
      
      GameFlow.getGameState.mockResolvedValue(mockGameState);
      
      const response = await request(app)
        .get('/api/games/1/status')
        .expect(200);
        
      expect(response.body).toEqual(mockGameState);
      expect(GameFlow.getGameState).toHaveBeenCalledWith(1);
    });

    it('should return 404 for non-existent game', async () => {
      GameFlow.getGameState.mockResolvedValue(null);
      
      const response = await request(app)
        .get('/api/games/999/status')
        .expect(404);
        
      expect(response.body.error).toBe('Game not found');
    });

    it('should return 400 for invalid game ID', async () => {
      const response = await request(app)
        .get('/api/games/invalid/status')
        .expect(400);
        
      expect(response.body.error).toBe('Invalid game ID');
    });
  });

  describe('POST /api/games/:id/advance-phase', () => {
    it('should advance phase successfully', async () => {
      const mockResult = {
        success: true,
        gameId: 1,
        previousPhase: 'planning',
        currentPhase: 'action',
        round: 1
      };
      
      GameFlow.advancePhase.mockResolvedValue(mockResult);
      
      const response = await request(app)
        .post('/api/games/1/advance-phase')
        .expect(200);
        
      expect(response.body.message).toBe('Phase advanced successfully');
      expect(response.body.currentPhase).toBe('action');
      expect(GameFlow.advancePhase).toHaveBeenCalledWith(1);
    });

    it('should return 400 for invalid transition', async () => {
      const mockResult = {
        success: false,
        error: 'Invalid phase transition'
      };
      
      GameFlow.advancePhase.mockResolvedValue(mockResult);
      
      const response = await request(app)
        .post('/api/games/1/advance-phase')
        .expect(400);
        
      expect(response.body.error).toBe('Invalid phase transition');
    });

    it('should handle exceptions with 400 for transition errors', async () => {
      GameFlow.advancePhase.mockRejectedValue(new Error('Invalid transition: cannot advance from current state'));
      
      const response = await request(app)
        .post('/api/games/1/advance-phase')
        .expect(400);
        
      expect(response.body.error).toContain('Invalid transition');
    });
  });

  describe('POST /api/games/:id/next-round', () => {
    it('should advance round successfully', async () => {
      const mockResult = {
        success: true,
        gameId: 1,
        previousRound: 1,
        currentRound: 2,
        phase: 'planning'
      };
      
      GameFlow.nextRound.mockResolvedValue(mockResult);
      
      const response = await request(app)
        .post('/api/games/1/next-round')
        .expect(200);
        
      expect(response.body.message).toBe('Round advanced successfully');
      expect(response.body.currentRound).toBe(2);
      expect(GameFlow.nextRound).toHaveBeenCalledWith(1);
    });

    it('should return 400 for invalid round transition', async () => {
      const mockResult = {
        success: false,
        error: 'Cannot advance round: game not in final phase'
      };
      
      GameFlow.nextRound.mockResolvedValue(mockResult);
      
      const response = await request(app)
        .post('/api/games/1/next-round')
        .expect(400);
        
      expect(response.body.error).toBe('Cannot advance round: game not in final phase');
    });

    it('should handle exceptions with 400 for transition errors', async () => {
      GameFlow.nextRound.mockRejectedValue(new Error('Cannot advance round in current state'));
      
      const response = await request(app)
        .post('/api/games/1/next-round')
        .expect(400);
        
      expect(response.body.error).toContain('Cannot advance round');
    });

    it('should return 400 for invalid game ID', async () => {
      const response = await request(app)
        .post('/api/games/invalid/next-round')
        .expect(400);
        
      expect(response.body.error).toBe('Invalid game ID');
    });
  });
});