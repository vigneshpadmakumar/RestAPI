const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    date: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model("User", userSchema);

module.exports = User;