# Capire-app

This project is connected to https://github.com/aeinziig/Capire-app

## Supabase Integration

As of 2026-05-29, the following screens have been integrated with Supabase backend:

### ✅ Implemented Features

1. **SearchScreen.tsx**
   - Text search across capstone title and abstract
   - Department and year filtering
   - Sorting by recent, originality, and relevance
   - Real-time data from `capstone_projects` table

2. **CapstoneDetailScreen.tsx**
   - Individual capstone details fetch by ID
   - Bookmark status checking for current user
   - Toggle bookmark functionality (add/remove)
   - Data from `capstone_projects` and `bookmarks` tables

3. **BookmarksScreen.tsx**
   - User's bookmarked projects with project details
   - Remove bookmark functionality
   - Data from `bookmarks` table with join to `capstone_projects`

4. **DashboardScreen.tsx**
   - Current user information
   - Actual bookmark count from Supabase
   - Placeholder stats for metrics requiring additional tables
   - Recent activity based on bookmark history

5. **TopicReviewScreen.tsx** (Faculty)
   - Fetch pending topics for review
   - Approve/reject topic status updates
   - Role-based access control (faculty only)
   - Data from `capstone_projects` table (requires status column)

### 📋 Database Schema

The implementation uses the following Supabase schema:

- `capstone_projects`: id, title, abstract, author, year, department, tags[], originalityScore, imageUrl, pdfUrl, keywords[], created_at, updated_at
- `users`: id, email, full_name, role, department, student_id, faculty_id, created_at, updated_at
- `bookmarks`: id, user_id, project_id, created_at
- `chat_messages`: id, sender_id, receiver_id, message, project_id, is_read, created_at
- `search_logs`: id, user_id, query, results_count, clicked_result_id, timestamp

### 🔧 Setup Instructions

1. Execute the provided SQL schema in your Supabase SQL editor
2. Ensure environment variables are set:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. The Supabase client is already configured in `src/services/supabase.ts`

### 🧹 Development Cleanup Commands

To resolve dependency issues or clear caches, use these cross-platform cleanup commands:

**Windows CMD:**
```cmd
npx rimraf node_modules
del package-lock.json
npm install
```

**Windows PowerShell:**
```powershell
npx rimraf node_modules
Remove-Item package-lock.json
npm install
```

**Unix/macOS (Terminal):**
```bash
npx rimraf node_modules
rm -f package-lock.json
npm install
```

To verify the `connect` dependency is properly installed:
```bash
npm ls connect
```

### 📱 Mobile App Features

The app is built with React Native/Expo and includes:
- Authentication flow (login, register, password reset)
- Capstone search and discovery
- Detailed capstone viewing
- Bookmarking system
- Faculty topic review system
- Dashboard with user statistics
- Originality checking (mock implementation ready for backend integration)

### 🚀 Next Steps

1. Implement originality checking backend via Supabase Edge Functions
2. Add interaction tracking for more accurate dashboard stats
3. Implement real-time subscriptions for live updates
4. Add chat messaging functionality
5. Enhance search with full-text search and ranking

### 🛠️ Development

Run the app with:
```bash
npx expo start
```

For development builds:
```bash
npx expo start --dev-client
```