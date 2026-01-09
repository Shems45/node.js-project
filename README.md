# Student Marketplace API

A Node.js REST API for a student marketplace platform. This is a standalone application with its own SQLite database.

## Features

- User Management: Complete CRUD operations
- Listings: CRUD operations with search and pagination
- Input Validation: Required fields, type checking, and format validation
- Database: SQLite with Prisma ORM
- API Documentation: HTML documentation page at root endpoint

## Requirements

- Node.js 20+
- npm

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Shems45/node.js-project
cd node.js-project

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Run database migration
npx prisma migrate dev

# 5. Seed database with test data
npm run db:seed

# 6. Start development server
npm run dev
```

Server runs on: `http://localhost:3000`

## Available Commands

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Populate database with test data
npm run db:studio    # Open Prisma Studio
```

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Retrieve all users |
| GET | `/users/:id` | Retrieve user by ID (includes listings) |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user (cascades to listings) |

**Request Body (POST/PUT):**
```json
{
  "firstName": "Alice",
  "lastName": "Peeters",
  "email": "alice@student.be"
}
```

### Listings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/listings` | Retrieve listings with pagination and search |
| GET | `/listings/:id` | Retrieve listing by ID |
| POST | `/listings` | Create new listing |
| PUT | `/listings/:id` | Update listing |
| DELETE | `/listings/:id` | Delete listing |

**Query Parameters (GET /listings):**
- `limit` (default: 20, max: 50) - Items per page
- `offset` (default: 0) - Items to skip
- `q` - Search query (searches in title, description, city, zip)

**Example:** `GET /listings?limit=10&offset=0&q=Brussels`

**Request Body (POST/PUT):**
```json
{
  "title": "iPhone 13",
  "description": "Battery 88%, includes case",
  "price": 420,
  "city": "Brussels",
  "zip": "1000",
  "userId": 1
}
```

## Validation Rules

### Users
- firstName/lastName: Required, cannot contain numbers
- email: Required, must be valid format, must be unique

### Listings
- title: Required
- description: Required
- price: Required, must be a number greater than or equal to 0
- city: Required
- zip: Required
- userId: Required, must reference existing user

## Database Schema

**User**
- id (Integer, Primary Key, Auto-increment)
- firstName (String)
- lastName (String)
- email (String, Unique)
- createdAt (DateTime)
- updatedAt (DateTime)
- listings (Relation)

**Listing**
- id (Integer, Primary Key, Auto-increment)
- title (String)
- description (String)
- price (Float)
- city (String)
- zip (String)
- userId (Integer, Foreign Key)
- user (Relation)
- createdAt (DateTime)
- updatedAt (DateTime)

## Technology Stack

- Node.js 20+ (ES Modules)
- Express 5
- SQLite
- Prisma 5
- CORS middleware
- Nodemon (development)

## Project Structure

```
.
├── src/
│   ├── server.js
│   ├── prisma.js
│   └── routes/
│       ├── users.routes.js
│       └── listings.routes.js
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   ├── dev.db (generated)
│   └── migrations/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Environment Configuration

Create a `.env` file in the root directory:

```
DATABASE_URL="file:./dev.db"
PORT=3000
```

## Seeding

The seed script creates:
- 5 users (Alice Peeters, Bilal El Amrani, Emma Janssens, Lucas Vermeulen, Sophie Dubois)
- 20 listings across various categories and Belgian cities

Run: `npm run db:seed`

## HTTP Status Codes

- 200: Success
- 201: Created
- 204: No Content (successful delete)
- 400: Bad Request (validation error)
- 404: Not Found
- 500: Server Error

## Development

Access the API at:
- `http://localhost:3000` - API documentation (HTML)
- `http://localhost:3000/users` - Users endpoint
- `http://localhost:3000/listings` - Listings endpoint


