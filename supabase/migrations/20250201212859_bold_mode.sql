/*
  # Affiliate Settings Schema

  1. New Tables
    - `affiliate_settings`
      - `id` (uuid, primary key) - matches auth.users id
      - `company_name` (text) - name of the affiliate company
      - `logo_url` (text) - URL to affiliate's logo
      - `postback_url` (text) - webhook URL for postbacks
      - `api_key` (text) - unique API key for the affiliate
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `affiliate_settings` table
    - Add policies for authenticated users to:
      - Read their own settings
      - Update their own settings
*/

CREATE TABLE IF NOT EXISTS affiliate_settings (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  company_name text NOT NULL,
  logo_url text,
  postback_url text,
  api_key text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE affiliate_settings ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own settings
CREATE POLICY "Users can read own settings"
  ON affiliate_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for users to update their own settings
CREATE POLICY "Users can update own settings"
  ON affiliate_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_affiliate_settings_updated_at
  BEFORE UPDATE ON affiliate_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();