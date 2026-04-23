const express = require('express');
const { getNotifications, markAllRead, markOneRead } = require('../controllers/notification.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router  = express.Router();

router.get('/',                 authenticate, getNotifications);
router.patch('/read-all',       authenticate, markAllRead);    // must be above /:id/read
router.patch('/:id/read',       authenticate, markOneRead);

module.exports = router;