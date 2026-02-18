-- Create players table with UUID primary key and proper indexes
-- Migration: create_players_table
-- Created: $(date)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL CHECK (LENGTH(TRIM(name)) >= 1 AND LENGTH(TRIM(name)) <= 50),
    game_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on game_id for efficient retrieval by game
CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);

-- Create index on created_at for consistent ordering
CREATE INDEX IF NOT EXISTS idx_players_created_at ON players(created_at);

-- Create composite index for game_id and created_at (optimizes findByGameId queries)
CREATE INDEX IF NOT EXISTS idx_players_game_id_created_at ON players(game_id, created_at);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE players IS 'Stores player information for games';
COMMENT ON COLUMN players.id IS 'UUID primary key for player';
COMMENT ON COLUMN players.name IS 'Player name, 1-50 characters';
COMMENT ON COLUMN players.game_id IS 'Reference to the game this player belongs to';
COMMENT ON COLUMN players.created_at IS 'Timestamp when player was created, used for consistent ordering';
COMMENT ON COLUMN players.updated_at IS 'Timestamp when player was last updated';