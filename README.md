# 🛍️ Student Marketplace API

Een Node.js REST API voor het delen en verkopen van studiedingen. Een standalone applicatie die volledig onafhankelijk is met eigen SQLite database.

## ✨ Features

- **User Management**: CRUD operations voor users
- **Listings**: CRUD operations met search en pagination
- **Validatie**: Robust validatie voor alle inputs
- **Database**: SQLite met Prisma ORM
- **API Docs**: HTML documentatie van alle endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
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

**Server runs on:** `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server with nodemon (port 3000)
npm start            # Start production server
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Populate database with test data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 📚 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID (includes listings) |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user (cascades to listings) |

**Create/Update User Body:**
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
| GET | `/listings` | Get listings with pagination/search |
| GET | `/listings/:id` | Get listing by ID |
| POST | `/listings` | Create new listing |
| PUT | `/listings/:id` | Update listing |
| DELETE | `/listings/:id` | Delete listing |

**Query Parameters for GET /listings:**
- `limit` (default: 20, max: 50) - Items per page
- `offset` (default: 0) - Skip items
- `q` - Search in title, description, city, zip

**Example:** `GET /listings?limit=10&offset=0&q=Brussels`

**Create/Update Listing Body:**
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

## ✅ Validation Rules

**Users:**
- firstName/lastName: Required, no numbers allowed
- email: Required, valid format, unique

**Listings:**
- title: Required, non-empty
- description: Required, non-empty
- price: Required, must be a number ≥ 0
- city: Required, non-empty
- zip: Required, non-empty
- userId: Required, must reference existing user

## 🗄️ Database

Uses SQLite with Prisma ORM. Database file location: `./prisma/dev.db`

### Schema

**User**
- id (Int, PK, Auto)
- firstName (String)
- lastName (String)
- email (String, Unique)
- createdAt (DateTime, Default: now)
- updatedAt (DateTime)
- listings (Relation to Listing)

**Listing**
- id (Int, PK, Auto)
- title (String)
- description (String)
- price (Float)
- city (String)
- zip (String)
- userId (Int, FK to User)
- user (Relation to User)
- createdAt (DateTime, Default: now)
- updatedAt (DateTime)

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+ (ES Modules)
- **Framework**: Express 5
- **Database**: SQLite
- **ORM**: Prisma 5
- **Middleware**: CORS
- **Dev Tools**: Nodemon

## 📝 Project Structure

```
.
├── src/
│   ├── server.js              # Main Express app
│   ├── prisma.js              # Prisma client instance
│   └── routes/
│       ├── users.routes.js    # User endpoints
│       └── listings.routes.js # Listing endpoints
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Seed script
│   ├── dev.db                 # SQLite database (generated)
│   └── migrations/            # Migration history
├── package.json
└── README.md
```

## 📦 Dependencies

- **express**: Web framework
- **cors**: CORS middleware
- **@prisma/client**: Database client

## 🔧 Development Dependencies

- **prisma**: ORM CLI
- **nodemon**: Auto-reload development server

## 🌱 Seeding Database

The seed script creates:
- 2 test users (Alice Peeters, Bilal El Amrani)
- 5 test listings (iPhone, MacBook, Basketball shoes, Desk chair, Calculator)

Run with: `npm run db:seed`

## 📄 Environment Variables

Create `.env` file:
```
DATABASE_URL="file:./dev.db"
PORT=3000
```

## 🎯 Checklist (Requirements)

- ✅ CRUD operations (Users & Listings)
- ✅ Validatie (required fields, type checking, regex)
- ✅ Pagination (limit + offset)
- ✅ Search endpoint (q parameter on multiple fields)
- ✅ Root docs page (HTML at /)
- ✅ Aparte SQLite database
- ✅ Prisma migrations & seed
- ✅ .gitignore & README
- ✅ ES Modules (modern syntax)

## 🚫 Ignored Files

`.gitignore` excludes:
- `node_modules/`
- `.env` (local environment)
- `prisma/dev.db` (local database)
- `prisma/dev.db-journal`

## 🎓 Score Boosters

Extra features implemented:
- ES Modules (modern Node.js)
- User relationships with cascade delete
- Multi-field search (title, description, city, zip)
- Pagination metadata in response
- Price validation (≥ 0)
- Case-insensitive search
- Proper HTTP status codes (200, 201, 204, 400, 404)
- CORS enabled
- City + Zip fields for location

## 📞 Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful delete)
- `400` - Bad request (validation error)
- `404` - Not found
- `500` - Server error

## 🔗 Access API

Development:
```
http://localhost:3000           # API docs (HTML)
http://localhost:3000/users
http://localhost:3000/listings
```


