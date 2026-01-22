const Listing = require("../models/listening");
const Expresserr = require("../extrawork/Expresserr");
const { listingsschema } = require("../schema");

const razorpay = require("../init/razopay");
const crypto = require("crypto");

// https://github.com/mapbox/mapbox-sdk-js go this and mapbox geocoding doc gor moreinfo 

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { response } = require("express");
const mapToken = process.env.MAP_TOKEN;
const   geocodingClient = mbxGeocoding({ accessToken: mapToken });

// INDEX 
module.exports.index = async (req, res) => {
  const alllisting = await Listing.find();
  res.render("listings/index.ejs", { alllisting });
};


// NEW FORM 
module.exports.newform = (req, res) => {
  res.render("listings/new.ejs");
};


// CREATE LISTING
module.exports.createlistings = async (req, res) => {
  result= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1                    // for geocoding = is nothigbut assces longitude and latitude 
})
  .send()
  const { error } = listingsschema.validate(req.body);
  if (error) {
    res.redirect()
    throw new Expresserr(400, error.details[0].message);
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
 newListing.geometry = result.body.features[0].geometry
 let saveListing =  await newListing.save();
 console.log(saveListing);
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// show 
module.exports.showlistings = async (req, res) => {
  const listings = await Listing.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listings) throw new Expresserr(404, "Listing not found");
    razorpayKey: process.env.RAZORPAY_KEY_ID

  res.render("listings/show.ejs", { listings ,  razorpayKey: process.env.RAZORPAY_KEY_ID });
};


// edit
module.exports.edit = async (req, res) => {
  const listings = await Listing.findById(req.params.id);
  res.render("listings/edit.ejs", { listings });
};

//update
module.exports.update = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};


// delete
module.exports.delete = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};


// payment part


//  CREATE RAZORPAY ORDER 
module.exports.createOrder = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const options = {
    amount: listing.price * 100, // ₹ → paise
    currency: "INR",
    receipt: `listing_${listing._id}`,
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
};


// VERIFY PAYMENT 
module.exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await Listing.findByIdAndUpdate(req.params.id, {
      paid: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
};
