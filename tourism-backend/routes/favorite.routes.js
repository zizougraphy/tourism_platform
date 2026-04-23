const express = require('express');
const router  = express.Router();
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favorite.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/',                authenticate, addFavorite);
router.get('/',                 authenticate, getFavorites);
router.delete('/:serviceId',    authenticate, removeFavorite);

module.exports = router;