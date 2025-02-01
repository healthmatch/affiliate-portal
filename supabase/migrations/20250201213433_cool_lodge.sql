/*
  # Add insert policy for affiliate settings

  1. Changes
    - Add RLS policy to allow authenticated users to insert their own settings
    
  2. Security
    - Users can only insert records where the id matches their auth.uid()
    - Maintains data isolation between users
*/

CREATE POLICY "Users can insert own settings"
  ON affiliate_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);