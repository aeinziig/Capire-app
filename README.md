# CAPIRE

CAPIRE is a mobile capstone archive and research assistant built for SPCBA. It helps students and faculty browse capstone projects, check originality, bookmark useful studies, chat with other users, and use AI assistance for research support.

## What It Does

- Browse and search capstone projects
- Open capstone detail pages with abstract, keywords, and citation support
- Save bookmarks for later review
- Run originality checks against archive content
- Chat with the Gemini-powered CAPIRE Assistant
- Send user-to-user messages with unread badges, seen state, archive, and delete actions
- Manage profile, theme, and do not disturb settings

## Stack

- Expo + React Native
- TypeScript
- React Navigation
- Supabase Auth, Database, Realtime, and Edge Functions
- Gemini API for assistant and embedding-backed archive matching

## Project Structure

```text
src/
  components/        Shared UI building blocks
  context/           App-wide state
  navigation/        Route types
  screens/
    authentication/ Auth flow
    faculty/        Faculty-only screens
    shared/         Shared messaging, chatbot, settings, profile
    student/        Student-facing archive and originality screens
  services/          Supabase client and helpers

supabase/
  functions/         Edge Functions
  migrations/        Database migrations
```

## Environment

Create a local `.env` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Some Supabase Edge Functions also expect server-side secrets in the Supabase project:

- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Local Development

Install dependencies:

```bash
npm install
```

Run Expo:

```bash
npx expo start
```

Run Android:

```bash
npx expo run:android
```

Type-check:

```bash
npx tsc --noEmit
```

## Test Release

Current peer-test APK:

- Version: `1.0.0`
- Build code: `3`
- APK: `https://expo.dev/artifacts/eas/EXgqMhr3Iy80kw_fVTpSd8OeZT_5lbUsOgmSgFF3ngM.apk`

Tester docs:

- [Test Release Notes](docs/test-release-notes.md)
- [Tester Checklist](docs/tester-checklist.md)

## Documentation

- [Project Context](docs/project-context.md)
- [Supabase Feature Setup Guide](docs/supabase-feature-setup-guide.md)
- [CAPIRE Design Notes](CAPIRE_DESIGN.md)

## Status

This repository is in active development. The app is already usable for peer testing, but it is still moving toward a broader production release.

