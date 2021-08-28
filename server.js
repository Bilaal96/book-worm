const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.get('/test', (req, res) => {
  res.status(200).json({ success: `Test endpoint hit` });
});

// Listen for connection on specified port
const PORT = process.env.PORT || 5000;

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Server is running on Port: ${PORT}`);
});
