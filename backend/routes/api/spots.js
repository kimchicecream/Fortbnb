const express = require('express');
const { Spot } = require('../../db/models');

const router = express.Router();

// Get all spots /api/spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();

    res.json({
        Spots: spots
    });
});

module.exports = router;
