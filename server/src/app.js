// Express application factory. Keeps routing and middleware configuration
// centralized so the bootstrapper (`server/index.js`) can remain minimal.
const express = require('express');
const cors = require('cors');
const booksRouter = require('./routes/books');
const filmsRouter = require('./routes/films');
const healthRouter = require('./routes/health');

const app = express();

// Enable CORS for the frontend dev server and parse JSON bodies
app.use(cors());
app.use(express.json());

// Mount API routes. Each router is responsible for its own paths.
app.use('/api/health', healthRouter);
app.use('/api/books', booksRouter);
app.use('/api/films', filmsRouter);

// Fallback 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

module.exports = app;
