/*
  # Cloud Certification Learning App - Initial Schema

  ## Overview
  This migration creates the complete database schema for an AI-powered cloud certification learning app
  with gamified streak tracking and commitment-based payment mechanics.

  ## New Tables
  
  ### 1. certifications
  - `id` (uuid, primary key) - Unique identifier for each certification
  - `name` (text) - Display name (e.g., "AWS Solutions Architect Associate")
  - `provider` (text) - Cloud provider (AWS, Azure, Google Cloud, etc.)
  - `code` (text, unique) - Short code for the certification (e.g., "AWS-SAA")
  - `description` (text) - Description of the certification
  - `active` (boolean) - Whether this certification is currently available
  - `created_at` (timestamptz) - When the certification was added
  
  ### 2. user_profiles
  - `id` (uuid, primary key, references auth.users) - Links to Supabase auth user
  - `selected_certification_id` (uuid, nullable) - Current certification being studied
  - `streak_count` (integer) - Current consecutive days completed
  - `longest_streak` (integer) - Historical best streak
  - `total_questions_answered` (integer) - Lifetime question count
  - `total_correct_answers` (integer) - Lifetime correct answers
  - `last_session_date` (date, nullable) - Last day a session was completed
  - `payment_method_id` (text, nullable) - Stored payment method reference
  - `subscription_active` (boolean) - Whether user is actively participating
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update
  
  ### 3. questions
  - `id` (uuid, primary key) - Unique question identifier
  - `certification_id` (uuid, references certifications) - Associated certification
  - `question_text` (text) - The actual question
  - `option_a` (text) - First answer option
  - `option_b` (text) - Second answer option
  - `option_c` (text) - Third answer option
  - `option_d` (text) - Fourth answer option
  - `correct_answer` (text) - Letter of correct answer (A, B, C, or D)
  - `explanation` (text) - Explanation of the correct answer
  - `difficulty_level` (integer) - 1 (easy) to 5 (hard)
  - `topic` (text) - Subject area within certification
  - `source_url` (text, nullable) - Origin of the question
  - `approved` (boolean) - Whether question is approved for use
  - `times_answered` (integer) - How many times this question has been used
  - `times_correct` (integer) - How many times answered correctly
  - `created_at` (timestamptz) - When question was added
  
  ### 4. daily_sessions
  - `id` (uuid, primary key) - Unique session identifier
  - `user_id` (uuid, references user_profiles) - User who completed the session
  - `session_date` (date) - Date of the session
  - `certification_id` (uuid, references certifications) - Certification studied
  - `questions_answered` (integer) - Number of questions answered
  - `correct_answers` (integer) - Number of correct answers
  - `completed` (boolean) - Whether all 10 questions were answered
  - `completed_at` (timestamptz, nullable) - When session was finished
  - `created_at` (timestamptz) - When session was started
  
  ### 5. session_answers
  - `id` (uuid, primary key) - Unique answer record
  - `session_id` (uuid, references daily_sessions) - Associated session
  - `question_id` (uuid, references questions) - Question that was answered
  - `user_answer` (text) - User's selected answer (A, B, C, or D)
  - `correct` (boolean) - Whether the answer was correct
  - `time_spent_seconds` (integer) - Time taken to answer
  - `answered_at` (timestamptz) - When the answer was submitted
  
  ### 6. user_question_history
  - `id` (uuid, primary key) - Unique history record
  - `user_id` (uuid, references user_profiles) - User who answered
  - `question_id` (uuid, references questions) - Question answered
  - `times_seen` (integer) - How many times user has seen this question
  - `times_correct` (integer) - How many times answered correctly
  - `last_seen_at` (timestamptz) - Last time this question was shown
  - `mastery_level` (integer) - 0-100 score indicating mastery
  
  ### 7. streak_records
  - `id` (uuid, primary key) - Unique streak record
  - `user_id` (uuid, references user_profiles) - User who achieved the streak
  - `streak_length` (integer) - Length of the streak in days
  - `start_date` (date) - When the streak began
  - `end_date` (date, nullable) - When the streak ended (null if active)
  - `completed_30_days` (boolean) - Whether this streak reached 30 days
  - `refund_processed` (boolean) - Whether the 30-day refund was issued
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 8. transactions
  - `id` (uuid, primary key) - Unique transaction identifier
  - `user_id` (uuid, references user_profiles) - User associated with transaction
  - `type` (text) - Transaction type: 'penalty', 'refund', or 'payment_method'
  - `amount` (decimal) - Amount in GBP (0.50 for penalties)
  - `currency` (text) - Currency code (GBP)
  - `status` (text) - 'pending', 'completed', 'failed', 'refunded'
  - `payment_provider_id` (text, nullable) - External payment reference
  - `missed_date` (date, nullable) - Date that was missed (for penalties)
  - `streak_id` (uuid, nullable) - Associated streak (for refunds)
  - `metadata` (jsonb) - Additional transaction details
  - `created_at` (timestamptz) - Transaction creation timestamp
  - `updated_at` (timestamptz) - Last status update
  
  ### 9. question_topics
  - `id` (uuid, primary key) - Unique topic identifier
  - `certification_id` (uuid, references certifications) - Associated certification
  - `name` (text) - Topic name (e.g., "EC2", "IAM", "VPC")
  - `weight` (integer) - Importance weight for this topic (exam percentage)
  - `created_at` (timestamptz) - When topic was added

  ## Security
  - All tables have RLS enabled
  - Users can only access their own data
  - Questions and certifications are publicly readable
  - Only authenticated users can create sessions and answers
  - Transaction records are private to the user

  ## Important Notes
  - User profiles are linked to Supabase auth.users via id
  - Streaks are tracked daily with timezone-aware date handling
  - Questions maintain aggregate statistics for adaptive learning
  - Payment integration uses external provider (Stripe recommended)
  - All financial amounts stored as decimal for precision
*/

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider text NOT NULL,
  code text UNIQUE NOT NULL,
  description text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_certification_id uuid REFERENCES certifications(id) ON DELETE SET NULL,
  streak_count integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_questions_answered integer DEFAULT 0,
  total_correct_answers integer DEFAULT 0,
  last_session_date date,
  payment_method_id text,
  subscription_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id uuid NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation text NOT NULL,
  difficulty_level integer DEFAULT 3 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  topic text NOT NULL,
  source_url text,
  approved boolean DEFAULT false,
  times_answered integer DEFAULT 0,
  times_correct integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create daily_sessions table
CREATE TABLE IF NOT EXISTS daily_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_date date NOT NULL,
  certification_id uuid NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  questions_answered integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, session_date)
);

-- Create session_answers table
CREATE TABLE IF NOT EXISTS session_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES daily_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer text NOT NULL CHECK (user_answer IN ('A', 'B', 'C', 'D')),
  correct boolean NOT NULL,
  time_spent_seconds integer DEFAULT 0,
  answered_at timestamptz DEFAULT now()
);

-- Create user_question_history table
CREATE TABLE IF NOT EXISTS user_question_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  times_seen integer DEFAULT 0,
  times_correct integer DEFAULT 0,
  last_seen_at timestamptz DEFAULT now(),
  mastery_level integer DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  UNIQUE(user_id, question_id)
);

-- Create streak_records table
CREATE TABLE IF NOT EXISTS streak_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  streak_length integer NOT NULL,
  start_date date NOT NULL,
  end_date date,
  completed_30_days boolean DEFAULT false,
  refund_processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('penalty', 'refund', 'payment_method')),
  amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'GBP',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_provider_id text,
  missed_date date,
  streak_id uuid REFERENCES streak_records(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create question_topics table
CREATE TABLE IF NOT EXISTS question_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id uuid NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  name text NOT NULL,
  weight integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  UNIQUE(certification_id, name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_certification ON user_profiles(selected_certification_id);
CREATE INDEX IF NOT EXISTS idx_questions_certification ON questions(certification_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_daily_sessions_user_date ON daily_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_session_answers_session ON session_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_user_question_history_user ON user_question_history(user_id);
CREATE INDEX IF NOT EXISTS idx_streak_records_user ON streak_records(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Enable Row Level Security on all tables
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_topics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for certifications (publicly readable)
CREATE POLICY "Anyone can view active certifications"
  ON certifications FOR SELECT
  TO authenticated
  USING (active = true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for questions (approved questions are readable)
CREATE POLICY "Users can view approved questions"
  ON questions FOR SELECT
  TO authenticated
  USING (approved = true);

-- RLS Policies for daily_sessions
CREATE POLICY "Users can view own sessions"
  ON daily_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON daily_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON daily_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for session_answers
CREATE POLICY "Users can view own session answers"
  ON session_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_sessions
      WHERE daily_sessions.id = session_answers.session_id
      AND daily_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own session answers"
  ON session_answers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_sessions
      WHERE daily_sessions.id = session_answers.session_id
      AND daily_sessions.user_id = auth.uid()
    )
  );

-- RLS Policies for user_question_history
CREATE POLICY "Users can view own question history"
  ON user_question_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own question history"
  ON user_question_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own question history"
  ON user_question_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for streak_records
CREATE POLICY "Users can view own streak records"
  ON streak_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak records"
  ON streak_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak records"
  ON streak_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for question_topics
CREATE POLICY "Users can view question topics"
  ON question_topics FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial certifications
INSERT INTO certifications (name, provider, code, description, active) VALUES
  ('AWS Certified Solutions Architect - Associate', 'AWS', 'AWS-SAA', 'Validates ability to design distributed systems on AWS', true),
  ('AWS Certified Developer - Associate', 'AWS', 'AWS-DEV', 'Validates ability to develop and maintain AWS applications', true),
  ('Microsoft Azure Fundamentals', 'Azure', 'AZ-900', 'Validates foundational knowledge of cloud services and Azure', true),
  ('Microsoft Azure Administrator Associate', 'Azure', 'AZ-104', 'Validates skills to implement, manage, and monitor Azure environments', true),
  ('Google Cloud Associate Cloud Engineer', 'Google Cloud', 'GCP-ACE', 'Validates ability to deploy applications, monitor operations, and manage enterprise solutions', true)
ON CONFLICT (code) DO NOTHING;