// server.js

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


var MongoClient = require('mongodb').MongoClient


// Load environment variables from .env file
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');


// Set up the Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());


// Register routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts/:postId/comments', commentRoutes);
app.use('/posts/:postId/likes', likeRoutes);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


const caCertPath = path.join(__dirname, "global-bundle.pem");
const caCert = fs.readFileSync(caCertPath);

let caObj = {
  importFile: path.join(__dirname, "global-bundle.pem")
}

const uri =  `${process.env.MONGODB_URI}` || 'mongodb://localhost:27017/social-media-app';
console.log('uri is ****', uri);
  console.log('path is***', caCertPath);
// Set up the database connection
mongoose
  .connect('mongodb://0.0.0.0:27017/social-media-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false
  })

  .then(() => {
      console.log('running');
    
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
    console.log('uri is', uri);
  });



// Start the server

