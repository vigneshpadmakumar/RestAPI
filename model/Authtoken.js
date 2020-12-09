const mongoose = require("mongoose");

const authTokenSchema = new mongoose.Schema({
    token: String,
    email: String,
    date: { type: Date, default: Date.now },
});



const Authtoken = mongoose.model("Authtoken", authTokenSchema);

module.exports = Authtoken;