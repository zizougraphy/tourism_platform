const express = require('express');
const { getMyServices, createService, updateService, deleteService } = require('../controllers/provider.controller');
const { getAvailability, setAvailability, setBulkAvailability, deleteAvailability } = require('../controllers/availability.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router  = express.Router();

// All routes require authentication + provider role
router.get('/services',         authenticate, authorize('service_provider'), getMyServices);
router.post('/services',        authenticate, authorize('service_provider'), upload.array('images', 5), createService);
router.put('/services/:id',     authenticate, authorize('service_provider'), upload.array('images', 5), updateService);
router.delete('/services/:id',  authenticate, authorize('service_provider'), deleteService);


// Availability management
router.get('/availability/:serviceId',  authenticate, authorize('service_provider'), getAvailability);
router.post('/availability',            authenticate, authorize('service_provider'), setAvailability);
router.post('/availability/bulk',       authenticate, authorize('service_provider'), setBulkAvailability);
router.delete('/availability/:id',      authenticate, authorize('service_provider'), deleteAvailability);

module.exports = router;