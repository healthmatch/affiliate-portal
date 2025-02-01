/*
  # Add accounts and user relationships

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `name` (text, company name)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `account_users`
      - `id` (uuid, primary key)
      - `account_id` (uuid, references accounts)
      - `user_id` (uuid, references auth.users)
      - `role` (text, user role in account)
      - `created_at` (timestamp)
  
  2. Changes
    - Modify affiliate_settings to reference accounts instead of users
    
  3. Security
    - Enable RLS on new tables
    - Add policies for proper access control
*/

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create account_users junction table
CREATE TABLE IF NOT EXISTS account_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(account_id, user_id)
);

-- Add account_id to affiliate_settings
ALTER TABLE affiliate_settings 
ADD COLUMN account_id uuid REFERENCES accounts(id);

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_users ENABLE ROW LEVEL SECURITY;

-- Policies for accounts
CREATE POLICY "Users can view their accounts"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = accounts.id
      AND account_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Account owners can update their accounts"
  ON accounts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = accounts.id
      AND account_users.user_id = auth.uid()
      AND account_users.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = accounts.id
      AND account_users.user_id = auth.uid()
      AND account_users.role = 'owner'
    )
  );

-- Policies for account_users
CREATE POLICY "Users can view members of their accounts"
  ON account_users
  FOR SELECT
  TO authenticated
  USING (
    account_id IN (
      SELECT account_id FROM account_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Account owners can manage users"
  ON account_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM account_users au
      WHERE au.account_id = account_users.account_id
      AND au.user_id = auth.uid()
      AND au.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users au
      WHERE au.account_id = account_users.account_id
      AND au.user_id = auth.uid()
      AND au.role = 'owner'
    )
  );

-- Update affiliate_settings policies to work with accounts
CREATE POLICY "Users can manage settings for their accounts"
  ON affiliate_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = affiliate_settings.account_id
      AND account_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = affiliate_settings.account_id
      AND account_users.user_id = auth.uid()
    )
  );

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for accounts
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();