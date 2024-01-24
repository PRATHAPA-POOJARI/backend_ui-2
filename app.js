
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 


const app = express();


app.use(cors());
const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));


const atlasConnectionUri = process.env.MONGODB_URI; 
mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });


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

app.use(express.json());

app.get('/get-vendors', async (req, res) => {
  try {
    const vendors = await VendorModel.find();
    res.status(200).json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
const port = process.env.PORT || 9000; // Use the PORT environment variable or default to 9000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
