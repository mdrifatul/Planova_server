# AI Service Setup Guide

The Planova AI Service is now integrated and ready to help users discover events and get recommendations. Follow these steps to enable the full functionality:

## Environment Configuration

Add the following environment variable to your `.env` file:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### How to Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Select your project (or create a new one)
4. Copy the generated API key
5. Paste it in your `.env` file

## Available Endpoints

### 1. Search Suggestions

**GET** `/api/ai/search-suggestions?q=event_name`

Returns search suggestions for events based on the query string.

**Query Parameters:**

- `q` (required): Search query string

**Response:**

```json
{
  "success": true,
  "message": "Search suggestions retrieved successfully",
  "data": ["Tech Conference", "Web Development Meetup", "Startup Pitch"]
}
```

### 2. Trending Events

**GET** `/api/ai/trending`

Returns the most recent and active events on the platform.

**Response:**

```json
{
  "success": true,
  "message": "Trending events retrieved successfully",
  "data": [
    {
      "id": "event123",
      "title": "React Meetup",
      "date": "2026-05-15T10:00:00Z",
      "fee": 0,
      "venue": "Tech Hub Downtown",
      "category": { "id": "cat1", "name": "Technology" },
      "organizer": { "name": "Tech Community", "image": "..." },
      "_count": { "participations": 45 }
    }
  ]
}
```

### 3. Personalized Recommendations

**GET** `/api/ai/recommendations`

Returns event recommendations based on user's participation history (optional authentication).

**Headers:**

- Authorization header (optional): If provided, recommendations are based on user's past events

**Response:**

```json
{
  "success": true,
  "message": "Personalized recommendations retrieved successfully",
  "data": [
    /* array of event objects */
  ]
}
```

### 4. AI Chat Assistant

**POST** `/api/ai/chat`

Chat with the AI assistant about events, recommendations, and event-related queries.

**Request Body:**

```json
{
  "message": "What are some good tech events happening soon?"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Chat response generated successfully",
  "data": {
    "reply": "Based on our current events, I found several great tech events including React Meetups, Web Development Workshops, and AI Conference. Would you like more details about any of these?"
  }
}
```

## Error Handling

All AI endpoints include comprehensive error handling:

- **400 Bad Request**: Invalid parameters or missing required fields
- **401 Unauthorized**: Authentication issues (for protected endpoints)
- **500 Internal Server Error**: Server-side errors including Gemini API connectivity issues

## Testing

You can test the endpoints using tools like:

- **Postman**: Import the endpoints and test with different parameters
- **curl**: Use command line to test endpoints
- **Frontend Client**: Integrate the endpoints into your React/Vue app

Example curl command:

```bash
curl -X GET "http://localhost:3000/api/ai/search-suggestions?q=tech"
curl -X GET "http://localhost:3000/api/ai/trending"
curl -X POST "http://localhost:3000/api/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me tech events"}'
```

## Features

- **Smart Search**: Case-insensitive search across event titles, descriptions, and categories
- **Personalized Recommendations**: Based on user's participation history
- **Trending Events**: Real-time list of active events
- **AI Assistant**: Powered by Google's Gemini API for intelligent event discovery and recommendations
- **Error Handling**: User-friendly error messages
- **Performance**: Optimized database queries with indexing and selective field selection

## Troubleshooting

1. **"Gemini API key is missing"**
   - Verify GEMINI_API_KEY is set in .env
   - Restart the server after adding the key

2. **Chat endpoint returns generic error**
   - Check your Gemini API key validity
   - Ensure API key has appropriate permissions
   - Check network connectivity to Google APIs

3. **Recommendations are empty**
   - Ensure user has participated in some events
   - Check if any events are marked as active in the database
