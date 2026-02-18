const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class Player {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.gameId = data.gameId;
    this.createdAt = data.created_at || new Date();
  }

  // Validate player data
  validate() {
    const errors = [];

    // Validate name length (1-50 characters)
    if (!this.name || typeof this.name !== 'string') {
      errors.push('Name is required and must be a string');
    } else if (this.name.trim().length < 1 || this.name.trim().length > 50) {
      errors.push('Name must be between 1 and 50 characters');
    }

    // Validate gameId is present
    if (!this.gameId) {
      errors.push('GameId is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create a new player
  async create() {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const query = `
      INSERT INTO players (id, name, game_id, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    try {
      const result = await db.query(query, [
        this.id,
        this.name.trim(),
        this.gameId,
        this.createdAt
      ]);

      return new Player(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Player with this ID already exists');
      }
      throw error;
    }
  }

  // Retrieve players by gameId in consistent order (by created_at)
  static async findByGameId(gameId) {
    if (!gameId) {
      throw new Error('GameId is required');
    }

    const query = `
      SELECT * FROM players
      WHERE game_id = $1
      ORDER BY created_at ASC
    `;

    try {
      const result = await db.query(query, [gameId]);
      return result.rows.map(row => new Player(row));
    } catch (error) {
      throw new Error(`Failed to retrieve players: ${error.message}`);
    }
  }

  // Find player by ID
  static async findById(id) {
    if (!id) {
      throw new Error('Player ID is required');
    }

    const query = 'SELECT * FROM players WHERE id = $1';

    try {
      const result = await db.query(query, [id]);
      return result.rows.length > 0 ? new Player(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find player: ${error.message}`);
    }
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      gameId: this.gameId,
      createdAt: this.createdAt
    };
  }
}

module.exports = Player;