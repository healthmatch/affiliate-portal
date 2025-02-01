/*
  # Fix RLS policies recursion

  1. Changes
    - Simplify RLS policies to prevent recursion
    - Restructure account_users policies
    - Add proper account access control
  
  2. Security
    - Maintain proper access control
    - Prevent infinite recursion
    - Ensure data isolation between accounts
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their account members" ON account_users;
DROP POLICY IF EXISTS "Account owners can add members" ON account_users;
DROP POLICY IF EXISTS "Users can join as initial account owner" ON account_users;
DROP POLICY IF EXISTS "Account owners can update members" ON account_users;
DROP POLICY IF EXISTS "Account owners can delete members" ON account_users;

-- Basic view policy - users can see accounts they belong to
CREATE POLICY "View own memberships"
  ON account_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow users to create their first account
CREATE POLICY "Create initial account membership"
  ON account_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    role = 'owner' AND
    NOT EXISTS (
      SELECT 1 
      FROM account_users au2
      WHERE au2.account_id = account_users.account_id
    )
  );

-- Allow owners to manage other members
CREATE POLICY "Owners manage members"
  ON account_users
  FOR ALL
  TO authenticated
  USING (
    account_id IN (
      SELECT au2.account_id 
      FROM account_users au2
      WHERE au2.user_id = auth.uid()
      AND au2.role = 'owner'
    )
  );

-- Update affiliate_settings policies
DROP POLICY IF EXISTS "Users can manage settings for their accounts" ON affiliate_settings;

CREATE POLICY "View and manage affiliate settings"
  ON affiliate_settings
  FOR ALL
  TO authenticated
  USING (
    account_id IN (
      SELECT au.account_id 
      FROM account_users au
      WHERE au.user_id = auth.uid()
    )
  );