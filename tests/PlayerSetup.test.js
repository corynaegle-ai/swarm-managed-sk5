import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerSetup from '../components/PlayerSetup';

describe('PlayerSetup Component', () => {
  test('renders player input fields', () => {
    render(<PlayerSetup />);
    expect(screen.getByLabelText('Player 1 Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Player 2 Name:')).toBeInTheDocument();
  });

  test('shows invalid styling and error message for empty inputs', () => {
    render(<PlayerSetup />);
    const input1 = screen.getByLabelText('Player 1 Name:');
    expect(input1).toHaveClass('invalid');
    expect(screen.getByText('Player name is required')).toBeInTheDocument();
  });

  test('shows valid styling when name is entered', () => {
    render(<PlayerSetup />);
    const input1 = screen.getByLabelText('Player 1 Name:');
    
    fireEvent.change(input1, { target: { value: 'John' } });
    
    expect(input1).toHaveClass('valid');
    expect(input1).not.toHaveClass('invalid');
  });

  test('hides error message when valid name is entered', () => {
    render(<PlayerSetup />);
    const input1 = screen.getByLabelText('Player 1 Name:');
    
    fireEvent.change(input1, { target: { value: 'John' } });
    
    expect(screen.queryByText('Player name is required')).not.toBeInTheDocument();
  });

  test('validates in real-time as user types', () => {
    render(<PlayerSetup />);
    const input1 = screen.getByLabelText('Player 1 Name:');
    
    // Start with invalid
    expect(input1).toHaveClass('invalid');
    
    // Type a character
    fireEvent.change(input1, { target: { value: 'J' } });
    expect(input1).toHaveClass('valid');
    
    // Clear input
    fireEvent.change(input1, { target: { value: '' } });
    expect(input1).toHaveClass('invalid');
  });
});