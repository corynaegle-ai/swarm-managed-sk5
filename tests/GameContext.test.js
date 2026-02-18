import React from 'react';
import { render, act } from '@testing-library/react';
import { GameProvider, useGameContext, GAME_PHASES } from '../contexts/GameContext';

// Test component to access context
function TestComponent() {
  const { state, dispatch, actions } = useGameContext();
  
  return (
    <div>
      <div data-testid="current-phase">{state.currentPhase}</div>
      <div data-testid="current-round">{state.currentRound}</div>
      <button 
        data-testid="set-players" 
        onClick={() => dispatch({
          type: actions.SET_PLAYERS,
          payload: [{ id: 'player1', name: 'Player 1' }]
        })}
      >
        Set Players
      </button>
      <button 
        data-testid="start-score-entry" 
        onClick={() => dispatch({
          type: actions.UPDATE_PHASE,
          payload: GAME_PHASES.SCORE_ENTRY
        })}
      >
        Start Score Entry
      </button>
    </div>
  );
}

describe('GameContext', () => {
  test('provides initial state', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    expect(getByTestId('current-phase')).toHaveTextContent('bidding');
    expect(getByTestId('current-round')).toHaveTextContent('1');
  });
  
  test('allows phase transitions to score entry', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    act(() => {
      getByTestId('start-score-entry').click();
    });
    
    expect(getByTestId('current-phase')).toHaveTextContent('score_entry');
  });
});