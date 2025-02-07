# Fomochat - Feature Overview & User Flow

## Table of Contents
- [Introduction](#introduction)
- [User Flow](#user-flow)
- [Features](#features)
- [Technical Considerations](#technical-considerations)

## Introduction

Fomochat is a progressive web app (PWA) that provides users with an intuitive and private chatbot experience powered by Deep Seek AI. The onboarding process ensures smooth engagement with minimal friction.

## User Flow

### Splash Screen
- Displays Fomo's mascot with a loading animation
- Lasts for a few seconds before transitioning automatically to the welcome screen

### Welcome Screen
- A brief introduction to the app is displayed
- Users see a downward arrow icon to proceed

### Privacy & Nickname Input
- Users are informed that their conversation is private and anonymous
- A text field prompts the user to enter a nickname
- Once the nickname is entered, a downward arrow icon appears
- Clicking the downward arrow transitions the user to the chat interface

### Chat Interface
- Users can now interact with the AI chatbot
- The chat UI supports:
  - Text-based conversation
  - A clean and user-friendly design

## Features

### AI Chat with Deep Seek
- The chat functionality is powered by Deep Seek AI
- Responses are context-aware and personalized

### Private & Anonymous Conversations
- No personal data is stored permanently
- Users do not need to sign up or log in
- Conversations are temporarily stored for 24 hours before deletion

### User Experience Enhancements
- Smooth animations between screens
- Clear onboarding instructions
- Minimalistic UI for distraction-free interaction

## Technical Considerations

### Tech Stack
| Component | Technology |
|-----------|------------|
| AI Model | Deep Seek AI |
| Frontend | React Native with TypeScript, Expo, and Expo Router |
| Backend/Database | Supabase |
| UI Framework | React Native Paper |

### API Integration
- Chat interactions rely on API calls to Deep Seek
- Ensure low-latency responses for a smooth user experience

### Database Management
- Supabase is used as the database
- User nicknames and queries are stored temporarily for 24 hours
- Data is automatically deleted after the retention period to ensure privacy

### UI/UX Guidelines
- Maintain a consistent color scheme and typography
- Buttons and input fields should have a responsive design
- Ensure accessibility features like high contrast and text resizing

### Database Schema

#### Tables

**chats**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| nickname | text | User's chosen nickname |
| created_at | timestamp | When the chat was created |
| expires_at | timestamp | When chat will be deleted (24h after creation) |

**messages**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| chat_id | uuid | Foreign key to chats.id |
| content | text | Message content |
| role | text | 'user' or 'assistant' |
| created_at | timestamp | When message was sent |
| expires_at | timestamp | When message will be deleted (24h after creation) |

### Folder Structure
Fomochat/
├── app/ # Expo Router pages
│ ├── (auth)/ # Authentication related screens
│ │ ├── welcome.tsx # Welcome screen
│ │ └── nickname.tsx # Nickname input screen
│ ├── (chat)/ # Chat related screens
│ │ └── index.tsx # Main chat interface
│ ├── layout.tsx # Root layout
│ └── index.tsx # Splash screen
├── assets/ # Static assets
│ ├── fonts/ # Custom fonts
│ └── images/ # Images and icons
├── components/ # Reusable components
│ ├── chat/ # Chat related components
│ │ ├── ChatBubble.tsx
│ │ ├── ChatInput.tsx
│ │ └── ChatList.tsx
│ └── common/ # Common UI components
│ ├── Button.tsx
│ └── TextField.tsx
├── constants/ # App constants
│ ├── Colors.ts
│ └── Layout.ts
├── hooks/ # Custom React hooks
│ ├── useChat.ts
│ └── useAuth.ts
├── services/ # API and external services
│ ├── ai.ts # Deep Seek AI integration
│ └── supabase.ts # Supabase client
├── types/ # TypeScript type definitions
│ └── index.ts
├── utils/ # Helper functions
│ └── formatters.ts
├── app.json # Expo config
├── babel.config.js
├── package.json
└── tsconfig.json
---

> This document serves as a foundation for developers to understand the core functionality and implementation of Fomochat.
