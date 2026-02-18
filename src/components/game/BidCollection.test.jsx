import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BidCollection from './BidCollection';

const mockGameState = {
  players: [
    { id: '1', name: 'Player 1' },
    { id: '2', name: 'Player 2' },
    { id: '3', name: 'Player 3' }
  ],
  handCount: 5
};

const mockOnBidsSubmit = jest.fn();

describe('BidCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders bid inputs for each player', () => {
    render(<BidCollection gameState={mockGameState} onBidsSubmit={mockOnBidsSubmit} />);
    
    expect(screen.getByLabelText('Player 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Player 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Player 3')).toBeInTheDocument();
  });

  test('shows error messages for invalid bids', async () => {
    render(<BidCollection gameState={mockGameState} onBidsSubmit={mockOnBidsSubmit} />);
    
    const input = screen.getByLabelText('Player 1');
    fireEvent.change(input, { target: { value: '-1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Bid must be 0 or a positive integer')).toBeInTheDocument();
    });
  });

  test('disables submit button when validation fails', async () => {
    render(<BidCollection gameState={mockGameState} onBidsSubmit={mockOnBidsSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /submit bids/i });
    expect(submitButton).toBeDisabled();
    
    // Fill valid bids
    fireEvent.change(screen.getByLabelText('Player 1'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Player 2'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Player 3'), { target: { value: '1' } });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('shows visual feedback for validation errors', async () => {
    render(<BidCollection gameState={mockGameState} onBidsSubmit={mockOnBidsSubmit} />);
    
    const input = screen.getByLabelText('Player 1');
    fireEvent.change(input, { target: { value: 'invalid' } });
    
    await waitFor(() => {
      expect(input).toHaveClass('bid-input-error');
      expect(screen.getByText('Bid must be 0 or a positive integer')).toBeInTheDocument();
    });
  });

  test('prevents total bids from equaling hand count', async () => {
    render(<BidCollection gameState={mockGameState} onBidsSubmit={mockOnBidsSubmit} />);
    
    // Set bids that total to hand count (5)
    fireEvent.change(screen.getByLabelText('Player 1'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Player 2'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Player 3'), { target: { value: '1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Total bids cannot equal 5 (hand count)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit bids/i })).toBeDisabled();
    });
  });
});