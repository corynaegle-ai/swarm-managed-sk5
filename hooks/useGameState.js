import { useGameContext, GAME_PHASES } from '../contexts/GameContext';

/**
 * Custom hook for managing game state operations
 * Provides high-level functions for game state transitions
 */
export function useGameState() {
  const { state, dispatch, actions } = useGameContext();

  // Set up players for the game
  const setPlayers = (players) => {
    dispatch({
      type: actions.SET_PLAYERS,
      payload: players
    });
  };

  // Record a bid for a player
  const setBid = (playerId, bid) => {
    dispatch({
      type: actions.SET_BID,
      payload: { playerId, bid }
    });
  };

  // Record actual tricks taken by a player
  const setActualTricks = (playerId, tricks) => {
    dispatch({
      type: actions.SET_ACTUAL_TRICKS,
      payload: { playerId, tricks }
    });
  };

  // Record bonus points for a player
  const setBonusPoints = (playerId, points) => {
    dispatch({
      type: actions.SET_BONUS_POINTS,
      payload: { playerId, points }
    });
  };

  // Transition to bidding phase
  const startBidding = () => {
    dispatch({
      type: actions.UPDATE_PHASE,
      payload: GAME_PHASES.BIDDING
    });
  };

  // Transition to playing phase
  const startPlaying = () => {
    dispatch({
      type: actions.UPDATE_PHASE,
      payload: GAME_PHASES.PLAYING
    });
  };

  // Transition to score entry phase
  const startScoreEntry = () => {
    dispatch({
      type: actions.UPDATE_PHASE,
      payload: GAME_PHASES.SCORE_ENTRY
    });
  };

  // Complete the current round and calculate scores
  const completeRound = () => {
    dispatch({
      type: actions.COMPLETE_ROUND
    });
  };

  // Start a new round
  const startNewRound = () => {
    dispatch({
      type: actions.START_NEW_ROUND
    });
  };

  // Reset the entire game
  const resetGame = () => {
    dispatch({
      type: actions.RESET_GAME
    });
  };

  // Check if all players have submitted bids
  const allBidsSubmitted = () => {
    if (!state.players.length) return false;
    return state.players.every(player => 
      state.bids.hasOwnProperty(player.id)
    );
  };

  // Check if all players have actual tricks recorded
  const allTricksRecorded = () => {
    if (!state.players.length) return false;
    return state.players.every(player => 
      state.actualTricks.hasOwnProperty(player.id)
    );
  };

  // Check if all score entry is complete (tricks and bonus points)
  const allScoreEntryComplete = () => {
    if (!state.players.length) return false;
    return state.players.every(player => 
      state.actualTricks.hasOwnProperty(player.id) &&
      state.bonusPoints.hasOwnProperty(player.id)
    );
  };

  // Auto-transition to next phase based on completion status
  const checkPhaseTransition = () => {
    if (state.currentPhase === GAME_PHASES.BIDDING && allBidsSubmitted()) {
      startPlaying();
    } else if (state.currentPhase === GAME_PHASES.PLAYING) {
      // Manual transition to score entry required
    } else if (state.currentPhase === GAME_PHASES.SCORE_ENTRY && allScoreEntryComplete()) {
      completeRound();
    }
  };

  // Check if current phase is score entry
  const isScoreEntryPhase = () => {
    return state.currentPhase === GAME_PHASES.SCORE_ENTRY;
  };

  // Check if current phase is playing
  const isPlayingPhase = () => {
    return state.currentPhase === GAME_PHASES.PLAYING;
  };

  // Check if current phase is bidding
  const isBiddingPhase = () => {
    return state.currentPhase === GAME_PHASES.BIDDING;
  };

  // Check if round is complete
  const isRoundComplete = () => {
    return state.roundComplete;
  };

  // Get current round scores
  const getCurrentRoundScores = () => {
    return state.scores[state.currentRound] || {};
  };

  // Get total scores for all players
  const getTotalScores = () => {
    return state.totalScores;
  };

  // Get player by ID
  const getPlayer = (playerId) => {
    return state.players.find(player => player.id === playerId);
  };

  // Get all game phases for reference
  const getGamePhases = () => GAME_PHASES;

  return {
    // State
    gameState: state,
    currentPhase: state.currentPhase,
    currentRound: state.currentRound,
    players: state.players,
    bids: state.bids,
    actualTricks: state.actualTricks,
    bonusPoints: state.bonusPoints,
    roundComplete: state.roundComplete,
    
    // Actions
    setPlayers,
    setBid,
    setActualTricks,
    setBonusPoints,
    startBidding,
    startPlaying,
    startScoreEntry,
    completeRound,
    startNewRound,
    resetGame,
    
    // Utility functions
    allBidsSubmitted,
    allTricksRecorded,
    allScoreEntryComplete,
    checkPhaseTransition,
    isScoreEntryPhase,
    isPlayingPhase,
    isBiddingPhase,
    isRoundComplete,
    getCurrentRoundScores,
    getTotalScores,
    getPlayer,
    getGamePhases
  };
}