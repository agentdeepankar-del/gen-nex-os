-- Create Academy table
CREATE TABLE IF NOT EXISTS academy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Branch table
CREATE TABLE IF NOT EXISTS branch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES academy(id),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User table
CREATE TABLE IF NOT EXISTS "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES academy(id),
  branch_id UUID REFERENCES branch(id),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Player table
CREATE TABLE IF NOT EXISTS player (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES academy(id),
  branch_id UUID NOT NULL REFERENCES branch(id),
  user_id UUID REFERENCES "user"(id),
  parent_id UUID REFERENCES "user"(id),
  player_code VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  parent_name VARCHAR(255),
  parent_phone VARCHAR(20),
  address TEXT,
  profile_photo_url TEXT,
  cricket_category VARCHAR(50),
  batting_style VARCHAR(50),
  bowling_style VARCHAR(50),
  joining_date DATE NOT NULL,
  batch_id UUID,
  status VARCHAR(50) DEFAULT 'prospect',
  medical_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Batch table
CREATE TABLE IF NOT EXISTS batch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES academy(id),
  branch_id UUID NOT NULL REFERENCES branch(id),
  name VARCHAR(255) NOT NULL,
  coach_id UUID,
  age_group VARCHAR(50),
  level VARCHAR(50),
  days VARCHAR(100),
  time_start VARCHAR(10),
  time_end VARCHAR(10),
  capacity INTEGER,
  monthly_fee DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Coach table
CREATE TABLE IF NOT EXISTS coach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES academy(id),
  branch_id UUID NOT NULL REFERENCES branch(id),
  user_id UUID REFERENCES "user"(id),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  code VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create FeeObligation table
CREATE TABLE IF NOT EXISTS fee_obligation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES player(id),
  batch_id UUID REFERENCES batch(id),
  amount DECIMAL(10,2) NOT NULL,
  billing_period VARCHAR(50),
  due_date DATE,
  status VARCHAR(50) DEFAULT 'due',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create PaymentDeclaration table
CREATE TABLE IF NOT EXISTS payment_declaration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_obligation_id UUID NOT NULL REFERENCES fee_obligation(id),
  declared_amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  payment_date DATE,
  reference_id VARCHAR(100),
  notes TEXT,
  declared_by VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AccountsConfirmation table
CREATE TABLE IF NOT EXISTS accounts_confirmation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_obligation_id UUID NOT NULL REFERENCES fee_obligation(id),
  received_amount DECIMAL(10,2),
  received_date DATE,
  received_by VARCHAR(255),
  reference_id VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'confirmed'
);

-- Create Goal table
CREATE TABLE IF NOT EXISTS goal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES player(id),
  coach_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  target TEXT,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Drill table
CREATE TABLE IF NOT EXISTS drill (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES academy(id),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  instructions TEXT,
  duration_minutes INTEGER,
  demonstration_media_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AuditLog table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES academy(id),
  user_id UUID REFERENCES "user"(id),
  entity_type VARCHAR(100),
  entity_id UUID,
  action VARCHAR(100),
  previous_value TEXT,
  new_value TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_player_academy ON player(academy_id);
CREATE INDEX idx_player_batch ON player(batch_id);
CREATE INDEX idx_fee_player ON fee_obligation(player_id);
CREATE INDEX idx_payment_declaration_fee ON payment_declaration(fee_obligation_id);
CREATE INDEX idx_accounts_confirmation_fee ON accounts_confirmation(fee_obligation_id);
CREATE INDEX idx_batch_academy ON batch(academy_id);
CREATE INDEX idx_coach_academy ON coach(academy_id);
CREATE INDEX idx_user_academy ON "user"(academy_id);
CREATE INDEX idx_audit_academy ON audit_log(academy_id);
