const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../extrawork/wrapasync");
const { reviewschema } = require("../schema");
const Expresserr = require("../extrawork/Expresserr");
const {isLogIn, OwnerCheck, AuthorCheck} = require("../middlwere");

const reviewController = require("../controller/reviewss");

const validateReview = (req, res, next) => {
  const { error } = reviewschema.validate(req.body);
  if (error) throw new Expresserr(400, error.details[0].message);
  next();
};

router.post("/", isLogIn, validateReview, wrapasync(reviewController.addreview));

router.delete("/:reviewId", isLogIn, AuthorCheck, wrapasync(reviewController.deletereview));

module.exports = router;
