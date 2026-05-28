# CAPIRE Design System
## AI-Integrated Capstone Project Archive and Topic Recommendation System
### San Pedro College of Business Administration — Department of Computer Studies

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing and Layout](#4-spacing-and-layout)
5. [Component Library](#5-component-library)
6. [Navigation Architecture](#6-navigation-architecture)
7. [Screen Designs](#7-screen-designs)
   - [Authentication Screens](#authentication-screens)
   - [Student Screens](#student-screens)
   - [Faculty Screens](#faculty-screens)
   - [Admin Screens](#admin-screens)
   - [Shared Screens](#shared-screens)
8. [Interaction Patterns](#8-interaction-patterns)
9. [Accessibility Guidelines](#9-accessibility-guidelines)
10. [Asset Specifications](#10-asset-specifications)

---

## 1. Design Philosophy

### Vision
CAPIRE is an institutional academic tool for IT students, faculty, and administrators at San Pedro College of Business Administration. The design must feel like a trusted university portal — professional, reliable, and easy to use during long research sessions.

### Core Principles

**Academic Integrity**
Every design decision reinforces the academic and institutional nature of the system. No element should feel like a social media app, gaming platform, or consumer product.

**Accessibility First**
Students use this app during research sessions that can last hours. Colors, contrast ratios, font sizes, and spacing are chosen specifically to reduce eye strain and cognitive fatigue.

**Contextual Clarity**
Every screen communicates its purpose immediately. Users should never feel lost or confused about where they are or what action to take next.

**SPCBA Identity**
The visual language is directly inspired by SPCBA's institutional green and gold branding, adapted for digital readability while maintaining the school's prestigious academic character.

**Filipino Academic Context**
The design acknowledges its deployment context — a Philippine college IT department — and prioritizes familiarity, trustworthiness, and institutional respect over trend-driven aesthetics.

---

## 2. Color System

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| Dark Green | `#1B4332` | Headers, navigation bars, primary headings |
| Sage Green | `#2D6A4F` | Primary buttons, active states, links |
| Light Green | `#52B788` | Hover states, category tags, secondary accents |
| Pale Green | `#D8F3DC` | Card backgrounds, badges, input focus fills |

### Secondary Palette

| Name | Hex | Usage |
|------|-----|-------|
| Amber Gold | `#E9C46A` | Accents, highlights, active indicators, chatbot button |
| Deep Gold | `#D4A017` | Moderate similarity badges, warning states |
| Pale Gold | `#FFF3CD` | AI suggestion boxes, notification backgrounds |

### Neutral Palette

| Name | Hex | Usage |
|------|-----|-------|
| Pure White | `#FFFFFF` | Main content backgrounds, card surfaces |
| Off White | `#F8F9FA` | Page backgrounds, input fields |
| Light Gray | `#E9ECEF` | Borders, dividers, disabled states |
| Medium Gray | `#6C757D` | Secondary text, placeholders, captions |
| Dark Gray | `#212529` | Primary body text, paragraph content |

### Status Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success Green | `#40916C` | Approved status, original topic badge |
| Warning Orange | `#F4A261` | High similarity warning, needs revision |
| Danger Red | `#E76F51` | Duplicate topic, rejected status |
| Critical Red | `#C1121F` | 80%+ similarity, critical errors |

### Color Rules

```
MANDATORY RULES — NEVER VIOLATE:

1. NEVER use pure black #000000 anywhere in the app
2. NEVER use bright blue, purple, pink, or any
   color outside this defined palette
3. NEVER use dark backgrounds on main content areas
   Content areas must always be white or off-white
4. ALWAYS use #1B4332 for all top headers and navbars
5. ALWAYS use #FFFFFF white text on dark green backgrounds
6. ALWAYS use #212529 for all body text and paragraphs
7. ALWAYS use #2D6A4F sage green for primary action buttons
8. NEVER use amber gold #E9C46A as a large section background
9. Amber gold is an ACCENT color only — use sparingly
10. Status colors (success, warning, danger) are for
    status communication ONLY — not decorative use
```

### Similarity Score Color Mapping

| Score Range | Color | Hex | Badge Style |
|-------------|-------|-----|-------------|
| 0% – 30% | Original | `#40916C` | `#D8F3DC` bg, `#40916C` text |
| 31% – 60% | Moderate | `#D4A017` | `#FFF3CD` bg, `#D4A017` text |
| 61% – 79% | High | `#E76F51` | `#FFE8D6` bg, `#E76F51` text |
| 80% – 100% | Duplicate | `#C1121F` | `#FFE0DB` bg, `#C1121F` text |

---

## 3. Typography

### Font Family
```
Primary:  Inter (all UI elements)
Fallback: system-ui, -apple-system, sans-serif
```

### Type Scale

| Element | Size | Weight | Color | Usage |
|---------|------|--------|-------|-------|
| Screen Title | 20px | 700 | `#FFFFFF` | Top header bar titles |
| Section Heading | 18px | 700 | `#1B4332` | Major section labels |
| Card Title | 16px | 600 | `#1B4332` | Capstone card titles |
| Body Text | 14px | 400 | `#212529` | Paragraphs, descriptions |
| Label | 12px | 600 | `#1B4332` | Form field labels |
| Caption | 12px | 400 | `#6C757D` | Timestamps, helper text |
| Micro Text | 11px | 400 | `#6C757D` | Footer text, version numbers |
| Button Text | 16px | 600 | `#FFFFFF` | All button labels |

### Typography Rules

```
1. NEVER use italic for UI elements
2. NEVER use decorative or script fonts
3. Line height: 1.5 for body text, 1.2 for headings
4. Letter spacing: normal for body, 0.5px for labels
5. Maximum line width: 320px for readable paragraphs
6. Two-line truncation with ellipsis for card titles
7. Single-line truncation for metadata (authors, dates)
```

---

## 4. Spacing and Layout

### Base Grid
```
Base unit:        8px
Screen padding:   16px (left and right, all screens)
Section gap:      24px (between major content sections)
Component gap:    12px (between related elements)
Element gap:      8px (between tightly coupled elements)
```

### Safe Areas
```
Status bar top:   44px (respected on all screens)
Home bar bottom:  34px (respected on all screens)
Fixed header:     56px + 44px status = 100px total
Fixed bottom nav: 64px + 34px safe area = 98px total
```

### Border Radius Scale

| Name | Value | Usage |
|------|-------|-------|
| Small | `8px` | Chips, tags, small badges |
| Medium | `10px` | Input fields |
| Large | `12px` | Buttons |
| Extra Large | `16px` | Cards, panels |
| Pill | `24px` | Toggle tabs, filter chips |
| Circle | `50%` | Avatars, icon buttons |

### Elevation (Shadow)
```
Card shadow:    0 2px 8px rgba(0, 0, 0, 0.06)
Button shadow:  0 4px 12px rgba(45, 106, 79, 0.30)
Sheet shadow:   0 -4px 24px rgba(0, 0, 0, 0.12)
Chatbot shadow: 0 4px 16px rgba(233, 196, 106, 0.40)
```

---

## 5. Component Library

### Buttons

#### Primary Button
```
Background:     #2D6A4F (Sage Green)
Text:           #FFFFFF 16px bold
Height:         52px
Border radius:  12px
Shadow:         0 4px 12px rgba(45,106,79,0.30)
Padding:        0 24px
Full width:     Yes (minus 32px screen padding)
Icon:           Optional, left side, 20px white

Disabled state:
Background:     #E9ECEF
Text:           #6C757D
Shadow:         None
```

#### Secondary Button
```
Background:     #FFFFFF
Border:         1.5px solid #2D6A4F
Text:           #2D6A4F 15px semibold
Height:         52px
Border radius:  12px
```

#### Danger Button
```
Background:     #E76F51
Text:           #FFFFFF 14px regular
Height:         48px
Border radius:  12px
Note:           Least visual weight, used for destructive actions
```

#### Warning Button
```
Background:     #FFF3CD
Border:         1px solid #D4A017
Text:           #D4A017 15px semibold
Height:         52px
Border radius:  12px
```

#### Text Link Button
```
Background:     Transparent
Text:           #2D6A4F 13-14px semibold
Underline:      Yes on tappable links
Height:         Auto
```

### Input Fields

#### Standard Input
```
Background:     #F8F9FA
Border:         1px solid #E9ECEF
Border radius:  10px
Height:         52px
Padding:        0 16px
Left icon:      20px #6C757D (when applicable)
Label:          12px semibold #1B4332 above field
Placeholder:    14px #6C757D

Focus state:
Border:         2px solid #2D6A4F
Background:     #FFFFFF

Error state:
Border:         2px solid #E76F51
Helper text:    13px #E76F51 below field
```

#### Textarea
```
Same as standard input
Min height:     100px
Max height:     200px (auto-expanding)
Resize:         Vertical only
```

#### Search Bar
```
Background:     #F8F9FA
Border:         1px solid #E9ECEF
Border radius:  24px (pill shape)
Height:         48px
Left icon:      Search magnifier 20px #6C757D
Right icon:     Filter sliders 20px #2D6A4F
Placeholder:    "Search capstone projects..."
```

### Cards

#### Capstone Card
```
Background:     #FFFFFF
Border:         1px solid #E9ECEF
Border radius:  16px
Shadow:         0 2px 8px rgba(0,0,0,0.06)
Padding:        16px

Contents (top to bottom):
- Category chip tag (top left) + Similarity badge (top right)
- Title: 15px semibold #1B4332, 2 lines max
- Authors: 13px #6C757D, 1 line truncated
- Bottom row: Year badge (left) + Bookmark icon (right)
```

#### Category Chip Tag
```
Background:     #D8F3DC
Text:           #2D6A4F 11px
Border radius:  20px (pill)
Padding:        4px 10px
```

#### Year Badge
```
Background:     #1B4332
Text:           #FFFFFF 11px
Border radius:  20px (pill)
Padding:        4px 10px
```

#### Status Badge
```
Pill shape, border radius 20px
Padding: 6px 14px
Text: 12px semibold
Colors: See Similarity Score Color Mapping above
```

### Navigation

#### Top Header Bar
```
Background:     #1B4332
Height:         56px (+ 44px status bar)
Title:          20px bold #FFFFFF centered
Left:           Back arrow or menu icon, white 24px
Right:          Contextual action icon, white 24px
```

#### Bottom Navigation Bar
```
Background:     #FFFFFF
Height:         64px (+ 34px safe area)
Top border:     1px solid #E9ECEF
Tabs:           5 maximum

Active tab:
Icon:           24px #2D6A4F
Label:          10px #2D6A4F
Indicator:      6px dot above icon, #E9C46A amber gold

Inactive tab:
Icon:           24px #6C757D
Label:          10px #6C757D
```

#### Tab Items (Student)
```
1. Home      — ti-home
2. Search    — ti-search
3. Browse    — ti-layout-grid
4. Bookmarks — ti-bookmark
5. Profile   — ti-user
```

### Bottom Sheet Modal
```
Background:     #FFFFFF
Border radius:  24px top left, 24px top right
Shadow:         0 -4px 24px rgba(0,0,0,0.12)
Max height:     65% of screen
Drag handle:    4px × 36px #E9ECEF pill, centered top

Header:
- Title: 18px bold #1B4332
- Close X: 32px circle #F8F9FA bg
```

### Avatar
```
Shape:          Circle
Size variants:  32px (chat), 44px (list), 64px (profile), 88px (profile header)
Background:     #2D6A4F
Text:           Initials, white bold
Border (own profile): 3px solid #E9C46A amber gold
```

### OTP Input Boxes
```
Count:          6 boxes in a row
Width:          44px each
Height:         56px
Border radius:  12px
Gap:            8px between boxes

Empty:    Border 2px #E9ECEF, bg #F8F9FA
Active:   Border 2px #2D6A4F, bg #FFFFFF
          Outer glow: 0 0 0 3px rgba(45,106,79,0.15)
Filled:   Border 2px #2D6A4F, digit 24px bold #1B4332
Error:    Border 2px #E76F51, bg #FFF0EE
Success:  Border 2px #40916C, bg #D8F3DC
```

### Floating Chatbot Button
```
Shape:          Circle 52px
Background:     #E9C46A amber gold
Icon:           Chat bubble outline 24px #1B4332
Shadow:         0 4px 16px rgba(233,196,106,0.40)
Position:       Fixed, bottom right, 16px from edges
                Above bottom nav bar
```

---

## 6. Navigation Architecture

### User Role Routing
```
Login successful
      │
      ├── student role        → Student Dashboard
      ├── faculty role        → Faculty Dashboard
      ├── admin role          → Admin Dashboard
      └── previous_researcher → Student Dashboard
                                (with researcher features)
```

### Authentication Flow
```
Splash Screen
      │
      ▼
Login Screen ──── Forgot Password ──── OTP Verification
      │
      └── Register ──── OTP Verification ──── Dashboard
```

### Student Navigation (Bottom Tabs)
```
Home Tab:       Dashboard
Search Tab:     Search Results → Capstone Detail
Browse Tab:     Browse Categories → Category Results
Bookmarks Tab:  Saved Capstones → Capstone Detail
Profile Tab:    Own Profile → Settings
```

### Shared Navigation (Accessible from any screen)
```
Notification Bell → Notifications Screen
Chat Bubble FAB   → Chatbot Screen
Messages (inbox)  → Messages List → Chat Conversation
Other User Card   → Other User Profile → Chat Conversation
Citation Button   → Citation Bottom Sheet
```

---

## 7. Screen Designs

---

### AUTHENTICATION SCREENS

---

#### Screen 1 — Splash Screen

**Purpose:** First screen shown on app launch while resources load.

**Layout:**
```
Full screen: #1B4332 dark green background

TOP AREA (upper 30%):
- SPCBA seal placeholder: white circle outline 80×80px, centered
- "SPCBA" label: 14px #E9C46A amber gold, uppercase, letter-spaced
- Institution name: 11px #D8F3DC pale green, centered

CENTER AREA (middle 40%):
- Vertical accent line: 1px #52B788, 40px tall, centered
- "CAPIRE" wordmark: 42px bold #FFFFFF
- Horizontal accent line: 60px wide, 1px #52B788
- Tagline line 1: "AI-Powered Capstone Archive" 14px #D8F3DC
- Tagline line 2: "and Topic Recommendation System" 14px #D8F3DC

BOTTOM AREA (lower 30%):
- Loading dots: 3 × 8px circles, #E9C46A amber gold, 8px gap
- Loading text: "Loading your academic archive..." 12px #6C757D
- Version: "v1.0.0" 11px #52B788
```

**States:** Loading only. Auto-redirects to Login after resources load.

**Data Requirements:** None.

---

#### Screen 2 — Login Screen

**Purpose:** Authenticate registered users into the system.

**Layout:**
```
HEADER SECTION (top 28%, dark green curved panel):
- Background: #1B4332, height 240px, curved bottom arc
- SPCBA seal: white circle outline 48×48px
- "CAPIRE": 32px bold #FFFFFF
- "Welcome Back": 16px regular #D8F3DC

FORM SECTION (white background):
- Section label: "Sign in to your account" 14px #6C757D centered
- Institutional Email input (envelope icon)
- Password input (lock icon + eye toggle)
- "Forgot Password?" link: right-aligned, 13px #2D6A4F
- Login button (primary, full width)
- Divider: "or"
- "Don't have an account? Register here" centered

FOOTER:
- "San Pedro College of Business Administration" 11px #6C757D
```

**Validation:**
```
- Email: must end in @spcba.edu.ph
- Password: minimum 8 characters
- Both fields required before Login enables
- Max 5 failed attempts → 30 min lockout
```

**Navigation:**
```
Login success    → Role-based dashboard
Forgot Password  → Forgot Password Screen
Register here    → Register Screen
```

**Data Requirements:** `supabase.auth.signInWithPassword()`

---

#### Screen 3 — Register Screen

**Purpose:** Create a new CAPIRE account for SPCBA students and staff.

**Layout:**
```
FIXED HEADER:
- Back arrow (left), "Create Account" (center)
- Progress dots row: 3 steps — Personal, Account, Verify

SCROLLABLE FORM:

Section: "Personal Information"
- Full Name input (person icon)
- Institutional Email input (envelope icon)
  Helper: "Use your official SPCBA email address"
- ID Number input (id-card icon)

Role Selection:
- "I am a..." label
- Dropdown: Student / Faculty Member /
  Capstone Adviser / Previous Researcher / Administrator

Section: "Account Security"
- Password input (lock + eye toggle)
  Helper: "Minimum 8 characters"
- Confirm Password input

Terms row:
- Checkbox + "I agree to Terms of Use and Privacy Policy"

- "Create Account" primary button (full width)
- "Already have an account? Login" link
```

**Validation:**
```
- All fields required except role (defaults to Student)
- Email domain: @spcba.edu.ph
- Password: min 8 chars, must match confirm
- Terms checkbox: must be checked
```

**Navigation:**
```
Create Account → OTP Verification Screen
Login link     → Login Screen
Back arrow     → Login Screen
```

**Data Requirements:** `supabase.auth.signUp()` + insert into `profiles`

---

#### Screen 4 — Forgot Password Screen

**Layout:**
```
FIXED HEADER:
- Back arrow (left), "Forgot Password" (center)

ILLUSTRATION SECTION (220px):
- Envelope illustration: #D8F3DC pale green body,
  #2D6A4F sage green open flap
- Lock icon overlay on envelope: #2D6A4F outline
- Three decorative dots: pale green, amber, pale green

CONTENT SECTION:
- Heading: "Reset Your Password" 22px bold #1B4332
- Description: "Enter your institutional email address
  and we will send you a secure link to reset your password."
  14px #6C757D centered

FORM:
- "Institutional Email" label
- Email input (envelope icon)
  Helper: "Use the same email you registered with"
- "Send Reset Link" button (paper-plane icon, full width)
- "Remember your password? Back to Login" link

SECURITY NOTE:
- Lock icon + "For security, reset links expire
  after 30 minutes of being sent." 12px #6C757D

SUCCESS STATE (after submission):
- Checkmark circle: #D8F3DC bg, #2D6A4F checkmark
- "Check Your Email" heading
- Masked email display: "yourname@spcba.edu.ph"
- Resend option with countdown: "Resend available in 00:45"
- "Open Email App" button
```

**States:** Default form | Success state

**Navigation:**
```
Send Reset Link → Success state → OTP Screen
Back to Login   → Login Screen
```

**Data Requirements:** `supabase.auth.resetPasswordForEmail()`

---

#### Screen 5 — OTP Verification Screen

**Purpose:** Verify institutional email using a 6-digit code.

**Layout:**
```
FIXED HEADER:
- Back arrow (left), "Email Verification" (center)

TOP SECTION:
- Shield icon in pale green circle: 80×80px
- "Verify Your Email": 22px bold #1B4332
- Description: "We sent a 6-digit verification code to"
- Email: 15px semibold #1B4332
- "Please enter the code to continue."
- "Wrong email? Change Email" link

OTP INPUT SECTION:
- Label: "Enter 6-Digit Code" 13px semibold
- 6 input boxes in a row (see Component Library specs)
- Primary render: 3 boxes filled, cursor in 4th box

RESEND SECTION:
- Clock icon + "Resend code in 00:42"
- "Resend Code" (gray/disabled while counting)
- "3 attempts remaining" caption

- "Verify and Continue" button
  (disabled until all 6 digits entered)

SECURITY INFO:
- "This code expires in 10 minutes and can only be used once."
- "Do not share this code with anyone."
- "Having trouble? Contact Support"
```

**States:**
```
Active:  Cursor in current box, previous boxes filled
Error:   All boxes red, shake, error message shown
Success: All boxes green → full screen success overlay
         "#2D6A4F bg + white checkmark + "Email Verified!""
         Auto-redirect after 1.5 seconds
```

**Keyboard Behavior:**
```
- Numeric keyboard opens automatically
- Auto-advance to next box on digit entry
- Backspace on empty box moves focus back
- Paste auto-fills all 6 boxes
```

**Navigation:**
```
Correct OTP (registration) → Student Dashboard
Correct OTP (password reset) → New Password Screen
Back arrow → Previous screen (with confirmation)
```

**Data Requirements:** `supabase.auth.verifyOtp()`

---

### STUDENT SCREENS

---

#### Screen 6 — Student Dashboard

**Purpose:** Main home screen after login. Entry point to all student features.

**Layout:**
```
FIXED HEADER:
- SPCBA seal (left, 36px white circle)
- "CAPIRE" centered, 20px bold #FFFFFF
- Notification bell (right, white) with amber dot badge

WELCOME BANNER (below header, sage green):
- Background: #2D6A4F, full width, 100px
- "Good morning," 14px #D8F3DC
- Student first name: 22px bold #FFFFFF
- "What will you research today?" 13px #D8F3DC
- Book/graduation cap icon: 48px #52B788 (right side)

SEARCH SECTION (white background):
- Large search bar: pill shape, #F8F9FA bg
  Left: search icon | Placeholder: "Search capstone projects..."
  Right: filter sliders icon #2D6A4F
- Toggle chips row below:
  "Keyword Search" (active: #2D6A4F bg, white text)
  "AI Semantic" (inactive: #F8F9FA bg, gray text)

RECENTLY ADDED SECTION:
- Header row: "Recently Added" (left) + "View All" link (right)
- Horizontal scroll row of capstone cards (200×140px each)
- Each card: category chip, title, year badge, bookmark icon

AI RECOMMENDED SECTION:
- Header: "AI Recommended for You" + sparkle icon + "Refresh"
- 3 topic suggestion cards (full width, 80px height)
- Left border accent: 4px #2D6A4F
- Right: arrow icon #2D6A4F

ARCHIVE STATS ROW:
- 3 stat cards in row, #D8F3DC background
- Numbers: 24px bold #1B4332
- Labels: 11px #6C757D
- Stats: "Capstones" | "Topics" | "Students"

FLOATING CHATBOT BUTTON:
- Position: above bottom nav, right side
- 52px circle, #E9C46A background
- Chat bubble icon 24px #1B4332

BOTTOM NAVIGATION BAR (fixed):
- 5 tabs: Home (active) | Search | Browse | Bookmarks | Profile
```

**Data Requirements:**
```
- profiles: student name for welcome banner
- capstones: recently added (order by created_at desc, limit 6)
- capstones: AI recommendations (via Python FastAPI SBERT)
- capstones: count for archive stats
```

---

#### Screen 7 — Search Results Screen

**Purpose:** Display capstone search results from keyword or semantic query.

**Layout:**
```
FIXED TOP SECTION (dark green header):
- Back arrow (left), "Search Results" (center), filter icon (right)
- Search bar with active query shown
  Background: rgba(255,255,255,0.15)
  Active query text: #FFFFFF, X clear button right

FILTER CHIPS ROW (white bg, horizontal scroll):
- "All Results" (active), "Web App", "Mobile",
  "AI/ML", "IoT", "Database", "Security"
- Active chip: #2D6A4F bg, white text
- Inactive chip: #F8F9FA bg, gray border

RESULTS META ROW:
- "24 results found" (left) | "Sort: Relevance ▾" (right)
- Bottom border: 1px #E9ECEF

SCROLLABLE RESULTS LIST (#F8F9FA bg):
- Capstone cards (full width, ~140px height)
- 12px gap between cards

EACH CARD CONTAINS:
- Top row: category chip (left) + similarity badge (right)
- Title: 15px semibold #1B4332, 2 lines max
- Authors: 13px #6C757D, 1 line
- Bottom row: year badge (left) + adviser 12px (center)
  + bookmark icon (right)

LONG PRESS CONTEXT MENU:
- View Details
- Bookmark
- Generate Citation
- Contact Researcher

EMPTY STATE:
- Gray illustration 120×120px
- "No results found" 18px semibold
- "Try AI Semantic Search for better results"
- "Try AI Search" outline button
```

**Search Types:**
```
Keyword: Supabase full-text search on title and abstract
Semantic: Python FastAPI SBERT cosine similarity
```

**Data Requirements:**
```
- capstones: title, authors, year, category, abstract
- Semantic: Python FastAPI /search endpoint
- Similarity scores returned from SBERT comparison
```

---

#### Screen 8 — Capstone Detail Screen

**Purpose:** View complete information about a specific capstone project.

**Layout:**
```
FIXED HEADER:
- Back arrow (left), "Capstone Details" (center)
- Bookmark icon (right) — filled if bookmarked

SCROLLABLE CONTENT:

STATS ROW (dark green card):
- 3 equal boxes: Pages | Views | Year
- Numbers: 20px bold #FFFFFF
- Labels: 11px #D8F3DC

TITLE SECTION:
- "TITLE" label: 12px #6C757D uppercase
- Full title: 18px semibold #1B4332

AUTHORS SECTION:
- "AUTHORS" label
- Each author row: avatar circle (32px) + full name
- Authors: De La Cruz, De La Cruz (name format)

PROGRAM SECTION:
- "PROGRAM" label
- Program text: 14px #212529

ADVISER SECTION:
- "FACULTY ADVISER" label
- Adviser name: 14px #212529

DATE SECTION:
- "DATE SUBMITTED" label
- Date: 14px #212529

ABSTRACT SECTION:
- "ABSTRACT" label
- Full abstract text: 14px #212529, line height 1.6

FIXED BOTTOM ACTION BAR:
- Three buttons in row:
  Left (secondary): Cite (quote icon)
  Center (primary): Contact Researcher (chat icon)
  Right (icon only): Share
```

**Navigation:**
```
Cite button          → Citation Bottom Sheet
Contact Researcher   → Chat Conversation Screen
Bookmark icon        → Toggle bookmark (save/unsave)
```

**Data Requirements:**
```
- capstones: all fields
- profiles: author details (linked via capstone authors array)
- bookmarks: check if current user has bookmarked
```

---

#### Screen 9 — Originality Checker Screen

**Purpose:** Students propose a capstone topic and check its conceptual similarity against the archive.

**Layout:**
```
FIXED HEADER:
- Back arrow (left), "Propose a Topic" (center)
- Information icon (right)

SCROLLABLE CONTENT (#F8F9FA bg):

INTRO CARD:
- Left border: 4px #2D6A4F
- Sparkle icon #E9C46A + "AI Originality Check" label
- Description: "Our AI compares your topic against 150+
  archived capstone projects to ensure your research is original"

FORM CARD (white):
- "Your Proposed Topic" section label

PROPOSED TITLE INPUT:
- Label: "Title"
- Placeholder: "Enter your proposed capstone title..."
- Character count: "0/200"

DESCRIPTION TEXTAREA:
- Label: "Brief Description"
- Height: 100px
- Placeholder: "Describe what your capstone will do..."
- Character count: "0/500"

TARGET USERS INPUT:
- Label: "Target Users"
- Placeholder: "e.g. SPCBA IT Students"

TECH STACK INPUT:
- Label: "Technology Stack (Optional)"
- Placeholder: "e.g. React Native, Firebase, Python"
- Helper: "This helps improve recommendation accuracy"

CHECK ORIGINALITY BUTTON:
- Icon: shield-check 22px white
- Text: "Check Topic Originality"
- Full width, 56px height (slightly taller for emphasis)

RESULTS SECTION (after check):

SCORE GAUGE CARD:
- Circular donut gauge: 120px diameter, 16px ring
- Filled arc: colored by score percentage
- Empty arc: #E9ECEF
- Center: score percentage 28px bold + "Similarity" label
- Status badge centered below gauge
- Recommendation text below badge

SIMILAR STUDIES CARD:
- Header: "Similar Existing Capstones" + count badge
- 3 rows: title, authors/year, progress bar, percentage

AI SUGGESTIONS CARD:
- Background: #FFF3CD pale gold
- Lightbulb icon + "AI Suggestions" header
- 3 bullet points with sage green dots

ACTION BUTTONS (bottom):
- Secondary: "Revise My Topic"
- Primary: "Submit for Faculty Review"
```

**States:**
```
Empty form:    Only form visible, button disabled
Checking:      Loading state on button
Results shown: Form + results panel both visible
```

**Data Requirements:**
```
- Python FastAPI /similarity endpoint
- capstones: all embeddings for comparison
- topic_submissions: insert on submit
```

---

#### Screen 10 — Bookmarks Screen

**Purpose:** View and manage saved capstone records.

**Layout:**
```
FIXED HEADER:
- Back arrow or menu (left), "Bookmarks" (center)
- Search icon (right)

SEARCH BAR (below header):
- Full width search within bookmarks

FILTER TAB ROW:
- "All (8)" | "Recent (3)" | "2025 (2)" | "2024 (3)"
- Active tab: bottom border 2px #2D6A4F, text #2D6A4F
- Tip text: "Tap any capstone to view full details"

SCROLLABLE BOOKMARKS LIST:
- Full width cards with remove option

BOOKMARK CARD:
- Category chip (top left, colored by type)
- Bookmark remove X (top right, #E76F51)
- Title: 15px semibold #1B4332
- Authors: 13px #6C757D
- Bottom row:
  Year badge | Saved date "Saved 2 days ago" |
  View count badge | "Cite" link #2D6A4F

EMPTY STATE:
- Bookmark outline icon 64px #D8F3DC
- "No bookmarks yet"
- "Start saving capstones you find useful"
- "Browse Capstones" button
```

**Data Requirements:**
```
- bookmarks: join with capstones
- Filter by year or date from bookmarks.created_at
- saved_citations: check for cite button state
```

---

### FACULTY SCREENS

---

#### Screen 11 — Faculty Topic Review Screen

**Purpose:** Faculty members review, approve, or reject student topic submissions.

**Layout:**
```
FIXED HEADER:
- Menu icon (left), "Topic Reviews" (center), filter icon (right)

STATS STRIP (below header, #2D6A4F bg):
- 3 equal sections divided by rgba white lines
- Pending | Approved | Rejected
- Numbers: 16px bold #FFFFFF
- Labels: 10px #D8F3DC

FILTER TABS:
- All | Pending | Approved | Needs Revision | Rejected
- Horizontal scroll

SUBMISSIONS LIST (scrollable):

SUBMISSION CARD:
- Left border: 4px colored by status
  Pending:   #E9C46A amber
  Approved:  #40916C green
  Revision:  #F4A261 orange
  Rejected:  #E76F51 red
- Student name: 15px semibold #1B4332
- Status badge: top right
- Proposed title: 14px #212529, 2 lines
- Bottom row: calendar icon + date | similarity badge

REVIEW DETAIL (bottom sheet on card tap):

STUDENT INFO ROW:
- Avatar 40px + name + ID + year level

PROPOSED TOPIC:
- Full title 16px semibold
- Description paragraph
- Target users and tech stack chips

AI ORIGINALITY REPORT CARD:
- Small donut gauge + similarity score
- "View Similar Studies" expandable row

FACULTY FEEDBACK TEXTAREA:
- Label: "Your Feedback" (required *)
- 100px height
- Placeholder: "Provide specific guidance..."
- Character count

ACTION BUTTONS (stacked):
- Approve:          green, 56px, most prominent
- Request Revision: amber/gold, 52px
- Reject:           transparent, red text, 48px, least prominent
```

**Data Requirements:**
```
- topic_submissions: all fields + student profile
- profiles: student name, ID, year level
- Update status + faculty_feedback + reviewed_by + reviewed_at
```

---

### SHARED SCREENS

---

#### Screen 12 — Chatbot Screen

**Purpose:** AI assistant for searching capstones, topic ideas, citations, and system navigation help.

**Layout:**
```
FIXED HEADER:
- Back arrow (left)
- Bot avatar: 32px circle #2D6A4F + sparkle icon
- "CAPIRE Assistant" 16px semibold #FFFFFF
- Green dot + "Online" 11px #D8F3DC
- Information icon (right)

QUICK ACTIONS ROW (white bg, horizontal scroll):
- 4 pill buttons with icons:
  Search icon + "Find Capstones"
  Lightbulb + "Topic Ideas"
  Book + "How to Use"
  Quote + "Get Citation"

CHAT MESSAGE AREA (scrollable, #F8F9FA bg):

DATE SEPARATOR:
- "Today" pill: #E9ECEF bg, 11px #6C757D

BOT MESSAGE (left aligned):
- Bot avatar 28px (bottom left of bubble)
- White bubble: border 1px #E9ECEF
- Border radius: 4px TL, 18px others (tail bottom left)
- Text: 14px #212529, line height 1.5
- Timestamp: 10px #6C757D below

MINI RESULT CARDS (inside bot message):
- After search results response
- Each card: #F8F9FA bg, border 1px #E9ECEF
- Title (13px) + year/category (11px) + "View" link

USER MESSAGE (right aligned):
- Sage green bubble #2D6A4F
- Border radius: 4px BR, 18px others (tail bottom right)
- Text: 14px #FFFFFF
- Timestamp: 10px #D8F3DC

TYPING INDICATOR:
- White bubble left side
- 3 dots: 8px, #2D6A4F, middle dot raised

FIXED INPUT AREA (white bg, border top):
- Attachment button: 44px circle #F8F9FA (docs only)
- Text input: pill shape, #F8F9FA, auto-expanding
  Placeholder: "Ask CAPIRE Assistant..."
- Send button: 44px circle
  Active: #2D6A4F bg + white send icon
  Disabled: #E9ECEF bg + gray icon
- "Powered by Gemini AI" 10px #6C757D
```

**Data Requirements:**
```
- Gemini Flash API: chatbot responses
- Python FastAPI: search and recommendation queries
- capstones: search results returned in chat
```

---

#### Screen 13 — Messages List Screen

**Purpose:** View all active academic conversations with previous researchers.

**Layout:**
```
FIXED HEADER:
- Back arrow (left), "Messages" (center)
- Compose/new message icon (right)

SCROLLABLE CONVERSATION LIST:

CONVERSATION CARD:
- Avatar circle 48px (initials, #2D6A4F bg)
- Researcher name: 15px semibold #1B4332
- Last message preview: 13px #6C757D, 1 line truncated
- Timestamp: 11px #6C757D (top right)
- Unread badge: #2D6A4F bg, white count text (right)
- Capstone context chip below name:
  #D8F3DC bg, #2D6A4F text, 11px
  Shows capstone title this convo is about

UNREAD CARD STYLE:
- Background: #F8F9FA
- Name: semibold weight (bolder)
- Unread badge visible

READ CARD STYLE:
- Background: #FFFFFF
- Name: regular weight
- No badge

EMPTY STATE:
- Message bubble icon 64px #D8F3DC
- "No messages yet"
- "Find a previous researcher to connect with"
- "Browse Researchers" button
```

**Data Requirements:**
```
- messages: grouped by conversation (sender + receiver pair)
- profiles: researcher name and avatar initials
- capstones: capstone title for context chip
- is_read: for unread badge display
```

---

#### Screen 14 — Chat Conversation Screen

**Purpose:** Private academic messaging between student and previous researcher.

**Layout:**
```
FIXED HEADER (96px + status bar):
TOP ROW:
- Back arrow (left)
- Researcher name: 16px bold #FFFFFF
- Information icon → opens researcher profile (right)

BOTTOM ROW (context strip, rgba white 0.08):
- Book icon #E9C46A + capstone title 12px #D8F3DC truncated
- External link icon #E9C46A → opens capstone detail

CONTEXT BANNER (scrolls away, #FFF3CD bg):
- Information icon #D4A017
- "This conversation is about" 12px #6C757D
- Capstone title 13px semibold #1B4332
- "Academic queries only. Be respectful." 11px italic
- Dismiss X button

MESSAGE AREA (scrollable, #F8F9FA bg):

DATE SEPARATOR:
- Pill: "Monday, May 5, 2026" 11px #6C757D

RECEIVED BUBBLE (left, from researcher):
- Avatar 32px left, at bubble bottom
- White bubble: border 1px #E9ECEF, radius 18px/4px BL
- Researcher name above first bubble: 11px #2D6A4F
- Text: 14px #212529, line height 1.5
- Timestamp: 10px #6C757D

SENT BUBBLE (right, from student):
- Sage green #2D6A4F, radius 18px/4px BR
- Text: 14px #FFFFFF, line height 1.5
- Timestamp: 10px #D8F3DC
- Checkmark icon: single (sent) / double (delivered)

TYPING INDICATOR:
- Left aligned, white bubble
- 3 dots #2D6A4F, middle dot slightly raised

UNREAD DIVIDER:
- #D8F3DC bg strip: "3 Unread Messages" 12px #2D6A4F

ACADEMIC DISCLAIMER (slim strip above input):
- "Academic queries only" 10px italic #6C757D

FIXED INPUT AREA (white bg):
- Attachment button (44px circle, docs only)
- Text input (pill, auto-expanding)
- Send button (44px circle, green/gray state)

LONG PRESS MENU:
- Copy Text
- Report Message (#E76F51)
- Delete for Me

EMPTY STATE (first conversation):
- Researcher avatar 64px
- Researcher name + capstone chip
- Welcome text with guidelines
- "Academic use only" reminder pill
```

**Data Requirements:**
```
- messages: full conversation thread (sender + receiver pair)
- Real-time subscription: supabase.channel() for live updates
- profiles: sender and receiver details
- capstones: context capstone details
```

---

#### Screen 15 — Own Profile Screen

**Purpose:** View and manage the logged-in user's personal profile and settings.

**Layout:**
```
FIXED HEADER:
- Back arrow (left), "Profile" (center)
- Edit pencil icon (right, #FFFFFF)

PROFILE IDENTITY (extended dark green, 220px):
- Background: #1B4332, curved bottom arc
- Avatar: 88px circle, #2D6A4F bg, white initials
  Border: 3px solid #E9C46A amber gold
  Camera overlay: 28px circle, #E9C46A bg, camera icon
- Full name: 22px bold #FFFFFF
- Role badge: pill, rgba white 0.15 bg, #FFFFFF text

SCROLLABLE CONTENT (#F8F9FA bg):

ACADEMIC INFO CARD:
- Left border: 4px #E9C46A amber gold
- Info rows: icon + label (left) + value (right)
  Institution, Year Level, Department, Program

RESEARCH INTERESTS CARD:
- "Research Interests" header
- Keyword chips: #D8F3DC bg, #2D6A4F text, wrapping

ACCOUNT SETTINGS CARD:
- "Account Settings" header
- Settings rows (52px each):
  Edit Profile | Change Password |
  Notification Settings | Privacy Settings | Help and FAQ
- Each row: icon (left) + label + chevron (right)
- Bottom border 1px #E9ECEF between rows

LOGOUT ROW (separate card):
- Logout icon #E76F51 + "Logout" text #E76F51

VERSION TEXT:
- "CAPIRE v1.0.0" 11px #6C757D centered
- "San Pedro College of Business Administration"
```

**Data Requirements:**
```
- profiles: all user fields
- auth: current user email
```

---

#### Screen 16 — Other User Profile Screen

**Purpose:** View a previous researcher's public academic profile before messaging.

**Layout:**
```
FIXED HEADER:
- Back arrow (left), "Profile" (center)
- Three-dot menu: Report / Block (right)

PROFILE IDENTITY (same structure as own profile):
- No camera overlay on avatar (not editable)
- Graduation cap icon instead of edit

CAPSTONE RESEARCH CARD (most prominent):
- Left border: 4px #E9C46A amber gold
- Book icon + "Capstone Research" label
- Full capstone title: 16px semibold #1B4332
- Year badge + Category chip row
- Abstract preview: 2 lines + "Read Abstract" link

ACADEMIC INFORMATION CARD:
- Institution, Graduation Year, Department, Program

AVAILABILITY TOGGLE CARD:
- Person-check icon
- "Available for Queries" label
- "Accepts messages from students" sublabel
- Toggle switch: ON (#2D6A4F) | OFF (#E9ECEF)

RESEARCH INTERESTS CARD:
- Keyword chips same style as own profile

FIXED BOTTOM ACTION BAR:
- Save button (30% width, secondary style)
- "Send Message" button (65% width, primary #2D6A4F)
```

**Data Requirements:**
```
- profiles: researcher's public fields
- capstones: researcher's capstone project
- messages: check existing conversation
```

---

#### Screen 17 — Citation Bottom Sheet

**Purpose:** Generate properly formatted APA citations for selected capstone projects.

**Layout:**
```
BOTTOM SHEET CONTAINER:
- Border radius: 24px top corners
- Drag handle: 4px × 36px #E9ECEF centered

SHEET HEADER:
- Quote icon 22px #2D6A4F + "Generate Citation" 18px bold
- Close X: 32px circle #F8F9FA

CAPSTONE REFERENCE ROW (#F8F9FA card):
- Capstone title 14px semibold + authors/year 12px

CITATION TABS:
- "Internal Citation" | "Full Reference"
- Active: #2D6A4F bg, white text
- Inactive: #F8F9FA bg, gray text

CITATION TYPE INFO BOX (#D8F3DC pale green):
- Information icon + usage guidance text

CITATION PREVIEW BOX:
- "Preview" label 11px uppercase #6C757D
- #F8F9FA bg, border 1px #E9ECEF
- Left border: 3px #2D6A4F
- Citation text: 13px #212529, line height 1.6
- Selectable text enabled

INTERNAL CITATION (active state):
- Large centered text: "(Cruz & Garcia, 2024)"
  24px bold #1B4332, centered in preview box
- How to use: instruction text
- Example: quoted sentence showing in-text usage

FULL REFERENCE (active state):
- Full APA paragraph text in preview box
- How to use: instruction text
- Example: references list entry

ACTION BUTTONS:
- "Copy to Clipboard" (primary, clipboard icon)
- "Save to My Citations" (secondary, bookmark icon)
- "Share" (tertiary, transparent, share icon)

COPIED STATE:
- Button → #40916C bg + "Copied!" text
- Returns to normal after 1.5 seconds
```

**APA Format Templates:**
```
INTERNAL CITATION:
(Last1 & Last2, Year)
(Last1, Last2, & Last3, Year)

FULL REFERENCE:
Last1, F. M., & Last2, F. M. (Year). Title of capstone
project in sentence case [Unpublished capstone project].
Department of Computer Studies, San Pedro College of
Business Administration. CAPIRE Academic Archive.
```

**Data Requirements:**
```
- capstones: title, authors, year, department
- saved_citations: insert on save
- citation_type: "internal" or "full"
```

---

## 8. Interaction Patterns

### Navigation Transitions
```
Push (slide left):    Tap on card → detail screen
Pop (slide right):    Back arrow tap
Modal (slide up):     Bottom sheets, citation modal
Fade:                 Tab switches in bottom nav
Replace:              Login → Dashboard (no back)
```

### Loading States
```
Skeleton screens:     Cards show gray animated placeholders
                      while data loads (never blank screens)
Button loading:       Spinner replaces icon inside button
Pull to refresh:      Green spinner at top of scrollable lists
Inline loading:       Small spinner for search results
```

### Empty States
```
Every list screen has a defined empty state:
- Relevant illustration placeholder (gray, simple)
- Clear heading explaining the empty state
- Helpful subtext with next action
- Action button to resolve the empty state
```

### Error States
```
Network error:   Full screen with retry button
Form error:      Red border + helper text below field
API error:       Toast notification bottom of screen
Auth error:      Inline below button, not modal
```

### Toast Notifications
```
Position:       Bottom of screen, above bottom nav
Duration:       2 seconds auto-dismiss
Success toast:  #D8F3DC bg, #40916C text, checkmark icon
Error toast:    #FFE0DB bg, #C1121F text, x-circle icon
Info toast:     #FFFFFF bg, #1B4332 text, info icon
```

### Gesture Interactions
```
Swipe left on card:  Reveal delete/remove action
Long press card:     Show context menu
Pull down:           Dismiss bottom sheets
Pull to refresh:     Refresh list data
Swipe back:          iOS back navigation
```

---

## 9. Accessibility Guidelines

### Color Contrast
```
Dark green on white:   #1B4332 on #FFFFFF = 12.6:1 (AAA)
Sage green on white:   #2D6A4F on #FFFFFF = 7.2:1 (AA)
White on dark green:   #FFFFFF on #1B4332 = 12.6:1 (AAA)
Body text on white:    #212529 on #FFFFFF = 16.1:1 (AAA)
Gray text on white:    #6C757D on #FFFFFF = 4.6:1 (AA)
```

### Touch Targets
```
Minimum tap target:   44×44px (all interactive elements)
Button height:        52px minimum
Icon buttons:         44px circle minimum
Bottom nav tabs:      Full width / 5 equal sections
```

### Text Sizing
```
Minimum font size:    11px (footer/version only)
Body minimum:         14px
Interactive labels:   14px minimum
No all-caps body text (uppercase for short labels only)
```

### Screen Reader Support
```
All images:           Alt text describing content
Icon buttons:         aria-label for screen readers
Status badges:        Include text not just color
Form errors:          Announced to screen reader
Loading states:       aria-live regions for updates
```

---

## 10. Asset Specifications

### App Icon
```
Format:         PNG, no transparency
Sizes required:
  1024×1024     App Store / Play Store
  512×512       Google Play Store
  180×180       iPhone home screen (@3x)
  120×120       iPhone home screen (@2x)
  80×80         iPhone spotlight
  40×40         Notification icon

Design:
  Shape:        Rounded square (squircle)
  Background:   #1B4332 dark green (filled)
  Style:        Flat design, academic theme
```

### Image Assets
```
SPCBA Seal:     SVG preferred, white version on green bg
Avatar default: Initials generated from profile name
Illustrations:  SVG flat style, #D8F3DC and #2D6A4F palette
Icons:          Outline style, 24px grid, 2px stroke
```

### Icon Library
```
Source:   @expo/vector-icons (Ionicons set)

Navigation icons:
  Home:         home-outline
  Search:       search-outline
  Browse:       grid-outline
  Bookmarks:    bookmark-outline
  Profile:      person-outline

Action icons:
  Back:         chevron-back-outline
  Close:        close-outline
  Menu:         menu-outline
  Filter:       options-outline
  Notification: notifications-outline
  Send:         send-outline
  Attach:       attach-outline
  Edit:         create-outline
  Delete:       trash-outline
  Share:        share-outline
  Copy:         copy-outline
  Bookmark:     bookmark-outline / bookmark (filled)
  Chat:         chatbubble-outline
  Check:        checkmark-circle-outline
  Info:         information-circle-outline
  Shield:       shield-checkmark-outline
  Book:         book-outline
  School:       school-outline
  Star:         star-outline
  Logout:       log-out-outline
  Camera:       camera-outline
  Eye:          eye-outline / eye-off-outline
  Lock:         lock-closed-outline
  Mail:         mail-outline
  Person:       person-outline
  Calendar:     calendar-outline
  Time:         time-outline
  Lightbulb:    bulb-outline
  Quote:        chatbox-ellipses-outline
```

### Export Checklist
```
□ App icon: all required sizes
□ Splash screen: 1242×2688px (max iPhone size)
□ SPCBA seal: SVG white version
□ Empty state illustrations: SVG files
□ Onboarding assets (if applicable)
□ All icons verified in Ionicons library
```

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 2026 | Initial design system created |

---

*This design document is maintained by the CAPIRE development team:*
*Dayao, Maria Alisa — Estrada, Allen M. — Zulueta, Jaz Lee P.*
*Adviser: Professor Rodolfo E. De Guzman*
*San Pedro College of Business Administration, AY 2025–2026*
