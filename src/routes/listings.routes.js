import express from "express";
import { prisma } from "../prisma.js";

export const listingsRouter = express.Router();

function validateListing(body) {
  const errors = [];

  const { title, description, price, city, zip, userId } = body;

  if (!title || typeof title !== "string" || title.trim() === "") errors.push("title is required");
  if (!description || typeof description !== "string" || description.trim() === "") errors.push("description is required");

  if (price === undefined || price === null || Number.isNaN(Number(price))) {
    errors.push("price must be a number");
  } else if (Number(price) < 0) {
    errors.push("price must be >= 0");
  }

  if (!city || typeof city !== "string" || city.trim() === "") errors.push("city is required");
  if (!zip || typeof zip !== "string" || zip.trim() === "") errors.push("zip is required");

  if (userId === undefined || userId === null || Number.isNaN(Number(userId))) {
    errors.push("userId must be a number");
  }

  return errors;
}

// GET /listings?limit=10&offset=0&q=iphone
listingsRouter.get("/", async (req, res) => {
  const limit = req.query.limit ? Math.min(Number(req.query.limit), 50) : 20;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  const q = req.query.q ? String(req.query.q).trim() : null;

  const where = q
    ? {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { city: { contains: q } },
          { zip: { contains: q } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { user: true },
      orderBy: { id: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.listing.count({ where }),
  ]);

  res.json({
    meta: { total, limit, offset, q },
    items,
  });
});

// GET /listings/:id
listingsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const listing = await prisma.listing.findUnique({ where: { id }, include: { user: true } });
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  res.json(listing);
});

// POST /listings
listingsRouter.post("/", async (req, res) => {
  const errors = validateListing(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const data = {
    title: req.body.title,
    description: req.body.description,
    price: Number(req.body.price),
    city: req.body.city,
    zip: req.body.zip,
    userId: Number(req.body.userId),
  };

  try {
    const created = await prisma.listing.create({ data, include: { user: true } });
    res.status(201).json(created);
  } catch (e) {
    return res.status(400).json({ error: "Invalid userId or bad data" });
  }
});

// PUT /listings/:id
listingsRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const errors = validateListing(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const data = {
    title: req.body.title,
    description: req.body.description,
    price: Number(req.body.price),
    city: req.body.city,
    zip: req.body.zip,
    userId: Number(req.body.userId),
  };

  try {
    const updated = await prisma.listing.update({ where: { id }, data, include: { user: true } });
    res.json(updated);
  } catch (e) {
    return res.status(404).json({ error: "Listing not found" });
  }
});

// DELETE /listings/:id
listingsRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.listing.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    return res.status(404).json({ error: "Listing not found" });
  }
});
