const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/AuraEscape";

// Connect to the MongoDB database
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Initialize the database with sample data
const initDB = async () => {
  await Listing.deleteMany({}); // Remove all existing listings
  await Listing.insertMany(initData.data); // Insert new sample listings
  console.log("data was initialized");
};

initDB();
