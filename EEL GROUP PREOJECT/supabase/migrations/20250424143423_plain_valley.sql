/*
# Create predictions table

1. New Tables
  - predictions
    - id (uuid, primary key)
    - user_id (uuid, references auth.users)
    - name (text)
    - age (integer)
    - risk_score (numeric)
    - created_at (timestamptz)

2. Security
  - Enable RLS on predictions table
  - Add policy for authenticated users to read their own predictions
  - Add policy for authenticated users to insert their own predictions
*/

CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  risk_score NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT age_range CHECK (age >= 0 AND age <= 120),
  CONSTRAINT risk_score_range CHECK (risk_score >= 0 AND risk_score <= 100)
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own predictions"
  ON predictions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);