const mongoose = require('mongoose');

const playerRoundResultSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  roundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  bid: {
    type: Number,
    required: true,
    min: [0, 'Bid cannot be negative'],
    validate: {
      validator: async function(value) {
        // Get the current round to check hand count
        const Round = mongoose.model('Round');
        const round = await Round.findById(this.roundId);
        if (!round) {
          throw new Error('Round not found');
        }
        return value <= round.handsInRound;
      },
      message: 'Bid cannot exceed the number of hands in the round'
    }
  },
  bidSubmitted: {
    type: Boolean,
    required: true,
    default: false
  },
  tricksWon: {
    type: Number,
    default: 0,
    min: 0
  },
  score: {
    type: Number,
    default: 0
  },
  isDealer: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure one result per player per round
playerRoundResultSchema.index({ playerId: 1, roundId: 1 }, { unique: true });

// Pre-save middleware for additional validation
playerRoundResultSchema.pre('save', async function(next) {
  if (this.isModified('bid')) {
    try {
      const Round = mongoose.model('Round');
      const round = await Round.findById(this.roundId);
      
      if (!round) {
        return next(new Error('Round not found for validation'));
      }
      
      if (this.bid < 0 || this.bid > round.handsInRound) {
        return next(new Error(`Bid must be between 0 and ${round.handsInRound} (hands in round)`));
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Instance method to submit bid
playerRoundResultSchema.methods.submitBid = function(bidValue) {
  this.bid = bidValue;
  this.bidSubmitted = true;
  return this.save();
};

// Static method to get all bids for a round
playerRoundResultSchema.statics.getBidsForRound = function(roundId) {
  return this.find({ roundId, bidSubmitted: true })
    .select('playerId bid')
    .populate('playerId', 'name');
};

// Virtual for bid status
playerRoundResultSchema.virtual('bidStatus').get(function() {
  if (!this.bidSubmitted) {
    return 'pending';
  }
  return this.tricksWon === this.bid ? 'made' : 'failed';
});

module.exports = mongoose.model('PlayerRoundResult', playerRoundResultSchema);