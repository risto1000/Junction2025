# Junction 2025

A community events platform that connects people through local events, micro-apprenticeships, and voice-powered profile creation using ElevenLabs AI.

## Features

- 🎤 **Voice-Powered Profile Creation**: Create your profile through natural conversation with ElevenLabs Conversational AI
- 📅 **Event Discovery**: Browse and discover local community events
- 👥 **Family & Community**: Connect with family members and community
- 🎓 **Micro-Apprenticeships**: Offer or find short learning opportunities
- 🗺️ **Interactive Maps**: View events on an interactive map
- ⭐ **Favorites & RSVP**: Save favorite events and RSVP to attend
- 🎯 **Smart Matching**: AI-powered event matching based on your profile

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** components
- **ElevenLabs React SDK** for voice interactions

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **Knex.js** for database queries
- **MySQL** (Cloud SQL)
- **ElevenLabs API** for conversational AI
- **Google Cloud Run** for deployment

## Project Structure

```
Junction2025/
├── backend/           # Express API server
│   ├── server.ts      # Main server file
│   ├── database.ts    # Database connection
│   ├── migrations.ts  # Database schema
│   ├── matchingService.ts  # Event matching logic
│   └── deploy.sh      # Deployment script
├── frontend/          # React application
│   ├── src/
│   │   ├── App.tsx    # Main app component
│   │   ├── components/ # React components
│   │   └── utils/     # Utility functions
│   └── vite.config.ts
└── Dockerfile         # Multi-stage Docker build
```

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL database (or Cloud SQL)
- ElevenLabs API key (for voice features)
- Google Cloud account (for deployment)

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
CLOUD_SQL_CONNECTION_NAME=your-project:region:instance

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id

# API
API_BASE_URL=http://localhost:8080
PORT=8080
NODE_ENV=development
```

### Local Development

1. **Install dependencies:**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Set up database:**

The database tables will be automatically created on first run via `migrations.ts`.

3. **Run backend:**

```bash
cd backend
npm run dev
```

4. **Run frontend:**

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:8080` (backend).

### Building for Production

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

### Docker Deployment

The project includes a multi-stage Dockerfile for containerized deployment:

```bash
docker build -t junction2025 .
docker run -p 8080:8080 junction2025
```

### Google Cloud Run Deployment

```bash
cd backend
./deploy.sh
```

## API Endpoints

### User Profile
- `GET /api/users/:id` - Get user profile
- `POST /api/users/voice-profile` - Create/update profile from voice data

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event

### ElevenLabs Integration
- `POST /api/conversations/start` - Start voice conversation
- `GET /api/conversations/signed-url` - Get signed URL for widget
- `POST /api/webhook/elevenlabs` - Webhook for conversation completion

### RSVPs & Favorites
- `POST /api/rsvps` - RSVP to an event
- `POST /api/favorites` - Add event to favorites
- `DELETE /api/favorites/:eventId` - Remove from favorites

## Voice Profile Creation

The app uses ElevenLabs Conversational AI to create user profiles through natural conversation:

1. User clicks "Record" button
2. ElevenLabs AI asks questions about:
   - Name and profession
   - Location
   - Availability
   - Hobbies and interests
   - Career highlights
3. Webhook receives conversation data
4. Profile is created/updated automatically
5. User can review and edit before saving

## Database Schema

### Users
- Profile information (name, age, tagline, location, avatar)
- Career highlights, achievements, hobbies
- Micro-apprenticeship offers

### Events
- Event details (title, description, location, time)
- Organizer information
- Capacity and RSVP tracking

### User Descriptions
- Stores conversation data from ElevenLabs webhooks
- Used for profile creation and matching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project was created for Junction 2025 hackathon.

## Support

For issues or questions, please open an issue on the repository.

