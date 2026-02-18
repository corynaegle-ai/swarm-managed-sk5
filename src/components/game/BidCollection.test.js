import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BidCollection from './BidCollection';

const mockPlayers = [
  { id: 1, name: 'Player 1' },
  { id: 2, name: 'Player 2' },
  { id: 3, name: 'Player 3' },
  { id: 4, name: 'Player 4' }
];

const mockOnBidsSubmit = jest.fn();

describe('BidCollection', () => {
  beforeEach(() => {
    mockOnBidsSubmit.mockClear();
  });

  test('renders bid collection form with all players', () => {
    render(
      <BidCollection 
        players={mockPlayers} 
        onBidsSubmit={mockOnBidsSubmit}
        gamePhase="bidding"
      />
    );
    
    expect(screen.getByText('Collect Player Bids')).toBeInTheDocument();
    expect(screen.getByText('0 of 4 players have bid')).toBeInTheDocument();
    
    mockPlayers.forEach(player => {
      expect(screen.getByText(player.name)).toBeInTheDocument();
    });
  });

  test('updates progress indicator as bids are entered', () => {
    render(
      <BidCollection 
        players={mockPlayers} 
        onBidsSubmit={mockOnBidsSubmit}
        gamePhase="bidding"
      />
    );
    
    const firstInput = screen.getAllByPlaceholderText('Enter bid...')[0];
    const secondInput = screen.getAllByPlaceholderText('Enter bid...')[1];
    
    fireEvent.change(firstInput, { target: { value: '3' } });
    expect(screen.getByText('1 of 4 players have bid')).toBeInTheDocument();
    
    fireEvent.change(secondInput, { target: { value: '2' } });
    expect(screen.getByText('2 of 4 players have bid')).toBeInTheDocument();
  });

  test('shows visual feedback for incomplete bid collection', () => {
    render(
      <BidCollection 
        players={mockPlayers} 
        onBidsSubmit={mockOnBidsSubmit}
        gamePhase="bidding"
      />
    );
    
    const submitButton = screen.getByText('Submit All Bids');
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Please complete all bid entries before submitting.')).toBeInTheDocument();
  });

  test('enables submit button when all bids are complete', () => {
    render(
      <BidCollection 
        players={mockPlayers} 
        onBidsSubmit={mockOnBidsSubmit}
        gamePhase="bidding"
      />
    );
    
    const inputs = screen.getAllByPlaceholderText('Enter bid...');
    
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    const submitButton = screen.getByText('Submit All Bids');
    expect(submitButton).not.toBeDisabled();
  });

  test('calls onBidsSubmit with bid data on form submission', async () => {
    render(
      <BidCollection 
        players={mockPlayers} 
        onBidsSubmit={mockOnBidsSubmit}
        gamePhase="bidding"
      />
    );
    
    const inputs = screen.getAllByPlaceholderText('Enter bid...');
    const bids = ['3', '2', '4', '1'];
    
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: bids[index] } });
    });
    
    const submitButton = screen.getByText('Submit All Bids');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnBidsSubmit).toHaveBeenCalledWith({
        1: 3,
        2: 2,
        3: 4,
        4: 1
      });
    });
  });

  test('clears form after successful submission', async () => {
    mockOnBidsSubmit.mockResolvedValueOnce();
    
    render(
      <BidCollection 
        players={mockPlayers} 
        onBidsSubmit={mockOnBidsSubmit}
        gamePhase="bidding"
      />
    );
    
    const inputs = screen.getAllByPlaceholderText('Enter bid...');
    
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    const submitButton = screen.getByText('Submit All Bids');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bids submitted successfully!')).toBeInTheDocument();
    });
  });

  test('validates bid inputs and shows error messages', () => {
    render(
      <BidCollection 
        players={mockPlayers} 
        onBidsSubmit={mockOnBidsSubmit}
        gamePhase="bidding"
      />
    );
    
    const firstInput = screen.getAllByPlaceholderText('Enter bid...')[0];
    fireEvent.change(firstInput, { target: { value: '-1' } });
    
    const submitButton = screen.getByText('Submit All Bids');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Bid must be a valid non-negative number')).toBeInTheDocument();
  });
});