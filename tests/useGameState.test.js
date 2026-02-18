import React from 'react';
import { render, act } from '@testing-library/react';
import { GameProvider } from '../contexts/GameContext';
import { useGameState } from '../hooks/useGameState';

// Test component using the hook
function TestComponent() {
  const gameState = useGameState();
  
  return (
    <div>
      <div data-testid="phase">{gameState.currentPhase}</div>
      <div data-testid="is-score-entry">{gameState.isScoreEntryPhase().toString()}</div>
      <div data-testid="total-scores">{JSON.stringify(gameState.getTotalScores())}</div>
      <button 
        data-testid="start-score-entry" 
        onClick={() => gameState.startScoreEntry()}
      >
        Start Score Entry
      </button>
      <button 
        data-testid="set-actual-tricks" 
        onClick={() => gameState.setActualTricks('player1', 3)}
      >
        Set Actual Tricks
      </button>
    </div>
  );
}

describe('useGameState', () => {
  test('provides score entry phase detection', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    expect(getByTestId('is-score-entry')).toHaveTextContent('false');
    
    act(() => {
      getByTestId('start-score-entry').click();
    });
    
    expect(getByTestId('is-score-entry')).toHaveTextContent('true');
  });
  
  test('allows setting actual tricks', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    act(() => {
      getByTestId('set-actual-tricks').click();
    });
    
    // Test passes if no errors thrown
    expect(getByTestId('phase')).toBeInTheDocument();
  });
});