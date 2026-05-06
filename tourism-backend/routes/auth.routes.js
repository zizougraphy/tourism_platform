const express               = require('express'); // importing the framework to use routing features.
const { register, login, getMe, updateProfile } = require('../controllers/auth.controller');
const { authenticate }      = require('../middleware/auth.middleware');
const upload                = require('../middleware/upload.middleware');

const router = express.Router();
// Create router, like a minimap inside the app.


// Syntax : router.METHOD(PATH, HANDLER)
router.post('/register', register);
router.post('/login',    login);
router.get('/me',        authenticate, getMe);
router.put('/profile',   authenticate, upload.single('profile_photo'), updateProfile);

module.exports = router;
