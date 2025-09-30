import express, { Application } from 'express';
import { corsMiddleware } from './middleware/cors';
import transactionRoutes from './routes/transactionRoutes';
import { initializeCSV } from './utils/csvHelper';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use('/api', transactionRoutes);

// Initialize CSV on startup
initializeCSV();

export default app;