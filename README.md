# SFWhirl — Medical Device Education Quiz App

A mobile quiz game that helps users learn about medical devices through AI-generated questions. Players select a topic, answer multiple-choice questions generated on the fly by Claude AI, earn XP, and track their progress over time.

## Features

- AI-generated quiz questions tailored to medical device topics and difficulty levels
- XP and leveling system with streaks and badges
- Per-user profiles and game session history
- Leaderboard view
- Works on iOS, Android, and web

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (React Native) with Expo Router |
| Language | TypeScript |
| State management | [Zustand](https://zustand-demo.pmnd.rs) |
| Backend / database | [Supabase](https://supabase.com) (Postgres + Auth + Row-Level Security) |
| AI question generation | [Claude API](https://www.anthropic.com) (Anthropic) |
| Navigation | Expo Router (file-based, tab layout) |

## Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/msanders-bc-ca/sfwhirl-app.git
   cd sfwhirl-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

4. **Set up the Supabase database**

   In the Supabase dashboard, open the SQL editor and run the contents of:
   ```
   supabase/schema.sql
   ```

## Running the App

```bash
npx expo start
```

This starts the Expo development server. From there:

- Press `i` to open in the iOS Simulator
- Press `a` to open in an Android emulator
- Press `w` to open in a web browser
- Scan the QR code with the [Expo Go](https://expo.dev/go) app on your phone

## Project Structure

```
app/                  # Screens and API routes (Expo Router)
  (tabs)/             # Tab navigation screens
  api/                # Server-side API routes
  game.tsx            # Quiz game screen
  results.tsx         # Post-game results screen
constants/            # Topics and difficulty levels
lib/                  # Supabase and Claude API clients
store/                # Zustand game state
supabase/             # Database schema
types/                # Shared TypeScript types
```

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `EXPO_PUBLIC_ANTHROPIC_API_KEY` | Your Anthropic (Claude) API key |

> **Note:** Never commit `.env.local` — it is excluded by `.gitignore`.
