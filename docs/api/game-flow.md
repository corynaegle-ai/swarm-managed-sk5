# Game Flow API Documentation

## Overview

The Game Flow API manages multiplayer game sessions, handling phase transitions, player actions, and game state synchronization. This RESTful API provides endpoints for creating games, managing player interactions, and tracking game progress through various phases.

## Base URL

```
https://api.gameflow.example.com/v1
```

## Authentication

All API requests require authentication via Bearer token:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## Core Endpoints

### Game Management

#### Create Game Session

**POST** `/games`

Creates a new game session with initial configuration.

```bash
curl -X POST https://api.gameflow.example.com/v1/games \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gameType": "multiplayer",
    "maxPlayers": 4,
    "timeLimit": 300,
    "configuration": {
      "difficulty": "medium",
      "features": ["powerups", "chat"]
    }
  }'
```

**Response:**
```json
{
  "gameId": "game_12345",
  "status": "waiting_for_players",
  "phase": "lobby",
  "maxPlayers": 4,
  "currentPlayers": 0,
  "createdAt": "2024-01-15T10:30:00Z",
  "gameUrl": "/games/game_12345"
}
```

#### Get Game State

**GET** `/games/{gameId}`

Retrieves current game state and all relevant information.

```bash
curl -X GET https://api.gameflow.example.com/v1/games/game_12345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "gameId": "game_12345",
  "phase": "in_progress",
  "status": "active",
  "currentRound": 2,
  "totalRounds": 5,
  "players": [
    {
      "playerId": "player_001",
      "username": "alice",
      "status": "connected",
      "score": 150,
      "position": 1
    }
  ],
  "gameData": {
    "timeRemaining": 180,
    "currentTurn": "player_001",
    "phase": "action_phase"
  },
  "lastUpdated": "2024-01-15T10:35:22Z"
}
```

### Player Actions

#### Join Game

**POST** `/games/{gameId}/join`

Allows a player to join an existing game session.

```bash
curl -X POST https://api.gameflow.example.com/v1/games/game_12345/join \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "player_002",
    "playerName": "bob"
  }'
```

**Response:**
```json
{
  "success": true,
  "playerId": "player_002",
  "gameState": {
    "phase": "lobby",
    "playerCount": 2,
    "waitingForPlayers": 2
  },
  "playerToken": "player_token_xyz"
}
```

#### Submit Player Action

**POST** `/games/{gameId}/actions`

Submits a player action during gameplay.

```bash
curl -X POST https://api.gameflow.example.com/v1/games/game_12345/actions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "player_001",
    "actionType": "move",
    "actionData": {
      "direction": "north",
      "distance": 3,
      "timestamp": "2024-01-15T10:35:45Z"
    }
  }'
```

**Response:**
```json
{
  "actionId": "action_789",
  "processed": true,
  "gameState": {
    "phase": "action_phase",
    "nextPlayer": "player_002",
    "timeRemaining": 175
  },
  "effects": [
    {
      "type": "position_update",
      "playerId": "player_001",
      "newPosition": {"x": 10, "y": 15}
    }
  ]
}
```

### Phase Management

#### Start Game

**POST** `/games/{gameId}/start`

Transitions game from lobby to active gameplay phase.

```bash
curl -X POST https://api.gameflow.example.com/v1/games/game_12345/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "phase": "in_progress",
  "startedAt": "2024-01-15T10:40:00Z",
  "firstPlayer": "player_001",
  "roundDuration": 60
}
```

#### End Game

**POST** `/games/{gameId}/end`

Manually ends a game session and calculates final results.

```bash
curl -X POST https://api.gameflow.example.com/v1/games/game_12345/end \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reason": "manual_end",
    "winnerId": "player_001"
  }'
```

**Response:**
```json
{
  "success": true,
  "phase": "completed",
  "endedAt": "2024-01-15T11:10:00Z",
  "results": {
    "winner": "player_001",
    "finalScores": [
      {"playerId": "player_001", "score": 350},
      {"playerId": "player_002", "score": 280}
    ],
    "duration": "30m 15s"
  }
}
```

## Real-time Updates

### WebSocket Connection

Connect to game updates via WebSocket:

```javascript
const ws = new WebSocket('wss://api.gameflow.example.com/v1/games/game_12345/ws');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Game update:', update);
};
```

### Event Types

- `phase_change`: Game phase transition
- `player_joined`: New player joined
- `player_left`: Player disconnected
- `action_processed`: Player action completed
- `game_ended`: Game session ended

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "invalid_request",
  "message": "Missing required field: playerId",
  "code": "MISSING_FIELD"
}
```

#### 404 Not Found
```json
{
  "error": "game_not_found",
  "message": "Game session game_12345 does not exist",
  "code": "GAME_NOT_FOUND"
}
```

#### 409 Conflict
```json
{
  "error": "invalid_phase",
  "message": "Cannot join game in completed phase",
  "code": "INVALID_PHASE_TRANSITION"
}
```

#### 429 Rate Limited
```json
{
  "error": "rate_limited",
  "message": "Too many requests. Try again in 60 seconds",
  "retryAfter": 60
}
```

### Error Scenarios

1. **Game Full**: Attempting to join when `currentPlayers >= maxPlayers`
2. **Invalid Phase**: Trying to perform action not allowed in current phase
3. **Player Not Found**: Action submitted by non-participant
4. **Timeout**: Game ended due to inactivity
5. **Connection Lost**: Player disconnected during critical phase

## Rate Limits

- **Game Creation**: 10 games per hour per user
- **Player Actions**: 30 actions per minute per player
- **Game Queries**: 100 requests per minute per user
- **WebSocket Connections**: 5 concurrent connections per user

## SDK Examples

### JavaScript/Node.js

```javascript
import { GameFlowClient } from '@gameflow/sdk';

const client = new GameFlowClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.gameflow.example.com/v1'
});

// Create and join game
const game = await client.createGame({
  gameType: 'multiplayer',
  maxPlayers: 4
});

await client.joinGame(game.gameId, {
  playerId: 'player_123',
  playerName: 'Alice'
});

// Submit action
await client.submitAction(game.gameId, {
  actionType: 'move',
  actionData: { direction: 'north' }
});
```

### Python

```python
import gameflow_sdk

client = gameflow_sdk.Client(api_key="YOUR_API_KEY")

# Create game
game = client.games.create(
    game_type="multiplayer",
    max_players=4
)

# Join game
client.games.join(
    game_id=game.game_id,
    player_id="player_123",
    player_name="Alice"
)
```