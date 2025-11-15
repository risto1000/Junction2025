# ApprenticeCircles+ — Interactive Prototype Guide

## Overview
This is a high-fidelity, fully interactive iPhone 18 Max prototype for **ApprenticeCircles+**, a voice-first, intergenerational social and micro-apprenticeship platform. The app connects seniors and youth through meaningful activities, mentorship opportunities, and family safety features.

---

## Design System

### Color Palette (Accessible)
- **Primary (Warm Teal)**: `#0A8F86` — Buttons, accents, active states
- **Accent (Soft Coral)**: `#FF7A6C` — Highlights, secondary actions
- **Background (Off-white)**: `#FCFBF9` — Main app background
- **Card Background**: `#FFFFFF` — Card surfaces
- **Text Primary**: `#0B1A1A` — Main text
- **Text Secondary**: `#5D6A6A` — Supporting text, labels
- **Error/Warning**: `#D64545` — Alerts and warnings

### Typography
- **Headings**: 24px/20px/17px (h1/h2/h3)
- **Body**: 17px/15px/13px
- Based on iOS system font guidelines

### Layout
- **Device**: iPhone 18 Max, portrait orientation
- **Safe Areas**: iOS standard (59px top, 34px bottom)
- **Spacing**: 16px baseline grid
- **Touch Targets**: Minimum 44×44pt (accessibility)

---

## Core Screens

### 1. Splash & Onboarding
**Flow**: Start → Voice/Manual Onboarding → Profile Creation

**Features**:
- Choice between voice onboarding (call simulation) or manual input
- Voice onboarding demonstrates 5-step process:
  - Interests
  - Career highlights
  - Hobbies
  - Availability
  - Safety preferences
- Auto-transcription with manual edit capability
- Creates profile with editable fields

**Interactions**:
- Click "Call me now" → Opens voice modal
- Click "Type details" → Opens profile edit mode

---

### 2. Profile Tab
**Purpose**: View and edit user profile, manage apprenticeship offerings

**Sections**:
- Profile card with avatar, name, tagline, location
- Career highlights with company badges
- Achievement badges
- Hobbies & routines (editable chips)
- Micro-apprenticeship offer toggle
- Safety & sharing controls
- Voice profile re-recording option

**Interactions**:
- Click "Edit" button → Enter edit mode
- Toggle apprenticeship switch → Enable/disable mentorship offering
- Click "My Events" → Navigate to Host Dashboard
- Click safety toggles → Update family sharing preferences
- Click "Save Changes" → Commit profile updates

---

### 3. Events Tab (Default Landing)
**Purpose**: Discover and RSVP to events

**Features**:
- Search bar with voice search option
- Filter options (distance, time, type, intergenerational)
- Featured event carousel with large cards
- Event feed with match scores
- Event cards show:
  - Banner image
  - Title, organizer, time, location
  - Distance, participants, capacity
  - Favorite heart icon
  - RSVP button

**Interactions**:
- Click search bar → Search events
- Click filters icon → Show/hide filter options
- Click event card → Open event detail
- Click heart icon → Add/remove from favorites
- Click floating mic button → Voice search

---

### 4. Event Detail Screen
**Purpose**: View full event information and RSVP

**Features**:
- Hero image with badges (match score, micro-apprenticeship)
- Full event details (date, time, location, capacity)
- Map thumbnail (tappable)
- Accessibility notes
- Organizer profile card
- Message organizer button
- Host dashboard access (if you're hosting)

**Interactions**:
- Click "RSVP — I'll come" → Opens RSVP modal
- Click heart → Toggle favorite
- Click map thumbnail → Open map (simulated)
- Click "Message organizer" → Direct message
- Click "You're hosting..." → Open Host Dashboard
- After RSVP: Click "Record reflection" → Voice feedback

---

### 5. RSVP Modal
**Purpose**: Confirm attendance with optional family invitation

**Features**:
- Event summary card
- "Invite family to join" checkbox
- What happens next (reminders, calendar, check-ins)
- One-tap confirm

**Interactions**:
- Click checkbox → Toggle family invitation
- Click "Confirm RSVP" → Complete RSVP + close modal
- Shows success toast with confetti animation

---

### 6. Family Tab (FamilySphere Hub)
**Purpose**: Family activity monitoring and communication

**Features**:
- Family member list with roles
- Activity timeline (attended, hosted, checked-in)
- Family chat preview
- Add family member button
- Safety check-in status

**Interactions**:
- Click "Add" → Open invite modal
- Click family chat card → Open full chat
- Click activity item → View event or member profile
- In chat: Type/voice messages, share events
- Click "Share an event" → Select event to share

---

### 7. Favorites Tab
**Purpose**: View and manage saved events

**Features**:
- Algorithmic suggestions banner
- Grid of saved event cards
- Remove and share options per event
- Empty state with CTA

**Interactions**:
- Click event card → Open event detail
- Click "Remove" → Remove from favorites
- Click "Share to family" → Share in family chat
- Click "View suggestions" → See recommended events

---

### 8. Host Dashboard
**Purpose**: Manage hosted events and attendees

**Features**:
- Quick stats (confirmed, checked-in, spots left)
- Event details summary
- Attendee list with status badges
- Message all / Send update buttons
- Check-in mode toggle

**Interactions**:
- Click "Message all" → Group message
- Click attendee → View profile or message individually
- Click "Enable check-in mode" → Activate check-in
- Click back → Return to event detail

---

## Key Interactive Flows

### Flow 1: Voice Onboarding → Profile Creation
1. Splash screen → Click "Call me now"
2. Voice modal opens with animated waveform
3. Auto-progresses through 5 steps with transcripts
4. Review screen with editable fields
5. Click "Create profile" → Profile screen with complete data

### Flow 2: Discover → RSVP → Family Calendar
1. Events tab → Browse event cards
2. Click event → Event detail screen
3. Click "RSVP — I'll come" → RSVP modal
4. Check "Invite family to join"
5. Click "Confirm RSVP" → Success toast
6. Event added to calendar, family notified

### Flow 3: Family Interaction
1. Family tab → View activity timeline
2. Click family chat card → Open chat
3. Click "Share an event" → Event selector
4. Select event → Event card appears in chat
5. Family members can tap to view/RSVP

### Flow 4: Offer Micro-Apprenticeship
1. Profile tab → Scroll to apprenticeship section
2. Toggle switch ON
3. Edit offer details (duration, capacity, etc.)
4. Click "Save Changes" → Offer published
5. Appears in Events feed with "Mentorship" badge

### Flow 5: Host Event Management
1. Event detail (your event) → Click "You're hosting..."
2. Host Dashboard opens
3. View attendee list with statuses
4. Click "Message all" → Send update to attendees
5. Click "Enable check-in mode" → Attendees can check in

---

## Accessibility Features

### Visual
- Large touch targets (44×44pt minimum)
- High contrast color scheme
- Clear, readable typography
- Color-blind safe palette

### Voice Affordances
- Floating mic button on main screens
- Voice search on Events tab
- Voice onboarding option
- Voice message in family chat
- Voice reflection after events

### Inclusive Design
- Adult-respectful language (no patronizing tone)
- Intergenerational friendly filters
- Safety controls with granular permissions
- Family sharing with privacy toggles

---

## Sample Content

### Users
- **Jari Koskinen** (68, Senior-host) — Retired carpenter, woodworking mentor
- **Mirka Lahti** (Youth-host) — Recent grad, seeking mentorship
- **Anna Virtanen** (Community) — Community organizer

### Events
1. **Morning Duck Walk** — Kaivopuisto, 09:30 (92% match)
2. **Intro to Chair Repair** — Workshop, 14:00 (Micro-apprenticeship)
3. **Intergenerational Story Circle** — Library, 18:00
4. **Cycling Mentorship Coffee** — Cafe, 11:00
5. **Weekend Knitting Circle** — Community Center, 15:00 (84% match)

### Family Members
- Jari Koskinen (You)
- Anna Koskinen (Daughter)
- Mikko Koskinen (Son)

---

## Technical Notes

### Responsive Design
- Fixed max-width: 430px (iPhone 18 Max)
- Portrait orientation optimized
- iOS safe area padding included

### Animations
- Card lift on tap (scale 0.98)
- Smooth modal transitions (slide-up)
- Toast notifications (slide-down)
- Waveform animation (voice UI)
- Confetti on RSVP success (simulated)

### State Management
- React hooks for local state
- Persistent favorites array
- RSVP tracking
- Profile editing mode
- Modal visibility

### Assets Required
- User avatars (diverse ages/ethnicities)
- Event photos (nature, workshops, cafes)
- Map thumbnails (placeholder)
- Icon set (Lucide React)

---

## Developer Handoff

### Core APIs Assumed
1. **Voice Transcript API** — Real-time speech-to-text
2. **Matching Engine** — Algorithm for event recommendations
3. **Calendar Integration** — iOS Calendar API
4. **Map Embed** — Apple Maps or Google Maps
5. **Push Notifications** — Reminders and family updates
6. **Real-time Chat** — WebSocket for family messages

### Spacing System
- Base: 16px
- Small: 8px (0.5rem)
- Medium: 16px (1rem)
- Large: 24px (1.5rem)
- XL: 32px (2rem)

### Safe Area Insets
- Top: 59px (status bar + notch)
- Bottom: 34px (home indicator)
- Bottom Nav Height: 56px + 34px safe area

---

## Testing the Prototype

### Recommended Test Flows
1. **New User**: Splash → Voice onboarding → Profile → Events → RSVP
2. **Discover**: Events → Filter → Event detail → Favorite → View Favorites
3. **Family**: Family tab → Chat → Share event → View timeline
4. **Host**: Profile → My Events → Host Dashboard → Message attendees
5. **Edit Profile**: Profile → Edit → Change hobbies → Save

### Clickable Elements
- All buttons and cards are interactive
- Bottom navigation switches tabs
- Modals can be opened and closed
- Toggles and checkboxes work
- Forms accept input (simulated submission)

---

## Design Philosophy

### Core Principles
1. **Voice-First**: Every major action has a voice alternative
2. **Low-Friction**: One-tap actions, minimal steps
3. **Respectful**: Adult language, no infantilization
4. **Inclusive**: Intergenerational by design
5. **Safe**: Family controls, verification badges, public spaces

### Visual Language
- **Warm & Friendly**: Rounded corners, soft shadows
- **Human Photography**: Candid, authentic moments
- **Accessible Icons**: Simple, recognizable shapes
- **Calm Microcopy**: Short, clear, action-oriented

---

## Next Steps for Development

1. Integrate real voice recognition API
2. Build backend for user/event data
3. Implement real-time chat with WebSocket
4. Add calendar API integration
5. Build matching algorithm
6. Implement push notifications
7. Add map integration
8. Create admin/moderation tools
9. Build verification system
10. Add analytics and reporting

---

**Version**: 1.0  
**Device**: iPhone 18 Max (portrait)  
**Framework**: React + Tailwind CSS  
**Icons**: Lucide React  
**Design System**: Accessibility-first, iOS HIG compliant
