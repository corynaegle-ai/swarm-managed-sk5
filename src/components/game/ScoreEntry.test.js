import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScoreEntry from './ScoreEntry';
import { gameService } from '../../services/gameService';

// Mock the game service
jest.mock('../../services/gameService', () => ({
  gameService: {
    submitScores: jest.fn()
  }
}));

const mockPlayers = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' }
];

const mockTricksData = {
  '1': 3,
  '2': 2
};

const mockBonusData = {
  '1': 5,
  '2': 10
};

const defaultProps = {
  gameId: 'test-game-id',
  players: mockPlayers,
  tricksData: mockTricksData,
  bonusData: mockBonusData,
  onScoreSubmit: jest.fn(),
  onCancel: jest.fn()
};

describe('ScoreEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders score preview for all players', () => {
    render(<ScoreEntry {...defaultProps} />);
    
    expect(screen.getByText('Calculated Scores Preview')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    
    // Check calculated scores (3 tricks * 10 + 5 bonus = 35 for Player 1)
    expect(screen.getByText('35')).toBeInTheDocument();
    // Check calculated scores (2 tricks * 10 + 10 bonus = 30 for Player 2)
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  test('shows loading state during API call', async () => {
    gameService.submitScores.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );
    
    render(<ScoreEntry {...defaultProps} />);
    
    const submitButton = screen.getByText('Submit Scores');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('calls API with correct data format on submit', async () => {
    gameService.submitScores.mockResolvedValue({ success: true });
    
    render(<ScoreEntry {...defaultProps} />);
    
    const submitButton = screen.getByText('Submit Scores');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(gameService.submitScores).toHaveBeenCalledWith('test-game-id', {
        gameId: 'test-game-id',
        roundScores: {
          '1': {
            tricks: 3,
            bonus: 5,
            baseScore: 30,
            totalScore: 35
          },
          '2': {
            tricks: 2,
            bonus: 10,
            baseScore: 20,
            totalScore: 30
          }
        }
      });
    });
  });

  test('calls onScoreSubmit prop when API succeeds', async () => {
    const mockResponse = { success: true, gameState: 'updated' };
    gameService.submitScores.mockResolvedValue(mockResponse);
    
    render(<ScoreEntry {...defaultProps} />);
    
    const submitButton = screen.getByText('Submit Scores');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(defaultProps.onScoreSubmit).toHaveBeenCalledWith(mockResponse);
    });
  });

  test('calls onCancel prop when cancel button clicked', () => {
    render(<ScoreEntry {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});