const Player = require('../models/Player');
const db = require('../database/connection');

// Mock database connection
jest.mock('../database/connection');

describe('Player Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    test('should validate name length between 1-50 characters', () => {
      // Test valid name
      const validPlayer = new Player({ name: 'John Doe', gameId: 'game123' });
      const validResult = validPlayer.validate();
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      // Test empty name
      const emptyNamePlayer = new Player({ name: '', gameId: 'game123' });
      const emptyResult = emptyNamePlayer.validate();
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.errors).toContain('Name must be between 1 and 50 characters');

      // Test name too long
      const longName = 'a'.repeat(51);
      const longNamePlayer = new Player({ name: longName, gameId: 'game123' });
      const longResult = longNamePlayer.validate();
      expect(longResult.isValid).toBe(false);
      expect(longResult.errors).toContain('Name must be between 1 and 50 characters');

      // Test missing name
      const noNamePlayer = new Player({ gameId: 'game123' });
      const noNameResult = noNamePlayer.validate();
      expect(noNameResult.isValid).toBe(false);
      expect(noNameResult.errors).toContain('Name is required and must be a string');
    });

    test('should require gameId', () => {
      const player = new Player({ name: 'John Doe' });
      const result = player.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('GameId is required');
    });
  });

  describe('Creation', () => {
    test('should create player with unique UUID and gameId', async () => {
      const mockResult = {
        rows: [{
          id: 'uuid-123',
          name: 'John Doe',
          game_id: 'game123',
          created_at: new Date()
        }]
      };
      
      db.query.mockResolvedValue(mockResult);

      const player = new Player({ name: 'John Doe', gameId: 'game123' });
      const result = await player.create();

      expect(result).toBeInstanceOf(Player);
      expect(result.name).toBe('John Doe');
      expect(result.gameId).toBe('game123');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO players'),
        expect.arrayContaining(['John Doe', 'game123'])
      );
    });

    test('should throw error for invalid player data', async () => {
      const player = new Player({ name: '', gameId: 'game123' });
      
      await expect(player.create()).rejects.toThrow('Validation failed');
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe('Retrieval', () => {
    test('should retrieve players by gameId in consistent order', async () => {
      const mockResult = {
        rows: [
          {
            id: 'uuid-1',
            name: 'Player 1',
            game_id: 'game123',
            created_at: new Date('2023-01-01T10:00:00Z')
          },
          {
            id: 'uuid-2',
            name: 'Player 2',
            game_id: 'game123',
            created_at: new Date('2023-01-01T11:00:00Z')
          }
        ]
      };
      
      db.query.mockResolvedValue(mockResult);

      const players = await Player.findByGameId('game123');

      expect(players).toHaveLength(2);
      expect(players[0]).toBeInstanceOf(Player);
      expect(players[0].name).toBe('Player 1');
      expect(players[1].name).toBe('Player 2');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at ASC'),
        ['game123']
      );
    });

    test('should throw error when gameId is missing', async () => {
      await expect(Player.findByGameId()).rejects.toThrow('GameId is required');
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe('UUID Generation', () => {
    test('should generate unique UUID for each player', () => {
      const player1 = new Player({ name: 'Player 1', gameId: 'game123' });
      const player2 = new Player({ name: 'Player 2', gameId: 'game123' });

      expect(player1.id).toBeDefined();
      expect(player2.id).toBeDefined();
      expect(player1.id).not.toBe(player2.id);
      expect(typeof player1.id).toBe('string');
    });
  });
});