// ============================================================
// KrishiSanjivani — Express API Server
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('./utils/logger');

const apiRoutes = require('./routes/api.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse application/json and application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Mount API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled server error:', err.stack || err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`🌾 KrishiSanjivani API Server running on port ${PORT}`);
  });
}

module.exports = app;
