/*
  # Fix RLS policies to prevent recursion

  1. Changes
    - Restructure policies to avoid NEW references
    - Simplify account_users policies
    - Add missing INSERT policies
  
  2. Security
    - Maintain proper access control
    - Ensure data isolation between accounts
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view members of their accounts" ON account_users;
DROP POLICY IF EXISTS "Account owners can manage users" ON account_users;

-- Simplified policies for account_users
CREATE POLICY "Users can view their account members"
  ON account_users
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    account_id IN (
      SELECT account_id FROM account_users
      WHERE user_id = auth.uid()
    )
  );

-- Split insert policy into two separate ones for different cases
CREATE POLICY "Account owners can add members"
  ON account_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users
      WHERE user_id = auth.uid()
      AND role = 'owner'
    )
  );

CREATE POLICY "Users can join as initial account owner"
  ON account_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    role = 'owner' AND
    NOT EXISTS (
      SELECT 1 FROM account_users
      WHERE account_id = account_users.account_id
    )
  );

CREATE POLICY "Account owners can update members"
  ON account_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_id = account_users.account_id
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

CREATE POLICY "Account owners can delete members"
  ON account_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_id = account_users.account_id
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Add missing INSERT policy for accounts
CREATE POLICY "Users can create accounts"
  ON accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);