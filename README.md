# Sentivox Backend

Backend API server for Sentivox - AI-Powered Interview Analysis Platform.

## Features

- Express.js REST API
- MongoDB with Mongoose
- JWT authentication with role-based access control
- AI-powered interview analysis (OpenAI & Google Gemini)
- Audio transcription and sentiment analysis
- Resume parsing and matching
- PDF report generation
- Email notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
FRONTEND_URL=your_frontend_url
NODE_ENV=production
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Deployment

This backend is configured for deployment on Render. Make sure to set all environment variables in your Render dashboard.

## API Endpoints

- `/api/auth/*` - Authentication routes
- `/api/interviews/*` - Interview management
- `/api/analysis/*` - Analysis endpoints
- `/api/candidates/*` - Candidate management
- `/api/recruiters/*` - Recruiter management

