const app = require('./app'); 
const mongoose = require('mongoose'); 
require('dotenv').config(); 

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' MongoDB connected');

  // Start the server after DB is connected
  app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error(' MongoDB connection failed:', err);
});
