require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./db');
const usersRoute = require('./routes/usersRoute');
const reviewRoute = require('./routes/reviewRoute');
const hotelRoute = require('./routes/hotelRoute');
const Hotel = require('./models/hotel'); // Import the Hotel model
const paymentRoute = require('./routes/paymentRoute');

const app = express();

// app.use(bodyParser.json());

// Enable CORS
// app.use(cors({
//   origin: 'https://hotel-01-vg16.vercel.app/' 
// }));
app.use(cors());


// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(express.static('public')); 

// Register routes
app.use('/api/users', usersRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/hotels', hotelRoute);
app.use('/api/payments', paymentRoute);

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error("Error:", err.stack);
//   res.status(500).json({ error: "Internal server error" });
// });

// Connect to database
connectDB().then(() => {
  addSampleHotels(); // Add sample hotels if not present when DB connects
});

// Function to add sample hotels if they do not exist
async function addSampleHotels() {
  try {
    const existingHotels = await Hotel.find();
    if (existingHotels.length === 0) {
      const sampleHotels = [
        {
          name: "Grand Luxury Hotel",
          description: "A beautiful hotel with excellent amenities and breathtaking views.",
          location: "Paris, France",
        },
        {
          name: "City Comfort Inn",
          description: "Perfect for business travelers, located in the heart of downtown.",
          location: "New York, USA",
        },
        {
          name: "Beachside Resort",
          description: "Enjoy the serene seaside views and luxurious facilities at our resort.",
          location: "Malibu, USA",
        },
      ];

      await Hotel.insertMany(sampleHotels);
      console.log("Sample hotels added successfully.");
    } else {
      console.log("Sample hotels already exist.");
    }
  } catch (error) {
    console.error("Error adding sample hotels:", error);
  }
}

// Start server
app.listen(8080, () => console.log("Server running on port 8080"));
