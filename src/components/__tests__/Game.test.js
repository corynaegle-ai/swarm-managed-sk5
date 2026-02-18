import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Game from '../Game';

// Mock the Score component
jest.mock('../Score', () => {
  return function MockScore({ players, currentRound, totalRounds }) {
    return (
      <div data-testid="score-component">
        <div>Round {currentRound}/{totalRounds}</div>
        {players.map(player => (
          <div key={player.id} data-testid={`player-${player.id}-score`}>
            {player.name}: {player.score}
          </div>
        ))}
      </div>
    );
  };
});

describe('Game Component', () => {
  test('renders game interface with Score component', () => {
    render(<Game />);
    
    // Check if main game elements are rendered
    expect(screen.getByText('Game Interface')).toBeInTheDocument();
    expect(screen.getByText('Round 1 of 5')).toBeInTheDocument();
    
    // Check if Score component is rendered
    expect(screen.getByTestId('score-component')).toBeInTheDocument();
  });

  test('Score component receives correct props from game state', () => {
    render(<Game />);
    
    // Check if players are displayed in score component
    expect(screen.getByTestId('player-1-score')).toHaveTextContent('Player 1: 0');
    expect(screen.getByTestId('player-2-score')).toHaveTextContent('Player 2: 0');
    expect(screen.getByTestId('player-3-score')).toHaveTextContent('Player 3: 0');
    expect(screen.getByTestId('player-4-score')).toHaveTextContent('Player 4: 0');
  });

  test('Score component updates when player scores change', () => {
    render(<Game />);
    
    // Find and click +10 button for Player 1
    const player1Section = screen.getByText('Player 1 (Score: 0)').closest('div');
    const addTenButton = player1Section.querySelector('button');
    
    fireEvent.click(addTenButton);
    
    // Check if score updated in Score component
    expect(screen.getByTestId('player-1-score')).toHaveTextContent('Player 1: 10');
  });

  test('Score component updates when round changes', () => {
    render(<Game />);
    
    const nextRoundButton = screen.getByText('Next Round');
    fireEvent.click(nextRoundButton);
    
    // Check if round updated in Score component
    expect(screen.getByTestId('score-component')).toHaveTextContent('Round 2/5');
  });

  test('Score component resets when game resets', () => {
    render(<Game />);
    
    // Add some scores first
    const player1Section = screen.getByText('Player 1 (Score: 0)').closest('div');
    const addTenButton = player1Section.querySelector('button');
    fireEvent.click(addTenButton);
    
    // Reset the game
    const resetButton = screen.getByText('Reset Game');
    fireEvent.click(resetButton);
    
    // Check if scores reset in Score component
    expect(screen.getByTestId('player-1-score')).toHaveTextContent('Player 1: 0');
    expect(screen.getByTestId('score-component')).toHaveTextContent('Round 1/5');
  });
});