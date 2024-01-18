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
app.get('/get-forms', async (req, res) => {
  try {
    const forms = await FormModel.find();
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET route to retrieve a specific form entry by ID
app.get('/get-form/:id', async (req, res) => {
  const formId = req.params.id;
  try {
    const form = await FormModel.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT route to update a specific form entry by ID
app.put('/update-form/:id', async (req, res) => {
  const formId = req.params.id;
  try {
    const updatedForm = await FormModel.findByIdAndUpdate(formId, req.body, { new: true });
    if (!updatedForm) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.status(200).json({ message: 'Form updated successfully', form: updatedForm });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE route to delete a specific form entry by ID
app.delete('/delete-form/:id', async (req, res) => {
  const formId = req.params.id;
  try {
    const deletedForm = await FormModel.findByIdAndDelete(formId);
    if (!deletedForm) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.status(200).json({ message: 'Form deleted successfully', form: deletedForm });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
