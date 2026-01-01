const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Validation helper
const validateUser = (data) => {
  const errors = [];

  if (!data.firstname || data.firstname.trim() === '') {
    errors.push('Firstname is required');
  } else if (/\d/.test(data.firstname)) {
    errors.push('Firstname cannot contain numbers');
  }

  if (!data.lastname || data.lastname.trim() === '') {
    errors.push('Lastname is required');
  } else if (/\d/.test(data.lastname)) {
    errors.push('Lastname cannot contain numbers');
  }

  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email is not valid');
  }

  return errors;
};

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { listings: true },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { listings: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create user
router.post('/', async (req, res) => {
  const errors = validateUser(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await prisma.user.create({
      data: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  const errors = validateUser(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
      },
    });
    res.json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
