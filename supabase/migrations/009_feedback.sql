-- Feedback & NPS System
-- Stores user feedback and NPS survey responses

-- Feedback type enum
CREATE TYPE feedback_sentiment AS ENUM ('positive', 'neutral', 'negative');

-- NPS responses table
CREATE TABLE IF NOT EXISTS nps_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- General feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sentiment feedback_sentiment NOT NULL,
  message TEXT NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_nps_responses_created_at ON nps_responses(created_at DESC);
CREATE INDEX idx_nps_responses_score ON nps_responses(score);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_feedback_sentiment ON feedback(sentiment);

-- RLS policies for NPS
ALTER TABLE nps_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own NPS responses"
  ON nps_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert NPS responses"
  ON nps_responses FOR INSERT
  WITH CHECK (true);

-- RLS policies for feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);
