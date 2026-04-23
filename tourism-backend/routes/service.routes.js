const express = require('express');
const { getServices, getServiceById } = require('../controllers/service.controller');

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getServiceById);



module.exports = router;