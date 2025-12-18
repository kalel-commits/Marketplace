-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('business_owner', 'freelancer')),
  phone TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  location TEXT NOT NULL,
  business_owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal TEXT NOT NULL,
  proposed_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for tasks
CREATE POLICY "Anyone can view open tasks" ON tasks FOR SELECT USING (status = 'open' OR business_owner_id = auth.uid());
CREATE POLICY "Business owners can create tasks" ON tasks FOR INSERT WITH CHECK (business_owner_id = auth.uid());
CREATE POLICY "Business owners can update own tasks" ON tasks FOR UPDATE USING (business_owner_id = auth.uid());

-- RLS Policies for applications
CREATE POLICY "Users can view applications for their tasks" ON applications FOR SELECT USING (
  task_id IN (SELECT id FROM tasks WHERE business_owner_id = auth.uid()) OR freelancer_id = auth.uid()
);
CREATE POLICY "Freelancers can create applications" ON applications FOR INSERT WITH CHECK (freelancer_id = auth.uid());
CREATE POLICY "Business owners can update applications for their tasks" ON applications FOR UPDATE USING (
  task_id IN (SELECT id FROM tasks WHERE business_owner_id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_business_owner_id ON tasks(business_owner_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_applications_task_id ON applications(task_id);
CREATE INDEX idx_applications_freelancer_id ON applications(freelancer_id);

