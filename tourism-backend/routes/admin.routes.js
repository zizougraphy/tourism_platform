const express = require('express');
const {
  getProviders, approveProvider, rejectProvider, updateProviderStatus,
  getStats,
  getUsers, updateUserStatus, deleteUser,
  getAdminServices, deleteAdminService, toggleService,
  getAdminBookings, cancelAdminBooking,
  getAdminReviews, deleteAdminReview,
  getAnalytics,
} = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();
const admin  = [authenticate, authorize('admin')];

// ── Stats ──────────────────────────────────────────────────────────────────────
router.get('/stats',                      ...admin, getStats);
router.get('/analytics',                  ...admin, getAnalytics);

// ── Users ──────────────────────────────────────────────────────────────────────
router.get('/users',                      ...admin, getUsers);
router.patch('/users/:id/status',         ...admin, updateUserStatus);
router.delete('/users/:id',               ...admin, deleteUser);

// ── Providers ──────────────────────────────────────────────────────────────────
router.get('/providers',                  ...admin, getProviders);
router.patch('/providers/:id/approve',    ...admin, approveProvider);
router.patch('/providers/:id/reject',     ...admin, rejectProvider);
router.patch('/providers/:id/status',     ...admin, updateProviderStatus);

// ── Services ───────────────────────────────────────────────────────────────────
router.get('/services',                   ...admin, getAdminServices);
router.delete('/services/:id',            ...admin, deleteAdminService);
router.patch('/services/:id/toggle',      ...admin, toggleService);

// ── Bookings ───────────────────────────────────────────────────────────────────
router.get('/bookings',                   ...admin, getAdminBookings);
router.patch('/bookings/:id/cancel',      ...admin, cancelAdminBooking);

// ── Reviews ────────────────────────────────────────────────────────────────────
router.get('/reviews',                    ...admin, getAdminReviews);
router.delete('/reviews/:id',             ...admin, deleteAdminReview);

module.exports = router;