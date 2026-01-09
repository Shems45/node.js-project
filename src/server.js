import express from "express";
import cors from "cors";
import { usersRouter } from "./routes/users.routes.js";
import { listingsRouter } from "./routes/listings.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.type("html").send(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Student Marketplace API</title>
      </head>
      <body>
        <h1>Student Marketplace API</h1>
        <p>Base URL: <code>http://localhost:${process.env.PORT || 3000}</code></p>

        <h2>Users</h2>
        <ul>
          <li>GET <code>/users</code></li>
          <li>GET <code>/users/:id</code> (includes listings)</li>
          <li>POST <code>/users</code></li>
          <li>PUT <code>/users/:id</code></li>
          <li>DELETE <code>/users/:id</code></li>
        </ul>

        <h3>POST/PUT User body</h3>
        <pre>{
  "firstName": "Alice",
  "lastName": "Peeters",
  "email": "alice@student.be"
}</pre>

        <h2>Listings</h2>
        <ul>
          <li>GET <code>/listings</code> (supports <code>limit</code>, <code>offset</code>, <code>q</code>)</li>
          <li>GET <code>/listings/:id</code></li>
          <li>POST <code>/listings</code></li>
          <li>PUT <code>/listings/:id</code></li>
          <li>DELETE <code>/listings/:id</code></li>
        </ul>

        <h3>GET listings with pagination + search</h3>
        <pre>/listings?limit=10&offset=0&q=brussels</pre>

        <h2>Quick Demo Links</h2>
        <ul>
          <li><a href="/users">View all users</a></li>
          <li><a href="/users/1">View user 1 (example)</a></li>
          <li><a href="/listings">View all listings</a></li>
          <li><a href="/listings/1">View listing 1 (example)</a></li>
          <li><a href="/listings?limit=5&offset=0&q=Brussels">Search listings: Brussels (limit=5)</a></li>
        </ul>

        <h3>POST/PUT Listing body</h3>
        <pre>{
  "title": "iPhone 13",
  "description": "Battery 88%",
  "price": 420,
  "city": "Brussels",
  "zip": "1000",
  "userId": 1
}</pre>

        <hr />
        <p>Built with Node.js + Express + Prisma + SQLite.</p>
      </body>
    </html>
  `);
});

app.use("/users", usersRouter);
app.use("/listings", listingsRouter);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

