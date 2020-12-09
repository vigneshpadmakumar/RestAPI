var express = require("express");
var router = express.Router();
const Joi = require("joi");
var User = require('../model/User');
var Authtoken = require('../model/Authtoken');

var auth = require('../middleware/auth');


/* GET user details. */
router.get("/user", auth, function (req, res, next) {
  const {user} = req;
  return res.json({
    user
  })
});

/** GET user login listing */
router.get("/list", auth, function (req, res, next) {
  const {user} = req;
  Authtoken.find({email: user.email}, function(err, data) {
    return res.send(data)
  });
  
});

/* Register User */

router.post("/register", async function (req, res, next) {
  const { name, password, email } = req.body;
  // Validating data from client side.
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
  });
  

  try {
    const value = await schema.validateAsync(req.body);

    User.findOne({email:email}, function(err, data) {
      if(data) {
        return res.json({
          message: "User already exist with same email"
        });
      }
      else {
        const user  = new User({
          name: name,
          password: password,
          email: email,
        });
    
        const result = user.save();
    
        return res.status(200).json({
          message: "Saved"
        })
      }
    })
  } catch (err) {
    return res.json(err);
  }
});

module.exports = router;
