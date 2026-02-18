import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from '../GameBoard';
import { useGameFlow } from '../../hooks/useGameFlow';

// Mock the useGameFlow hook
jest.mock('../../hooks/useGameFlow');

const mockUseGameFlow = useGameFlow;

describe('GameBoard Component', () => {
  const defaultMockReturn = {
    currentRound: 1,
    currentPhase: 'bidding',
    gameComplete: false,
    nextPhase: jest.fn(),
    previousPhase: jest.fn(),
    canAdvance: jest.fn(() => true),
    canGoBack: jest.fn(() => false)
  };

  beforeEach(() => {
    mockUseGameFlow.mockReturnValue(defaultMockReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders GameBoard with bidding phase UI', () => {
    render(<GameBoard />);
    
    expect(screen.getByText('Spades Game')).toBeInTheDocument();
    expect(screen.getByText('Current Phase: Bidding')).toBeInTheDocument();
    expect(screen.getByText('Bidding Phase')).toBeInTheDocument();
    expect(screen.getByText('Pass (0)')).toBeInTheDocument();
    expect(screen.getByText('Bid 1')).toBeInTheDocument();
  });

  test('renders playing phase UI when phase is playing', () => {
    mockUseGameFlow.mockReturnValue({
      ...defaultMockReturn,
      currentPhase: 'playing'
    });

    render(<GameBoard />);
    
    expect(screen.getByText('Current Phase: Playing')).toBeInTheDocument();
    expect(screen.getByText('Playing Phase')).toBeInTheDocument();
    expect(screen.getByText('♠️A')).toBeInTheDocument();
    expect(screen.queryByText('Bidding Phase')).not.toBeInTheDocument();
  });

  test('renders scoring phase UI when phase is scoring', () => {
    mockUseGameFlow.mockReturnValue({
      ...defaultMockReturn,
      currentPhase: 'scoring'
    });

    render(<GameBoard />);
    
    expect(screen.getByText('Current Phase: Scoring')).toBeInTheDocument();
    expect(screen.getByText('Scoring Phase')).toBeInTheDocument();
    expect(screen.getByText('Round 1 Complete!')).toBeInTheDocument();
  });

  test('disables navigation buttons based on canAdvance and canGoBack', () => {
    mockUseGameFlow.mockReturnValue({
      ...defaultMockReturn,
      canAdvance: jest.fn(() => false),
      canGoBack: jest.fn(() => true)
    });

    render(<GameBoard />);
    
    const nextButton = screen.getByText('Next Phase');
    const prevButton = screen.getByText('Previous Phase');
    
    expect(nextButton).toBeDisabled();
    expect(prevButton).not.toBeDisabled();
  });

  test('calls nextPhase when next button is clicked', () => {
    const mockNextPhase = jest.fn();
    mockUseGameFlow.mockReturnValue({
      ...defaultMockReturn,
      nextPhase: mockNextPhase
    });

    render(<GameBoard />);
    
    fireEvent.click(screen.getByText('Next Phase'));
    expect(mockNextPhase).toHaveBeenCalledTimes(1);
  });

  test('renders GameComplete when game is complete', () => {
    mockUseGameFlow.mockReturnValue({
      ...defaultMockReturn,
      gameComplete: true
    });

    render(<GameBoard />);
    
    expect(screen.getByText('🎉 Game Complete! 🎉')).toBeInTheDocument();
  });

  test('applies correct CSS class based on current phase', () => {
    const { container } = render(<GameBoard />);
    
    expect(container.firstChild).toHaveClass('game-board', 'phase-bidding');
  });
});