const express = require("express");
const router = express.Router();

const wrapasync = require("../extrawork/wrapasync");
const { isLogIn, OwnerCheck } = require("../middlwere");

const listingController = require("../controller/listingss");


// index
router.get("/", wrapasync(listingController.index));


//  NEW 
router.get("/new", isLogIn, listingController.newform);


//  CREATE
router.post("/", isLogIn, wrapasync(listingController.createlistings));


// show
router.get("/:id", wrapasync(listingController.showlistings));


// edit
router.get(
  "/:id/edit",
  isLogIn,
  OwnerCheck,
  wrapasync(listingController.edit)
);


// update
router.put(
  "/:id",
  isLogIn,
  OwnerCheck,
  wrapasync(listingController.update)
);


// delete
router.delete(
  "/:id",
  isLogIn,
  OwnerCheck,
  wrapasync(listingController.delete)
);


// payment

// CREATE RAZORPAY ORDER
router.post(
  "/:id/create",
  isLogIn,
  wrapasync(listingController.createOrder)
);

// VERIFY PAYMENT
router.post(
  "/:id/verify",
  isLogIn,
  wrapasync(listingController.verifyPayment)
);


module.exports = router;
