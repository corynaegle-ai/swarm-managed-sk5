import React from 'react';
import { render, screen } from '@testing-library/react';
import Score from './Score';

describe('Score Component', () => {
  const mockGameState = {
    players: [
      { name: 'Alice', scores: [10, 15, 12] },
      { name: 'Bob', scores: [8, 20, 14] },
      { name: 'Charlie', scores: [12, 10, 18] }
    ],
    rounds: [1, 2, 3]
  };

  test('renders table with player names', () => {
    render(<Score gameState={mockGameState} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('creates dynamic round columns', () => {
    render(<Score gameState={mockGameState} />);
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('Round 3')).toBeInTheDocument();
  });

  test('displays individual round scores', () => {
    render(<Score gameState={mockGameState} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  test('shows total column', () => {
    render(<Score gameState={mockGameState} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('37')).toBeInTheDocument(); // Alice's total
    expect(screen.getByText('42')).toBeInTheDocument(); // Bob's total
  });

  test('handles undefined gameState gracefully', () => {
    render(<Score gameState={undefined} />);
    expect(screen.getByText('No game data available')).toBeInTheDocument();
  });

  test('handles empty players array', () => {
    render(<Score gameState={{ players: [], rounds: [1, 2, 3] }} />);
    expect(screen.getByText('No players in the game')).toBeInTheDocument();
  });

  test('handles missing player scores', () => {
    const gameStateWithMissingScores = {
      players: [{ name: 'Alice' }],
      rounds: [1, 2]
    };
    render(<Score gameState={gameStateWithMissingScores} />);
    expect(screen.getAllByText('-')).toHaveLength(2);
  });
});