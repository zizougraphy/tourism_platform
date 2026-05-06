require('dotenv').config();
const express = require('express');
const cors    = require('cors');

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes         = require('./routes/auth.routes');
const cityRoutes         = require('./routes/city.routes');
const serviceRoutes      = require('./routes/service.routes');
const bookingRoutes      = require('./routes/booking.routes');
const reviewRoutes       = require('./routes/review.routes');
const favoriteRoutes     = require('./routes/favorite.routes');
const messageRoutes      = require('./routes/message.routes');
const notificationRoutes = require('./routes/notification.routes');
const providerRoutes     = require('./routes/provider.routes');
const adminRoutes        = require('./routes/admin.routes');

const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ── Mount routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/cities',        cityRoutes);
app.use('/api/services',      serviceRoutes);
app.use('/api/bookings',      bookingRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/favorites',     favoriteRoutes);
app.use('/api/messages',      messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/provider',      providerRoutes);
app.use('/api/admin',         adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
require('./config/db'); // test DB connection on startup

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});