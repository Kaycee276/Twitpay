-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL REFERENCES twitter_users(id),
    creator_username TEXT NOT NULL,
    token TEXT NOT NULL,
    amount_per_user DECIMAL NOT NULL,
    keywords TEXT[] NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    receiver TEXT,
    total_amount DECIMAL NOT NULL,
    max_recipients INTEGER,
    claim_link TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT NOT NULL REFERENCES transactions(id),
    twitter_id TEXT NOT NULL,
    twitter_username TEXT NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    amount DECIMAL NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_transactions_creator_id ON transactions(creator_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_claims_transaction_id ON claims(transaction_id);
CREATE INDEX idx_claims_twitter_id ON claims(twitter_id);
