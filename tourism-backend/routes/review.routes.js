const express = require('express');
const { createReview, getServiceReviews, deleteReview } = require('../controllers/review.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/',                        authenticate, createReview);
router.get('/service/:serviceId',                     getServiceReviews); // public
router.delete('/:id',                   authenticate, deleteReview);
 
module.exports = router;