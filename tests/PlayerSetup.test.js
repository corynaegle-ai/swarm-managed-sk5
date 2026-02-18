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

  test('input fields update state when typed in', () => {
    render(<PlayerSetup />);
    const input1 = screen.getByPlaceholderText('Player 1 name');
    const input2 = screen.getByPlaceholderText('Player 2 name');
    
    fireEvent.change(input1, { target: { value: 'Alice' } });
    fireEvent.change(input2, { target: { value: 'Bob' } });
    
    expect(input1.value).toBe('Alice');
    expect(input2.value).toBe('Bob');
  });
});