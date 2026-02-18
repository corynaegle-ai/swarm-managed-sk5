import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameComplete from '../src/components/GameComplete';
import { useGameFlow } from '../src/hooks/useGameFlow';

jest.mock('../src/hooks/useGameFlow');

describe('GameComplete', () => {
  it('renders when gameComplete is true', () => {
    useGameFlow.mockReturnValue({
      gameComplete: true,
      scores: { player: 8, computer: 6 },
      resetGame: jest.fn()
    });

    render(<GameComplete />);
    expect(screen.getByText('Game Complete!')).toBeInTheDocument();
    expect(screen.getByText('Player Wins!')).toBeInTheDocument();
  });

  it('does not render when gameComplete is false', () => {
    useGameFlow.mockReturnValue({
      gameComplete: false,
      scores: { player: 0, computer: 0 },
      resetGame: jest.fn()
    });

    const { container } = render(<GameComplete />);
    expect(container.firstChild).toBeNull();
  });

  it('calls resetGame when Play Again is clicked', () => {
    const mockResetGame = jest.fn();
    useGameFlow.mockReturnValue({
      gameComplete: true,
      scores: { player: 5, computer: 5 },
      resetGame: mockResetGame
    });

    render(<GameComplete />);
    fireEvent.click(screen.getByText('Play Again'));
    expect(mockResetGame).toHaveBeenCalled();
  });
});