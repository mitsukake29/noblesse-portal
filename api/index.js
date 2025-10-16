// Vercel serverless function handler
const app = require('../backend/server');

// Export the Express app as a Vercel serverless function
module.exports = app;

// Also export a handler function for Vercel
module.exports.default = app;
