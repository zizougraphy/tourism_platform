const express = require('express');
const {
    getProviders,
    approveProvider,
    rejectProvider,
    getStats,
} = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router  = express.Router();

// All admin routes require authentication + admin role
router.get('/providers',                authenticate, authorize('admin'), getProviders);
router.patch('/providers/:id/approve',  authenticate, authorize('admin'), approveProvider);
router.patch('/providers/:id/reject',   authenticate, authorize('admin'), rejectProvider);
router.get('/stats',                    authenticate, authorize('admin'), getStats);

module.exports = router;