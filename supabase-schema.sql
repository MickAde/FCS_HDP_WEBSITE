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

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sermons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON books FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
