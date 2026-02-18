import React from 'react';
import { render, screen } from '@testing-library/react';
import Score from './Score';

const mockPlayers = [
  { id: 1, name: 'Alice', score: 150 },
  { id: 2, name: 'Bob', score: 200 },
  { id: 3, name: 'Charlie', score: 100 }
];

describe('Score Component', () => {
  test('displays current scores when game is not complete', () => {
    render(<Score players={mockPlayers} gameComplete={false} />);
    
    expect(screen.getByText('Current Scores')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('displays final rankings when game is complete', () => {
    render(<Score players={mockPlayers} gameComplete={true} />);
    
    expect(screen.getByText('Final Rankings')).toBeInTheDocument();
    expect(screen.getByText('1st')).toBeInTheDocument();
    expect(screen.getByText('2nd')).toBeInTheDocument();
    expect(screen.getByText('3rd')).toBeInTheDocument();
  });

  test('sorts players by score in descending order', () => {
    render(<Score players={mockPlayers} gameComplete={true} />);
    
    const rankings = screen.getAllByClassName('ranking-item');
    expect(rankings[0]).toHaveTextContent('Bob');
    expect(rankings[0]).toHaveTextContent('200 points');
    expect(rankings[1]).toHaveTextContent('Alice');
    expect(rankings[2]).toHaveTextContent('Charlie');
  });

  test('highlights winner with special styling', () => {
    render(<Score players={mockPlayers} gameComplete={true} />);
    
    const winnerElement = screen.getByText('Bob').closest('.ranking-item');
    expect(winnerElement).toHaveClass('winner');
    expect(winnerElement).toHaveTextContent('🏆');
  });

  test('displays correct ordinal suffixes', () => {
    const manyPlayers = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Player${i + 1}`,
      score: 100 - i
    }));
    
    render(<Score players={manyPlayers} gameComplete={true} />);
    
    expect(screen.getByText('1st')).toBeInTheDocument();
    expect(screen.getByText('2nd')).toBeInTheDocument();
    expect(screen.getByText('3rd')).toBeInTheDocument();
    expect(screen.getByText('11th')).toBeInTheDocument();
    expect(screen.getByText('12th')).toBeInTheDocument();
    expect(screen.getByText('13th')).toBeInTheDocument();
  });
});