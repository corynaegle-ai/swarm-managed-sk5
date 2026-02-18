import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerSetup from '../components/PlayerSetup';

describe('PlayerSetup Component', () => {
  test('renders with initial 2 players', () => {
    render(<PlayerSetup />);
    expect(screen.getByText('Player 1:')).toBeInTheDocument();
    expect(screen.getByText('Player 2:')).toBeInTheDocument();
    expect(screen.getByText('Players: 2 / 8')).toBeInTheDocument();
  });

  test('Add Player button creates new input field up to 8 players', () => {
    render(<PlayerSetup />);
    const addButton = screen.getByText('Add Player');
    
    // Add players up to 8
    for (let i = 3; i <= 8; i++) {
      fireEvent.click(addButton);
      expect(screen.getByText(`Player ${i}:`)).toBeInTheDocument();
      expect(screen.getByText(`Players: ${i} / 8`)).toBeInTheDocument();
    }
  });

  test('Add Player button is disabled when 8 players are present', () => {
    render(<PlayerSetup />);
    const addButton = screen.getByText('Add Player');
    
    // Add 6 more players to reach 8
    for (let i = 0; i < 6; i++) {
      fireEvent.click(addButton);
    }
    
    expect(addButton).toBeDisabled();
    expect(addButton).toHaveClass('disabled');
  });

  test('Remove buttons appear when more than 2 players', () => {
    render(<PlayerSetup />);
    
    // Initially no remove buttons with 2 players
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
    
    // Add a player
    fireEvent.click(screen.getByText('Add Player'));
    
    // Now remove buttons should appear
    expect(screen.getAllByText('Remove')).toHaveLength(3);
  });

  test('Remove Player button works down to minimum 2 players', () => {
    render(<PlayerSetup />);
    
    // Add a third player
    fireEvent.click(screen.getByText('Add Player'));
    expect(screen.getByText('Players: 3 / 8')).toBeInTheDocument();
    
    // Remove a player
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    
    expect(screen.getByText('Players: 2 / 8')).toBeInTheDocument();
  });

  test('Remove buttons disappear when only 2 players remain', () => {
    render(<PlayerSetup />);
    
    // Add a third player
    fireEvent.click(screen.getByText('Add Player'));
    expect(screen.getAllByText('Remove')).toHaveLength(3);
    
    // Remove a player to get back to 2
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    
    // Remove buttons should disappear
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
  });

  test('player name inputs update correctly', () => {
    render(<PlayerSetup />);
    const player1Input = screen.getByPlaceholderText('Enter Player 1 name');
    const player2Input = screen.getByPlaceholderText('Enter Player 2 name');
    
    fireEvent.change(player1Input, { target: { value: 'Alice' } });
    fireEvent.change(player2Input, { target: { value: 'Bob' } });
    
    expect(player1Input).toHaveValue('Alice');
    expect(player2Input).toHaveValue('Bob');
  });
});