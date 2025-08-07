const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Test Route
app.get('/', (req, res) => {
  res.send('Backrite backend is running!');
});

module.exports = app;
