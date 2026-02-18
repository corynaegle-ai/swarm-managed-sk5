import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameScreen from '../components/GameScreen';

// Mock child components
jest.mock('../components/PlayerSetup', () => {
  return function MockPlayerSetup({ onPlayersCreated }) {
    return (
      <div data-testid="player-setup">
        <button onClick={() => onPlayersCreated([{ id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }])}>
          Create Players
        </button>
      </div>
    );
  };
});

jest.mock('../components/GameBoard', () => {
  return function MockGameBoard({ players }) {
    return (
      <div data-testid="game-board">
        Game Board with {players.length} players
      </div>
    );
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('GameScreen', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('starts in setup phase', () => {
    render(<GameScreen />);
    expect(screen.getByTestId('player-setup')).toBeInTheDocument();
    expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
  });

  test('transitions to active game after player creation', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }]
    });

    render(<GameScreen />);
    
    fireEvent.click(screen.getByText('Create Players'));
    
    await waitFor(() => {
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.queryByTestId('player-setup')).not.toBeInTheDocument();
    });
  });

  test('displays player names in active game', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
    });

    render(<GameScreen />);
    
    fireEvent.click(screen.getByText('Create Players'));
    
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  test('can navigate back to setup', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'Player 1' }]
    });

    render(<GameScreen />);
    
    // Go to active game
    fireEvent.click(screen.getByText('Create Players'));
    
    await waitFor(() => {
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
    });
    
    // Go back to setup
    fireEvent.click(screen.getByText('Back to Setup'));
    
    expect(screen.getByTestId('player-setup')).toBeInTheDocument();
    expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
  });
});