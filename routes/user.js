const express = require("express");
const userRoutes = express.Router();
// Models
const User = require("../models/userModel");

//----- Retrieve single user
userRoutes.post("/api/user", (req, res) => {
  User.findById(req.body.id)
  .then(user => {
    if(user) {
      res.json({
        success: true,
        user
      })
    } else {
      res.json({
        success: false,
        message: "User not found"
      })
    }
  })
  .catch(err => console.log(err));
});

module.exports = userRoutes;