// Import necessary modules and packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Create an Express app
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app's origin
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Connect to MongoDB Atlas
const atlasConnectionUri = 'mongodb+srv://prathappoojari607:3WrebKuwJ1OIS5KU@cluster0.qhn2yup.mongodb.net/jsp?retryWrites=true&w=majority';
mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Define Mongoose schema for form input
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
  },
  pincode: String,
  age: Number,
});

const FormModel = mongoose.model('login', formSchema);

// Middleware to parse JSON in the request body
app.use(express.json());

// POST route to handle form creation
app.post('/submit-form', async (req, res) => {
  try {
    // Create a new form entry using the Mongoose model
    const newFormEntry = new FormModel(req.body);

    // Save the entry to the database
    await newFormEntry.save();

    // Send a success response
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
