require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listening");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAP_TOKEN,
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ainnb");
  console.log("DB connected");

  const listings = await Listing.find({
    $or: [
      { geometry: { $exists: false } },
      { geometry: null }
    ]
  });

  console.log("Listings to update:", listings.length);

  for (let listing of listings) {

    if (!listing.location || listing.location.trim() === "") {
      console.log(`Skipped (no location): ${listing._id}`);
      continue;
    }

    const geo = await geocodingClient
      .forwardGeocode({
        query: listing.location,
        limit: 1,
      })
      .send();

    if (!geo.body.features.length) {
      console.log(`No result for: ${listing.location}`);
      continue;
    }

    listing.geometry = geo.body.features[0].geometry;
    // listing.location = geo.body.features[0].place_name; // optional

    await listing.save();
    console.log(`Updated: ${listing.title}`);
  }

  mongoose.connection.close();
  console.log("Done & DB closed");
}

main().catch(console.error);
