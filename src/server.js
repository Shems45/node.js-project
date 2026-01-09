import express from "express";
import cors from "cors";
import { usersRouter } from "./routes/users.routes.js";
import { listingsRouter } from "./routes/listings.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Student Marketplace API</title>
      </head>
      <body>
        <h1>Student Marketplace API</h1>
        <p>Base URL: <code>http://localhost:${port}</code></p>

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

        <h3>POST/PUT Listing body</h3>
        <pre>{
  "title": "iPhone 13",
  "description": "Battery 88%",
  "price": 420,
  "city": "Brussels",
  "zip": "1000",
  "userId": 1
}</pre>

        <h2>Quick Demo Links</h2>
        <ul>
          <li><a href="/users">View all users</a></li>
          <li><a href="/users/8">View user 8 (example)</a></li>
          <li><a href="/listings">View all listings</a></li>
          <li><a href="/listings/26">View listing 26 (example)</a></li>
          <li><a href="/listings?limit=5&offset=0&q=Brussels">Search listings: Brussels (limit=5)</a></li>
        </ul>

        <h2>Interactive Demo (Browser)</h2>
        <p>Voer API-calls uit rechtstreeks in de browser. Resultaat verschijnt hieronder.</p>

        <section style="display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
          <div style="border:1px solid #ccc; padding:12px;">
            <h3>POST /users</h3>
            <textarea id="userBody" rows="6" style="width:100%;">{
  "firstName": "Alice",
  "lastName": "Peeters",
  "email": "alice.demo@student.be"
}</textarea>
            <button onclick="doFetch('POST','/users', document.getElementById('userBody').value)">Create User</button>
            <button onclick="resetSample('userBody','user')">Reset sample</button>
          </div>

          <div style="border:1px solid #ccc; padding:12px;">
            <h3>GET /users</h3>
            <button onclick="doFetch('GET','/users')">List Users</button>
          </div>

          <div style="border:1px solid #ccc; padding:12px;">
            <h3>POST /listings</h3>
            <textarea id="listingBody" rows="10" style="width:100%;">{
  "title": "iPhone 13",
  "description": "Battery 88%",
  "price": 420,
  "city": "Brussels",
  "zip": "1000",
  "userId": 1
}</textarea>
            <button onclick="doFetch('POST','/listings', document.getElementById('listingBody').value)">Create Listing</button>
            <button onclick="resetSample('listingBody','listing')">Reset sample</button>
          </div>

          <div style="border:1px solid #ccc; padding:12px;">
            <h3>GET /listings (search)</h3>
            <label>limit <input id="limit" type="number" value="5" min="1" max="50"></label>
            <label>offset <input id="offset" type="number" value="0" min="0"></label>
            <label>q <input id="q" type="text" value="Brussels"></label>
            <button onclick="doFetch('GET', '/listings?limit=' + document.getElementById('limit').value + '&offset=' + document.getElementById('offset').value + '&q=' + encodeURIComponent(document.getElementById('q').value))">Search Listings</button>
          </div>

          <div style="border:1px solid #ccc; padding:12px;">
            <h3>GET /listings (with sorting)</h3>
            <label>sort <select id="sortField" style="padding:4px;">
              <option value="id">id</option>
              <option value="title">title</option>
              <option value="price" selected>price</option>
              <option value="city">city</option>
              <option value="createdAt">createdAt</option>
            </select></label>
            <label>order <select id="sortOrder" style="padding:4px;">
              <option value="asc" selected>asc (lowest first)</option>
              <option value="desc">desc (highest first)</option>
            </select></label>
            <label>limit <input id="sortLimit" type="number" value="10" min="1" max="50"></label>
            <button onclick="doFetch('GET', '/listings?sort=' + document.getElementById('sortField').value + '&order=' + document.getElementById('sortOrder').value + '&limit=' + document.getElementById('sortLimit').value)">Sort & List</button>
          </div>

          <div style="border:1px solid #ccc; padding:12px;">
            <h3>GET /listings/:id</h3>
            <label>id <input id="getListingId" type="number" value="26" min="1"></label>
            <button onclick="doFetch('GET', '/listings/' + document.getElementById('getListingId').value)">Get Listing</button>
          </div>

          <div style="border:1px solid #ccc; padding:12px;">
            <h3>PUT /listings/:id</h3>
            <label>id <input id="putListingId" type="number" value="26" min="1"></label>
            <textarea id="putListingBody" rows="10" style="width:100%;">{
  "title": "iPhone 13 (updated)",
  "description": "Battery 85%",
  "price": 399,
  "city": "Brussels",
  "zip": "1000",
  "userId": 1
}</textarea>
            <button onclick="doFetch('PUT', '/listings/' + document.getElementById('putListingId').value, document.getElementById('putListingBody').value)">Update Listing</button>
            <button onclick="resetSample('putListingBody','listingPut')">Reset sample</button>
          </div>

          <div style="border:1px solid #ccc; padding:12px;">
            <h3>DELETE /listings/:id</h3>
            <label>id <input id="deleteListingId" type="number" value="26" min="1"></label>
            <button onclick="doFetch('DELETE', '/listings/' + document.getElementById('deleteListingId').value)">Delete Listing</button>
          </div>
        </section>

        <h3>Resultaat</h3>
        <div style="margin-bottom:8px;">
          <button onclick="clearOutput()">Clear output</button>
        </div>
        <pre id="out" style="background:#f7f7f7; padding:12px; overflow:auto;"></pre>

<script>
          async function doFetch(method, url, bodyText) {
            var out = document.getElementById("out");
            out.textContent = "Loading...";
            var options = { method: method, headers: {} };
            if (bodyText) {
              try {
                var json = JSON.parse(bodyText);
                options.headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(json);
              } catch (e) {
                out.textContent = "Invalid JSON body";
                return;
              }
            }
            try {
              var res = await fetch(url, options);
              var ct = res.headers.get("content-type") || "";
              if (ct.includes("application/json")) {
                var data = await res.json();
                out.textContent = JSON.stringify({ status: res.status, data: data }, null, 2);
              } else {
                var text = await res.text();
                out.textContent = "Status: " + res.status + "\\n\\n" + text;
              }
            } catch (err) {
              out.textContent = "Error: " + (err && err.message ? err.message : String(err));
            }
          }

          var samples = { user: "", listing: "", listingPut: "" };
          samples.user = '{"firstName":"Alice","lastName":"Peeters","email":"alice.demo@student.be"}';
          samples.listing = '{"title":"iPhone 13","description":"Battery 88%","price":420,"city":"Brussels","zip":"1000","userId":1}';
          samples.listingPut = '{"title":"iPhone 13 (updated)","description":"Battery 85%","price":399,"city":"Brussels","zip":"1000","userId":1}';
          
          Object.keys(samples).forEach(function(key) {
            try { samples[key] = JSON.stringify(JSON.parse(samples[key]), null, 2); } catch(e) {}
          });

          function resetSample(textareaId, key) {
            var el = document.getElementById(textareaId);
            if (el && samples[key]) el.value = samples[key];
          }

          function clearOutput() {
            var out = document.getElementById("out");
            out.textContent = "";
          }
        </script>

        <hr />
        <p>Built with Node.js + Express + Prisma + SQLite.</p>
      </body>
    </html>
  `;
  res.type("html").send(htmlContent);
});

app.use("/users", usersRouter);
app.use("/listings", listingsRouter);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

