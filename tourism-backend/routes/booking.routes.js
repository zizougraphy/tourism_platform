const express = require('express');
const router  = express.Router();
const {
  createBooking,
  getBookings,
  cancelBooking,
  confirmBooking,
} = require('../controllers/booking.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All booking routes require authentication
router.post('/',                    authenticate,                          createBooking);
router.get('/',                     authenticate,                          getBookings);
router.patch('/:id/cancel',         authenticate, authorize('tourist', 'service_provider'), cancelBooking);
router.patch('/:id/confirm',        authenticate, authorize('service_provider'),   confirmBooking);

module.exports = router;