-- Phase 2B: Attendance, Goals, Drills, Media, Feedback

-- Attendance Sessions
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id VARCHAR NOT NULL,
  branch_id VARCHAR NOT NULL,
  batch_id VARCHAR NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  coach_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_batch FOREIGN KEY(batch_id) REFERENCES batches(id)
);

-- Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  player_id VARCHAR NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
  recorded_by VARCHAR,
  recorded_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_session FOREIGN KEY(session_id) REFERENCES attendance_sessions(id)
);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id VARCHAR NOT NULL,
  player_id VARCHAR NOT NULL,
  coach_id VARCHAR,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  target TEXT,
  due_date DATE,
  status VARCHAR DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
  progress INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Drills
CREATE TABLE IF NOT EXISTS drills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  category VARCHAR,
  description TEXT,
  instructions TEXT,
  duration INT,
  reps INT,
  sets INT,
  difficulty VARCHAR CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  demonstration_media_id UUID,
  video_url VARCHAR,
  created_by VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Player Drill Assignments
CREATE TABLE IF NOT EXISTS player_drill_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id VARCHAR NOT NULL,
  player_id VARCHAR NOT NULL,
  drill_id UUID NOT NULL,
  assigned_by VARCHAR,
  due_date DATE,
  status VARCHAR DEFAULT 'ASSIGNED' CHECK (status IN ('ASSIGNED', 'STARTED', 'COMPLETED', 'REVIEWED', 'NEEDS_IMPROVEMENT')),
  completion_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_drill FOREIGN KEY(drill_id) REFERENCES drills(id)
);

-- Media (Videos, Images)
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id VARCHAR NOT NULL,
  player_id VARCHAR NOT NULL,
  drill_assignment_id UUID,
  type VARCHAR NOT NULL CHECK (type IN ('DRILL_SUBMISSION', 'PROGRESS_VIDEO', 'COACH_DEMO', 'PLAYER_HIGHLIGHT')),
  storage_reference VARCHAR NOT NULL,
  file_name VARCHAR,
  file_size INT,
  duration INT,
  metadata JSONB,
  processing_status VARCHAR DEFAULT 'PENDING' CHECK (processing_status IN ('PENDING', 'PROCESSING', 'READY', 'FAILED')),
  uploaded_by VARCHAR,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_drill_assignment FOREIGN KEY(drill_assignment_id) REFERENCES player_drill_assignments(id)
);

-- Coach Feedback
CREATE TABLE IF NOT EXISTS coach_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  academy_id VARCHAR NOT NULL,
  player_id VARCHAR NOT NULL,
  drill_assignment_id UUID,
  media_id UUID,
  coach_id VARCHAR NOT NULL,
  feedback TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  status VARCHAR DEFAULT 'GIVEN' CHECK (status IN ('GIVEN', 'ACKNOWLEDGED', 'ACTED_UPON')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_drill_assignment FOREIGN KEY(drill_assignment_id) REFERENCES player_drill_assignments(id),
  CONSTRAINT fk_media FOREIGN KEY(media_id) REFERENCES media(id)
);

-- Indexes
CREATE INDEX idx_attendance_sessions_batch_date ON attendance_sessions(batch_id, date);
CREATE INDEX idx_attendance_records_session ON attendance_records(session_id);
CREATE INDEX idx_attendance_records_player ON attendance_records(player_id);
CREATE INDEX idx_goals_player ON goals(player_id);
CREATE INDEX idx_goals_academy ON goals(academy_id);
CREATE INDEX idx_drills_academy ON drills(academy_id);
CREATE INDEX idx_drill_assignments_player ON player_drill_assignments(player_id);
CREATE INDEX idx_drill_assignments_drill ON player_drill_assignments(drill_id);
CREATE INDEX idx_media_player ON media(player_id);
CREATE INDEX idx_media_drill_assignment ON media(drill_assignment_id);
CREATE INDEX idx_coach_feedback_player ON coach_feedback(player_id);
CREATE INDEX idx_coach_feedback_coach ON coach_feedback(coach_id);
