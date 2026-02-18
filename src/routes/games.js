const express = require('express');
const GameFlow = require('../services/GameFlow');
const router = express.Router();

// Middleware to validate game ID
const validateGameId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid game ID' });
  }
  next();
};

// GET /api/games/:id/status - Get current game state
router.get('/:id/status', validateGameId, async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const gameState = await GameFlow.getGameState(gameId);
    
    if (!gameState) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({
      gameId: gameState.gameId,
      phase: gameState.phase,
      round: gameState.round,
      status: gameState.status,
      players: gameState.players,
      currentPlayer: gameState.currentPlayer
    });
  } catch (error) {
    console.error('Error getting game status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/games/:id/advance-phase - Advance to next phase
router.post('/:id/advance-phase', validateGameId, async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const result = await GameFlow.advancePhase(gameId);
    
    if (result.success) {
      res.json({
        message: 'Phase advanced successfully',
        gameId: result.gameId,
        previousPhase: result.previousPhase,
        currentPhase: result.currentPhase,
        round: result.round
      });
    } else {
      res.status(400).json({ 
        error: result.error || 'Cannot advance phase at this time'
      });
    }
  } catch (error) {
    console.error('Error advancing phase:', error);
    if (error.message.includes('Invalid transition') || error.message.includes('Cannot advance')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// POST /api/games/:id/next-round - Advance to next round
router.post('/:id/next-round', validateGameId, async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const result = await GameFlow.nextRound(gameId);
    
    if (result.success) {
      res.json({
        message: 'Round advanced successfully',
        gameId: result.gameId,
        previousRound: result.previousRound,
        currentRound: result.currentRound,
        phase: result.phase
      });
    } else {
      res.status(400).json({ 
        error: result.error || 'Cannot advance to next round at this time'
      });
    }
  } catch (error) {
    console.error('Error advancing round:', error);
    if (error.message.includes('Invalid transition') || error.message.includes('Cannot advance')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;