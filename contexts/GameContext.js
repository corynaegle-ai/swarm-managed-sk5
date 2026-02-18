import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext();

// Game phases
export const GAME_PHASES = {
  BIDDING: 'bidding',
  PLAYING: 'playing',
  SCORE_ENTRY: 'score_entry',
  ROUND_COMPLETE: 'round_complete'
};

// Initial state
const initialState = {
  currentRound: 1,
  currentPhase: GAME_PHASES.BIDDING,
  players: [],
  bids: {},
  actualTricks: {},
  bonusPoints: {},
  scores: {},
  totalScores: {},
  roundComplete: false,
  gameComplete: false,
  scoreEntryComplete: false
};

// Action types
const ACTIONS = {
  SET_PLAYERS: 'SET_PLAYERS',
  SET_BID: 'SET_BID',
  SET_ACTUAL_TRICKS: 'SET_ACTUAL_TRICKS',
  SET_BONUS_POINTS: 'SET_BONUS_POINTS',
  UPDATE_PHASE: 'UPDATE_PHASE',
  COMPLETE_ROUND: 'COMPLETE_ROUND',
  START_NEW_ROUND: 'START_NEW_ROUND',
  RESET_GAME: 'RESET_GAME'
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PLAYERS:
      return {
        ...state,
        players: action.payload,
        totalScores: action.payload.reduce((acc, player) => {
          acc[player.id] = 0;
          return acc;
        }, {})
      };

    case ACTIONS.SET_BID:
      return {
        ...state,
        bids: {
          ...state.bids,
          [action.payload.playerId]: action.payload.bid
        }
      };

    case ACTIONS.SET_ACTUAL_TRICKS:
      return {
        ...state,
        actualTricks: {
          ...state.actualTricks,
          [action.payload.playerId]: action.payload.tricks
        }
      };

    case ACTIONS.SET_BONUS_POINTS:
      return {
        ...state,
        bonusPoints: {
          ...state.bonusPoints,
          [action.payload.playerId]: action.payload.points
        }
      };

    case ACTIONS.UPDATE_PHASE:
      return {
        ...state,
        currentPhase: action.payload,
        roundComplete: action.payload === GAME_PHASES.ROUND_COMPLETE,
        scoreEntryComplete: action.payload === GAME_PHASES.ROUND_COMPLETE
      };

    case ACTIONS.COMPLETE_ROUND:
      // Calculate scores for current round
      const roundScores = {};
      const newTotalScores = { ...state.totalScores };
      
      state.players.forEach(player => {
        const bid = state.bids[player.id] || 0;
        const actual = state.actualTricks[player.id] || 0;
        const bonus = state.bonusPoints[player.id] || 0;
        
        let roundScore = 0;
        if (bid === actual) {
          // Made bid exactly - score is 10 + bid + bonus
          roundScore = 10 + bid + bonus;
        } else {
          // Missed bid - lose points equal to difference + bonus
          roundScore = -(Math.abs(bid - actual)) + bonus;
        }
        
        roundScores[player.id] = roundScore;
        newTotalScores[player.id] += roundScore;
      });
      
      return {
        ...state,
        scores: {
          ...state.scores,
          [state.currentRound]: roundScores
        },
        totalScores: newTotalScores,
        currentPhase: GAME_PHASES.ROUND_COMPLETE,
        roundComplete: true
      };

    case ACTIONS.START_NEW_ROUND:
      return {
        ...state,
        currentRound: state.currentRound + 1,
        currentPhase: GAME_PHASES.BIDDING,
        bids: {},
        actualTricks: {},
        bonusPoints: {},
        roundComplete: false,
        scoreEntryComplete: false
      };

    case ACTIONS.RESET_GAME:
      return {
        ...initialState,
        players: state.players,
        totalScores: state.players.reduce((acc, player) => {
          acc[player.id] = 0;
          return acc;
        }, {}),
        scoreEntryComplete: false
      };

    default:
      return state;
  }
}

// Context provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const value = {
    state,
    dispatch,
    actions: ACTIONS
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Hook to use game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}

export default GameContext;