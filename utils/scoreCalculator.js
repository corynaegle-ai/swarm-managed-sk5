/**
 * Score calculation utilities for Skull King game
 * Implements core scoring rules including zero bid special handling
 */

/**
 * Calculate the score for a round based on bid, actual tricks, and bonus points
 * @param {number} bid - The player's bid for the round
 * @param {number} actualTricks - Number of tricks actually taken
 * @param {number} bonusPoints - Bonus points earned (only applied if bid met exactly)
 * @param {number} handsInRound - Total number of hands in the current round
 * @returns {number} The calculated score for the round
 */
export function calculateRoundScore(bid, actualTricks, bonusPoints = 0, handsInRound) {
  // Input validation
  if (typeof bid !== 'number' || typeof actualTricks !== 'number' || typeof handsInRound !== 'number') {
    throw new Error('bid, actualTricks, and handsInRound must be numbers');
  }
  
  if (bid < 0 || actualTricks < 0 || handsInRound <= 0) {
    throw new Error('bid and actualTricks must be non-negative, handsInRound must be positive');
  }
  
  if (typeof bonusPoints !== 'number') {
    throw new Error('bonusPoints must be a number');
  }

  // Zero bid special rules
  if (bid === 0) {
    if (actualTricks === 0) {
      // Correct zero bid: +10 × handsInRound
      return 10 * handsInRound;
    } else {
      // Incorrect zero bid: -10 × handsInRound
      return -10 * handsInRound;
    }
  }

  // Regular bid scoring
  if (bid === actualTricks) {
    // Bid met exactly: +20 per trick + bonus points
    return (20 * actualTricks) + bonusPoints;
  } else {
    // Bid missed: -10 per difference (no bonus points)
    const difference = Math.abs(bid - actualTricks);
    return -10 * difference;
  }
}

/**
 * Calculate if a zero bid was successful
 * @param {number} bid - The player's bid
 * @param {number} actualTricks - Number of tricks actually taken
 * @returns {boolean} True if zero bid was successful, false otherwise
 */
export function isZeroBidSuccessful(bid, actualTricks) {
  return bid === 0 && actualTricks === 0;
}

/**
 * Calculate if bonus points should be applied
 * @param {number} bid - The player's bid
 * @param {number} actualTricks - Number of tricks actually taken
 * @returns {boolean} True if bonus points should be applied
 */
export function shouldApplyBonusPoints(bid, actualTricks) {
  return bid > 0 && bid === actualTricks;
}

/**
 * Calculate the base score without bonus points
 * @param {number} bid - The player's bid for the round
 * @param {number} actualTricks - Number of tricks actually taken
 * @param {number} handsInRound - Total number of hands in the current round
 * @returns {number} The base score (without bonus points)
 */
export function calculateBaseScore(bid, actualTricks, handsInRound) {
  return calculateRoundScore(bid, actualTricks, 0, handsInRound);
}