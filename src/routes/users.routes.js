import express from "express";
import { prisma } from "../prisma.js";

export const usersRouter = express.Router();

function validateUser(body) {
  const errors = [];

  const { firstName, lastName, email } = body;

  if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
    errors.push("firstName is required");
  } else if (/\d/.test(firstName)) {
    errors.push("firstName cannot contain numbers");
  }

  if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
    errors.push("lastName is required");
  } else if (/\d/.test(lastName)) {
    errors.push("lastName cannot contain numbers");
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    errors.push("email is required");
  } else if (!email.includes("@")) {
    errors.push("email must be a valid email");
  }

  return errors;
}

// GET /users
usersRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  res.json(users);
});

// GET /users/:id
usersRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id }, include: { listings: true } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST /users
usersRouter.post("/", async (req, res) => {
  const errors = validateUser(req.body);
  if (errors.length) return res.status(400).json({ errors });

  try {
    const created = await prisma.user.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    // Unique email
    return res.status(400).json({ error: "Email already exists" });
  }
});

// PUT /users/:id
usersRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const errors = validateUser(req.body);
  if (errors.length) return res.status(400).json({ errors });

  try {
    const updated = await prisma.user.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (e) {
    return res.status(404).json({ error: "User not found" });
  }
});

// DELETE /users/:id
usersRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    return res.status(404).json({ error: "User not found" });
  }
});
