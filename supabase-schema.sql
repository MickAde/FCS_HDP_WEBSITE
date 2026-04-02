-- Profiles Table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  level TEXT CHECK (level IN ('100L','200L','300L','400L','500L','Alumni','Staff')),
  unit TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member','leader','admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date TIMESTAMP DEFAULT NOW(),
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sermons Table
CREATE TABLE sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  preacher TEXT NOT NULL,
  date TIMESTAMP DEFAULT NOW(),
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  file_size TEXT NOT NULL,
  audio_url TEXT,
  preacher_img TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Books Table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_url TEXT,
  download_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('workshop', 'gathering', 'seminar')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activities Table
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  date DATE NOT NULL,
  end_date DATE,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT CHECK (type IN ('General','Workshop','Outreach','Prayer')) DEFAULT 'General',
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  expectations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- SOD Departments Table
CREATE TABLE sod_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  teachers TEXT[] DEFAULT '{}',
  fee INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SOD Registrations Table
CREATE TABLE sod_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES sod_departments(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  level TEXT NOT NULL,
  faculty_dept TEXT NOT NULL,
  paystack_ref TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid')),
  student_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sod_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sod_registrations ENABLE ROW LEVEL SECURITY;

-- SOD RLS
CREATE POLICY "Public read sod_departments" ON sod_departments FOR SELECT USING (true);
CREATE POLICY "Admins manage sod_departments" ON sod_departments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can register" ON sod_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own registration" ON sod_registrations FOR SELECT USING (true);
CREATE POLICY "Admins manage registrations" ON sod_registrations FOR ALL USING (auth.role() = 'authenticated');

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Public read access
CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sermons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON books FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);

-- Authenticated write access (leaders/admins)
CREATE POLICY "Admins can insert blog posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert sermons" ON sermons FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert books" ON books FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
