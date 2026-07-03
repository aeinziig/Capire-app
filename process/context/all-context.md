# Capire-app Repository Context

**Last updated**: 2026-06-01
**Repository HEAD**: 605a69e

## Context Router
This file serves as the root context entrypoint. For detailed information on specific domains, refer to the relevant grouped context files listed in the Source References section below.

## Project Overview
Capire-app is a React Native/Expo mobile application for an AI-integrated capstone project archive and topic recommendation system. Built for San Pedro College of Business Administration's Department of Computer Studies, it helps students discover, review, and manage capstone projects while ensuring academic integrity through originality checking.

## Technology Stack
- **Framework**: React Native with Expo
- **State Management**: React Context (via useState/useEffect hooks)
- **Navigation**: React Navigation (Native Stack and Bottom Tabs)
- **UI Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL database with real-time subscriptions)
- **Authentication**: Supabase Auth (email/password with OTP verification)
- **Icons**: @expo/vector-icons (Ionicons set)
- **Build**: TypeScript

## Repository Structure
```
Capire-app/
├── .claude/                 # Claude Code skills and agents
├── .expo/                   # Expo configuration
├── .git/                    # Git repository
├── .remember/               # Session memory storage
├── bin/                     # Binary scripts
├── node_modules/            # Dependencies
├── process/                 # Shared process documentation
│   └── context/             # Context documentation (this file)
├── src/                     # Source code
│   ├── navigation/          # Navigation type definitions
│   ├── services/            # Service layer (Supabase client)
│   ├── screens/             # Screen components
│   │   ├── authentication/  # Auth flow screens
│   │   ├── faculty/         # Faculty-facing screens
│   │   ├── shared/          # Shared screens
│   │   └── student/         # Student-facing screens
│   └── theme.ts             # Tailwind theme configuration
├── temp_kit/                # Temporary kit files
├── temp-expo/               # Temporary Expo files
├── App.tsx                  # Root application component
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── CAPIRE_DESIGN.md         # Design system documentation
├── CLAUDE.md                # Project instructions for Claude Code
├── eas.json                 # Expo Application Services config
├── install.sh               # Installation script
├── LICENSE.txt              # License file
├── package.json             # NPM dependencies
├── package-lock.json        # Locked dependency versions
├── README.md                # Project overview
├── resolve-manifest.mjs     # Manifest resolver
├── SECURITY.md              # Security policy
├── supabase-implementation-prompt.txt # Supabase implementation notes
├── supabase-test.js         # Supabase connection test
├── supabase-test-simple.js  # Simple Supabase test
├── test-supabase.js         # Additional Supabase test
├── ThirdPartyNoticeText.txt # Third-party notices
├── tsconfig.json            # TypeScript configuration
└── vc-manifest.json         # Skill manifest
```

## Project Structure
```
src/
├── services/              # Service layer (Supabase client)
├── screens/               # Screen components organized by user role
│   ├── authentication/    # Auth flow screens (login, register, etc.)
│   ├── student/           # Student-facing screens
│   ├── faculty/           # Faculty-facing screens  
│   ├── shared/            # Screens accessible to all users
│   └── MainTabs.tsx       # Bottom tab navigation
├── navigation/            # Navigation type definitions
└── theme.ts               # Tailwind theme configuration
```

## Key Features Implemented

### 1. Authentication System
- Splash screen on app load
- Email/password login with Supabase
- User registration with role selection (student/faculty)
- Password reset flow
- OTP verification for email confirmation
- Protected routes based on authentication state

### 2. Capstone Project Management
- **SearchScreen**: Full-text search across capstone titles and abstracts with filtering by department, year, and sorting options
- **CapstoneDetailScreen**: Detailed view of individual projects with bookmark toggle functionality
- **BookmarksScreen**: User's saved projects with remove capability
- **DashboardScreen**: User statistics (actual bookmark count, placeholders for other metrics requiring additional tables)
- **TopicReviewScreen** (Faculty only): Pending topic review with approve/reject functionality

### 3. Academic Integrity Tools
- **OriginalityCheckerScreen**: Mock implementation ready for backend integration (currently uses simulated results)
- **CitationBottomSheet**: APA citation generator for capstone projects

### 4. Communication & Collaboration
- **ChatbotScreen**: AI assistant powered by Gemini Flash for general assistance
- **MessagesScreen**: List of academic conversations
- **ChatConversationScreen**: Private messaging between students and previous researchers
- **OwnProfileScreen** & **OtherUserProfileScreen**: User profile viewing and management

## Database Schema (Supabase)
Live schema and current app expectations differ slightly. The current linked project already includes:

### Core Tables
1. **capstone_projects**
   - id (UUID)
   - title (string)
   - abstract (text)
   - author (string)
   - year (integer)
   - department (string)
   - tags (text array)
   - created_at (timestamp)
   - updated_at (timestamp)
   - status (text)

   App code also expects these additive fields, which should be treated as pending alignment if absent:
   - originalityScore (integer, nullable)
   - imageUrl (string, nullable)
   - pdfUrl (string, nullable)
   - keywords (text array)

2. **auth.users**
   - Supabase Auth source of truth for signed-in accounts

3. **public.users**
   - id (UUID)
   - email (string)
   - full_name (string)
   - role (string)
   - department (string)
   - student_id (string)
   - faculty_id (string)
   - created_at (timestamp)
   - updated_at (timestamp)

4. **bookmarks**
   - id (UUID)
   - user_id (foreign key to users.id)
   - project_id (foreign key to capstone_projects.id)
   - created_at (timestamp)

### Planned/Referenced Tables (from documentation)
5. **chat_messages** - Already exists with `sender_id`, `receiver_id`, `message`, `project_id`, `is_read`, `created_at`
6. **search_logs** - Already exists, but search persistence is not fully wired in the app
7. **topic_submissions** - Optional future split if proposals must be separate from archive entries
8. **saved_citations** - Still not present

## Current Implementation State

### ✅ Fully Implemented
- Authentication flow (login, registration, password reset, OTP verification)
- Capstone search with filtering and sorting
- Individual capstone detail view with bookmarking
- Bookmark management
- Dashboard with user info and actual bookmark count
- Faculty topic review screen (requires status column in database)
- Chatbot with Gemini AI integration
- Messaging system (mock data)
- Profile screens
- Citation generation (APA format)

### 🔧 Requires Backend/Tables
- Originality checker backend (currently mocked)
- Real-time subscriptions (implemented in services but requires table setup)
- Chat conversation send/read flow
- Search logging writes
- Faculty feedback storage (`review_comment`, `reviewed_by`, `reviewed_at`)
- Citation saving

## Environment Configuration
Required environment variables (in .env file):
- `EXPO_PUBLIC_SUPABASE_URL`: Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Design System Compliance
The application strictly adheres to the CAPIRE Design System documented in CAPIRE_DESIGN.md:

### Color Usage
- Primary: Sage Green (#2D6A4F) for buttons, active states
- Secondary: Amber Gold (#E9C46A) for accents, highlights
- Neutrals: White backgrounds, dark gray text (#212529)
- Status colors: Green (success), Orange (warning), Red (danger/error)

### Typography
- Primary font: Inter (system fallback)
- Consistent type scale applied throughout
- No italic or decorative fonts used

### Spacing & Layout
- 8px base grid
- Consistent padding (16px screen horizontal)
- Component gaps (12px) and section gaps (24px)
- Proper border radiuses (8px small, 10px input, 12px button, 16px card)

### Component Implementation
- Buttons: Primary, secondary, danger, warning variants
- Inputs: Standard, textarea, search bar implementations
- Cards: Capstone card with proper elevation and shadow
- Navigation: Header bar and bottom navigation following specs
- Modals: Bottom sheets with drag handles
- Avatars: Circle with initials and colored backgrounds

## Navigation Architecture
- Role-based routing after authentication (student/faculty/admin)
- Student bottom tabs: Dashboard, Search, Browse, Bookmarks, Profile
- Shared accessibility: Chatbot FAB, Messages, Notifications, Citation button
- Authentication flow: Splash → Login/Register → OTP Verification → Dashboard

## Data Flow Patterns
1. **Authentication**: Supabase auth methods → React state → Protected routes
2. **Data Fetching**: Supabase queries in useEffect hooks → Component state → Render
3. **Real-time**: Supabase channels in services → Component subscriptions
4. **Mutations**: Supabase insert/update/delete → Optimistic UI updates → Error handling
5. **File-based**: Local state for temporary data (OTP, form inputs)

## Integration Points
- **Supabase**: All data operations go through src/services/supabase.ts
- **Navigation**: Defined in src/navigation/types.ts (RootParamList)
- **Styling**: NativeWind with custom theme in src/theme.ts
- **Icons**: @expo/vector-icons (Ionicons) used consistently

## Known Limitations & Placeholders
1. **OriginalityChecker**: Currently mock implementation - needs backend integration
2. **Dashboard Stats**: Only bookmark count is real; others require additional tables
3. **Recent Activity**: Uses bookmark history as proxy - needs activity_logs table
4. **Schema Alignment**: Some screens still depend on additive `capstone_projects` fields that may not exist yet in older environments
4. **Faculty Role Detection**: Currently checks for hardcoded values - needs proper metadata
5. **Chat Messages**: Mock data - requires chat_messages table implementation
6. **Search Analytics**: Requires search_logs table
7. **Topic Review**: Requires status column on capstone_projects table
8. **Citation Saving**: Requires saved_citations table

## Development Workflow
- **Expo Development**: `npx expo start`
- **Development Client**: `npx expo start --dev-client`
- **TypeScript Checking**: Built-in via Expo
- **Linting**: Would need ESLint setup (not currently configured)
- **Testing**: Would need Jest/React Native Testing Library setup

## Recent Changes & TODOs
Based on code analysis:
- Added faculty topic review screen with approve/reject
- Implemented originality checker UI (backend pending)
- Added citation generation functionality
- Enhanced dashboard with actual Supabase data
- Improved navigation structure with role-based tabs

### Immediate Next Steps
1. Set up Supabase database with all required tables
2. Implement originality checker backend via Supabase Edge Functions
3. Add real-time subscriptions for live updates
4. Implement chat messaging persistence
5. Add search logging and analytics
6. Complete faculty feedback storage system

## Code Quality Observations
- Consistent use of TypeScript interfaces/types
- Proper error handling with try/catch and user feedback
- Loading states implemented for async operations
- Empty states handled appropriately
- Modal cleanup on unmount (subscription cleanup)
- Environment variable usage for configuration
- Modular service layer for Supabase operations

## Source References
- `CAPIRE_DESIGN.md` - Complete design system specification
- `src/services/supabase.ts` - Supabase client initialization and helper functions
- `src/screens/authentication/` - Authentication flow implementations
- `src/screens/student/` - Student-facing feature implementations
- `src/screens/faculty/` - Faculty-facing feature implementations
- `src/screens/shared/` - Shared components accessible to all roles
- `src/navigation/types.ts` - Root navigation parameter definitions
- `src/theme.ts` - Tailwind theme configuration extending NativeWind

## Open Questions & Outstanding Work
- How should faculty role detection be implemented? Currently uses hardcoded checks
- What additional tables are needed for complete dashboard statistics?
- Should we implement real-time subscriptions for live updates in chat and activity feeds?
- How should we handle offline data synchronization for poor network conditions?
- What metrics should we track for search analytics and user engagement?
- How should we handle data privacy and GDPR compliance for user data?
- What is the plan for handling large capstone PDF files in storage?
