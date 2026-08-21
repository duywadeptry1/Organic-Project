import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ESM path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database initialization
import connectDB from './server/config/db.js';

// Route Handlers
import productRoutes from './server/routes/productRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import orderRoutes from './server/routes/orderRoutes.js';
import uploadRoutes from './server/routes/uploadRoutes.js';
import { notFoundHandler, globalErrorHandler } from './server/middlewares/errorMiddleware.js';

const app = express();
const PORT = 3000;

// Initialize Database connection (soft fallback if offline)
connectDB();

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());

// Static uploads directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// PayPal Client ID Endpoint
app.get('/api/config/paypal', (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'API is healthy and running',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Serve frontend: Vite dev middleware in development, static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: __dirname,
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Organi server listening on http://0.0.0.0:${PORT}`);
});
