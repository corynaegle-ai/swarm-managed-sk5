import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerSetup from '../components/PlayerSetup';

describe('PlayerSetup Component', () => {
  test('renders player input fields', () => {
    render(<PlayerSetup />);
    expect(screen.getByLabelText('Player 1 Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Player 2 Name:')).toBeInTheDocument();
  });

  test('does not show validation styling on initial render', () => {
    render(<PlayerSetup />);
    const input1 = screen.getByLabelText('Player 1 Name:');
    const input2 = screen.getByLabelText('Player 2 Name:');
    
    expect(input1).not.toHaveClass('valid');
    expect(input1).not.toHaveClass('invalid');
    expect(input2).not.toHaveClass('valid');
    expect(input2).not.toHaveClass('invalid');
  });

  test('shows invalid styling and error message after typing empty value', () => {
    render(<PlayerSetup />);
    const input = screen.getByLabelText('Player 1 Name:');
    
    fireEvent.change(input, { target: { value: '' } });
    
    expect(input).toHaveClass('invalid');
    expect(screen.getByText('Player name is required')).toBeInTheDocument();
  });

  test('shows valid styling for non-empty name', () => {
    render(<PlayerSetup />);
    const input = screen.getByLabelText('Player 1 Name:');
    
    fireEvent.change(input, { target: { value: 'John' } });
    
    expect(input).toHaveClass('valid');
    expect(screen.queryByText('Player name is required')).not.toBeInTheDocument();
  });

  test('validates against trimmed value - whitespace only is invalid', () => {
    render(<PlayerSetup />);
    const input = screen.getByLabelText('Player 1 Name:');
    
    fireEvent.change(input, { target: { value: '   ' } });
    
    expect(input).toHaveClass('invalid');
    expect(screen.getByText('Player name is required')).toBeInTheDocument();
  });

  test('shows validation after blur event', () => {
    render(<PlayerSetup />);
    const input = screen.getByLabelText('Player 1 Name:');
    
    fireEvent.blur(input);
    
    expect(input).toHaveClass('invalid');
    expect(screen.getByText('Player name is required')).toBeInTheDocument();
  });
});