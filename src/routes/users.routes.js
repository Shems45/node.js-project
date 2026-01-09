import express from "express";
import { prisma } from "../prisma.js";

export const usersRouter = express.Router();

function validateUser(body) {
  const errors = [];
  const { firstName, lastName, email } = body;

  if (!firstName || firstName.trim() === "") {
    errors.push("firstName is required");
  } else if (/\d/.test(firstName)) {
    errors.push("firstName cannot contain numbers");
  }

  if (!lastName || lastName.trim() === "") {
    errors.push("lastName is required");
  } else if (/\d/.test(lastName)) {
    errors.push("lastName cannot contain numbers");
  }

  if (!email || email.trim() === "") {
    errors.push("email is required");
  } else if (!email.includes("@")) {
    errors.push("email must be valid");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("email must be in valid format (e.g., user@example.com)");
  }

  return errors;
}

usersRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ 
    where: { id }, 
    include: { listings: true } 
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

usersRouter.post("/", async (req, res) => {
  const errors = validateUser(req.body);
  if (errors.length) return res.status(400).json({ errors });

  try {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).json(user);
  } catch (e) {
    return res.status(400).json({ error: "Email already exists" });
  }
});

usersRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const errors = validateUser(req.body);
  if (errors.length) return res.status(400).json({ errors });

  try {
    const user = await prisma.user.update({ where: { id }, data: req.body });
    res.json(user);
  } catch (e) {
    return res.status(404).json({ error: "User not found" });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    return res.status(404).json({ error: "User not found" });
  }
});
