import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameBoard from './GameBoard';

const mockPlayers = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' }
];

const mockGameConfig = {
  maxRounds: 10
};

describe('GameBoard', () => {
  test('renders game board with players and scores', () => {
    render(<GameBoard players={mockPlayers} gameConfig={mockGameConfig} />);
    
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Player 1: 0')).toBeInTheDocument();
    expect(screen.getByText('Player 2: 0')).toBeInTheDocument();
  });

  test('shows ScoreEntry when round is completed', () => {
    render(<GameBoard players={mockPlayers} gameConfig={mockGameConfig} />);
    
    fireEvent.click(screen.getByText('Complete Round'));
    
    expect(screen.getByText('Enter Round Scores')).toBeInTheDocument();
  });

  test('hides ScoreEntry when cancelled', () => {
    render(<GameBoard players={mockPlayers} gameConfig={mockGameConfig} />);
    
    fireEvent.click(screen.getByText('Complete Round'));
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.queryByText('Enter Round Scores')).not.toBeInTheDocument();
  });

  test('updates scores and advances round after submission', async () => {
    const mockOnGameStateUpdate = jest.fn();
    render(
      <GameBoard 
        players={mockPlayers} 
        gameConfig={mockGameConfig}
        onGameStateUpdate={mockOnGameStateUpdate}
      />
    );
    
    fireEvent.click(screen.getByText('Complete Round'));
    
    const player1Input = screen.getByLabelText('Player 1:');
    const player2Input = screen.getByLabelText('Player 2:');
    
    fireEvent.change(player1Input, { target: { value: '10' } });
    fireEvent.change(player2Input, { target: { value: '15' } });
    
    fireEvent.click(screen.getByText('Submit Scores'));
    
    await waitFor(() => {
      expect(screen.getByText('Round 2')).toBeInTheDocument();
      expect(screen.getByText('Player 1: 10')).toBeInTheDocument();
      expect(screen.getByText('Player 2: 15')).toBeInTheDocument();
    });
    
    expect(mockOnGameStateUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        currentRound: 2,
        scores: { '1': 10, '2': 15 }
      })
    );
  });
});