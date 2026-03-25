
export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  level: '100L' | '200L' | '300L' | '400L' | '500L' | 'Alumni' | 'Staff' | null;
  unit: string | null;
  role: 'member' | 'leader' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile | null;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image_url: string | null;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TestSession {
  id: string;
  subject: string;
  questions: Question[];
  score: number;
  completed: boolean;
  timeSpent: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'workshop' | 'gathering' | 'seminar';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverUrl: string;
  downloadUrl?: string;
}

// Added preacherImg to match the usage in SAMPLE_SERMONS
export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  category: string;
  duration: string;
  fileSize: string;
  audioUrl?: string;
  preacherImg: string;
}
