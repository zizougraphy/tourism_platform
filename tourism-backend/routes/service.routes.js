const express = require('express');
const { getServices, getServiceById } = require('../controllers/service.controller');
const { getPublicAvailability } = require('../controllers/availability.controller');

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getServiceById);
router.get('/:serviceId/availability', getPublicAvailability);

module.exports = router;