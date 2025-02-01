/*
  # Disable RLS for testing

  1. Changes
    - Disable RLS on all tables
    - Drop all existing policies
  
  2. Security
    - WARNING: This removes all security policies for testing purposes
    - Not recommended for production use
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own settings" ON affiliate_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON affiliate_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON affiliate_settings;
DROP POLICY IF EXISTS "Users can view their accounts" ON accounts;
DROP POLICY IF EXISTS "Account owners can update their accounts" ON accounts;
DROP POLICY IF EXISTS "Users can create accounts" ON accounts;
DROP POLICY IF EXISTS "View own memberships" ON account_users;
DROP POLICY IF EXISTS "Create initial account membership" ON account_users;
DROP POLICY IF EXISTS "Owners manage members" ON account_users;
DROP POLICY IF EXISTS "View and manage affiliate settings" ON affiliate_settings;

-- Disable RLS on all tables
ALTER TABLE affiliate_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE account_users DISABLE ROW LEVEL SECURITY;