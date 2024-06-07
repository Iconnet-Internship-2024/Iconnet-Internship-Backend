const express = require('express');
const app = express();
const userRoutes = require('./routes/user');

// Middleware untuk parsing body dari request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the user routes
app.use('/users', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
