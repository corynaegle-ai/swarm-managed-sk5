import React from 'react';
import { render, screen } from '@testing-library/react';
import Score from './Score';

describe('Score Component', () => {
  const mockRounds = [
    { round: 1, par: 4, score: 5, differential: 1, total: 5 },
    { round: 2, par: 3, score: 3, differential: 0, total: 8 },
    { round: 3, par: 5, score: 4, differential: -1, total: 12 }
  ];

  test('renders score table with data', () => {
    render(<Score rounds={mockRounds} />);
    
    expect(screen.getByText('Round')).toBeInTheDocument();
    expect(screen.getByText('Par')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('+/-')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  test('renders no data message when rounds array is empty', () => {
    render(<Score rounds={[]} />);
    
    expect(screen.getByText('No score data available')).toBeInTheDocument();
  });

  test('applies responsive CSS classes', () => {
    render(<Score rounds={mockRounds} />);
    
    const container = document.querySelector('.score-container');
    const table = document.querySelector('.score-table');
    const wrapper = document.querySelector('.score-table-wrapper');
    
    expect(container).toBeInTheDocument();
    expect(table).toBeInTheDocument();
    expect(wrapper).toBeInTheDocument();
  });

  test('applies differential styling correctly', () => {
    render(<Score rounds={mockRounds} />);
    
    const overPar = screen.getByText('+1');
    const underPar = screen.getByText('-1');
    const atPar = screen.getByText('0');
    
    expect(overPar).toHaveClass('over-par');
    expect(underPar).toHaveClass('under-par');
    expect(atPar).toHaveClass('at-par');
  });
});