// Import necessary modules and packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express app
const app = express();

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

// Define Mongoose schema for vendor input
const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true
  },
  bankAccountNo: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  address: {
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  }
});

const VendorModel = mongoose.model('Vendor', vendorSchema);

// Middleware to parse JS/ON in the request body
app.use(express.json());

// GET route to retrieve all vendor entries
app.get('/get-vendors', async (req, res) => {
  try {
    const vendors = await VendorModel.find();
    res.status(200).json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST route to handle vendor creation
app.post('/create-vendor', async (req, res) => {
  try {
    const newVendorEntry = new VendorModel(req.body);
    await newVendorEntry.save();
    res.status(201).json({ message: 'Vendor created successfully' });
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET route to retrieve a specific vendor entry by ID
app.get('/get-vendor/:id', async (req, res) => {
  const vendorId = req.params.id;
  try {
    const vendor = await VendorModel.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT route to update a specific vendor entry by ID
app.put('/update-vendor/:id', async (req, res) => {
  const vendorId = req.params.id;
  try {
    const updatedVendor = await VendorModel.findByIdAndUpdate(vendorId, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE route to delete a specific vendor entry by ID
app.delete('/delete-vendor/:id', async (req, res) => {
  const vendorId = req.params.id;
  try {
    const deletedVendor = await VendorModel.findByIdAndDelete(vendorId);
    if (!deletedVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully', vendor: deletedVendor });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
const port = 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
