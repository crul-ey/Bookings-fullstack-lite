import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import sentry from '@sentry/node';

import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import bookingRoutes from './routes/bookings.js';
import reviewsRoutes from './routes/reviews.js';
import amenitiesRoutes from './routes/amenities.js';

import { sentryErrorHandler, generalErrorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Sentry configureren
sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  tracesSampleRate: 1.0,
});

console.log('✅ Sentry initialized');

app.use(sentry.Handlers.requestHandler());
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/properties', propertyRoutes);
app.use('/bookings', bookingRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/amenities', amenitiesRoutes);

// ✅ Health check endpoint
app.get('/', (req, res) => {
  res.send('📦 Bookings API is running');
});

// ✅ Foutafhandeling
app.use(sentryErrorHandler);
app.use(generalErrorHandler);

// ✅ Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
