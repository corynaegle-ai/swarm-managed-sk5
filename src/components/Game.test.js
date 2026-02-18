import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from './Game';

// Mock the Score component
jest.mock('./Score', () => {
  return function MockScore({ gameState }) {
    return (
      <div data-testid="score-component">
        Mock Score Component - Round: {gameState.currentRound}
      </div>
    );
  };
});

describe('Game Component', () => {
  test('renders game title and start button initially', () => {
    render(<Game />);
    expect(screen.getByText('Score Keeper Game')).toBeInTheDocument();
    expect(screen.getByText('Start New Game')).toBeInTheDocument();
  });

  test('displays Score component', () => {
    render(<Game />);
    expect(screen.getByTestId('score-component')).toBeInTheDocument();
  });

  test('starts game and shows round interface', () => {
    render(<Game />);
    fireEvent.click(screen.getByText('Start New Game'));
    
    expect(screen.getByText('Round 1 of 5')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter score')).toBeInTheDocument();
  });

  test('Score component receives updated game state', () => {
    render(<Game />);
    fireEvent.click(screen.getByText('Start New Game'));
    
    expect(screen.getByText('Mock Score Component - Round: 1')).toBeInTheDocument();
  });

  test('can submit scores and advance rounds', () => {
    render(<Game />);
    fireEvent.click(screen.getByText('Start New Game'));
    
    const inputs = screen.getAllByPlaceholderText('Enter score');
    fireEvent.change(inputs[0], { target: { value: '10' } });
    fireEvent.change(inputs[1], { target: { value: '15' } });
    
    fireEvent.click(screen.getByText('Submit Round Scores'));
    
    expect(screen.getByText('Round 2 of 5')).toBeInTheDocument();
  });
});
