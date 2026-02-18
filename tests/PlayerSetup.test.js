import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerSetup from '../components/PlayerSetup';

describe('PlayerSetup Component', () => {
  test('Start Game button is disabled with less than 2 players', () => {
    render(<PlayerSetup />);
    
    // Initially has 2 empty players, so button should be disabled
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeDisabled();
  });

  test('Start Game button is enabled with 2 valid player names', () => {
    render(<PlayerSetup />);
    
    const inputs = screen.getAllByPlaceholderText(/Player \d+ Name/);
    fireEvent.change(inputs[0], { target: { value: 'Alice' } });
    fireEvent.change(inputs[1], { target: { value: 'Bob' } });
    
    const startButton = screen.getByText('Start Game');
    expect(startButton).not.toBeDisabled();
  });

  test('Start Game button is disabled when any player name is empty', () => {
    render(<PlayerSetup />);
    
    const inputs = screen.getAllByPlaceholderText(/Player \d+ Name/);
    fireEvent.change(inputs[0], { target: { value: 'Alice' } });
    // Leave second input empty
    
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeDisabled();
  });

  test('Console logs player names when Start Game is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<PlayerSetup />);
    
    const inputs = screen.getAllByPlaceholderText(/Player \d+ Name/);
    fireEvent.change(inputs[0], { target: { value: 'Alice' } });
    fireEvent.change(inputs[1], { target: { value: 'Bob' } });
    
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Starting game with players:', ['Alice', 'Bob']);
    
    consoleSpy.mockRestore();
  });
});