# Supabase Setup Instructions

## 1. Create Supabase Project
- Go to https://supabase.com
- Create a new project
- Copy your project URL and anon key

## 2. Update Environment Variables
Edit `.env.local`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
<!-- db password FCSHDPwebsite123# -->

## 3. Run SQL Schema
- Go to Supabase Dashboard → SQL Editor
- Copy and paste content from `supabase-schema.sql`
- Run the query

## 4. Create Storage Buckets
In Supabase Dashboard → Storage, create:
- `sermons` (for audio files)
- `books` (for PDFs)
- `images` (for blog/event images)

Make all buckets public.

## 5. Install Dependencies
```bash
npm install
```

## 6. Run the App
```bash
npm run dev
```

## Usage Examples

### Authentication
```typescript
import { authService } from './services/authService';

// Sign up
await authService.signUp('email@example.com', 'password', 'John Doe');

// Sign in
await authService.signIn('email@example.com', 'password');
```

### Database
```typescript
import { dbService } from './services/dbService';

// Get blog posts
const { data, error } = await dbService.getBlogPosts();
```

### Storage
```typescript
import { storageService } from './services/storageService';

// Upload file
await storageService.uploadFile('sermons', 'sermon.mp3', file);
```
