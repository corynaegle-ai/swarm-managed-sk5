import { renderHook, act, waitFor } from '@testing-library/react';
import useGameFlow from '../src/hooks/useGameFlow';

// Mock setTimeout/clearTimeout for testing
jest.useFakeTimers();

describe('useGameFlow', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useGameFlow());
    
    expect(result.current.currentRound).toBe(1);
    expect(result.current.currentPhase).toBe('bidding');
    expect(result.current.gameComplete).toBe(false);
    expect(typeof result.current.advancePhase).toBe('function');
  });

  test('advances from bidding to playing after 3 seconds', async () => {
    const { result } = renderHook(() => useGameFlow());
    
    expect(result.current.currentPhase).toBe('bidding');
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(result.current.currentPhase).toBe('playing');
    });
  });

  test('advances from playing to scoring after 3 seconds', async () => {
    const { result } = renderHook(() => useGameFlow());
    
    // First advance to playing
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(result.current.currentPhase).toBe('playing');
    });
    
    // Then advance to scoring
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(result.current.currentPhase).toBe('scoring');
    });
  });

  test('advances to next round after scoring phase', async () => {
    const { result } = renderHook(() => useGameFlow());
    
    // Advance through full cycle: bidding → playing → scoring
    act(() => {
      jest.advanceTimersByTime(9000); // 3 phases * 3 seconds
    });
    
    await waitFor(() => {
      expect(result.current.currentRound).toBe(2);
      expect(result.current.currentPhase).toBe('bidding');
    });
  });

  test('marks game complete after round 10', async () => {
    const { result } = renderHook(() => useGameFlow());
    
    // Simulate 10 full rounds (each round = 9 seconds for 3 phases)
    act(() => {
      jest.advanceTimersByTime(10 * 9000);
    });
    
    await waitFor(() => {
      expect(result.current.gameComplete).toBe(true);
      expect(result.current.currentRound).toBe(10);
    });
  });

  test('manual advancePhase works correctly', () => {
    const { result } = renderHook(() => useGameFlow());
    
    expect(result.current.currentPhase).toBe('bidding');
    
    act(() => {
      result.current.advancePhase();
    });
    
    expect(result.current.currentPhase).toBe('playing');
    
    act(() => {
      result.current.advancePhase();
    });
    
    expect(result.current.currentPhase).toBe('scoring');
    
    act(() => {
      result.current.advancePhase();
    });
    
    expect(result.current.currentRound).toBe(2);
    expect(result.current.currentPhase).toBe('bidding');
  });
});