const Listing = require("../models/listening");
const Review = require("../models/review");

module.exports.addreview =async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);
    review.author = req.user._id; // req.user cuurent login user add to author

  listing.reviews.push(review);
  await review.save();
  await listing.save();

  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.deletereview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
}