import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Routes
import analyzeMediaRoute from './routes/analyze-media.js';
import downloadMediaRoute from './routes/download-media.js';
import youtubeDownloadRoute from './routes/youtube-download.js';
import streamMediaRoute from './routes/stream-media.js';
import scrapeColaborareadRoute from './routes/scrape-colaboraread.js';
import downloadHlsRoute from './routes/download-hls.js';
import sitemapRoute from './routes/sitemap.js';
import healthRoute from './routes/health.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for SPA compatibility
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.BASE_URL 
    : '*',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// API Routes
app.use('/api/health', healthRoute);
app.use('/api/analyze-media', analyzeMediaRoute);
app.use('/api/download-media', downloadMediaRoute);
app.use('/api/youtube-download', youtubeDownloadRoute);
app.use('/api/stream-media', streamMediaRoute);
app.use('/api/scrape-colaboraread', scrapeColaborareadRoute);
app.use('/api/download-hls', downloadHlsRoute);
app.use('/sitemap.xml', sitemapRoute);

// Serve static files (built frontend)
app.use(express.static(join(__dirname, '../dist')));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint não encontrado' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SaveClip server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
