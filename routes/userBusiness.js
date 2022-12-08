const express = require("express");
const userBusinessRoutes = express.Router();
// Models
const UserBusiness = require("../models/userBusinessModel");

//----- Add new user-business
userBusinessRoutes.post("/api/userBusiness", (req, res) => {
  // Created new user-business
  let newUserBusiness = new UserBusiness({
    userId: req.body.userId,
    businessId: req.body.businessId
  });
  
  // Save user-business
  newUserBusiness.save()
  .then(savedUserBusiness => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
})

//----- Retrieve user-businesses for given user
userBusinessRoutes.post("/api/userBusiness/user", (req, res) => {
  UserBusiness.find({
    userId: req.body.userId
  })
  .then(userBusinesses => {
    res.json({
      success: true,
      userBusinesses
    });
  })
  .catch(err => console.log(err));
})

module.exports = userBusinessRoutes;