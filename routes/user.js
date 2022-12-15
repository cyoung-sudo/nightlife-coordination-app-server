const express = require("express");
const userRoutes = express.Router();
// Models
const User = require("../models/userModel");


userRoutes.route("/api/user")
//----- Retrieve all users
.get((req, res) => {
  User.find({})
  .then(users => {
    res.json({
      success: true,
      users
    });
  })
  .catch(err => console.log(err));
})
//----- Retrieve single user
.post((req, res) => {
  User.findById(req.body.id)
  .then(user => {
    if(user) {
      res.json({
        success: true,
        user
      });
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  })
  .catch(err => console.log(err));
})
//----- Delete authenticated user
.delete((req, res) => {
  User.findByIdAndDelete(req.user._id)
  .then(deletedDoc => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
});

module.exports = userRoutes;