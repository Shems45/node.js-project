import express from "express";
import { prisma } from "../prisma.js";

export const listingsRouter = express.Router();

function validateListing(body) {
  const errors = [];
  const { title, description, price, city, zip, userId } = body;

  if (!title || title.trim() === "") errors.push("title is required");
  if (!description || description.trim() === "") errors.push("description is required");

  if (price === undefined || price === null || Number.isNaN(Number(price))) {
    errors.push("price must be a number");
  } else if (Number(price) < 0) {
    errors.push("price must be >= 0");
  }

  if (!city || city.trim() === "") errors.push("city is required");
  if (!zip || zip.trim() === "") errors.push("zip is required");

  if (!userId || isNaN(userId)) errors.push("userId is required");

  return errors;
}

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

  const [listings, total] = await Promise.all([
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
    data: listings,
  });
});

listingsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const listing = await prisma.listing.findUnique({ where: { id }, include: { user: true } });
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  res.json(listing);
});

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

listingsRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.listing.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    return res.status(404).json({ error: "Listing not found" });
  }
});
