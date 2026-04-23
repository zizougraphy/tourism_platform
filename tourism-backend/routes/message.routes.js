const express = require('express');
const { sendMessage, getConversation, getInbox } = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router  = express.Router();

router.post('/',            authenticate, sendMessage);
router.get('/',             authenticate, getInbox);
router.get('/:userId',      authenticate, getConversation);

module.exports = router;