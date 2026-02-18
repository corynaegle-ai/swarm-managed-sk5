# PlayerRoundResult Model Reference

## Overview
The `PlayerRoundResult` model stores individual player performance data for each round of a game, including bid information, tricks won, and scoring details.

## Schema Definition

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `playerId` | ObjectId | Yes | - | Reference to the Player document |
| `roundId` | ObjectId | Yes | - | Reference to the Round document |
| `gameId` | ObjectId | Yes | - | Reference to the Game document |
| `bid` | Number | Yes | - | Player's bid for the round (0 to handsInRound) |
| `bidSubmitted` | Boolean | Yes | false | Flag indicating if bid has been submitted |
| `tricksWon` | Number | No | 0 | Number of tricks won by player in round |
| `score` | Number | No | 0 | Player's score for the round |
| `isDealer` | Boolean | No | false | Flag indicating if player is dealer for round |

### Validation Rules

#### Bid Validation
- **Range**: Must be between 0 and the round's `handsInRound` value
- **Type**: Must be a non-negative integer
- **Reference**: Validated against the associated Round document's `handsInRound` field

#### Business Rules
- Each player can only have one result per round (enforced by compound unique index)
- Bid cannot be modified after `bidSubmitted` is set to true (application logic)
- Tricks won cannot exceed the round's hand count

## Usage Examples

### Creating a PlayerRoundResult

```javascript
const PlayerRoundResult = require('../models/PlayerRoundResult');

// Create new player round result
const result = new PlayerRoundResult({
  playerId: '507f1f77bcf86cd799439011',
  roundId: '507f1f77bcf86cd799439012', 
  gameId: '507f1f77bcf86cd799439013',
  bid: 3,
  bidSubmitted: true
});

await result.save();
```

### Submitting a Bid

```javascript
// Using instance method
const result = await PlayerRoundResult.findOne({
  playerId: playerId,
  roundId: roundId
});

await result.submitBid(4);
```

### Querying Bids for a Round

```javascript
// Get all submitted bids for a round
const bids = await PlayerRoundResult.getBidsForRound(roundId);
console.log(bids); // Array of results with player names
```

### Validation Examples

```javascript
// Valid bid - will save successfully
const validResult = new PlayerRoundResult({
  playerId: playerId,
  roundId: roundId,
  gameId: gameId,
  bid: 2, // Valid if round has >= 2 hands
  bidSubmitted: true
});

// Invalid bid - will throw validation error
const invalidResult = new PlayerRoundResult({
  playerId: playerId,
  roundId: roundId,
  gameId: gameId,
  bid: 15, // Invalid if round has < 15 hands
  bidSubmitted: true
});

try {
  await invalidResult.save();
} catch (error) {
  console.log(error.message); // "Bid cannot exceed the number of hands in the round"
}
```

## Instance Methods

### `submitBid(bidValue)`
Submits a bid for the player round result.

**Parameters:**
- `bidValue` (Number): The bid value to submit

**Returns:** Promise that resolves to the saved document

**Example:**
```javascript
const result = await PlayerRoundResult.findById(resultId);
await result.submitBid(3);
```

## Static Methods

### `getBidsForRound(roundId)`
Retrieves all submitted bids for a specific round.

**Parameters:**
- `roundId` (ObjectId): The round ID to query

**Returns:** Promise that resolves to array of PlayerRoundResult documents with populated player names

**Example:**
```javascript
const roundBids = await PlayerRoundResult.getBidsForRound(roundId);
roundBids.forEach(result => {
  console.log(`${result.playerId.name}: ${result.bid}`);
});
```

## Virtual Properties

### `bidStatus`
Read-only computed property that returns the bid outcome status.

**Returns:**
- `"pending"`: Bid not yet submitted
- `"made"`: Bid submitted and player won exact number of tricks bid
- `"failed"`: Bid submitted but player did not win exact number of tricks bid

**Example:**
```javascript
const result = await PlayerRoundResult.findById(resultId);
console.log(result.bidStatus); // "made", "failed", or "pending"
```

## Indexes

### Compound Unique Index
- Fields: `playerId` + `roundId`
- Purpose: Ensures each player has exactly one result per round
- Prevents duplicate entries for the same player in the same round

## Error Handling

### Common Validation Errors

1. **Bid out of range**: "Bid must be between 0 and X (hands in round)"
2. **Negative bid**: "Bid cannot be negative"
3. **Round not found**: "Round not found for validation"
4. **Duplicate result**: Mongoose duplicate key error on compound index

### Best Practices

1. Always validate round exists before creating PlayerRoundResult
2. Check bid constraints before submission
3. Handle async validation errors in try-catch blocks
4. Use transactions when updating multiple related documents

## Related Models

- **Player**: Referenced by `playerId`
- **Round**: Referenced by `roundId`, used for bid validation
- **Game**: Referenced by `gameId`

## Migration Notes

When adding bid fields to existing PlayerRoundResult documents:

1. Set default `bidSubmitted: false` for existing records
2. Require bid field to be set when `bidSubmitted: true`
3. Run validation against existing Round documents
4. Consider data migration script for production deployment