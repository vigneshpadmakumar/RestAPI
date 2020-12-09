var express = require('express');
var router = express.Router();
var User = require('../model/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var AuthToken = require('../model/Authtoken');

// Login
router.post('/login', function(req, res) {
  const {email, password} = req.body;
  User.findOne({email:email}, function(err, data) {
    bcrypt.compare(password, data.password, function(err, result) {
        if(result) {
            const accessToken = jwt.sign({
                data: data
              }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 * 60 });
            const refreshToken = jwt.sign({
            data: data
            }, process.env.REFRESH_TOKEN_SECRET);

            // Saving user token to database;
            const authtoken = new AuthToken({
                token: accessToken,
                email: email

            })

            authtoken.save();

            return res.json({
                message: "login success",
                accessToken,
                refreshToken
            })
        }
        return res.json({message: "invalid credentials"});
    });
  })

});

module.exports = router;
