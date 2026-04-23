const express = require('express');
const { createService, updateService, deleteService } = require('../controllers/provider.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router  = express.Router();

// All routes require authentication + provider role
router.post('/services',        authenticate, authorize('provider'), createService);
router.put('/services/:id',     authenticate, authorize('provider'), updateService);
router.delete('/services/:id',  authenticate, authorize('provider'), deleteService);

module.exports = router;