# CAPIRE Project Context

## Overview

CAPIRE is an SPCBA-focused mobile application for capstone discovery, research support, and academic workflow assistance. The goal is simple: make it easier for students and faculty to find relevant capstone work, avoid duplicate topics, and collaborate inside one app.

## Primary Users

- Students looking for capstone ideas, references, and originality support
- Faculty reviewing topics and existing archive content
- Researchers and advisers who need faster access to prior studies

## Core Product Areas

### Archive Search

Users can search capstone titles and abstracts, filter by department or year, and open detailed capstone records.

### Capstone Detail

Each capstone detail screen is meant to surface the useful parts quickly:

- Title
- Author
- Department
- Year
- Abstract
- Keywords
- Citation support
- Bookmark action

### Originality Support

The originality checker compares pasted text or uploaded content against archive data and returns similarity-focused results for proposal review and writing support.

### AI Assistant

The chatbot uses Gemini to help with:

- Topic ideation
- Abstract refinement
- Keyword suggestions
- Citation-related help
- Archive-aware questions about live capstone data

### Messaging

Users can message each other directly. The app currently supports:

- Conversation list
- Unread badges
- Seen/read clearing
- Archive
- Delete from personal inbox
- Do not disturb awareness

### Profile and Settings

Users can manage:

- Display name
- Display profile
- Theme preference
- Do not disturb
- Legal pages

## Technical Context

### Frontend

- Expo / React Native
- TypeScript
- React Navigation
- Shared wireframe-inspired component styling

### Backend

- Supabase Auth for user accounts
- Supabase Postgres for app data
- Supabase Realtime for chat updates
- Supabase Edge Functions for originality and Gemini-backed assistant flows

### AI

Gemini is used for:

- Assistant replies
- Embedding generation
- Semantic archive matching

## Current State

The app is beyond prototype stage and already supports peer testing. Core archive browsing, messaging, assistant, bookmarking, profile, and settings flows are implemented. Remaining work is mostly production hardening, broader testing, and release cleanup rather than basic app setup.

## Repository Intent

This repository contains both:

- Product code for the mobile app
- Internal process and planning files used during development

If you only need the product overview, use:

- `README.md`
- this file
- `docs/test-release-notes.md`
- `docs/tester-checklist.md`

