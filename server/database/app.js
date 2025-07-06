const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const Reviews = require('./review');
const Dealerships = require('./dealership');

const app = express();
const port = process.env.PORT || 3030;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// MongoDB Connection + Initial Data Load
async function initDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Load initial JSON data
    const reviews_data = JSON.parse(fs.readFileSync("data/reviews.json", 'utf8'));
    const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", 'utf8'));

    // Insert into collections
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews);

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships);

    console.log('✅ Database populated successfully');
  } catch (err) {
    console.error('❌ MongoDB init error:', err);
  }
}

// Routes
app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});

app.get('/fetchReviews', async (req, res) => {
  try {
    const reviews = await Reviews.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const reviews = await Reviews.find({ dealership: parseInt(req.params.id) });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching dealer reviews' });
  }
});

app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching dealers' });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealers = await Dealerships.find({ state: req.params.state });
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching dealers by state' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealerships.findOne({ id: parseInt(req.params.id) });
    dealer ? res.json(dealer) : res.status(404).json({ error: 'Dealer not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching dealer by ID' });
  }
});

app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;

    const last = await Reviews.findOne().sort({ id: -1 });
    const new_id = last ? last.id + 1 : 1;

    const review = new Reviews({ id: new_id, ...data });
    const saved = await review.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start Server and Init DB
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  initDatabase(); // connect + populate DB
});
