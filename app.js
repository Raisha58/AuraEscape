const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

// Connecting to the database
const MONGO_URL = "mongodb://127.0.0.1:27017/AuraEscape";

// calling main function for db
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB: ", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Creating API
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Creating a new route
app.get("/testListing", async (req, res) => {
  try {
    let sampleListing = new Listing({
      title: "Annapurna Guest House",
      description: "At the heart of Bhaktapur",
      price: 1200,
      location: "Bhaktapur",
      country: "Nepal",
    });

    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Successful testing");
  } catch (err) {
    console.error("Error saving sample listing:", err);
    res.status(500).send("An error occurred");
  }
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
