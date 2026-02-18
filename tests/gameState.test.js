import { renderHook, act } from '@testing-library/react';
import { useGameState } from '../hooks/useGameState';
import { GameProvider, GAME_PHASES } from '../contexts/GameContext';

const wrapper = ({ children }) => <GameProvider>{children}</GameProvider>;

describe('Game State Management', () => {
  test('should track score entry phase separately', () => {
    const { result } = renderHook(() => useGameState(), { wrapper });
    
    act(() => {
      result.current.startScoreEntry();
    });
    
    expect(result.current.isScoreEntryPhase()).toBe(true);
    expect(result.current.isPlayingPhase()).toBe(false);
  });

  test('should include actualTricks and bonusPoints in state', () => {
    const { result } = renderHook(() => useGameState(), { wrapper });
    
    act(() => {
      result.current.setPlayers([{ id: '1', name: 'Player 1' }]);
      result.current.setActualTricks('1', 3);
      result.current.setBonusPoints('1', 5);
    });
    
    expect(result.current.actualTricks['1']).toBe(3);
    expect(result.current.bonusPoints['1']).toBe(5);
  });

  test('should handle proper phase transitions', () => {
    const { result } = renderHook(() => useGameState(), { wrapper });
    
    // Start in bidding phase
    expect(result.current.isBiddingPhase()).toBe(true);
    
    // Transition to playing
    act(() => {
      result.current.startPlaying();
    });
    expect(result.current.isPlayingPhase()).toBe(true);
    
    // Transition to score entry
    act(() => {
      result.current.startScoreEntry();
    });
    expect(result.current.isScoreEntryPhase()).toBe(true);
  });

  test('should update total scores after score entry', () => {
    const { result } = renderHook(() => useGameState(), { wrapper });
    
    act(() => {
      result.current.setPlayers([{ id: '1', name: 'Player 1' }]);
      result.current.setBid('1', 2);
      result.current.setActualTricks('1', 2);
      result.current.setBonusPoints('1', 0);
      result.current.completeRound();
    });
    
    const totalScores = result.current.getTotalScores();
    expect(totalScores['1']).toBe(12); // 10 + 2 + 0 for exact bid
  });
});