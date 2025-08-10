import express from 'express';
import router from './routes/authroutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Routes
app.use('/user', router);


// Test route
app.get('/', (req, res) => {
  res.send(' Backrite backend is running!');
});

export default app;
