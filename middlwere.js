const Listing = require("./models/listening");
const Reviews = require("./models/review");

module.exports.isLogIn = (req, res, next)=>{
    if(!req.isAuthenticated()){ // use to login avvailabe in passport
        req.session.redirectUrl = req.originalUrl; // 
        req.flash("error", "you must be logIn!!");
       return res.redirect("/login");
        
    }
    next();
}

module.exports.saveUrl = (req, res, next)=>{
    if(req.session.redirectUrl){                                                    
        res.locals.redirectUrl  = req.session.redirectUrl;
    }
    next();
}

module.exports.OwnerCheck = async(req ,res, next)=>{
    const { id } = req.params;

    const listing = await Listing.findById(id);

    // OWNER CHECK
    if (listing.owner.toString() !== res.locals.currUser._id.toString()) {
      req.flash("error", "You have no permission");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
   
module.exports.AuthorCheck = async(req ,res, next)=>{
   const { id, reviewId } = req.params;

    const Review = await Reviews.findById(reviewId);

    // OWNER CHECK
    if (Review.author.toString() !== res.locals.currUser._id.toString()) {
      req.flash("error", "You not crated this review!!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
   

// req.originalUrl → user ne login se pehle kaunsa page open kiya tha
// Extra middleware (saveUrl) → session se URL nikal ke res.locals me daalne ke liye
// res.locals → login ke baad redirect karna easy ho jata hai