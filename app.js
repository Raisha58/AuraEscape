const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/AuraEscape";

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public"))); //for adding css

// Creating root API
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
    }
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    const sampleData = require("../AuraEscape/init/data.js").data;
    res.render("listings/index", { allListings: sampleData, allListings });
  })
);

// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
  })
);

// Create Route
app.post(
  "/listings",
  validateListing, // first ma validateListing will be called
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

// Creating error handling middleware
// for all pages that doesnt exists
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

// for ones with status code
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
