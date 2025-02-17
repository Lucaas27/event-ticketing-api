# Event Ticketing API

A TypeScript-based RESTful API for managing events and ticket sales, implementing Object-Oriented Programming principles with Express and MongoDB.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
  - [Health Check](#health-check)
  - [Events Endpoints](#events-endpoints)
- [OOP Design Principles](#oop-design-principles)
- [Error Handling](#error-handling)
- [Database Configuration](#database-configuration)
  - [MongoDB In-Memory Database](#mongodb-in-memory-database)
  - [MongoDB Connection Strategy](#mongodb-connection-strategy)
- [Future Enhancements](#future-enhancements)
- [Technologies Used](#technologies-used)

## Project Structure

```
src/
├── controllers/    # Request handlers
├── models/         # Database schemas & DTOs
├── services/       # Business logic
├── middleware/     # Express middleware
├── routes/         # API endpoints
├── utils/          # Helper functions
├── utils/          # Express server related configs
├── server.ts       # Express server related configs
├── index.ts        # Application entry point
├── requests.http   # Example of possible requests
└── app.ts          # Application related configs

```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

## API Routes

### Health Check

```http
GET /
# Application health
```

### Events Endpoints

```http
POST /api/events
# Create new event
{
  "name": "Event Name",
  "date": "DD/MM/YYYY",
  "capacity": 100,
  "costPerTicket": 50
}

GET /api/events
# List all events

GET /api/events/:id
# Get specific event details

POST /api/events/purchase
# Purchase tickets
{
  "eventId": "event_id",
  "nTickets": 5
}

GET /api/events/stats
# Get monthly statistics for the past 12 months
```

## OOP Design Principles

1. **Encapsulation**

   - Services encapsulate business logic
   - Controllers handle request/response lifecycle
   - Models manage data structure and validation

2. **Single Responsibility**

   - EventService: Handles event operations
   - EventController: Manages HTTP interactions
   - EventModel: Defines data structure

3. **Dependency Injection**
   - Services are injected into controllers
   - Promotes testability and loose coupling

Benefits of OOP in this project:

1. Maintainable and organized code structure
2. Easy to test individual components
3. Clear separation of concerns
4. Scalable architecture

## Error Handling

- Consistent error response format
- HTTP status codes for different scenarios
- Validation middleware for requests
- Global error handler middleware

```typescript
{
  success: boolean,
  error: {
    message: string,
    details?: any
  }
}
```

## Database Configuration

### MongoDB In-Memory Database

The application uses `mongodb-memory-server` for testing, which provides:

- Isolated test environment
- No need for external MongoDB installation
- Faster test execution
- Consistent test data

### MongoDB Connection Strategy

The application uses a smart database connection strategy:

```typescript

  public async connect(uri?: string): Promise<void> {
    let mongoUri = uri;

   // If no MONGODB_URI is provided, it automatically spins up an in-memory database
    if (!mongoUri) {
      this.mongoServer = await MongoMemoryServer.create();
      mongoUri = this.mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    this.connection = mongoose.connection;
    console.log("Connected to MongoDB with Mongoose");
  }

```

### Benefits

- Zero configuration needed for quick start
- Automatic fallback to in-memory database
- Perfect for development and testing
- No need to install MongoDB locally

## Future Enhancements

1. **Authentication & Authorization**

   - User management
   - Role-based access
   - Bearer Token authentication

2. **Advanced Features**

   - Event categories
   - Multiple ticket types
   - Waiting lists

3. **Technical Improvements**
   - Caching layer
   - Rate limiting
   - API documentation (Swagger)
   - Docker containerization

## Technologies Used

### Core Technologies

- **Node.js** (v22.x)
- **TypeScript** (v5.x)
- **Express.js** (v4.x)
- **MongoDB** (v6.x)
- **Mongoose** (v7.x)
- **Zod** - Schema validation

### Testing & Development

- **mongodb-memory-server** - In-memory MongoDB for testing and development
- **Jest** - Testing framework
- **REST Client** - VS Code extension for API testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **Visual Studio Code** - IDE

### Middleware & Utilities

- **cors**
- **dotenv**
