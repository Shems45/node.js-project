const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Validation helper
const validateListing = (data) => {
  const errors = [];

  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!data.description || data.description.trim() === '') {
    errors.push('Description is required');
  }

  if (!data.price) {
    errors.push('Price is required');
  } else if (isNaN(data.price)) {
    errors.push('Price must be a number');
  } else if (parseFloat(data.price) < 0) {
    errors.push('Price must be greater than or equal to 0');
  }

  if (!data.userId) {
    errors.push('UserId is required');
  } else if (isNaN(data.userId)) {
    errors.push('UserId must be a number');
  }

  return errors;
};

// GET all listings with pagination and search
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = parseInt(req.query.offset) || 0;
    const searchQuery = req.query.q || '';

    const where = searchQuery
      ? { title: { contains: searchQuery, mode: 'insensitive' } }
      : {};

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: { user: true },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({
      data: listings,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true },
    });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// POST create listing
router.post('/', async (req, res) => {
  const errors = validateListing(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const listing = await prisma.listing.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price),
        userId: parseInt(req.body.userId),
      },
      include: { user: true },
    });
    res.status(201).json(listing);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'User not found' });
    }
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// PUT update listing
router.put('/:id', async (req, res) => {
  const errors = validateListing(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const listing = await prisma.listing.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price),
        userId: parseInt(req.body.userId),
      },
      include: { user: true },
    });
    res.json(listing);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Listing not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'User not found' });
    }
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// DELETE listing
router.delete('/:id', async (req, res) => {
  try {
    const listing = await prisma.listing.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Listing deleted successfully', listing });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Listing not found' });
    }
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;
