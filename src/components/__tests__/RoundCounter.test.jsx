import React from 'react';
import { render, screen } from '@testing-library/react';
import RoundCounter from '../RoundCounter';
import { useGameFlow } from '../../hooks/useGameFlow';

// Mock the useGameFlow hook
jest.mock('../../hooks/useGameFlow');

describe('RoundCounter', () => {
  beforeEach(() => {
    useGameFlow.mockReturnValue({
      currentRound: 1,
      currentPhase: 'bidding'
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays current round number accurately', () => {
    render(<RoundCounter />);
    expect(screen.getByText('Round 1')).toBeInTheDocument();
  });

  it('displays current phase with proper capitalization', () => {
    render(<RoundCounter />);
    expect(screen.getByText('Bidding')).toBeInTheDocument();
  });

  it('displays round and phase together', () => {
    render(<RoundCounter />);
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Bidding')).toBeInTheDocument();
  });

  it('applies correct CSS class for bidding phase', () => {
    render(<RoundCounter />);
    const phaseElement = screen.getByText('Bidding');
    expect(phaseElement).toHaveClass('phase-indicator', 'phase-bidding');
  });

  it('applies correct CSS class for playing phase', () => {
    useGameFlow.mockReturnValue({
      currentRound: 2,
      currentPhase: 'playing'
    });
    render(<RoundCounter />);
    const phaseElement = screen.getByText('Playing');
    expect(phaseElement).toHaveClass('phase-indicator', 'phase-playing');
  });

  it('applies correct CSS class for scoring phase', () => {
    useGameFlow.mockReturnValue({
      currentRound: 3,
      currentPhase: 'scoring'
    });
    render(<RoundCounter />);
    const phaseElement = screen.getByText('Scoring');
    expect(phaseElement).toHaveClass('phase-indicator', 'phase-scoring');
  });

  it('handles undefined phase gracefully', () => {
    useGameFlow.mockReturnValue({
      currentRound: 1,
      currentPhase: undefined
    });
    render(<RoundCounter />);
    expect(screen.getByText('Round 1')).toBeInTheDocument();
  });

  it('updates when round changes', () => {
    const { rerender } = render(<RoundCounter />);
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    
    useGameFlow.mockReturnValue({
      currentRound: 5,
      currentPhase: 'playing'
    });
    
    rerender(<RoundCounter />);
    expect(screen.getByText('Round 5')).toBeInTheDocument();
  });
});