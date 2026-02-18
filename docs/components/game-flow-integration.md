# Game Flow React Component Integration Guide

## Overview

This guide covers integration patterns for React components with the Game Flow system. It includes component architecture, state management, real-time updates, and common usage patterns for building responsive multiplayer game interfaces.

## Component Architecture

### Core Components Hierarchy

```
GameFlowProvider
├── GameLobby
├── GameSession
│   ├── PlayerList
│   ├── GameBoard
│   ├── ActionPanel
│   └── ScoreDisplay
├── GameResults
└── ErrorBoundary
```

## Provider Setup

### GameFlowProvider Component

The root provider manages game state and WebSocket connections:

```jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameFlowClient } from '@gameflow/sdk';

const GameFlowContext = createContext();

export const useGameFlow = () => {
  const context = useContext(GameFlowContext);
  if (!context) {
    throw new Error('useGameFlow must be used within GameFlowProvider');
  }
  return context;
};

export const GameFlowProvider = ({ children, apiKey, gameId }) => {
  const [state, dispatch] = useReducer(gameFlowReducer, initialState);
  const [client] = useState(() => new GameFlowClient({ apiKey }));
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(`wss://api.gameflow.example.com/v1/games/${gameId}/ws`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      dispatch({ type: 'GAME_UPDATE', payload: update });
    };

    ws.onopen = () => {
      dispatch({ type: 'CONNECTION_ESTABLISHED' });
    };

    ws.onerror = (error) => {
      dispatch({ type: 'CONNECTION_ERROR', payload: error });
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [gameId]);

  const value = {
    gameState: state.gameState,
    connectionStatus: state.connectionStatus,
    error: state.error,
    client,
    socket,
    actions: {
      joinGame: (playerData) => client.joinGame(gameId, playerData),
      submitAction: (actionData) => client.submitAction(gameId, actionData),
      startGame: () => client.startGame(gameId),
      endGame: (reason) => client.endGame(gameId, reason)
    }
  };

  return (
    <GameFlowContext.Provider value={value}>
      {children}
    </GameFlowContext.Provider>
  );
};
```

### Game State Reducer

```jsx
const initialState = {
  gameState: null,
  connectionStatus: 'disconnected',
  error: null,
  players: [],
  currentPlayer: null
};

function gameFlowReducer(state, action) {
  switch (action.type) {
    case 'GAME_UPDATE':
      return {
        ...state,
        gameState: action.payload.gameState,
        players: action.payload.players || state.players
      };

    case 'CONNECTION_ESTABLISHED':
      return {
        ...state,
        connectionStatus: 'connected',
        error: null
      };

    case 'CONNECTION_ERROR':
      return {
        ...state,
        connectionStatus: 'error',
        error: action.payload
      };

    case 'PLAYER_JOINED':
      return {
        ...state,
        players: [...state.players, action.payload.player]
      };

    case 'PLAYER_LEFT':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.payload.playerId)
      };

    case 'PHASE_CHANGED':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          phase: action.payload.newPhase
        }
      };

    default:
      return state;
  }
}
```

## Phase-Specific Components

### Game Lobby Component

```jsx
import React, { useState } from 'react';
import { useGameFlow } from './GameFlowProvider';

export const GameLobby = () => {
  const { gameState, players, actions } = useGameFlow();
  const [playerName, setPlayerName] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoinGame = async () => {
    if (!playerName.trim()) return;
    
    setJoining(true);
    try {
      await actions.joinGame({
        playerName: playerName.trim(),
        playerId: `player_${Date.now()}`
      });
    } catch (error) {
      console.error('Failed to join game:', error);
    } finally {
      setJoining(false);
    }
  };

  const handleStartGame = async () => {
    try {
      await actions.startGame();
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const canStartGame = players.length >= 2 && gameState?.hostId === getCurrentPlayerId();

  if (gameState?.phase !== 'lobby') {
    return null;
  }

  return (
    <div className="game-lobby">
      <h2>Game Lobby</h2>
      
      <div className="player-join-section">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          disabled={joining}
        />
        <button 
          onClick={handleJoinGame}
          disabled={joining || !playerName.trim()}
        >
          {joining ? 'Joining...' : 'Join Game'}
        </button>
      </div>

      <PlayerList players={players} />

      <div className="lobby-controls">
        <button
          onClick={handleStartGame}
          disabled={!canStartGame}
          className="start-game-btn"
        >
          Start Game ({players.length}/{gameState?.maxPlayers})
        </button>
      </div>

      <GameConfiguration />
    </div>
  );
};
```

### Active Game Session Component

```jsx
import React, { useEffect, useState } from 'react';
import { useGameFlow } from './GameFlowProvider';

export const GameSession = () => {
  const { gameState, actions } = useGameFlow();
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionData, setActionData] = useState({});

  const isActivePlayer = gameState?.currentTurn === getCurrentPlayerId();
  const timeRemaining = gameState?.turnTimeRemaining || 0;

  const handleSubmitAction = async () => {
    if (!selectedAction || !isActivePlayer) return;

    try {
      await actions.submitAction({
        actionType: selectedAction,
        actionData: actionData,
        timestamp: new Date().toISOString()
      });
      
      // Reset action state
      setSelectedAction(null);
      setActionData({});
    } catch (error) {
      console.error('Action submission failed:', error);
    }
  };

  if (!['in_progress', 'round_end'].includes(gameState?.phase)) {
    return null;
  }

  return (
    <div className="game-session">
      <GameHeader gameState={gameState} />
      
      <div className="game-content">
        <GameBoard 
          gameState={gameState}
          onCellClick={(position) => setActionData({...actionData, position})}
        />
        
        <div className="game-sidebar">
          <PlayerList 
            players={gameState.players}
            currentPlayer={gameState.currentTurn}
          />
          
          <TurnTimer 
            timeRemaining={timeRemaining}
            isActive={isActivePlayer}
          />
          
          <ActionPanel
            availableActions={getAvailableActions(gameState)}
            selectedAction={selectedAction}
            onActionSelect={setSelectedAction}
            onSubmit={handleSubmitAction}
            disabled={!isActivePlayer}
            actionData={actionData}
            onActionDataChange={setActionData}
          />
          
          <ScoreDisplay players={gameState.players} />
        </div>
      </div>
      
      <GameChat gameId={gameState.gameId} />
    </div>
  );
};
```

### Action Panel Component

```jsx
import React from 'react';

export const ActionPanel = ({
  availableActions,
  selectedAction,
  onActionSelect,
  onSubmit,
  disabled,
  actionData,
  onActionDataChange
}) => {
  const renderActionInputs = () => {
    if (!selectedAction) return null;

    switch (selectedAction) {
      case 'move':
        return (
          <div className="action-inputs">
            <label>Direction:</label>
            <select
              value={actionData.direction || ''}
              onChange={(e) => onActionDataChange({
                ...actionData,
                direction: e.target.value
              })}
            >
              <option value="">Select direction</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
            
            <label>Distance:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={actionData.distance || 1}
              onChange={(e) => onActionDataChange({
                ...actionData,
                distance: parseInt(e.target.value)
              })}
            />
          </div>
        );

      case 'attack':
        return (
          <div className="action-inputs">
            <label>Target Player:</label>
            <select
              value={actionData.targetId || ''}
              onChange={(e) => onActionDataChange({
                ...actionData,
                targetId: e.target.value
              })}
            >
              <option value="">Select target</option>
              {/* Populate with available targets */}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  const canSubmit = selectedAction && 
    !disabled && 
    isActionDataValid(selectedAction, actionData);

  return (
    <div className="action-panel">
      <h3>Your Turn</h3>
      
      <div className="available-actions">
        {availableActions.map(action => (
          <button
            key={action.type}
            className={`action-btn ${selectedAction === action.type ? 'selected' : ''}`}
            onClick={() => onActionSelect(action.type)}
            disabled={disabled}
          >
            {action.name}
          </button>
        ))}
      </div>

      {renderActionInputs()}

      <button
        className="submit-action-btn"
        onClick={onSubmit}
        disabled={!canSubmit}
      >
        Submit Action
      </button>
    </div>
  );
};

function isActionDataValid(actionType, actionData) {
  switch (actionType) {
    case 'move':
      return actionData.direction && actionData.distance > 0;
    case 'attack':
      return actionData.targetId;
    default:
      return true;
  }
}
```

## Hooks for Game Flow

### useGamePhase Hook

```jsx
import { useGameFlow } from './GameFlowProvider';

export const useGamePhase = () => {
  const { gameState } = useGameFlow();
  
  return {
    currentPhase: gameState?.phase,
    isLobby: gameState?.phase === 'lobby',
    isStarting: gameState?.phase === 'starting',
    isInProgress: gameState?.phase === 'in_progress',
    isRoundEnd: gameState?.phase === 'round_end',
    isGameEnd: gameState?.phase === 'game_end',
    isCompleted: gameState?.phase === 'completed',
    isPaused: gameState?.phase === 'paused',
    isEnded: gameState?.phase === 'ended'
  };
};
```

### usePlayerActions Hook

```jsx
export const usePlayerActions = (playerId) => {
  const { gameState, actions } = useGameFlow();
  const [submitting, setSubmitting] = useState(false);

  const submitAction = async (actionType, actionData) => {
    setSubmitting(true);
    try {
      const result = await actions.submitAction({
        actionType,
        actionData,
        playerId,
        timestamp: new Date().toISOString()
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const canAct = gameState?.currentTurn === playerId && 
                 gameState?.phase === 'in_progress' && 
                 !submitting;

  return {
    submitAction,
    canAct,
    submitting,
    timeRemaining: gameState?.turnTimeRemaining || 0
  };
};
```

### useGameTimer Hook

```jsx
export const useGameTimer = () => {
  const { gameState } = useGameFlow();
  const [localTimeRemaining, setLocalTimeRemaining] = useState(0);

  useEffect(() => {
    if (!gameState?.turnTimeRemaining) return;

    setLocalTimeRemaining(gameState.turnTimeRemaining);

    const interval = setInterval(() => {
      setLocalTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.turnTimeRemaining, gameState?.currentTurn]);

  return {
    timeRemaining: localTimeRemaining,
    isTimeRunningOut: localTimeRemaining <= 10,
    formattedTime: formatTime(localTimeRemaining)
  };
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

## Error Handling Patterns

### Game Error Boundary

```jsx
import React from 'react';

export class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Game component error:', error, errorInfo);
    
    // Report to error tracking service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="game-error">
          <h2>Something went wrong</h2>
          <p>The game encountered an unexpected error.</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Connection Error Handling

```jsx
export const ConnectionStatusIndicator = () => {
  const { connectionStatus, error } = useGameFlow();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'green';
      case 'connecting': return 'yellow';
      case 'disconnected': return 'red';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="connection-status">
      <div 
        className="status-indicator"
        style={{ backgroundColor: getStatusColor() }}
      />
      <span className="status-text">
        {connectionStatus === 'connected' ? 'Online' : 'Connection Issue'}
      </span>
      
      {error && (
        <div className="error-details">
          <button onClick={() => window.location.reload()}>
            Reconnect
          </button>
        </div>
      )}
    </div>
  );
};
```

## Complete Integration Example

### Main Game Component

```jsx
import React from 'react';
import { GameFlowProvider, useGamePhase } from './gameflow';

const GameApp = ({ gameId, apiKey, playerId }) => {
  return (
    <GameErrorBoundary>
      <GameFlowProvider apiKey={apiKey} gameId={gameId}>
        <div className="game-app">
          <ConnectionStatusIndicator />
          <GameContent />
        </div>
      </GameFlowProvider>
    </GameErrorBoundary>
  );
};

const GameContent = () => {
  const { 
    isLobby, 
    isStarting, 
    isInProgress, 
    isRoundEnd, 
    isGameEnd, 
    isCompleted 
  } = useGamePhase();

  if (isLobby) return <GameLobby />;
  if (isStarting) return <GameStarting />;
  if (isInProgress || isRoundEnd) return <GameSession />;
  if (isGameEnd || isCompleted) return <GameResults />;
  
  return <div>Loading...</div>;
};

export default GameApp;
```

This integration guide provides a complete foundation for building React components that work seamlessly with the Game Flow system, handling real-time updates, state management, and error scenarios effectively.