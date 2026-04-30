import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import { config } from './config';
import routes from './routes';

const app = express();

// Security
app.use(helmet());

const allowedOrigins = new Set(
  [config.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(Boolean)
);

const corsOptions = {
  origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    if (!origin) {
      callback(null, true);
      return;
    }

    // Allow exact matches
    if (allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    // Allow any vercel.app preview deployments
    if (origin.endsWith('.vercel.app')) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
