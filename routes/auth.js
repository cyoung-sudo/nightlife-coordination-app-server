const express = require("express");
const authRoutes = express.Router();
// Authentication
const passport = require("passport");
// Models
const User = require("../models/userModel");
// Encryption
const bcrypt = require("bcryptjs");

//----- Signup new user
authRoutes.post("/api/auth/signup", (req, res) => {
  // Encrypt password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      // Create new user
      let newUser = new User({
        username: req.body.username,
        password: hash
      })

      // Save user
      newUser.save()
      .then(savedUser => {
        res.json({ success: true });
      })
      .catch(err => {
        console.log(err);
        res.json({ 
          success: false,
          message: "Username has been taken"
        });
      });
    });
  });
});

//----- Login existing user
authRoutes.post("/api/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if(err) next(err);

    if(!user) {
      // Invalid login
      res.json({
        success: false,
        message: info.message
      });
    } 
    if(user) {
      // Successful login
      req.logIn(user, err => {
        if(err) next(err);
        res.json({
          success: true,
          user
        });
      });
    }
  })(req, res, next);
});

module.exports = authRoutes;