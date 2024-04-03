const express = require('express');
const { User, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

module.exports = router;
