const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create upload directories
const directories = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads', 'original'),
  path.join(__dirname, 'uploads', 'blurred'),
  path.join(__dirname, 'models')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Routes
const authRoutes = require('./routes/auth');
const membersRoutes = require('./routes/members');
const adminRoutes = require('./routes/admin');
const maleMembersRoutes = require('./routes/maleMembers');
const offersRoutes = require('./routes/offers');

app.use('/api/auth', authRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/male-members', maleMembersRoutes);
app.use('/api/offers', offersRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Noblesse API is running' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
  });
}

// Export for Vercel
module.exports = app;
