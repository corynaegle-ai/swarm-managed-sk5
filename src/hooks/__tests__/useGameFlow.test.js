import { renderHook, act } from '@testing-library/react';
import { useGameFlow } from '../useGameFlow';

describe('useGameFlow Hook', () => {
  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useGameFlow());
    
    expect(result.current.currentRound).toBe(1);
    expect(result.current.currentPhase).toBe('bidding');
    expect(result.current.gameComplete).toBe(false);
    expect(result.current.totalRounds).toBe(13);
    expect(result.current.phases).toEqual(['bidding', 'playing', 'scoring']);
  });

  test('canAdvance returns true initially', () => {
    const { result } = renderHook(() => useGameFlow());
    
    expect(result.current.canAdvance()).toBe(true);
  });

  test('canGoBack returns false initially', () => {
    const { result } = renderHook(() => useGameFlow());
    
    expect(result.current.canGoBack()).toBe(false);
  });

  test('nextPhase advances from bidding to playing', () => {
    const { result } = renderHook(() => useGameFlow());
    
    act(() => {
      result.current.nextPhase();
    });
    
    expect(result.current.currentPhase).toBe('playing');
    expect(result.current.currentRound).toBe(1);
  });

  test('nextPhase advances from playing to scoring', () => {
    const { result } = renderHook(() => useGameFlow());
    
    // Advance to playing phase first
    act(() => {
      result.current.nextPhase();
    });
    
    // Then advance to scoring
    act(() => {
      result.current.nextPhase();
    });
    
    expect(result.current.currentPhase).toBe('scoring');
    expect(result.current.currentRound).toBe(1);
  });

  test('nextPhase advances to next round after scoring', () => {
    const { result } = renderHook(() => useGameFlow());
    
    // Advance through all phases of round 1
    act(() => {
      result.current.nextPhase(); // bidding -> playing
      result.current.nextPhase(); // playing -> scoring
      result.current.nextPhase(); // scoring -> next round bidding
    });
    
    expect(result.current.currentPhase).toBe('bidding');
    expect(result.current.currentRound).toBe(2);
  });

  test('previousPhase works correctly', () => {
    const { result } = renderHook(() => useGameFlow());
    
    // Advance to playing phase
    act(() => {
      result.current.nextPhase();
    });
    
    expect(result.current.currentPhase).toBe('playing');
    
    // Go back to bidding
    act(() => {
      result.current.previousPhase();
    });
    
    expect(result.current.currentPhase).toBe('bidding');
    expect(result.current.currentRound).toBe(1);
  });

  test('game completes after round 13', () => {
    const { result } = renderHook(() => useGameFlow());
    
    // Jump to round 14 (should trigger game complete)
    act(() => {
      result.current.jumpToPhase(14, 'bidding');
    });
    
    expect(result.current.gameComplete).toBe(true);
  });

  test('resetGame restores initial state', () => {
    const { result } = renderHook(() => useGameFlow());
    
    // Advance game state
    act(() => {
      result.current.nextPhase();
      result.current.nextPhase();
      result.current.nextPhase();
    });
    
    // Reset game
    act(() => {
      result.current.resetGame();
    });
    
    expect(result.current.currentRound).toBe(1);
    expect(result.current.currentPhase).toBe('bidding');
    expect(result.current.gameComplete).toBe(false);
  });

  test('jumpToPhase works correctly', () => {
    const { result } = renderHook(() => useGameFlow());
    
    act(() => {
      const success = result.current.jumpToPhase(5, 'playing');
      expect(success).toBe(true);
    });
    
    expect(result.current.currentRound).toBe(5);
    expect(result.current.currentPhase).toBe('playing');
  });

  test('getGameProgress calculates correctly', () => {
    const { result } = renderHook(() => useGameFlow());
    
    // At start (round 1, bidding phase), progress should be 0
    expect(result.current.getGameProgress()).toBe(0);
    
    // Jump to middle of game
    act(() => {
      result.current.jumpToPhase(7, 'playing');
    });
    
    const expectedProgress = ((7 - 1) * 3 + 1) / (13 * 3) * 100;
    expect(result.current.getGameProgress()).toBeCloseTo(expectedProgress, 1);
  });
});