import React from 'react';
import { render, screen } from '@testing-library/react';
import Score from '../Score';

describe('Score Component', () => {
  const mockGameData = {
    currentRound: 3,
    totalRounds: 10,
    scores: [
      { player: 'Alice', value: 150, round: 1 },
      { player: 'Bob', value: 120, round: 2 }
    ],
    gameStatus: 'In Progress'
  };

  test('renders progress indicator with correct round information', () => {
    render(<Score gameData={mockGameData} />);
    expect(screen.getByText('Round 3')).toBeInTheDocument();
    expect(screen.getByText('of 10')).toBeInTheDocument();
  });

  test('displays visual progress bar with correct percentage', () => {
    render(<Score gameData={mockGameData} />);
    expect(screen.getByText('30%')).toBeInTheDocument();
    const progressFill = document.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle('width: 30%');
  });

  test('shows correct game status for in-progress game', () => {
    render(<Score gameData={mockGameData} />);
    const statusElement = screen.getByText('In Progress');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('in-progress');
  });

  test('shows complete status when game is finished', () => {
    const completeGameData = {
      ...mockGameData,
      currentRound: 10,
      gameStatus: 'Complete'
    };
    render(<Score gameData={completeGameData} />);
    const statusElement = screen.getByText('Complete');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('complete');
  });

  test('updates progress automatically when currentRound changes', () => {
    const { rerender } = render(<Score gameData={mockGameData} />);
    expect(screen.getByText('30%')).toBeInTheDocument();
    
    const updatedGameData = { ...mockGameData, currentRound: 5 };
    rerender(<Score gameData={updatedGameData} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('handles missing gameData gracefully', () => {
    render(<Score />);
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('of 10')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });
});