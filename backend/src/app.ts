import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import routes from './routes';

const app = express();

// Security
app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting (desactivado para desarrollo)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Error handling
app.use(errorHandler);

export default app;
