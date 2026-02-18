import { 
  calculateRoundScore, 
  isZeroBidSuccessful, 
  shouldApplyBonusPoints, 
  calculateBaseScore 
} from '../../utils/scoreCalculator.js';

describe('scoreCalculator', () => {
  describe('calculateRoundScore', () => {
    describe('zero bid scenarios', () => {
      test('correct zero bid returns +10 × handsInRound', () => {
        expect(calculateRoundScore(0, 0, 0, 5)).toBe(50);
        expect(calculateRoundScore(0, 0, 0, 10)).toBe(100);
        expect(calculateRoundScore(0, 0, 50, 3)).toBe(30); // bonus ignored for zero bid
      });

      test('incorrect zero bid returns -10 × handsInRound', () => {
        expect(calculateRoundScore(0, 1, 0, 5)).toBe(-50);
        expect(calculateRoundScore(0, 2, 0, 10)).toBe(-100);
        expect(calculateRoundScore(0, 3, 50, 3)).toBe(-30); // bonus ignored for zero bid
      });
    });

    describe('regular bid scenarios', () => {
      test('bid met exactly returns +20 per trick plus bonus', () => {
        expect(calculateRoundScore(3, 3, 0, 5)).toBe(60);
        expect(calculateRoundScore(2, 2, 10, 5)).toBe(50);
        expect(calculateRoundScore(5, 5, 30, 10)).toBe(130);
      });

      test('bid missed returns -10 per difference', () => {
        expect(calculateRoundScore(3, 1, 0, 5)).toBe(-20); // difference of 2
        expect(calculateRoundScore(2, 5, 10, 5)).toBe(-30); // difference of 3, bonus ignored
        expect(calculateRoundScore(5, 2, 50, 10)).toBe(-30); // difference of 3, bonus ignored
      });

      test('bonus points only applied when bid met exactly', () => {
        // Bid met exactly - bonus applied
        expect(calculateRoundScore(3, 3, 25, 5)).toBe(85);
        
        // Bid missed - bonus ignored
        expect(calculateRoundScore(3, 2, 25, 5)).toBe(-10);
        expect(calculateRoundScore(3, 4, 25, 5)).toBe(-10);
      });
    });

    describe('edge cases', () => {
      test('handles single trick scenarios', () => {
        expect(calculateRoundScore(1, 1, 0, 1)).toBe(20);
        expect(calculateRoundScore(1, 0, 0, 1)).toBe(-10);
      });

      test('handles large differences', () => {
        expect(calculateRoundScore(10, 1, 0, 10)).toBe(-90);
        expect(calculateRoundScore(1, 10, 0, 10)).toBe(-90);
      });

      test('handles negative bonus points', () => {
        expect(calculateRoundScore(2, 2, -10, 5)).toBe(30);
      });
    });

    describe('input validation', () => {
      test('throws error for non-number inputs', () => {
        expect(() => calculateRoundScore('3', 3, 0, 5)).toThrow('bid, actualTricks, and handsInRound must be numbers');
        expect(() => calculateRoundScore(3, '3', 0, 5)).toThrow('bid, actualTricks, and handsInRound must be numbers');
        expect(() => calculateRoundScore(3, 3, 0, '5')).toThrow('bid, actualTricks, and handsInRound must be numbers');
        expect(() => calculateRoundScore(3, 3, '0', 5)).toThrow('bonusPoints must be a number');
      });

      test('throws error for negative values', () => {
        expect(() => calculateRoundScore(-1, 3, 0, 5)).toThrow('bid and actualTricks must be non-negative, handsInRound must be positive');
        expect(() => calculateRoundScore(3, -1, 0, 5)).toThrow('bid and actualTricks must be non-negative, handsInRound must be positive');
        expect(() => calculateRoundScore(3, 3, 0, 0)).toThrow('bid and actualTricks must be non-negative, handsInRound must be positive');
        expect(() => calculateRoundScore(3, 3, 0, -5)).toThrow('bid and actualTricks must be non-negative, handsInRound must be positive');
      });
    });
  });

  describe('isZeroBidSuccessful', () => {
    test('returns true for successful zero bid', () => {
      expect(isZeroBidSuccessful(0, 0)).toBe(true);
    });

    test('returns false for unsuccessful zero bid', () => {
      expect(isZeroBidSuccessful(0, 1)).toBe(false);
      expect(isZeroBidSuccessful(0, 5)).toBe(false);
    });

    test('returns false for non-zero bids', () => {
      expect(isZeroBidSuccessful(1, 0)).toBe(false);
      expect(isZeroBidSuccessful(3, 3)).toBe(false);
    });
  });

  describe('shouldApplyBonusPoints', () => {
    test('returns true when non-zero bid met exactly', () => {
      expect(shouldApplyBonusPoints(3, 3)).toBe(true);
      expect(shouldApplyBonusPoints(1, 1)).toBe(true);
      expect(shouldApplyBonusPoints(10, 10)).toBe(true);
    });

    test('returns false when bid missed', () => {
      expect(shouldApplyBonusPoints(3, 2)).toBe(false);
      expect(shouldApplyBonusPoints(3, 4)).toBe(false);
    });

    test('returns false for zero bid scenarios', () => {
      expect(shouldApplyBonusPoints(0, 0)).toBe(false);
      expect(shouldApplyBonusPoints(0, 1)).toBe(false);
    });
  });

  describe('calculateBaseScore', () => {
    test('calculates score without bonus points', () => {
      expect(calculateBaseScore(3, 3, 5)).toBe(60);
      expect(calculateBaseScore(2, 1, 5)).toBe(-10);
      expect(calculateBaseScore(0, 0, 5)).toBe(50);
      expect(calculateBaseScore(0, 1, 5)).toBe(-50);
    });
  });
});