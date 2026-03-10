# Software Requirements Specification (SRS)
## FCS Futminna Web Application

**Version:** 1.0  
**Date:** January 2025  
**Prepared By:** Development Team  
**Project:** Fellowship of Christian Students (FCS) Futminna Digital Platform

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features and Requirements](#3-system-features-and-requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Technical Architecture](#6-technical-architecture)
7. [Data Requirements](#7-data-requirements)
8. [Security Requirements](#8-security-requirements)
9. [Appendices](#9-appendices)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a comprehensive description of the FCS Futminna Web Application. It details the functional and non-functional requirements for a digital platform designed to serve the Fellowship of Christian Students community at Federal University of Technology, Minna (FUTMINNA).

### 1.2 Scope
The FCS Futminna Web Application is a comprehensive digital platform that serves as:
- A spiritual and academic resource hub for students
- A community engagement and communication platform
- An AI-powered learning assistance system
- A content management system for fellowship activities
- A registration and management system for programs

**Key Objectives:**
- Provide 24/7 access to spiritual resources (sermons, books, devotionals)
- Facilitate academic excellence through AI-powered study tools
- Enable efficient communication of fellowship activities and events
- Streamline registration processes for programs like School of Destiny (SOD)
- Build a strong online community presence
- Support both online and offline access to critical resources

### 1.3 Definitions, Acronyms, and Abbreviations
- **FCS**: Fellowship of Christian Students
- **SOD**: School of Destiny (intensive 14-day spiritual training program)
- **GST**: General Studies courses
- **FUTMINNA**: Federal University of Technology, Minna
- **AI**: Artificial Intelligence
- **SPA**: Single Page Application
- **API**: Application Programming Interface
- **RLS**: Row Level Security
- **PWA**: Progressive Web Application

### 1.4 References
- React Documentation (v19.2.3)
- Supabase Documentation (v2.39.0)
- Google Gemini AI API Documentation (v1.38.0)
- Vite Build Tool Documentation (v6.2.0)
- TypeScript Documentation (v5.8.2)

### 1.5 Overview
This document is organized into nine major sections covering all aspects of the system requirements, from functional specifications to technical architecture and security considerations.

---

## 2. Overall Description

### 2.1 Product Perspective
The FCS Futminna Web Application is a standalone web-based system that integrates with:
- **Google Gemini AI**: For intelligent content generation and conversational AI
- **Supabase Backend**: For authentication, database, and file storage
- **External Content Sources**: For images, media, and educational resources

The system operates as a Progressive Web Application (PWA) accessible via modern web browsers on desktop, tablet, and mobile devices.

### 2.2 Product Functions
The application provides the following major functions:

#### 2.2.1 Information & Content Management
- Display fellowship information, mission, and values
- Showcase team members and leadership structure
- Publish and manage blog posts about campus life and spiritual growth
- Maintain a digital library of Christian literature
- Host and stream audio sermons
- Display photo galleries of fellowship events

#### 2.2.2 Academic Support Tools
- **E-Test Simulator**: AI-generated practice questions for 100L-500L courses
- **AI Study Buddy**: Conversational AI assistant for academic and spiritual guidance
- **Course Resources**: Subject-specific study materials and tips

#### 2.2.3 Community Engagement
- Service unit information and recruitment
- Event calendar and activity announcements
- Contact and communication channels
- Testimonials and success stories

#### 2.2.4 Program Management
- School of Destiny (SOD) program information
- Registration and waitlist management
- Countdown timers for upcoming events
- Notification systems for program updates

### 2.3 User Classes and Characteristics

#### 2.3.1 Students (Primary Users)
- **Characteristics**: University students aged 18-25, varying technical proficiency
- **Needs**: Academic support, spiritual resources, community connection
- **Frequency**: Daily to weekly usage
- **Technical Skills**: Basic to intermediate

#### 2.3.2 Fellowship Leaders
- **Characteristics**: Student leaders and coordinators
- **Needs**: Content management, member communication, event coordination
- **Frequency**: Multiple times per week
- **Technical Skills**: Intermediate

#### 2.3.3 Visitors/Prospective Members
- **Characteristics**: New students, curious visitors
- **Needs**: Information about FCS, program details, contact information
- **Frequency**: One-time to occasional
- **Technical Skills**: Basic

#### 2.3.4 Alumni
- **Characteristics**: Former FCS members
- **Needs**: Stay connected, access resources, view updates
- **Frequency**: Occasional
- **Technical Skills**: Varies

### 2.4 Operating Environment
- **Client-Side**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Server-Side**: Supabase cloud infrastructure
- **AI Services**: Google Gemini API
- **Hosting**: Static hosting platform (Vercel, Netlify, or similar)
- **Network**: Internet connection required for full functionality; offline mode for cached content

### 2.5 Design and Implementation Constraints
- Must use React 19.2.3 with TypeScript
- Must integrate with Supabase for backend services
- Must use Google Gemini AI for intelligent features
- Must be responsive and mobile-friendly
- Must support dark mode
- Must maintain performance on low-bandwidth connections
- Must comply with data privacy regulations
- API rate limits for Gemini AI services

### 2.6 Assumptions and Dependencies
**Assumptions:**
- Users have access to internet-enabled devices
- Users have basic digital literacy
- Gemini API remains available and stable
- Supabase services maintain 99.9% uptime

**Dependencies:**
- Google Gemini AI API availability
- Supabase infrastructure reliability
- Third-party CDN services for images
- Browser support for modern JavaScript features

---

## 3. System Features and Requirements

### 3.1 Home Page Module

#### 3.1.1 Description
The home page serves as the primary landing point, providing an immersive introduction to FCS Futminna with dynamic content and AI-generated spiritual insights.

#### 3.1.2 Functional Requirements

**FR-HOME-001**: Dynamic Hero Section
- **Priority**: High
- **Description**: Display rotating background images with fellowship activities
- **Input**: Pre-configured image URLs
- **Processing**: Automatic rotation every 6 seconds
- **Output**: Smooth transitions between images

**FR-HOME-002**: AI-Generated Daily Insight
- **Priority**: Medium
- **Description**: Generate and display a daily spiritual quote or encouragement
- **Input**: Request to Gemini AI API
- **Processing**: AI generates 20-word spiritual message
- **Output**: Displayed quote with loading state
- **Error Handling**: Fallback to default scripture if API fails

**FR-HOME-003**: Statistics Display
- **Priority**: Low
- **Description**: Show fellowship statistics (10 units, 3000+ members)
- **Output**: Animated number displays with icons

**FR-HOME-004**: Core Pillars Section
- **Priority**: High
- **Description**: Display three foundational values (Deep Worship, Sound Doctrine, Genuine Love)
- **Output**: Card-based layout with icons and descriptions

**FR-HOME-005**: Feature Cards
- **Priority**: High
- **Description**: Showcase four main features (E-Test Simulator, Library, AI Study Buddy, Blog)
- **Input**: Feature data with links
- **Output**: Interactive cards with hover effects and navigation

**FR-HOME-006**: Call-to-Action Buttons
- **Priority**: High
- **Description**: Provide clear navigation to key sections
- **Output**: Prominent buttons for "Join Next Service" and "Find Your Unit"


### 3.2 E-Test Simulator Module

#### 3.2.1 Description
An AI-powered practice test system that generates curriculum-aligned questions for students across all academic levels (100L-500L).

#### 3.2.2 Functional Requirements

**FR-SIM-001**: Level Selection Interface
- **Priority**: High
- **Description**: Allow users to select their academic level
- **Input**: User clicks on level (100L, 200L, 300L, 400L, 500L)
- **Output**: Display available subjects for selected level

**FR-SIM-002**: Subject Selection
- **Priority**: High
- **Description**: Display subjects relevant to selected level
- **Input**: Level selection
- **Output**: Grid of subject cards with icons, names, and descriptions
- **Subjects by Level**:
  - 100L: MTH 101, GST 101, CHM 101, PHY 101
  - 200L: MTH 201, GNS 201, STA 201
  - 300L: Engineering Economics, Data Structures, Thermodynamics
  - 400L: Project Management, Entrepreneurship
  - 500L: Professional Ethics, Seminar Presentation

**FR-SIM-003**: AI Question Generation
- **Priority**: Critical
- **Description**: Generate 5 practice questions using Gemini AI
- **Input**: Subject name and difficulty level
- **Processing**: API call to Gemini with structured schema
- **Output**: Array of Question objects with:
  - id: string
  - text: string
  - options: string[] (4 options)
  - correctAnswer: number (0-3)
  - explanation: string
- **Response Time**: Maximum 10 seconds
- **Error Handling**: Display error message and return to subject selection

**FR-SIM-004**: Test Interface
- **Priority**: High
- **Description**: Present questions one at a time with answer selection
- **Input**: User selects answer option (A, B, C, or D)
- **Processing**: Store answer and enable navigation
- **Output**: Visual feedback on selected answer, progress indicator

**FR-SIM-005**: Timer Functionality
- **Priority**: Medium
- **Description**: Track time spent on test
- **Processing**: Start timer when test begins, stop when completed
- **Output**: Display elapsed time in MM:SS format

**FR-SIM-006**: Progress Tracking
- **Priority**: Medium
- **Description**: Visual progress bar showing question completion
- **Output**: Colored progress bars (current, completed, remaining)

**FR-SIM-007**: Results Calculation
- **Priority**: High
- **Description**: Calculate and display test results
- **Processing**: Compare user answers with correct answers
- **Output**: 
  - Total score percentage
  - Number correct/total
  - Time taken
  - Average time per question
  - Pass/fail status (60% threshold)

**FR-SIM-008**: Detailed Explanations
- **Priority**: High
- **Description**: Show AI-generated explanations for each question
- **Output**: 
  - User's answer
  - Correct answer (if wrong)
  - AI explanation
  - Visual indicators (correct/incorrect)

**FR-SIM-009**: Test Retake
- **Priority**: Medium
- **Description**: Allow users to retake same test or start new one
- **Output**: Buttons for "Start New Test" and "Retake This Test"

### 3.3 AI Study Buddy Module

#### 3.3.1 Description
A conversational AI assistant powered by Gemini AI, providing academic guidance, spiritual encouragement, and campus survival tips.

#### 3.3.2 Functional Requirements

**FR-BUDDY-001**: Chat Interface
- **Priority**: High
- **Description**: Provide conversational interface for user interaction
- **Input**: Text messages from user
- **Output**: AI-generated responses in chat format

**FR-BUDDY-002**: AI Context Configuration
- **Priority**: Critical
- **Description**: Configure AI with FCS-specific context
- **System Instruction**: "You are 'FCS Study Buddy', an AI assistant for students at Futminna University, specifically for the FCS community. You are friendly, encouraging, knowledgeable about academic life, and provide guidance that aligns with Christian values."
- **Behavior**: Concise, supportive, spiritually-aligned responses

**FR-BUDDY-003**: Conversation History
- **Priority**: High
- **Description**: Maintain chat history within session
- **Processing**: Store messages in state with role (user/model)
- **Output**: Scrollable chat history with distinct styling

**FR-BUDDY-004**: Starter Prompts
- **Priority**: Medium
- **Description**: Provide suggested questions for new users
- **Output**: Display 4 starter prompts:
  - "How do I balance fellowship and study?"
  - "Tips for 100 level engineering math?"
  - "Give me a word of encouragement."
  - "Best spots to study at Gidan Kwano?"

**FR-BUDDY-005**: Loading States
- **Priority**: Medium
- **Description**: Show loading indicator while AI generates response
- **Output**: Animated "Thinking..." message with spinner

**FR-BUDDY-006**: Error Handling
- **Priority**: High
- **Description**: Handle API failures gracefully
- **Output**: Friendly error message: "I'm having a little trouble connecting right now. Please try again in a moment!"

**FR-BUDDY-007**: Auto-Scroll
- **Priority**: Low
- **Description**: Automatically scroll to latest message
- **Processing**: Scroll to bottom on new message

### 3.4 Blog Module

#### 3.4.1 Description
A content management system for publishing articles about campus life, spiritual growth, and academic strategies.

#### 3.4.2 Functional Requirements

**FR-BLOG-001**: Blog Post Listing
- **Priority**: High
- **Description**: Display all published blog posts
- **Input**: Fetch from Supabase database
- **Output**: Grid of blog cards with:
  - Title
  - Excerpt
  - Author
  - Date
  - Category
  - Featured image
  - Read time estimate

**FR-BLOG-002**: Category Filtering
- **Priority**: Medium
- **Description**: Filter posts by category
- **Categories**: Spiritual Growth, Academic Tips, Campus Life, Testimonies
- **Output**: Filtered post list

**FR-BLOG-003**: Blog Post Detail View
- **Priority**: High
- **Description**: Display full blog post content
- **Input**: Post ID from URL parameter
- **Output**: 
  - Full article content
  - Author information
  - Publication date
  - Related posts
  - Share buttons

**FR-BLOG-004**: Search Functionality
- **Priority**: Low
- **Description**: Search blog posts by title or content
- **Input**: Search query
- **Output**: Filtered results

### 3.5 Library Module

#### 3.5.1 Description
Digital library providing access to Christian literature, study guides, and resources through a mobile application.

#### 3.5.2 Functional Requirements

**FR-LIB-001**: Mobile App Promotion
- **Priority**: High
- **Description**: Promote dedicated mobile app for library access
- **Output**: 
  - App features (offline access, notifications, fast performance)
  - Download button for Android APK
  - Installation instructions
  - Version information

**FR-LIB-002**: Installation Guide
- **Priority**: High
- **Description**: Provide step-by-step installation instructions
- **Output**: 3-step guide with visual indicators

**FR-LIB-003**: Book Catalog (Future)
- **Priority**: Medium
- **Description**: Display available books in database
- **Input**: Fetch from Supabase books table
- **Output**: Book cards with cover, title, author, category

**FR-LIB-004**: Download Management (Future)
- **Priority**: Medium
- **Description**: Enable book downloads for offline reading
- **Processing**: Use Supabase storage service

### 3.6 Sermons Module

#### 3.6.1 Description
Audio sermon library with streaming and download capabilities.

#### 3.6.2 Functional Requirements

**FR-SERM-001**: Sermon Listing
- **Priority**: High
- **Description**: Display all available sermons
- **Input**: Fetch from Supabase sermons table
- **Output**: List of sermon cards with:
  - Title
  - Preacher name and photo
  - Date
  - Category
  - Duration
  - File size

**FR-SERM-002**: Audio Player
- **Priority**: High
- **Description**: Embedded audio player for streaming
- **Input**: Audio URL from Supabase storage
- **Output**: HTML5 audio player with controls

**FR-SERM-003**: Category Filtering
- **Priority**: Medium
- **Description**: Filter sermons by category
- **Categories**: Sunday Service, Midweek, Special Programs, SOD Sessions

**FR-SERM-004**: Download Option
- **Priority**: Medium
- **Description**: Allow users to download sermons
- **Processing**: Direct download from Supabase storage

### 3.7 Units Module

#### 3.7.1 Description
Information system for fellowship service units, enabling members to discover and join units.

#### 3.7.2 Functional Requirements

**FR-UNIT-001**: Units Overview
- **Priority**: High
- **Description**: Display all 10 service units
- **Output**: Grid of unit cards with:
  - Unit name
  - Icon
  - Brief description
  - Featured image
  - Color-coded design

**FR-UNIT-002**: Unit Details
- **Priority**: High
- **Description**: Detailed information about each unit
- **Input**: Unit ID from URL
- **Output**: 
  - Long description
  - Activities list
  - Meeting schedule
  - Requirements
  - Contact information

**FR-UNIT-003**: Units Data
- **Priority**: High
- **Units**: 
  1. Drama Unit
  2. Ushering Unit
  3. Organizing Unit
  4. Maintenance Unit
  5. Music Unit
  6. Media & Technical
  7. Publicity Unit
  8. Evangelism Unit
  9. Intercessory Unit
  10. Hospitality & Welfare

**FR-UNIT-004**: Registration (Future)
- **Priority**: Low
- **Description**: Enable online unit registration
- **Processing**: Submit to Supabase with user authentication


### 3.8 School of Destiny (SOD) Module

#### 3.8.1 Description
Program management system for the intensive 14-day spiritual training program, including registration and countdown features.

#### 3.8.2 Functional Requirements

**FR-SOD-001**: Program Landing Page
- **Priority**: High
- **Description**: Immersive landing page with program information
- **Output**: 
  - Hero section with dramatic imagery
  - Program description
  - Countdown timer
  - Call-to-action buttons

**FR-SOD-002**: Countdown Timer
- **Priority**: High
- **Description**: Real-time countdown to program start
- **Processing**: Calculate days, hours, minutes, seconds
- **Output**: 4-panel display with animated numbers
- **Update Frequency**: Every second

**FR-SOD-003**: Program Information
- **Priority**: High
- **Description**: Detailed program expectations
- **Output**: 
  - Preparation steps
  - What to expect sections
  - Testimonials from past participants
  - Program curriculum overview

**FR-SOD-004**: Registration Waitlist
- **Priority**: High
- **Description**: Collect registrations for limited slots
- **Input**: User information (name, email, level, phone)
- **Processing**: Store in Supabase with authentication
- **Output**: Confirmation message
- **Capacity**: 500 students

**FR-SOD-005**: Notification Signup
- **Priority**: Medium
- **Description**: Allow users to opt-in for program updates
- **Processing**: Store email for notification list

### 3.9 Activities & Events Module

#### 3.9.1 Description
Calendar and information system for fellowship activities and events.

#### 3.9.2 Functional Requirements

**FR-ACT-001**: Events Listing
- **Priority**: High
- **Description**: Display upcoming and past events
- **Input**: Fetch from Supabase events table
- **Output**: Event cards with:
  - Title
  - Date and time
  - Location
  - Type (workshop, gathering, seminar)
  - Description
  - Featured image

**FR-ACT-002**: Event Details
- **Priority**: High
- **Description**: Detailed view of individual events
- **Input**: Event ID from URL
- **Output**: Full event information with registration option

**FR-ACT-003**: Event Type Filtering
- **Priority**: Medium
- **Description**: Filter events by type
- **Types**: Workshops, Gatherings, Seminars

**FR-ACT-004**: Calendar View (Future)
- **Priority**: Low
- **Description**: Calendar interface for event browsing

### 3.10 About & Contact Module

#### 3.10.1 Description
Information about FCS Futminna, team members, and contact channels.

#### 3.10.2 Functional Requirements

**FR-ABOUT-001**: Mission & Values
- **Priority**: High
- **Description**: Display fellowship mission and core values
- **Output**: 
  - Academic Excellence
  - Strong Community
  - Safe Environment

**FR-ABOUT-002**: Team Directory
- **Priority**: High
- **Description**: Display 24 leadership team members
- **Output**: Grid of member cards with:
  - Photo
  - Name
  - Role/Position
  - Grayscale to color hover effect

**FR-ABOUT-003**: History Section
- **Priority**: Medium
- **Description**: Fellowship history and milestones
- **Output**: Timeline or narrative format

**FR-CONTACT-001**: Contact Form
- **Priority**: High
- **Description**: Enable users to send messages
- **Input**: Name, email, subject, message
- **Processing**: Send via email service or store in database
- **Output**: Confirmation message

**FR-CONTACT-002**: Contact Information
- **Priority**: High
- **Description**: Display official contact channels
- **Output**: 
  - Email: pr@fcsfutminna.edu
  - Social media links
  - Physical location

### 3.11 Gallery Module

#### 3.11.1 Description
Photo gallery showcasing fellowship events and activities.

#### 3.11.2 Functional Requirements

**FR-GAL-001**: Photo Grid
- **Priority**: Medium
- **Description**: Display photos in responsive grid
- **Input**: Fetch from Supabase storage
- **Output**: Masonry or grid layout

**FR-GAL-002**: Lightbox View
- **Priority**: Medium
- **Description**: Full-screen photo viewing
- **Input**: Click on photo
- **Output**: Modal with navigation

**FR-GAL-003**: Album Organization
- **Priority**: Low
- **Description**: Organize photos by event/album

### 3.12 Authentication Module

#### 3.12.1 Description
User authentication system using Supabase Auth for secure access to personalized features.

#### 3.12.2 Functional Requirements

**FR-AUTH-001**: User Registration
- **Priority**: High
- **Description**: Create new user accounts
- **Input**: Email, password, full name
- **Processing**: Supabase Auth signup
- **Output**: User account with email verification
- **Validation**: 
  - Email format validation
  - Password minimum 8 characters
  - Unique email check

**FR-AUTH-002**: User Login
- **Priority**: High
- **Description**: Authenticate existing users
- **Input**: Email and password
- **Processing**: Supabase Auth signInWithPassword
- **Output**: Session token and user object
- **Error Handling**: Invalid credentials message

**FR-AUTH-003**: User Logout
- **Priority**: High
- **Description**: End user session
- **Processing**: Supabase Auth signOut
- **Output**: Clear session and redirect to home

**FR-AUTH-004**: Session Management
- **Priority**: High
- **Description**: Maintain user session across page reloads
- **Processing**: Check for existing session on app load
- **Output**: Restore user state if valid session exists

**FR-AUTH-005**: Protected Routes (Future)
- **Priority**: Medium
- **Description**: Restrict access to authenticated users only
- **Routes**: Profile, Saved Content, Registration Forms

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements
- **Responsive Design**: Must adapt to screen sizes from 320px to 2560px
- **Dark Mode**: Full dark mode support with system preference detection
- **Accessibility**: WCAG 2.1 Level AA compliance
- **Loading States**: Visual feedback for all async operations
- **Error States**: User-friendly error messages
- **Navigation**: Persistent navigation bar with mobile hamburger menu

#### 4.1.2 Design System
- **Primary Color**: #00A36C (Emerald green)
- **Secondary Color**: #1e1b4b (Indigo-900)
- **Typography**: 
  - Headings: Poppins (600, 700)
  - Body: Inter (400, 500, 600, 700)
- **Border Radius**: Rounded corners (8px-64px range)
- **Shadows**: Layered shadows for depth
- **Animations**: Smooth transitions (300ms-500ms)

#### 4.1.3 Component Library
- Cards with hover effects
- Buttons (primary, secondary, outline)
- Form inputs with validation
- Modal dialogs
- Toast notifications
- Progress indicators
- Skeleton loaders

### 4.2 Hardware Interfaces
- **Not Applicable**: Web-based application with no direct hardware interaction

### 4.3 Software Interfaces

#### 4.3.1 Google Gemini AI API
- **Purpose**: Generate practice questions and conversational responses
- **Version**: Gemini 3 Flash Preview
- **Protocol**: HTTPS REST API
- **Authentication**: API Key
- **Data Format**: JSON
- **Rate Limits**: As per Google Cloud quotas
- **Error Handling**: Fallback to default content on failure

#### 4.3.2 Supabase Backend
- **Purpose**: Database, authentication, and file storage
- **Version**: 2.39.0
- **Components**:
  - PostgreSQL Database
  - Auth Service
  - Storage Service
  - Realtime Subscriptions
- **Protocol**: HTTPS REST API and WebSocket
- **Authentication**: JWT tokens
- **Data Format**: JSON

#### 4.3.3 External CDNs
- **Tailwind CSS**: Via CDN for styling
- **Google Fonts**: Inter and Poppins fonts
- **Unsplash**: Stock images for content
- **Lucide React**: Icon library

### 4.4 Communication Interfaces

#### 4.4.1 HTTP/HTTPS
- All API communications over HTTPS
- RESTful API architecture
- JSON data exchange format

#### 4.4.2 WebSocket (Future)
- Real-time updates for chat features
- Live event notifications

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

**NFR-PERF-001**: Page Load Time
- **Requirement**: Initial page load < 3 seconds on 3G connection
- **Measurement**: Lighthouse performance score > 80

**NFR-PERF-002**: API Response Time
- **Requirement**: Database queries < 500ms
- **Requirement**: AI generation < 10 seconds

**NFR-PERF-003**: Concurrent Users
- **Requirement**: Support 1000 concurrent users
- **Scaling**: Horizontal scaling via Supabase

**NFR-PERF-004**: Asset Optimization
- **Requirement**: Images optimized and lazy-loaded
- **Requirement**: Code splitting for route-based loading

### 5.2 Security Requirements

**NFR-SEC-001**: Data Encryption
- **Requirement**: All data in transit encrypted via HTTPS/TLS 1.3
- **Requirement**: Passwords hashed using bcrypt

**NFR-SEC-002**: Authentication
- **Requirement**: JWT-based authentication with expiration
- **Requirement**: Secure session management

**NFR-SEC-003**: API Key Protection
- **Requirement**: API keys stored in environment variables
- **Requirement**: No sensitive data in client-side code

**NFR-SEC-004**: Input Validation
- **Requirement**: All user inputs sanitized
- **Requirement**: SQL injection prevention via parameterized queries

**NFR-SEC-005**: Row Level Security
- **Requirement**: Database RLS policies enforced
- **Requirement**: Users can only access authorized data

### 5.3 Reliability Requirements

**NFR-REL-001**: Uptime
- **Requirement**: 99.5% uptime (excluding planned maintenance)
- **Measurement**: Monthly uptime monitoring

**NFR-REL-002**: Error Recovery
- **Requirement**: Graceful degradation on API failures
- **Requirement**: Automatic retry for failed requests (max 3 attempts)

**NFR-REL-003**: Data Backup
- **Requirement**: Daily automated backups via Supabase
- **Requirement**: Point-in-time recovery capability

### 5.4 Usability Requirements

**NFR-USE-001**: Learnability
- **Requirement**: New users can navigate core features within 5 minutes
- **Requirement**: Intuitive UI with clear labels

**NFR-USE-002**: Accessibility
- **Requirement**: Keyboard navigation support
- **Requirement**: Screen reader compatibility
- **Requirement**: Sufficient color contrast (4.5:1 minimum)

**NFR-USE-003**: Mobile Responsiveness
- **Requirement**: Full functionality on mobile devices
- **Requirement**: Touch-friendly interface (44px minimum touch targets)

### 5.5 Maintainability Requirements

**NFR-MAIN-001**: Code Quality
- **Requirement**: TypeScript for type safety
- **Requirement**: Component-based architecture
- **Requirement**: Consistent code formatting

**NFR-MAIN-002**: Documentation
- **Requirement**: Inline code comments for complex logic
- **Requirement**: README with setup instructions
- **Requirement**: API documentation

**NFR-MAIN-003**: Version Control
- **Requirement**: Git-based version control
- **Requirement**: Semantic versioning

### 5.6 Portability Requirements

**NFR-PORT-001**: Browser Compatibility
- **Requirement**: Support Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Requirement**: Progressive enhancement approach

**NFR-PORT-002**: Device Compatibility
- **Requirement**: Desktop, tablet, and mobile support
- **Requirement**: Responsive breakpoints at 640px, 768px, 1024px, 1280px


---

## 6. Technical Architecture

### 6.1 System Architecture

#### 6.1.1 Architecture Pattern
**Single Page Application (SPA) with Backend-as-a-Service (BaaS)**

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │   React 19.2.3 + TypeScript 5.8.2                │  │
│  │   - Component-based UI                            │  │
│  │   - React Router for navigation                   │  │
│  │   - State management (useState, useEffect)        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTPS
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Supabase   │  │  Gemini AI   │  │  External    │  │
│  │   Backend    │  │   Service    │  │   CDNs       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   Storage    │  │    Auth      │  │
│  │   Database   │  │   Buckets    │  │   System     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Technology Stack

#### 6.2.1 Frontend Technologies
- **Framework**: React 19.2.3
- **Language**: TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 7.12.0
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React 0.562.0
- **AI Integration**: @google/genai 1.38.0
- **Backend Client**: @supabase/supabase-js 2.39.0

#### 6.2.2 Backend Technologies
- **BaaS Platform**: Supabase
- **Database**: PostgreSQL 15+
- **Authentication**: Supabase Auth (JWT-based)
- **Storage**: Supabase Storage (S3-compatible)
- **API**: Auto-generated REST API

#### 6.2.3 AI Services
- **Provider**: Google Gemini AI
- **Model**: gemini-3-flash-preview
- **Use Cases**: 
  - Question generation
  - Conversational AI
  - Content generation

#### 6.2.4 Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Code Editor**: VS Code (recommended)
- **Linting**: ESLint (TypeScript)
- **Type Checking**: TypeScript compiler

### 6.3 Component Architecture

#### 6.3.1 Core Components
```
App.tsx (Root)
├── Navbar (Global)
├── Routes
│   ├── Home
│   ├── About
│   ├── Blog
│   │   └── BlogPostDetail
│   ├── Simulator
│   ├── StudyBuddy
│   ├── Library
│   ├── Sermons
│   ├── Units
│   │   └── UnitDetail
│   ├── Activities
│   │   └── ActivityDetail
│   ├── SOD
│   │   ├── SODRegister
│   │   └── SODApply
│   ├── Gallery
│   └── Contact
└── Footer (Global)
```

#### 6.3.2 Shared Components
- FeatureCard
- TestQuestion
- ChatMessage
- EventCard
- UnitCard
- BlogCard
- SermonCard

#### 6.3.3 Service Modules
```
services/
├── geminiService.ts (AI integration)
├── authService.ts (Authentication)
├── dbService.ts (Database operations)
└── storageService.ts (File management)
```

### 6.4 Data Flow

#### 6.4.1 Authentication Flow
```
1. User enters credentials
2. authService.signIn() called
3. Supabase Auth validates credentials
4. JWT token returned and stored
5. User state updated in React
6. Protected routes become accessible
```

#### 6.4.2 AI Question Generation Flow
```
1. User selects subject and level
2. generatePracticeQuestions() called
3. Request sent to Gemini API with schema
4. AI generates 5 questions with explanations
5. Response parsed and validated
6. Questions displayed in test interface
```

#### 6.4.3 Content Retrieval Flow
```
1. Component mounts
2. dbService.get*() called
3. Supabase client queries database
4. RLS policies applied
5. Data returned as JSON
6. State updated and UI rendered
```

### 6.5 State Management

#### 6.5.1 Local State (useState)
- Component-specific UI state
- Form inputs
- Modal visibility
- Loading states

#### 6.5.2 Session State (localStorage)
- Dark mode preference
- User session token (via Supabase)
- Cached content for offline access

#### 6.5.3 Global State (Context - Future)
- User authentication state
- Theme preferences
- Notification settings

### 6.6 Routing Strategy

#### 6.6.1 Hash-Based Routing
- **Implementation**: HashRouter from React Router
- **Reason**: Compatibility with static hosting
- **Format**: `/#/path`

#### 6.6.2 Route Structure
```
/ - Home
/about - About FCS
/blog - Blog listing
/blog/:postId - Blog post detail
/simulator - E-Test Simulator
/study-buddy - AI Study Buddy
/library - E-Library
/sermons - Audio Sermons
/units - Service Units
/units/:unitId - Unit detail
/activities - Events & Activities
/activities/:activityId - Activity detail
/sod - School of Destiny
/sod/register - SOD Registration
/gallery - Photo Gallery
/contact - Contact Us
```

### 6.7 API Integration

#### 6.7.1 Gemini AI API
**Endpoint**: Google Gemini API  
**Authentication**: API Key in environment variable  
**Request Format**:
```typescript
{
  model: 'gemini-3-flash-preview',
  contents: string,
  config: {
    responseMimeType: 'application/json',
    responseSchema: SchemaObject
  }
}
```

#### 6.7.2 Supabase API
**Base URL**: Project-specific Supabase URL  
**Authentication**: Anon key + JWT for authenticated requests  
**Endpoints**:
- `/rest/v1/blog_posts` - Blog operations
- `/rest/v1/sermons` - Sermon operations
- `/rest/v1/books` - Library operations
- `/rest/v1/events` - Event operations
- `/auth/v1/signup` - User registration
- `/auth/v1/token` - User login
- `/storage/v1/object` - File operations

### 6.8 Environment Configuration

#### 6.8.1 Environment Variables
```
GEMINI_API_KEY=<Google Gemini API Key>
VITE_SUPABASE_URL=<Supabase Project URL>
VITE_SUPABASE_ANON_KEY=<Supabase Anonymous Key>
```

#### 6.8.2 Build Configuration
**Development**:
```bash
npm run dev
# Starts Vite dev server on http://localhost:5173
```

**Production**:
```bash
npm run build
# Generates optimized static files in /dist
```

---

## 7. Data Requirements

### 7.1 Database Schema

#### 7.1.1 blog_posts Table
```sql
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
```

**Columns**:
- `id`: Unique identifier (UUID)
- `title`: Blog post title (max 200 chars)
- `excerpt`: Short summary (max 300 chars)
- `content`: Full article content (Markdown supported)
- `author`: Author name
- `date`: Publication date
- `category`: Post category (Spiritual Growth, Academic Tips, etc.)
- `image_url`: Featured image URL
- `created_at`: Record creation timestamp

**Indexes**: 
- Primary key on `id`
- Index on `date` for sorting
- Index on `category` for filtering

#### 7.1.2 sermons Table
```sql
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
```

**Columns**:
- `id`: Unique identifier
- `title`: Sermon title
- `preacher`: Preacher name
- `date`: Sermon date
- `category`: Sermon category (Sunday Service, Midweek, etc.)
- `duration`: Audio duration (e.g., "45:30")
- `file_size`: File size (e.g., "25.3 MB")
- `audio_url`: URL to audio file in storage
- `preacher_img`: Preacher photo URL
- `created_at`: Record creation timestamp

#### 7.1.3 books Table
```sql
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
```

**Columns**:
- `id`: Unique identifier
- `title`: Book title
- `author`: Book author
- `description`: Book description
- `category`: Book category (Theology, Devotional, etc.)
- `cover_url`: Book cover image URL
- `download_url`: PDF download URL
- `created_at`: Record creation timestamp

#### 7.1.4 events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('workshop', 'gathering', 'seminar')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Columns**:
- `id`: Unique identifier
- `title`: Event title
- `date`: Event date and time
- `location`: Event location
- `description`: Event description
- `type`: Event type (enum: workshop, gathering, seminar)
- `created_at`: Record creation timestamp

#### 7.1.5 users Table (Supabase Auth)
**Managed by Supabase Auth**:
- `id`: UUID
- `email`: User email
- `encrypted_password`: Hashed password
- `email_confirmed_at`: Email verification timestamp
- `created_at`: Account creation timestamp
- `user_metadata`: JSON field for custom data (full_name, etc.)

### 7.2 Storage Buckets

#### 7.2.1 sermons Bucket
- **Purpose**: Store audio sermon files
- **File Types**: MP3, M4A
- **Access**: Public read
- **Max File Size**: 100 MB
- **Naming Convention**: `YYYY-MM-DD_sermon-title.mp3`

#### 7.2.2 books Bucket
- **Purpose**: Store PDF books and study materials
- **File Types**: PDF
- **Access**: Public read
- **Max File Size**: 50 MB
- **Naming Convention**: `category/book-title.pdf`

#### 7.2.3 images Bucket
- **Purpose**: Store blog images, event photos, gallery
- **File Types**: JPG, PNG, WebP
- **Access**: Public read
- **Max File Size**: 10 MB
- **Naming Convention**: `type/YYYY-MM-DD_description.jpg`

### 7.3 Data Types (TypeScript)

```typescript
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
}

interface Sermon {
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

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverUrl: string;
  downloadUrl?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'workshop' | 'gathering' | 'seminar';
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TestSession {
  id: string;
  subject: string;
  questions: Question[];
  score: number;
  completed: boolean;
  timeSpent: number;
}
```

### 7.4 Data Validation Rules

#### 7.4.1 Input Validation
- **Email**: RFC 5322 compliant format
- **Password**: Minimum 8 characters, at least one letter and one number
- **Text Fields**: Maximum lengths enforced
- **URLs**: Valid URL format
- **Dates**: ISO 8601 format

#### 7.4.2 Business Rules
- Blog posts must have title, content, and author
- Sermons must have audio file before publishing
- Events must have future dates
- User emails must be unique
- Categories must match predefined list

### 7.5 Data Migration Strategy

#### 7.5.1 Initial Data Population
- Sample blog posts for demonstration
- Placeholder sermon entries
- Unit information (static data)
- Team member profiles

#### 7.5.2 Future Migrations
- Version-controlled SQL migration files
- Rollback procedures for each migration
- Data backup before migrations

---

## 8. Security Requirements

### 8.1 Authentication Security

**SEC-AUTH-001**: Password Security
- Passwords hashed using bcrypt (Supabase default)
- Minimum password strength enforced
- Password reset via email verification

**SEC-AUTH-002**: Session Management
- JWT tokens with expiration (1 hour default)
- Refresh token rotation
- Automatic logout on token expiration

**SEC-AUTH-003**: Email Verification
- Email confirmation required for new accounts
- Verification link expires after 24 hours

### 8.2 Authorization Security

**SEC-AUTHZ-001**: Row Level Security (RLS)
- All tables have RLS enabled
- Public read access for content tables
- Write access restricted to authenticated users
- Admin-only access for content management

**SEC-AUTHZ-002**: API Key Protection
- API keys stored in environment variables
- Never exposed in client-side code
- Separate keys for development and production

### 8.3 Data Security

**SEC-DATA-001**: Encryption
- All data in transit encrypted via HTTPS/TLS 1.3
- Database encryption at rest (Supabase default)

**SEC-DATA-002**: Input Sanitization
- All user inputs sanitized to prevent XSS
- SQL injection prevention via parameterized queries
- File upload validation (type, size, content)

**SEC-DATA-003**: Data Privacy
- No collection of unnecessary personal data
- GDPR compliance for EU users
- User data deletion on request

### 8.4 Application Security

**SEC-APP-001**: CORS Configuration
- Restrict API access to authorized domains
- Proper CORS headers configured

**SEC-APP-002**: Rate Limiting
- API rate limits enforced
- Prevent brute force attacks
- DDoS protection via Supabase

**SEC-APP-003**: Error Handling
- No sensitive information in error messages
- Generic error messages to users
- Detailed errors logged server-side only

---

## 9. Appendices

### 9.1 Glossary

- **BaaS**: Backend as a Service
- **JWT**: JSON Web Token
- **RLS**: Row Level Security
- **SPA**: Single Page Application
- **PWA**: Progressive Web Application
- **CORS**: Cross-Origin Resource Sharing
- **XSS**: Cross-Site Scripting
- **API**: Application Programming Interface
- **CDN**: Content Delivery Network
- **UUID**: Universally Unique Identifier

### 9.2 Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | January 2025 | Development Team | Initial SRS document |

### 9.3 Future Enhancements

#### Phase 2 Features
- User profiles with saved content
- Push notifications for events
- Advanced search with filters
- Social sharing integration
- Comment system for blog posts
- Live streaming for services
- Mobile app (React Native)

#### Phase 3 Features
- Admin dashboard for content management
- Analytics and reporting
- Payment integration for donations
- Mentorship matching system
- Prayer request management
- Attendance tracking
- Certificate generation for SOD graduates

### 9.4 Known Limitations

- AI question generation requires internet connection
- Limited to 5 questions per test session (API cost optimization)
- No offline mode for AI features
- Mobile app only available for Android (iOS in development)
- Email notifications require third-party service integration

### 9.5 Success Metrics

#### User Engagement
- 1000+ monthly active users
- Average session duration > 5 minutes
- 60% return user rate

#### Academic Impact
- 500+ test simulations completed monthly
- 70% average test scores
- Positive feedback from 80% of users

#### Community Growth
- 100+ new registrations per semester
- 50+ active unit members
- 200+ SOD registrations annually

---

**END OF DOCUMENT**

