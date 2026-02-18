import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerSetup from '../components/PlayerSetup';

describe('PlayerSetup Component', () => {
  test('renders without errors', () => {
    render(<PlayerSetup />);
    expect(screen.getByText('Player Setup')).toBeInTheDocument();
  });

  test('shows exactly 2 name input fields by default', () => {
    render(<PlayerSetup />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);
  });

  test('input fields have proper placeholders', () => {
    render(<PlayerSetup />);
    expect(screen.getByPlaceholderText('Player 1 name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Player 2 name')).toBeInTheDocument();
  });

  test('input values can be changed', () => {
    render(<PlayerSetup />);
    const player1Input = screen.getByPlaceholderText('Player 1 name');
    const player2Input = screen.getByPlaceholderText('Player 2 name');
    
    fireEvent.change(player1Input, { target: { value: 'Alice' } });
    fireEvent.change(player2Input, { target: { value: 'Bob' } });
    
    expect(player1Input.value).toBe('Alice');
    expect(player2Input.value).toBe('Bob');
  });

  test('component can be imported and used', () => {
    expect(PlayerSetup).toBeDefined();
    expect(typeof PlayerSetup).toBe('function');
  });
});