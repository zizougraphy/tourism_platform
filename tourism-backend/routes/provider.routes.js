const express = require('express');
const { getMyServices, createService, updateService, deleteService } = require('../controllers/provider.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router  = express.Router();

// All routes require authentication + provider role
router.get('/services',         authenticate, authorize('service_provider'), getMyServices);
router.post('/services',        authenticate, authorize('service_provider'), createService);
router.put('/services/:id',     authenticate, authorize('service_provider'), updateService);
router.delete('/services/:id',  authenticate, authorize('service_provider'), deleteService);

module.exports = router;