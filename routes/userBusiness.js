const express = require("express");
const userBusinessRoutes = express.Router();
// Models
const UserBusiness = require("../models/userBusinessModel");

userBusinessRoutes.route("/api/userBusiness")
//----- Add new user-business
.post((req, res) => {
  // Check for existing duplicate
  UserBusiness.findOne({
    userId: req.body.userId,
    businessId: req.body.businessId
  })
  .then(userBusiness => {
    if(userBusiness === null) {
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
    } else {
      res.json({
        success: false,
        message: "Business already added"
      });
    }
  })
  .catch(err => console.log(err));
})
//----- Delete given user-buisness
.delete((req, res) => {
  UserBusiness.findOneAndDelete({
    userId: req.body.userId,
    businessId: req.body.businessId
  })
  .then(deletedDoc => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
});

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
});

module.exports = userBusinessRoutes;