const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;


const listeningSchema = new Schema({
    title: {
        type: String,
        required: true,   // fixed
    },
    description: String,
    img: {
        type: String,
        default: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"

        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

  geometry: {
  type: {
    type: String,
    enum: ["Point"],  //geojson format availabe in mongooses
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
}

    
});


listeningSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){                                                         // middle ware jevha ti listing delete hoi auomaticaly tiche reviwe pn delete honar
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
})



// default collection = "listenings"
module.exports = mongoose.model("Listening", listeningSchema);
