const express = require("express");
const userSearchRoutes = express.Router();
// Models
const UserSearch = require("../models/userSearchModel");

//----- Add new user-search
userSearchRoutes.post("/api/userSearch", (req, res) => {
  // Create or update user-search
  UserSearch.findOneAndUpdate({
    userId: req.body.userId,
  }, {
    term: req.body.term,
    location: req.body.location,
    price: req.body.price,
    open: req.body.open
  }, { 
    upsert: true,
    new: true
  })
  .then(updatedDoc => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
});

userSearchRoutes.route("/api/userSearch/user")
//----- Retrieve user-search for given user
.post((req, res) => {
  UserSearch.findOne({
    userId: req.body.userId
  })
  .then(userSearch => {
    if(userSearch) {
      res.json({
        success: true,
        userSearch
      })
    } else {
      res.json({ 
        success: false,
        message: "No search history found"
      })
    }
  })
  .catch(err => console.log(err));
})
//----- Delete user-search for authenticated user
.delete((req, res) => {
  UserSearch.findOneAndDelete({
    userId: req.user._id
  })
  .then(deletedDoc => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
});

module.exports = userSearchRoutes;