const express = require('express');
const router = express.Router();
const bggCtrl = require('../controllers/bggFetch');

// GET single game details
router.get('/game/:id', bggCtrl.show);

// GET search results
router.get('/search/:id', bggCtrl.search);


module.exports = router;