const express = require('express');
const mongoose = require('mongoose');

const app = express();


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err.message));


// Define schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String,
});


const Item = mongoose.model('Item', itemSchema);


// Middleware to parse JSON bodies
app.use(express.json());


// GET all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    console.log('Items fetched:', items); // Console log the data
    if (items.length === 0) {
      res.status(404).json({ message: 'No items found' });
    } else {
      res.json(items);
    }
  } catch (err) {
    console.error('Error fetching items:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// POST a new item
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    console.log('New item created:', newItem); // Console log the data
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating item:', err.message);
    res.status(400).send('Error creating item');
  }
});


// PATCH an existing item by ID
app.patch('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('Item updated:', updatedItem); // Console log the data
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err.message);
    res.status(400).send('Error updating item');
  }
});


// DELETE an item by ID
app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('Item deleted:', deletedItem); // Console log the data
    res.json({ message: 'Item deleted successfully', deletedItem });
  } catch (err) {
    console.error('Error deleting item:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Start server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
