const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const db = require('./db/datasbase');
const port = process.env.PORT || 8080;
const cors = require('cors');

// Enable CORS
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



db.connect()
  .then(() => console.log('PostgreSQL database connected'))
  .catch(err => console.error('Error connecting to PostgreSQL database', err));

// Separated Routes for each Resource

// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/tasks', require('./routes/taskRoute'));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

