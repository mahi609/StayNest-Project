
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;// imp defult


const userSchema = new Schema({
    email: {
        type: String,    //
        required: true
    }
})

userSchema.plugin(passportLocalMongoose);// authomatically add hashing ,salting, username, password

module.exports = mongoose.model("User", userSchema);